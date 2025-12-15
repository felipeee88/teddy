import axios from 'axios';
import { useAuthStore } from './auth.store';
import { ApiError, ApiErrorResponse } from '../types/error';

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000',
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 || error.response?.status === 403) {
      useAuthStore.getState().logout();
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    
    // Padronizar erro
    const errorData = error.response?.data as ApiErrorResponse;
    const apiError = new ApiError(
      errorData?.message || error.message || 'An unexpected error occurred',
      error.response?.status || 500,
      errorData?.errors
    );
    
    return Promise.reject(apiError);
  }
);

export default apiClient;
