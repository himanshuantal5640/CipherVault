const express = require('express');
const router = express.Router();
const { 
  getUploadUrl, 
  confirmUpload, 
  getFiles, 
  getDownloadUrl, 
  deleteFile,
  simulatedS3Upload,
  simulatedS3Download
} = require('../controllers/fileController');
const { protect } = require('../middleware/authMiddleware');

// Simulated S3 endpoints for local dev fallback
router.put('/simulated-s3-upload', simulatedS3Upload);
router.get('/simulated-s3-download', simulatedS3Download);

// Protected File Operations
router.post('/upload-url', protect, getUploadUrl);
router.post('/', protect, confirmUpload);
router.get('/', protect, getFiles);
router.get('/:id/download-url', protect, getDownloadUrl);
router.delete('/:id', protect, deleteFile);

module.exports = router;
