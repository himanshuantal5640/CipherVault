const crypto = require('crypto');
const mongoose = require('mongoose');
const File = require('../models/File');
const { generatePutPresignedUrl, generateGetPresignedUrl, deleteS3Object } = require('../config/s3');

// In-memory file storage fallback for local dev when MongoDB Atlas is unconfigured
const inMemoryFiles = new Map();
const simulatedS3Storage = new Map();

const MAX_FILE_SIZE_BYTES = 100 * 1024 * 1024; // 100 MB max limit

/**
 * Request Presigned Upload URL
 * POST /api/files/upload-url
 */
const getUploadUrl = async (req, res, next) => {
  try {
    const { fileName, fileSize, mimeType } = req.body;

    if (!fileName || !fileSize) {
      return res.status(400).json({
        success: false,
        message: 'File name and size are required to request an upload URL.'
      });
    }

    if (fileSize > MAX_FILE_SIZE_BYTES) {
      return res.status(400).json({
        success: false,
        message: `File size exceeds maximum allowed threshold of 100 MB.`
      });
    }

    // Generate secure UUID for object key
    const fileUuid = crypto.randomUUID();
    const ownerId = req.user.id;
    const s3Key = `users/${ownerId}/${fileUuid}.enc`;

    // Generate short-lived presigned PUT URL
    const uploadUrl = await generatePutPresignedUrl(s3Key, mimeType || 'application/octet-stream');

    return res.status(200).json({
      success: true,
      uploadUrl,
      s3Key,
      fileId: fileUuid
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Confirm Successful Upload & Store Metadata
 * POST /api/files
 */
const confirmUpload = async (req, res, next) => {
  try {
    const {
      originalName,
      s3Key,
      size,
      mimeType,
      encryptedDEK,
      fileIV,
      wrapIV,
      salt,
      algorithm,
      keyDerivation
    } = req.body;

    const ownerId = req.user.id;

    // SECURITY CHECK: Verify s3Key starts with users/{req.user.id}/
    const expectedPrefix = `users/${ownerId}/`;
    if (!s3Key || !s3Key.startsWith(expectedPrefix)) {
      return res.status(403).json({
        success: false,
        message: 'Forbidden: s3Key does not belong to your user security namespace.'
      });
    }

    if (!originalName || !size || !encryptedDEK || !fileIV || !wrapIV || !salt) {
      return res.status(400).json({
        success: false,
        message: 'Missing required cryptographic file metadata fields.'
      });
    }

    const isDbConnected = mongoose.connection.readyState === 1;
    let savedFile = null;

    if (isDbConnected) {
      savedFile = await File.create({
        ownerId,
        originalName,
        s3Key,
        size,
        mimeType: mimeType || 'application/octet-stream',
        encryptedDEK,
        fileIV,
        wrapIV,
        salt,
        algorithm: algorithm || 'AES-256-GCM',
        keyDerivation: keyDerivation || { algorithm: 'PBKDF2-SHA-256', iterations: 100000 }
      });
    } else {
      const fileId = 'file_' + Date.now() + Math.random().toString(36).substring(2, 6);
      savedFile = {
        id: fileId,
        ownerId,
        originalName,
        s3Key,
        size,
        mimeType: mimeType || 'application/octet-stream',
        encryptedDEK,
        fileIV,
        wrapIV,
        salt,
        algorithm: algorithm || 'AES-256-GCM',
        keyDerivation: keyDerivation || { algorithm: 'PBKDF2-SHA-256', iterations: 100000 },
        createdAt: new Date().toISOString()
      };
      inMemoryFiles.set(fileId, savedFile);
    }

    return res.status(201).json({
      success: true,
      file: savedFile
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get Authenticated User's Files
 * GET /api/files
 */
const getFiles = async (req, res, next) => {
  try {
    const ownerId = req.user.id;
    const isDbConnected = mongoose.connection.readyState === 1;

    let userFiles = [];

    if (isDbConnected) {
      userFiles = await File.find({ ownerId }).sort({ createdAt: -1 });
    } else {
      for (const file of inMemoryFiles.values()) {
        if (file.ownerId === ownerId) {
          userFiles.push(file);
        }
      }
    }

    return res.status(200).json({
      success: true,
      files: userFiles
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Request Presigned Download URL & Metadata
 * GET /api/files/:id/download-url
 */
const getDownloadUrl = async (req, res, next) => {
  try {
    const fileId = req.params.id;
    const ownerId = req.user.id;
    const isDbConnected = mongoose.connection.readyState === 1;

    let fileRecord = null;

    if (isDbConnected) {
      // SECURITY: Find file scoped strictly to ownerId
      if (mongoose.Types.ObjectId.isValid(fileId)) {
        fileRecord = await File.findOne({ _id: fileId, ownerId });
      }
    } else {
      const candidate = inMemoryFiles.get(fileId);
      if (candidate && candidate.ownerId === ownerId) {
        fileRecord = candidate;
      }
    }

    if (!fileRecord) {
      return res.status(404).json({
        success: false,
        message: 'File not found or access denied.'
      });
    }

    // Generate short-lived presigned GET URL
    const downloadUrl = await generateGetPresignedUrl(fileRecord.s3Key);

    return res.status(200).json({
      success: true,
      downloadUrl,
      metadata: {
        id: fileRecord.id || fileRecord._id,
        filename: fileRecord.originalName,
        mimeType: fileRecord.mimeType,
        size: fileRecord.size,
        algorithm: fileRecord.algorithm,
        encryptedDEK: fileRecord.encryptedDEK,
        iv: fileRecord.fileIV,
        wrapIv: fileRecord.wrapIV,
        salt: fileRecord.salt,
        pbkdf2Iterations: fileRecord.keyDerivation?.iterations || 100000
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Delete File
 * DELETE /api/files/:id
 */
const deleteFile = async (req, res, next) => {
  try {
    const fileId = req.params.id;
    const ownerId = req.user.id;
    const isDbConnected = mongoose.connection.readyState === 1;

    let fileRecord = null;

    if (isDbConnected) {
      if (mongoose.Types.ObjectId.isValid(fileId)) {
        fileRecord = await File.findOne({ _id: fileId, ownerId });
      }
    } else {
      const candidate = inMemoryFiles.get(fileId);
      if (candidate && candidate.ownerId === ownerId) {
        fileRecord = candidate;
      }
    }

    if (!fileRecord) {
      return res.status(404).json({
        success: false,
        message: 'File not found or access denied.'
      });
    }

    // 1. Delete object from AWS S3
    await deleteS3Object(fileRecord.s3Key);

    // 2. Delete metadata record from Database
    if (isDbConnected) {
      await File.deleteOne({ _id: fileRecord._id });
    } else {
      inMemoryFiles.delete(fileId);
    }

    return res.status(200).json({
      success: true,
      message: 'File deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Local Simulation PUT endpoint for offline dev without AWS credentials
 */
const simulatedS3Upload = (req, res) => {
  const s3Key = req.query.s3Key;
  const chunks = [];
  req.on('data', (chunk) => chunks.push(chunk));
  req.on('end', () => {
    const buffer = Buffer.concat(chunks);
    simulatedS3Storage.set(s3Key, buffer);
    res.status(200).send();
  });
};

/**
 * Local Simulation GET endpoint for offline dev without AWS credentials
 */
const simulatedS3Download = (req, res) => {
  const s3Key = req.query.s3Key;
  const buffer = simulatedS3Storage.get(s3Key);
  if (!buffer) {
    return res.status(404).json({ success: false, message: 'Simulated S3 object not found' });
  }
  res.setHeader('Content-Type', 'application/octet-stream');
  res.send(buffer);
};

module.exports = {
  getUploadUrl,
  confirmUpload,
  getFiles,
  getDownloadUrl,
  deleteFile,
  simulatedS3Upload,
  simulatedS3Download
};
