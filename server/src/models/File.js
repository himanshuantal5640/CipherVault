const mongoose = require('mongoose');

const fileSchema = new mongoose.Schema(
  {
    ownerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Owner ID is required'],
      index: true // Efficient user-scoped queries
    },
    originalName: {
      type: String,
      required: [true, 'Original file name is required'],
      trim: true
    },
    s3Key: {
      type: String,
      required: [true, 'S3 object key is required'],
      unique: true,
      trim: true
    },
    size: {
      type: Number,
      required: [true, 'File size in bytes is required']
    },
    mimeType: {
      type: String,
      required: [true, 'MIME type is required'],
      default: 'application/octet-stream'
    },
    encryptedDEK: {
      type: String,
      required: [true, 'Base64 encrypted DEK is required']
    },
    fileIV: {
      type: String,
      required: [true, 'Base64 file IV is required']
    },
    wrapIV: {
      type: String,
      required: [true, 'Base64 wrap IV is required']
    },
    salt: {
      type: String,
      required: [true, 'Base64 PBKDF2 salt is required']
    },
    algorithm: {
      type: String,
      required: true,
      default: 'AES-256-GCM'
    },
    keyDerivation: {
      algorithm: {
        type: String,
        default: 'PBKDF2-SHA-256'
      },
      iterations: {
        type: Number,
        default: 100000
      }
    }
  },
  {
    timestamps: true
  }
);

// Ensure IDs format cleanly in JSON output
fileSchema.set('toJSON', {
  transform: (doc, ret) => {
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v;
    return ret;
  }
});

const File = mongoose.model('File', fileSchema);

module.exports = File;
