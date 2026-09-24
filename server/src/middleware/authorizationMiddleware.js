/**
 * Authorization Foundation Middleware
 * Provides reusable helpers for verifying resource ownership.
 * Design supports future query patterns: Model.findOne({ _id: resourceId, ownerId: req.user.id })
 */

/**
 * Reusable helper function to verify resource ownership
 * @param {Object} resource The document/resource retrieved from DB
 * @param {String} userId Currently authenticated user ID
 * @param {String} ownerKey Field name representing owner ID (default: 'ownerId')
 * @returns {Boolean} True if user owns the resource
 */
const isResourceOwner = (resource, userId, ownerKey = 'ownerId') => {
  if (!resource || !userId) return false;
  const ownerId = resource[ownerKey]?.toString() || resource[ownerKey];
  return ownerId === userId.toString();
};

/**
 * Middleware factory to enforce resource ownership on Express requests
 * @param {Function} fetchResourceFn Async function (req) => Promise<resource>
 * @param {String} ownerKey Field name representing owner ID (default: 'ownerId')
 */
const requireOwnership = (fetchResourceFn, ownerKey = 'ownerId') => {
  return async (req, res, next) => {
    try {
      if (!req.user || !req.user.id) {
        return res.status(401).json({
          success: false,
          message: 'Authentication required for resource access.'
        });
      }

      const resource = await fetchResourceFn(req);
      if (!resource) {
        return res.status(404).json({
          success: false,
          message: 'Requested resource not found.'
        });
      }

      if (!isResourceOwner(resource, req.user.id, ownerKey)) {
        return res.status(403).json({
          success: false,
          message: 'Access denied: You do not own this resource.'
        });
      }

      req.resource = resource;
      next();
    } catch (error) {
      next(error);
    }
  };
};

module.exports = {
  isResourceOwner,
  requireOwnership
};
