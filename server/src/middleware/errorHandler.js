const config = require('../config');

/**
 * 404 Not Found Middleware for unhandled endpoints
 */
const notFoundHandler = (req, res, next) => {
  const error = new Error(`Route Not Found - ${req.originalUrl}`);
  res.status(404);
  next(error);
};

/**
 * Centralized Global Error Handler
 * Hides stack traces in production environment
 */
const errorHandler = (err, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  
  const response = {
    success: false,
    message: err.message || "Internal Server Error"
  };

  // Only expose stack trace if NOT in production
  if (config.nodeEnv !== 'production') {
    response.stack = err.stack;
  }

  res.status(statusCode).json(response);
};

module.exports = {
  notFoundHandler,
  errorHandler
};
