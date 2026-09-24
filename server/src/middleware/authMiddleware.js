const jwt = require('jsonwebtoken');
const config = require('../config');

/**
 * Middleware to verify JWT authentication from HTTP-only cookie
 */
const protect = (req, res, next) => {
  try {
    const token = req.cookies?.vaultx_token;

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required. No session token provided.'
      });
    }

    // Verify JWT token signature and expiration
    const decoded = jwt.verify(token, config.jwtSecret);

    if (!decoded || !decoded.sub) {
      return res.status(401).json({
        success: false,
        message: 'Invalid session payload.'
      });
    }

    // Attach minimal authenticated user context
    req.user = {
      id: decoded.sub
    };

    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Invalid or expired authentication session.'
    });
  }
};

module.exports = {
  protect
};
