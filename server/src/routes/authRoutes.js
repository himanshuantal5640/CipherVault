const express = require('express');
const router = express.Router();
const { register, login, logout, getCurrentUser } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');
const { authLimiter } = require('../middleware/rateLimiter');

// Public Auth Endpoints (Rate Limited)
router.post('/register', authLimiter, register);
router.post('/login', authLimiter, login);

// Authenticated Auth Endpoints
router.post('/logout', logout);
router.get('/me', protect, getCurrentUser);

module.exports = router;
