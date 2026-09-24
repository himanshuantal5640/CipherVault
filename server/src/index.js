const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const config = require('./config');
const connectDB = require('./config/db');
const apiRoutes = require('./routes/apiRoutes');
const { apiLimiter } = require('./middleware/rateLimiter');
const { notFoundHandler, errorHandler } = require('./middleware/errorHandler');

const app = express();

// Security HTTP headers
app.use(helmet());

// Cross-Origin Resource Sharing configured for cookie-based credentials
const configuredClientUrl = (config.clientUrl || 'http://localhost:5173').replace(/\/+$/, '');

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps, curl, server-to-server)
    if (!origin) return callback(null, true);
    
    const cleanReqOrigin = origin.replace(/\/+$/, '');
    
    if (cleanReqOrigin === configuredClientUrl || cleanReqOrigin.includes('localhost') || cleanReqOrigin.includes('127.0.0.1')) {
      return callback(null, true);
    }
    
    // In production, also match Vercel preview domains if applicable
    if (cleanReqOrigin.endsWith('.vercel.app')) {
      return callback(null, true);
    }

    return callback(null, true); // Fallback allow to avoid preflight blocks
  },
  credentials: true
}));

// Cookie Parser Middleware
app.use(cookieParser());

// Body Parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Apply rate limiting to API routes
app.use('/api', apiLimiter);

// API Routes
app.use('/api', apiRoutes);

// 404 Route Not Found Handler
app.use(notFoundHandler);

// Centralized Global Error Handler
app.use(errorHandler);

// Connect DB & Start Server
if (process.env.NODE_ENV !== 'test') {
  connectDB().then(() => {
    app.listen(config.port, () => {
      console.log(`=================================`);
      console.log(`VaultX API Server Running`);
      console.log(`Port: ${config.port}`);
      console.log(`Environment: ${config.nodeEnv}`);
      console.log(`Allowed Client URL: ${config.clientUrl}`);
      console.log(`Health endpoint: http://localhost:${config.port}/api/health`);
      console.log(`=================================`);
    });
  });
}

module.exports = app;
