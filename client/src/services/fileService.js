import api from './api';

/**
 * File Vault Service (Phase 1 Placeholder)
 * Encrypted blob upload/download logic via S3 presigned URLs will be implemented in Phase 4.
 */
export const fileService = {
  /**
   * Fetch encrypted file metadata list
   */
  listFiles: async () => {
    console.warn('[VaultX] File Service: listFiles is returning mock data in Phase 1.');
    return [
      {
        id: 'file-001',
        filename: 'financial_audit_2026.pdf.enc',
        size: '2.4 MB',
        uploadedAt: '2026-09-20T10:30:00Z',
        algorithm: 'AES-256-GCM',
        status: 'ENCRYPTED_AT_REST'
      },
      {
        id: 'file-002',
        filename: 'passport_scan.png.enc',
        size: '1.1 MB',
        uploadedAt: '2026-09-22T14:15:00Z',
        algorithm: 'AES-256-GCM',
        status: 'ENCRYPTED_AT_REST'
      }
    ];
  },

  /**
   * Request upload authorization placeholder
   */
  getPresignedUploadUrl: async (filename, mimeType) => {
    console.warn('[VaultX] File Service: AWS S3 presigned URL is a placeholder in Phase 1.');
    throw new Error('S3 upload features will be enabled in Phase 4.');
  },

  /**
   * Delete file metadata placeholder
   */
  deleteFile: async (fileId) => {
    console.warn('[VaultX] File Service: deleteFile is a placeholder in Phase 1.');
    return { success: true, message: `File ${fileId} removed.` };
  }
};

export default fileService;
