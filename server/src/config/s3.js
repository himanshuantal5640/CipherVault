const { S3Client, PutObjectCommand, GetObjectCommand, DeleteObjectCommand } = require('@aws-sdk/client-s3');
const { getSignedUrl } = require('@aws-sdk/s3-request-presigner');
const config = require('./index');

let s3Client = null;
let isAwsConfigured = false;

if (
  config.aws.region &&
  config.aws.accessKeyId &&
  config.aws.secretAccessKey &&
  config.aws.s3Bucket
) {
  s3Client = new S3Client({
    region: config.aws.region,
    credentials: {
      accessKeyId: config.aws.accessKeyId,
      secretAccessKey: config.aws.secretAccessKey
    }
  });
  isAwsConfigured = true;
  console.log(`[VaultX S3] AWS S3 Client Initialized (Region: ${config.aws.region}, Bucket: ${config.aws.s3Bucket})`);
} else {
  console.warn('[VaultX S3 Warning] AWS S3 environment variables not fully populated.');
  console.warn('[VaultX S3 Warning] S3 operations will run in local simulation mode.');
}

/**
 * Generate a short-lived Presigned PUT URL for uploading encrypted ciphertext directly to S3
 * 
 * @param {string} s3Key S3 object key (e.g. users/USER_ID/UUID.enc)
 * @param {string} mimeType File MIME type
 * @param {number} expiresInSeconds Expiration duration in seconds (default: 900 = 15 minutes)
 * @returns {Promise<string>} Presigned PUT URL
 */
const generatePutPresignedUrl = async (s3Key, mimeType, expiresInSeconds = 900) => {
  if (isAwsConfigured && s3Client) {
    const command = new PutObjectCommand({
      Bucket: config.aws.s3Bucket,
      Key: s3Key,
      ContentType: mimeType || 'application/octet-stream'
    });
    return await getSignedUrl(s3Client, command, { expiresIn: expiresInSeconds });
  }

  // Local Dev Fallback Presigned URL Simulation
  return `http://localhost:${config.port}/api/files/simulated-s3-upload?s3Key=${encodeURIComponent(s3Key)}`;
};

/**
 * Generate a short-lived Presigned GET URL for downloading encrypted ciphertext directly from S3
 * 
 * @param {string} s3Key S3 object key
 * @param {number} expiresInSeconds Expiration duration in seconds (default: 900 = 15 minutes)
 * @returns {Promise<string>} Presigned GET URL
 */
const generateGetPresignedUrl = async (s3Key, expiresInSeconds = 900) => {
  if (isAwsConfigured && s3Client) {
    const command = new GetObjectCommand({
      Bucket: config.aws.s3Bucket,
      Key: s3Key
    });
    return await getSignedUrl(s3Client, command, { expiresIn: expiresInSeconds });
  }

  // Local Dev Fallback Presigned URL Simulation
  return `http://localhost:${config.port}/api/files/simulated-s3-download?s3Key=${encodeURIComponent(s3Key)}`;
};

/**
 * Delete an object from S3 bucket
 * 
 * @param {string} s3Key S3 object key to delete
 * @returns {Promise<boolean>} Success status
 */
const deleteS3Object = async (s3Key) => {
  if (isAwsConfigured && s3Client) {
    try {
      const command = new DeleteObjectCommand({
        Bucket: config.aws.s3Bucket,
        Key: s3Key
      });
      await s3Client.send(command);
      return true;
    } catch (error) {
      console.error(`[VaultX S3 Error] Failed to delete S3 object ${s3Key}: ${error.message}`);
      throw error;
    }
  }

  // Local Dev Fallback Simulation
  console.log(`[VaultX S3 Simulation] Deleted simulated object ${s3Key}`);
  return true;
};

module.exports = {
  isAwsConfigured: () => isAwsConfigured,
  generatePutPresignedUrl,
  generateGetPresignedUrl,
  deleteS3Object
};
