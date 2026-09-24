const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const config = require('../config');
const User = require('../models/User');
const { registerSchema, loginSchema } = require('../utils/validation');
const { logAuditEvent } = require('../services/auditService');

// In-memory user fallback storage when MongoDB Atlas is disconnected/unconfigured
const inMemoryUsers = new Map();

/**
 * Generate secure cookie options for vaultx_token
 */
const getCookieOptions = () => ({
  httpOnly: true,
  sameSite: 'lax',
  secure: config.nodeEnv === 'production',
  maxAge: 24 * 60 * 60 * 1000 // 1 day in milliseconds
});

/**
 * Register User
 * POST /api/auth/register
 */
const register = async (req, res, next) => {
  try {
    // 1. Validate request body with Zod
    const parsedInput = registerSchema.safeParse(req.body);
    if (!parsedInput.success) {
      const issue = parsedInput.error.issues[0]?.message || 'Invalid registration input';
      return res.status(400).json({
        success: false,
        message: issue
      });
    }

    const { email, password } = parsedInput.data;
    const isDbConnected = mongoose.connection.readyState === 1;

    let userObj = null;

    if (isDbConnected) {
      // MongoDB Persistence Mode
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: 'User with this email already exists'
        });
      }

      const passwordHash = await bcrypt.hash(password, 12);
      const newUser = await User.create({ email, passwordHash });
      userObj = { id: newUser._id.toString(), email: newUser.email };
    } else {
      // In-Memory Dev Fallback Mode
      if (inMemoryUsers.has(email)) {
        return res.status(400).json({
          success: false,
          message: 'User with this email already exists'
        });
      }

      const passwordHash = await bcrypt.hash(password, 12);
      const userId = 'mem_' + Date.now() + Math.random().toString(36).substring(2, 7);
      inMemoryUsers.set(email, { id: userId, email, passwordHash });
      userObj = { id: userId, email };
    }

    // Generate JWT token containing minimal payload (sub: userId)
    const token = jwt.sign(
      { sub: userObj.id },
      config.jwtSecret,
      { expiresIn: config.jwtExpiresIn }
    );

    // Set HTTP-only Cookie
    res.cookie('vaultx_token', token, getCookieOptions());

    // Log successful registration / login event
    await logAuditEvent({
      userId: userObj.id,
      action: 'LOGIN_SUCCESS',
      status: 'SUCCESS',
      req,
      details: { email: userObj.email, event: 'New user registration' }
    });

    // Return safe user response
    return res.status(201).json({
      success: true,
      user: userObj
    });

  } catch (error) {
    next(error);
  }
};

/**
 * Login User
 * POST /api/auth/login
 */
const login = async (req, res, next) => {
  try {
    // 1. Validate request body with Zod
    const parsedInput = loginSchema.safeParse(req.body);
    if (!parsedInput.success) {
      return res.status(400).json({
        success: false,
        message: 'Invalid email or password format'
      });
    }

    const { email, password } = parsedInput.data;
    const isDbConnected = mongoose.connection.readyState === 1;

    let userRecord = null;

    if (isDbConnected) {
      const dbUser = await User.findOne({ email });
      if (dbUser) {
        userRecord = { id: dbUser._id.toString(), email: dbUser.email, passwordHash: dbUser.passwordHash };
      }
    } else {
      userRecord = inMemoryUsers.get(email);
    }

    if (!userRecord) {
      await logAuditEvent({
        userId: null,
        action: 'LOGIN_FAILED',
        status: 'FAILED',
        req,
        details: { email, reason: 'Invalid email address' }
      });
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Compare password with stored hash using bcrypt
    const isPasswordValid = await bcrypt.compare(password, userRecord.passwordHash);
    if (!isPasswordValid) {
      await logAuditEvent({
        userId: userRecord.id,
        action: 'LOGIN_FAILED',
        status: 'FAILED',
        req,
        details: { email, reason: 'Incorrect password' }
      });
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Generate JWT token containing minimal payload
    const token = jwt.sign(
      { sub: userRecord.id },
      config.jwtSecret,
      { expiresIn: config.jwtExpiresIn }
    );

    // Store JWT in an HTTP-only cookie
    res.cookie('vaultx_token', token, getCookieOptions());

    await logAuditEvent({
      userId: userRecord.id,
      action: 'LOGIN_SUCCESS',
      status: 'SUCCESS',
      req,
      details: { email: userRecord.email }
    });

    return res.status(200).json({
      success: true,
      user: {
        id: userRecord.id,
        email: userRecord.email
      }
    });

  } catch (error) {
    next(error);
  }
};

/**
 * Logout User
 * POST /api/auth/logout
 */
const logout = async (req, res) => {
  res.clearCookie('vaultx_token', {
    httpOnly: true,
    sameSite: 'lax',
    secure: config.nodeEnv === 'production'
  });

  return res.status(200).json({
    success: true,
    message: 'Logged out successfully'
  });
};

/**
 * Get Current User Profile
 * GET /api/auth/me
 */
const getCurrentUser = async (req, res, next) => {
  try {
    const isDbConnected = mongoose.connection.readyState === 1;
    let foundEmail = null;

    if (isDbConnected) {
      const user = await User.findById(req.user.id);
      if (user) foundEmail = user.email;
    } else {
      for (const [email, record] of inMemoryUsers.entries()) {
        if (record.id === req.user.id) {
          foundEmail = email;
          break;
        }
      }
    }

    if (!foundEmail) {
      return res.status(401).json({
        success: false,
        message: 'User session no longer valid'
      });
    }

    return res.status(200).json({
      success: true,
      user: {
        id: req.user.id,
        email: foundEmail
      }
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  register,
  login,
  logout,
  getCurrentUser
};
