import React, { createContext, useState, useContext, useEffect } from 'react';
import { authService } from '../services/authService';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState({
    username: 'Demo Security Analyst',
    email: 'secops@vaultx.io',
    isAuthenticated: false
  });
  const [loading, setLoading] = useState(false);

  const login = async (email, password) => {
    setLoading(true);
    try {
      const res = await authService.login(email, password);
      setUser({
        username: email.split('@')[0],
        email: email,
        isAuthenticated: true
      });
      return res;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    authService.logout();
    setUser({
      username: '',
      email: '',
      isAuthenticated: false
    });
  };

  return (
    <AuthContext.Provider value={{ user, setUser, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
