import api from './api';

/**
 * Security Audit Log Service
 * Fetches authenticated user's security audit history
 */
export const auditService = {
  /**
   * Fetch authenticated user's recent audit logs
   * GET /api/audit
   */
  getAuditLogs: async () => {
    try {
      const res = await api.get('/audit');
      return res.logs || [];
    } catch (err) {
      console.error('[VaultX AuditService] Failed to fetch audit logs:', err);
      throw err;
    }
  }
};

export default auditService;
