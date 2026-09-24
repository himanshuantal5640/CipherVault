/**
 * Base API Controller
 * GET /api
 */
const getApiRoot = (req, res) => {
  return res.status(200).json({
    success: true,
    message: "VaultX API"
  });
};

/**
 * Health Check Controller
 * GET /api/health
 */
const getHealthStatus = (req, res) => {
  return res.status(200).json({
    success: true,
    message: "VaultX API is running"
  });
};

module.exports = {
  getApiRoot,
  getHealthStatus
};
