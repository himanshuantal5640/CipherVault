import api from './api';

/**
 * Authentication Service (Phase 1 Placeholder)
 * Full JWT authentication and session management will be wired up in Phase 3.
 */
export const authService = {
  /**
   * User login placeholder
   */
  login: async (email, password) => {
    console.warn('[VaultX] Auth Service: login is a placeholder in Phase 1.');
    return {
      success: true,
      message: 'Phase 1 auth mock successful',
      user: { email, role: 'User' }
    };
  },

  /**
   * User registration placeholder
   */
  register: async (username, email, password) => {
    console.warn('[VaultX] Auth Service: register is a placeholder in Phase 1.');
    return {
      success: true,
      message: 'Phase 1 registration mock successful',
      user: { username, email }
    };
  },

  /**
   * Logout user session
   */
  logout: () => {
    localStorage.removeItem('vaultx_token');
    console.log('[VaultX] User logged out.');
  },

  /**
   * Get server health status
   */
  checkHealth: async () => {
    return await api.get('/health');
  }
};

export default authService;
