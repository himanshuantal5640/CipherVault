const express = require('express');
const router = express.Router();
const { getUserAuditLogs } = require('../controllers/auditController');
const { protect } = require('../middleware/authMiddleware');

// GET /api/audit - Get current user's security audit log history (Protected)
router.get('/', protect, getUserAuditLogs);

module.exports = router;
