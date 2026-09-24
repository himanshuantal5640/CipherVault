import api from './api';

/**
 * Authentication Service
 * Communicates with VaultX Express API using HTTP-only cookies
 */
export const authService = {
  /**
   * Register new user account
   */
  register: async (email, password) => {
    return await api.post('/auth/register', { email, password });
  },

  /**
   * User login
   */
  login: async (email, password) => {
    return await api.post('/auth/login', { email, password });
  },

  /**
   * User logout (clears HTTP-only vaultx_token cookie)
   */
  logout: async () => {
    return await api.post('/auth/logout');
  },

  /**
   * Fetch current authenticated user session
   */
  getCurrentUser: async () => {
    return await api.get('/auth/me');
  },

  /**
   * Check API health status
   */
  checkHealth: async () => {
    return await api.get('/health');
  }
};

export default authService;
