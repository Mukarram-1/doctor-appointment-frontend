import api from './api';

const authService = {
  async login(credentials) {
    try {
      const response = await api.post('/auth/login', credentials);
      
      if (response.data.success) {
        const { user, accessToken, tokenType, expiresIn } = response.data.data;
        
        // Store tokens in localStorage
        localStorage.setItem('accessToken', accessToken);
        localStorage.setItem('user', JSON.stringify(user));
        
        return {
          user,
          accessToken,
          tokenType,
          expiresIn
        };
      } else {
        throw new Error(response.data.message || 'Login failed');
      }
    } catch (error) {
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw new Error(error.message || 'Login failed');
    }
  },

  async register(userData) {
    try {
      const response = await api.post('/auth/register', userData);
      
      if (response.data.success) {
        const { user, tokens } = response.data.data;
        
        // Store tokens in localStorage
        localStorage.setItem('accessToken', tokens.accessToken);
        localStorage.setItem('user', JSON.stringify(user));
        
        return {
          user,
          accessToken: tokens.accessToken,
          tokenType: tokens.tokenType,
          expiresIn: tokens.expiresIn
        };
      } else {
        throw new Error(response.data.message || 'Registration failed');
      }
    } catch (error) {
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw new Error(error.message || 'Registration failed');
    }
  },

  async getProfile() {
    try {
      const response = await api.get('/auth/me');
      
      if (response.data.success) {
        const user = response.data.data;
        localStorage.setItem('user', JSON.stringify(user));
        return user;
      } else {
        throw new Error(response.data.message || 'Failed to fetch profile');
      }
    } catch (error) {
      if (error.response?.status === 401) {
        this.logout();
        throw new Error('Session expired. Please login again.');
      }
      throw new Error(error.response?.data?.message || 'Failed to fetch profile');
    }
  },

  async updateProfile(profileData) {
    try {
      const response = await api.put('/auth/profile', profileData);
      
      if (response.data.success) {
        const user = response.data.data;
        localStorage.setItem('user', JSON.stringify(user));
        return user;
      } else {
        throw new Error(response.data.message || 'Failed to update profile');
      }
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to update profile');
    }
  },

  async changePassword(passwordData) {
    try {
      const response = await api.put('/auth/change-password', passwordData);
      
      if (response.data.success) {
        // Password changed successfully, user needs to login again
        this.logout();
        return response.data.message;
      } else {
        throw new Error(response.data.message || 'Failed to change password');
      }
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to change password');
    }
  },

  async refreshToken() {
    try {
      const response = await api.post('/auth/refresh-token');
      
      if (response.data.success) {
        const { accessToken } = response.data.data;
        localStorage.setItem('accessToken', accessToken);
        return accessToken;
      } else {
        throw new Error('Token refresh failed');
      }
    } catch {
      this.logout();
      throw new Error('Session expired. Please login again.');
    }
  },

  async logout() {
    try {
      // Try to logout from server
      await api.post('/auth/logout');
    } catch (error) {
      // Continue with local logout even if server logout fails
      console.warn('Server logout failed:', error.message);
    } finally {
      // Always clear local storage
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');
    }
  },

  async logoutAll() {
    try {
      await api.post('/auth/logout-all');
    } catch (err) {
      console.warn('Server logout-all failed:', err.message);
    } finally {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');
    }
  },

  // Helper methods
  getCurrentUser() {
    try {
      const userStr = localStorage.getItem('user');
      return userStr ? JSON.parse(userStr) : null;
    } catch (error) {
      console.error('Error parsing user data:', error);
      return null;
    }
  },

  getAccessToken() {
    return localStorage.getItem('accessToken');
  },

  isAuthenticated() {
    return !!this.getAccessToken();
  },

  isAdmin() {
    const user = this.getCurrentUser();
    return user?.role === 'admin';
  },

  isUser() {
    const user = this.getCurrentUser();
    return user?.role === 'user';
  }
};

export default authService; 