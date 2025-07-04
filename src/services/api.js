import axios from 'axios';
import { message } from 'antd';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Include cookies for refresh token
});

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  
  failedQueue = [];
};

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then(token => {
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return api(originalRequest);
        }).catch(err => {
          return Promise.reject(err);
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const response = await axios.post(`${API_BASE_URL}/auth/refresh-token`, {}, {
          withCredentials: true,
          headers: {
            'Content-Type': 'application/json',
          }
        });

        if (response.data.success) {
          const { accessToken } = response.data.data;
          localStorage.setItem('accessToken', accessToken);
          
          processQueue(null, accessToken);
          
          originalRequest.headers.Authorization = `Bearer ${accessToken}`;
          isRefreshing = false;
          return api(originalRequest);
        } else {
          throw new Error('Token refresh failed');
        }
      } catch (refreshError) {
        processQueue(refreshError, null);
        isRefreshing = false;
        
        localStorage.removeItem('accessToken');
        localStorage.removeItem('user');
        
        if (!originalRequest.url?.includes('/auth/login') && 
            !originalRequest.url?.includes('/auth/register')) {
          message.error('Session expired. Please login again.');
          
          if (window.location.pathname !== '/login') {
            window.location.href = '/login';
          }
        }
        
        return Promise.reject(refreshError);
      }
    }

    if (error.response?.data?.message) {
      if (error.response.status !== 400 && 
          !error.config?.url?.includes('/auth/login') && 
          !error.config?.url?.includes('/auth/register')) {
        message.error(error.response.data.message);
      }
    } else if (error.message && error.message !== 'Network Error') {
      message.error(error.message);
    }

    return Promise.reject(error);
  }
);

export default api; 
