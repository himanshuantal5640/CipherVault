const mongoose = require('mongoose');
const AuditLog = require('../models/AuditLog');
const { getInMemoryAuditLogs } = require('../services/auditService');

/**
 * Fetch Authenticated User's Audit Log History
 * GET /api/audit
 */
const getUserAuditLogs = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const isDbConnected = mongoose.connection.readyState === 1;

    let logs = [];

    if (isDbConnected) {
      logs = await AuditLog.find({ userId })
        .sort({ createdAt: -1 })
        .limit(50)
        .lean();

      // Transform _id to id for consistency
      logs = logs.map((doc) => ({
        id: doc._id.toString(),
        userId: doc.userId ? doc.userId.toString() : null,
        action: doc.action,
        fileId: doc.fileId,
        status: doc.status,
        ipAddress: doc.ipAddress,
        userAgent: doc.userAgent,
        details: doc.details,
        createdAt: doc.createdAt
      }));
    } else {
      logs = getInMemoryAuditLogs(userId).slice(0, 50);
    }

    return res.status(200).json({
      success: true,
      count: logs.length,
      logs
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getUserAuditLogs
};
