import { useState, useEffect } from 'react';
import { message } from 'antd';
import authService from '../services/authService';
import { AuthContext } from './AuthContext';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    checkAuthState();
  }, []);

  const checkAuthState = async () => {
    try {
      const token = authService.getAccessToken();
      const storedUser = authService.getCurrentUser();
      
      if (token && storedUser) {
        try {
          const userData = await authService.getProfile();
          setUser(userData);
          setIsAuthenticated(true);
        } catch {
          await logout();
        }
      } else {
        setUser(null);
        setIsAuthenticated(false);
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      await logout();
    } finally {
      setLoading(false);
    }
  };

  const login = async (credentials) => {
    try {
      setLoading(true);
      const response = await authService.login(credentials);
      const { user: userData } = response;
      
      setUser(userData);
      setIsAuthenticated(true);
      message.success('Login successful!');
      return { success: true };
    } catch (error) {
      message.error(error.message || 'Login failed');
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  const signup = async (userData) => {
    try {
      setLoading(true);
      const response = await authService.register(userData);
      
      if (response.user && response.accessToken) {
        setUser(response.user);
        setIsAuthenticated(true);
        message.success('Registration successful! Welcome!');
        return { success: true, autoLogin: true };
      } else {
        message.success('Registration successful! Please login.');
        return { success: true, autoLogin: false };
      }
    } catch (error) {
      message.error(error.message || 'Registration failed');
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      setLoading(true);
      await authService.logout();
      setUser(null);
      setIsAuthenticated(false);
      message.success('Logged out successfully');
      window.location.href = '/login';
    } catch (error) {
      console.warn('Logout failed:', error);
      setUser(null);
      setIsAuthenticated(false);
      window.location.href = '/login';
    } finally {
      setLoading(false);
    }
  };

  const isAdmin = () => {
    return user?.role === 'admin';
  };

  const isUser = () => {
    return user?.role === 'user';
  };

  const hasRole = (role) => {
    return user?.role === role;
  };

  const value = {
    user,
    isAuthenticated,
    loading,
    login,
    signup,
    logout,
    checkAuthState,
    isAdmin,
    isUser,
    hasRole
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}; 
