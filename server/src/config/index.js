const dotenv = require('dotenv');

// Load environment variables from .env file if available
dotenv.config();

module.exports = {
  port: process.env.PORT || 5000,
  nodeEnv: process.env.NODE_ENV || 'development',
  mongoUri: (process.env.MONGODB_URI || '').trim(),
  jwtSecret: (process.env.JWT_SECRET || 'vaultx_default_dev_secret_change_in_prod').trim(),
  jwtExpiresIn: (process.env.JWT_EXPIRES_IN || '1d').trim(),
  clientUrl: (process.env.CLIENT_URL || 'http://localhost:5173').trim().replace(/\/+$/, ''),
  aws: {
    region: (process.env.AWS_REGION || '').trim(),
    accessKeyId: (process.env.AWS_ACCESS_KEY_ID || '').trim(),
    secretAccessKey: (process.env.AWS_SECRET_ACCESS_KEY || '').trim(),
    s3Bucket: (process.env.AWS_S3_BUCKET || '').trim()
  },
  firebase: {
    projectId: (process.env.FIREBASE_PROJECT_ID || '').trim(),
    clientEmail: (process.env.FIREBASE_CLIENT_EMAIL || '').trim(),
    privateKey: (process.env.FIREBASE_PRIVATE_KEY || '').replace(/\\n/g, '\n').trim()
  }
};
