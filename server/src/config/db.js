const mongoose = require('mongoose');
const config = require('./index');

/**
 * Connect to MongoDB Atlas / Local Instance
 */
const connectDB = async () => {
  if (!config.mongoUri) {
    console.warn('[VaultX DB Warning] MONGODB_URI is not defined in environment variables.');
    console.warn('[VaultX DB Warning] Please set MONGODB_URI in server/.env to enable MongoDB persistence.');
    return false;
  }

  try {
    const conn = await mongoose.connect(config.mongoUri);
    console.log(`[VaultX DB] MongoDB Connected: ${conn.connection.host}`);
    return true;
  } catch (error) {
    console.error(`[VaultX DB Error] Failed to connect to MongoDB: ${error.message}`);
    if (config.nodeEnv === 'production') {
      process.exit(1);
    }
    return false;
  }
};

module.exports = connectDB;
