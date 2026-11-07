import React, { createContext, useContext, useState, useEffect } from 'react';
import { authApi } from '../services/authApi';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('talenthub_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('talenthub_token');
    if (token) {
      authApi.getMe()
        .then((userData) => {
          setUser(userData);
          localStorage.setItem('talenthub_user', JSON.stringify(userData));
        })
        .catch(() => {
          logout();
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (credentials) => {
    const response = await authApi.login(credentials);
    const userData = {
      user_id: response.user_id,
      name: response.name,
      email: response.email,
      role: response.role
    };
    localStorage.setItem('talenthub_token', response.access_token);
    localStorage.setItem('talenthub_user', JSON.stringify(userData));
    setUser(userData);
    return userData;
  };

  const logout = () => {
    localStorage.removeItem('talenthub_token');
    localStorage.removeItem('talenthub_user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
