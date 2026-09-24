import axios from 'axios';

// Get API base URL from Vite environment variables or fallback to local port 5000
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

/**
 * Standardized Axios HTTP Client for VaultX Backend
 * Enabled withCredentials: true to send/receive HTTP-only session cookies
 */
const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json'
  },
  timeout: 10000
});

// Response interceptor for unified error formatting
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const formattedError = {
      message: error.response?.data?.message || error.message || 'An unexpected API error occurred',
      status: error.response?.status || 500,
      raw: error
    };
    return Promise.reject(formattedError);
  }
);

export default api;
