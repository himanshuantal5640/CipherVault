const mongoose = require('mongoose');

const auditLogSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: false,
      index: true
    },
    action: {
      type: String,
      required: [true, 'Audit action is required'],
      enum: [
        'LOGIN_SUCCESS',
        'LOGIN_FAILED',
        'FILE_UPLOAD',
        'FILE_DOWNLOAD',
        'FILE_DELETE',
        'ACCESS_DENIED'
      ]
    },
    fileId: {
      type: String,
      default: null
    },
    status: {
      type: String,
      enum: ['SUCCESS', 'FAILED', 'BLOCKED'],
      default: 'SUCCESS',
      required: true
    },
    ipAddress: {
      type: String,
      default: '127.0.0.1'
    },
    userAgent: {
      type: String,
      default: 'Unknown'
    },
    details: {
      type: mongoose.Schema.Types.Mixed,
      default: {}
    }
  },
  {
    timestamps: true
  }
);

// Compound index for efficient user timeline queries
auditLogSchema.index({ userId: 1, createdAt: -1 });

auditLogSchema.set('toJSON', {
  transform: (doc, ret) => {
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v;
    return ret;
  }
});

const AuditLog = mongoose.model('AuditLog', auditLogSchema);

module.exports = AuditLog;
