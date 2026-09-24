const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const config = require('./config');
const apiRoutes = require('./routes/apiRoutes');
const { apiLimiter } = require('./middleware/rateLimiter');
const { notFoundHandler, errorHandler } = require('./middleware/errorHandler');

const app = express();

// Security HTTP headers
app.use(helmet());

// Cross-Origin Resource Sharing
app.use(cors({
  origin: true,
  credentials: true
}));

// Body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Apply rate limiting to all requests
app.use('/api', apiLimiter);

// API Routes
app.use('/api', apiRoutes);

// 404 Route Not Found Handler
app.use(notFoundHandler);

// Centralized Global Error Handler
app.use(errorHandler);

// Start Server
if (process.env.NODE_ENV !== 'test') {
  app.listen(config.port, () => {
    console.log(`=================================`);
    console.log(`VaultX API Server Running`);
    console.log(`Port: ${config.port}`);
    console.log(`Environment: ${config.nodeEnv}`);
    console.log(`Health endpoint: http://localhost:${config.port}/api/health`);
    console.log(`=================================`);
  });
}

module.exports = app;
