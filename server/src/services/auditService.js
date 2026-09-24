const mongoose = require('mongoose');
const AuditLog = require('../models/AuditLog');

// In-memory fallback audit log array for local offline dev without MongoDB Atlas
const inMemoryAuditLogs = [];

/**
 * Sensitive fields that must NEVER appear in audit details or logs
 */
const SENSITIVE_KEYS = new Set([
  'password',
  'secret',
  'dek',
  'kek',
  'encrypteddek',
  'fileiv',
  'wrapiv',
  'salt',
  'token',
  'cookie',
  'vaultx_token',
  'presignedurl',
  'uploadurl',
  'downloadurl',
  'authorization',
  'awssecretaccesskey',
  'awsaccesskeyid'
]);

/**
 * Deeply sanitize details object to ensure no security secrets are logged
 */
const sanitizeDetails = (obj) => {
  if (!obj || typeof obj !== 'object') {
    return typeof obj === 'string' ? obj.substring(0, 500) : {};
  }

  const clean = {};
  for (const [key, val] of Object.entries(obj)) {
    const lowerKey = key.toLowerCase();
    if (SENSITIVE_KEYS.has(lowerKey)) {
      clean[key] = '[REDACTED_SECURITY_SECRET]';
    } else if (typeof val === 'object' && val !== null) {
      clean[key] = sanitizeDetails(val);
    } else if (typeof val === 'string' && val.length > 500) {
      clean[key] = val.substring(0, 500) + '...[TRUNCATED]';
    } else {
      clean[key] = val;
    }
  }
  return clean;
};

/**
 * Safe Audit Event Logging Service
 * Guarantees zero sensitive data logging and non-blocking execution
 */
const logAuditEvent = async ({
  userId = null,
  action,
  fileId = null,
  status = 'SUCCESS',
  req = null,
  details = {}
}) => {
  try {
    const ipAddress = req
      ? (req.headers['x-forwarded-for'] || req.ip || req.socket?.remoteAddress || '127.0.0.1')
          .split(',')[0]
          .trim()
      : '127.0.0.1';

    const userAgent = req?.headers ? req.headers['user-agent'] || 'Unknown' : 'Unknown';
    const cleanDetails = sanitizeDetails(details);

    const isDbConnected = mongoose.connection.readyState === 1;

    if (isDbConnected) {
      await AuditLog.create({
        userId: userId && mongoose.Types.ObjectId.isValid(userId) ? userId : null,
        action,
        fileId: fileId ? String(fileId) : null,
        status,
        ipAddress,
        userAgent,
        details: cleanDetails
      });
    } else {
      const logEntry = {
        id: 'log_' + Date.now() + Math.random().toString(36).substring(2, 6),
        userId: userId ? String(userId) : null,
        action,
        fileId: fileId ? String(fileId) : null,
        status,
        ipAddress,
        userAgent,
        details: cleanDetails,
        createdAt: new Date().toISOString()
      };
      inMemoryAuditLogs.unshift(logEntry);

      // Keep in-memory logs capped at 200 entries to prevent memory leaks
      if (inMemoryAuditLogs.length > 200) {
        inMemoryAuditLogs.pop();
      }
    }
  } catch (err) {
    // Fail silently in production/runtime so non-critical audit log failures never crash requests
    console.error('[VaultX AuditService Warning] Safe audit log write error:', err.message);
  }
};

/**
 * Get in-memory audit logs for offline fallback
 */
const getInMemoryAuditLogs = (userId) => {
  return inMemoryAuditLogs.filter((log) => log.userId === String(userId));
};

module.exports = {
  logAuditEvent,
  getInMemoryAuditLogs,
  sanitizeDetails
};
