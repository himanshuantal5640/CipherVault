import api from './api';

/**
 * File Vault Service
 * Handles S3 presigned URL retrieval, direct browser S3 transfer, and MongoDB metadata storage
 */
export const fileService = {
  /**
   * Request presigned PUT URL from backend
   */
  getUploadUrl: async (fileName, fileSize, mimeType) => {
    return await api.post('/files/upload-url', { fileName, fileSize, mimeType });
  },

  /**
   * Transfer ciphertext directly to S3 via presigned PUT URL
   * Browser -> S3 (Zero Node.js backend involvement)
   */
  uploadCiphertextToS3: async (uploadUrl, ciphertextBuffer, mimeType) => {
    try {
      const response = await fetch(uploadUrl, {
        method: 'PUT',
        headers: {
          'Content-Type': mimeType || 'application/octet-stream'
        },
        body: ciphertextBuffer
      });

      if (!response.ok) {
        throw new Error(`S3 direct upload failed with HTTP status ${response.status}`);
      }
      return true;
    } catch (err) {
      if (err.name === 'TypeError' || err.message.includes('fetch') || err.message.includes('CORS')) {
        throw new Error(
          `AWS S3 CORS Error: Direct upload to S3 was blocked by browser CORS policy. Please configure CORS permissions on your S3 bucket in AWS Console.`
        );
      }
      throw err;
    }
  },

  /**
   * Store encrypted metadata package in MongoDB after S3 upload
   */
  saveFileMetadata: async (metadataPackage) => {
    return await api.post('/files', metadataPackage);
  },

  /**
   * Fetch authenticated user's file list from MongoDB
   */
  getFiles: async () => {
    const res = await api.get('/files');
    return res.files || [];
  },

  /**
   * Request presigned GET URL and metadata from backend
   */
  getDownloadUrl: async (fileId) => {
    return await api.get(`/files/${fileId}/download-url`);
  },

  /**
   * Fetch encrypted ciphertext directly from S3 via presigned GET URL
   */
  downloadCiphertextFromS3: async (downloadUrl) => {
    try {
      const response = await fetch(downloadUrl);
      if (!response.ok) {
        throw new Error(`S3 direct download failed with HTTP status ${response.status}`);
      }
      return await response.arrayBuffer();
    } catch (err) {
      if (err.name === 'TypeError' || err.message.includes('fetch') || err.message.includes('CORS')) {
        throw new Error(
          `AWS S3 CORS Error: Direct download from S3 was blocked by browser CORS policy. Please configure CORS permissions on your S3 bucket in AWS Console.`
        );
      }
      throw err;
    }
  },

  /**
   * Delete file object from S3 and metadata from MongoDB
   */
  deleteFile: async (fileId) => {
    return await api.delete(`/files/${fileId}`);
  }
};

export default fileService;
