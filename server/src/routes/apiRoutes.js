const express = require('express');
const router = express.Router();
const { getApiRoot, getHealthStatus } = require('../controllers/healthController');
const authRoutes = require('./authRoutes');

// Base API route: GET /api
router.get('/', getApiRoot);

// Health check route: GET /api/health
router.get('/health', getHealthStatus);

// Authentication sub-router: /api/auth/*
router.use('/auth', authRoutes);

module.exports = router;
