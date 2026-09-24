const express = require('express');
const router = express.Router();
const { getApiRoot, getHealthStatus } = require('../controllers/healthController');
const authRoutes = require('./authRoutes');
const fileRoutes = require('./fileRoutes');

// Base API route: GET /api
router.get('/', getApiRoot);

// Health check route: GET /api/health
router.get('/health', getHealthStatus);

// Authentication sub-router: /api/auth/*
router.use('/auth', authRoutes);

// File management sub-router: /api/files/*
router.use('/files', fileRoutes);

module.exports = router;
