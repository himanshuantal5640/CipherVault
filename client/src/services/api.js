import axios from 'axios';

// Get API base URL from Vite environment variables or fallback to local port 5000
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

/**
 * Standardized Axios HTTP Client for VaultX Backend
 */
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  },
  timeout: 10000
});

// Request interceptor to attach auth headers in future phases
api.interceptors.request.use(
  (config) => {
    // Placeholder for attaching JWT token from localStorage or state
    const token = localStorage.getItem('vaultx_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for unified error parsing
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
