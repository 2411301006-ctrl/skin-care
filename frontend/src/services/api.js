import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';

// Retrieve or generate persistent session ID for guest carts
export function getOrCreateSessionId() {
  let sessionId = localStorage.getItem('glow_session_id');
  if (!sessionId) {
    sessionId = 'sess_' + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    localStorage.setItem('glow_session_id', sessionId);
  }
  return sessionId;
}

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor to add Auth token & Session ID
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('glow_access_token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    config.headers['X-Session-ID'] = getOrCreateSessionId();
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor for response error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message = error.response?.data?.detail || error.message || 'An unexpected error occurred';
    return Promise.reject(new Error(message));
  }
);

export default api;
