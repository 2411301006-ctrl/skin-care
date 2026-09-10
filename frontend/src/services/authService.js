import api from './api';

export const authService = {
  async signup(data) {
    const res = await api.post('/auth/signup', data);
    if (res.data.access_token) {
      localStorage.setItem('glow_access_token', res.data.access_token);
      localStorage.setItem('glow_refresh_token', res.data.refresh_token);
    }
    return res.data;
  },

  async login(data) {
    const res = await api.post('/auth/login', data);
    if (res.data.access_token) {
      localStorage.setItem('glow_access_token', res.data.access_token);
      localStorage.setItem('glow_refresh_token', res.data.refresh_token);
    }
    return res.data;
  },

  async refreshToken() {
    const refreshToken = localStorage.getItem('glow_refresh_token');
    if (!refreshToken) return null;
    const res = await api.post('/auth/refresh', { refresh_token: refreshToken });
    if (res.data.access_token) {
      localStorage.setItem('glow_access_token', res.data.access_token);
    }
    return res.data;
  },

  logout() {
    localStorage.removeItem('glow_access_token');
    localStorage.removeItem('glow_refresh_token');
  }
};
