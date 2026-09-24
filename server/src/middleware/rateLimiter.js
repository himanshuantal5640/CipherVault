const rateLimit = require('express-rate-limit');

/**
 * Basic API Rate Limiter
 */
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many requests from this IP, please try again after 15 minutes."
  }
});

/**
 * Strict Rate Limiter for Sensitive Auth Endpoints (Login / Register)
 */
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 15, // Limit each IP to 15 login/register attempts per windowMs
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many authentication attempts from this IP. Please try again in 15 minutes."
  }
});

module.exports = {
  apiLimiter,
  authLimiter
};
