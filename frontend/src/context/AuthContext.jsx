import React, { createContext, useState, useEffect, useCallback } from 'react';
import { authService } from '../services/authService';
import { userService } from '../services/userService';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchUser = useCallback(async () => {
    const token = localStorage.getItem('glow_access_token');
    if (!token) {
      setUser(null);
      setLoading(false);
      return;
    }
    try {
      const userData = await userService.getMe();
      setUser(userData);
    } catch (err) {
      console.warn("Auth check failed:", err.message);
      // Try refresh token
      try {
        const refreshed = await authService.refreshToken();
        if (refreshed) {
          const userData = await userService.getMe();
          setUser(userData);
        } else {
          authService.logout();
          setUser(null);
        }
      } catch {
        authService.logout();
        setUser(null);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  const login = async (credentials) => {
    setError(null);
    try {
      const data = await authService.login(credentials);
      setUser(data.user);
      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const signup = async (data) => {
    setError(null);
    try {
      const res = await authService.signup(data);
      setUser(res.user);
      return res;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const logout = () => {
    authService.logout();
    setUser(null);
  };

  const refreshProfile = async () => {
    if (user) {
      try {
        const updated = await userService.getMe();
        setUser(updated);
      } catch (e) {
        console.error(e);
      }
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, error, login, signup, logout, refreshProfile }}>
      {children}
    </AuthContext.Provider>
  );
};
