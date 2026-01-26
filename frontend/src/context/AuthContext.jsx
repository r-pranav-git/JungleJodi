// frontend/src/context/AuthContext.jsx
import { createContext, useContext, useState, useEffect } from 'react';
import { userAPI } from '../utils/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('jj_token');
    const storedUser = localStorage.getItem('jj_user');
    
    if (token && storedUser) {
      setIsAuthenticated(true);
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = (userData, token) => {
    localStorage.setItem('jj_token', token);
    localStorage.setItem('jj_user', JSON.stringify(userData));
    setIsAuthenticated(true);
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem('jj_token');
    localStorage.removeItem('jj_user');
    setIsAuthenticated(false);
    setUser(null);
  };

  const updateUser = async () => {
    try {
      const response = await userAPI.getMe();
      setUser(response.data.user);
      localStorage.setItem('jj_user', JSON.stringify(response.data.user));
    } catch (error) {
      console.error('Failed to refresh user:', error);
    }
  };

  const value = {
    isAuthenticated,
    user,
    login,
    logout,
    updateUser,
    loading,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};