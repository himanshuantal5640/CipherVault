const express = require('express');
const router = express.Router();
const { getApiRoot, getHealthStatus } = require('../controllers/healthController');

// Base API route: GET /api
router.get('/', getApiRoot);

// Health check route: GET /api/health
router.get('/health', getHealthStatus);

module.exports = router;
