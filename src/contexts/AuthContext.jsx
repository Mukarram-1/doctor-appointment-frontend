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
        // Verify token is still valid by fetching fresh user data
        try {
          const userData = await authService.getProfile();
          setUser(userData);
          setIsAuthenticated(true);
        } catch {
          // Token is invalid, clear auth state
          await logout();
        }
      } else {
        // No token or user data
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
      
      // Auto-login after successful registration
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
      await authService.logout();
    } catch (error) {
      console.warn('Server logout failed:', error);
    } finally {
      setUser(null);
      setIsAuthenticated(false);
      message.success('Logged out successfully');
    }
  };

  const updateProfile = async (profileData) => {
    try {
      setLoading(true);
      const updatedUser = await authService.updateProfile(profileData);
      setUser(updatedUser);
      message.success('Profile updated successfully!');
      return { success: true };
    } catch (error) {
      message.error(error.message || 'Failed to update profile');
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  const changePassword = async (passwordData) => {
    try {
      setLoading(true);
      await authService.changePassword(passwordData);
      // User will be logged out automatically after password change
      setUser(null);
      setIsAuthenticated(false);
      message.success('Password changed successfully! Please login with your new password.');
      return { success: true };
    } catch (error) {
      message.error(error.message || 'Failed to change password');
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  // Helper methods
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
    updateProfile,
    changePassword,
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