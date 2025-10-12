import { useState, useCallback } from 'react';
import axios from 'axios';
import { useToast, ToastMessages } from '../components/Toast';

const useApi = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const toast = useToast();

  // Create axios instance with default config
  const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
    timeout: 10000,
    headers: {
      'Content-Type': 'application/json',
    },
  });

  // Request interceptor
  api.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  // Response interceptor
  api.interceptors.response.use(
    (response) => {
      return response;
    },
    (error) => {
      if (error.response?.status === 401) {
        // Check if auto-redirect is disabled for this request
        const disableAutoRedirect = error.config?.disableAutoRedirect;

        if (!disableAutoRedirect) {
          localStorage.removeItem('currentUser');
          localStorage.removeItem('token');
          window.location.href = '/login';
        }
      }
      return Promise.reject(error);
    }
  );

  // Generic API call function
  const apiCall = useCallback(async (config, options = {}) => {
    const {
      showLoading = true,
      showError = true,
      showSuccess = false,
      successMessage = 'Operation completed successfully',
      errorMessage = null,
      onSuccess = null,
      onError = null,
      disableAutoRedirect = false,
    } = options;

    if (showLoading) {
      setLoading(true);
    }
    setError(null);

    // Add disableAutoRedirect to config if specified
    const axiosConfig = {
      ...config,
      disableAutoRedirect,
    };

    try {
      const response = await api(axiosConfig);
      
      if (showSuccess && successMessage) {
        toast.success(successMessage);
      }
      
      if (onSuccess) {
        onSuccess(response.data);
      }
      
      return response.data;
    } catch (err) {
      let errorMsg = errorMessage;
      
      if (!errorMsg) {
        if (err.response) {
          switch (err.response.status) {
            case 400:
              errorMsg = err.response.data?.message || 'Bad request';
              break;
            case 401:
              errorMsg = 'Unauthorized. Please log in again.';
              break;
            case 403:
              errorMsg = 'Access denied. You do not have permission to perform this action.';
              break;
            case 404:
              errorMsg = 'Resource not found';
              break;
            case 409:
              errorMsg = err.response.data?.message || 'Conflict. Resource already exists.';
              break;
            case 422:
              errorMsg = err.response.data?.message || 'Validation error';
              break;
            case 429:
              errorMsg = 'Too many requests. Please try again later.';
              break;
            case 500:
              errorMsg = ToastMessages.SERVER_ERROR;
              break;
            default:
              errorMsg = err.response.data?.message || 'An error occurred';
          }
        } else if (err.code === 'NETWORK_ERROR' || !navigator.onLine) {
          errorMsg = ToastMessages.NETWORK_ERROR;
        } else if (err.code === 'ECONNABORTED') {
          errorMsg = 'Request timeout. Please try again.';
        } else {
          errorMsg = 'An unexpected error occurred';
        }
      }

      setError(errorMsg);
      
      if (showError) {
        toast.error(errorMsg);
      }
      
      if (onError) {
        onError(err, errorMsg);
      }
      
      throw err;
    } finally {
      if (showLoading) {
        setLoading(false);
      }
    }
  }, [api, toast]);

  // Specific API methods
  const get = useCallback((url, options = {}) => {
    return apiCall({ method: 'GET', url }, options);
  }, [apiCall]);

  const post = useCallback((url, data, options = {}) => {
    return apiCall({ method: 'POST', url, data }, options);
  }, [apiCall]);

  const put = useCallback((url, data, options = {}) => {
    return apiCall({ method: 'PUT', url, data }, options);
  }, [apiCall]);

  const patch = useCallback((url, data, options = {}) => {
    return apiCall({ method: 'PATCH', url, data }, options);
  }, [apiCall]);

  const del = useCallback((url, options = {}) => {
    return apiCall({ method: 'DELETE', url }, options);
  }, [apiCall]);

  // Upload file
  const upload = useCallback(async (url, file, options = {}) => {
    const formData = new FormData();
    formData.append('file', file);
    
    return apiCall({
      method: 'POST',
      url,
      data: formData,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }, options);
  }, [apiCall]);

  // Clear error
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    loading,
    error,
    clearError,
    apiCall,
    get,
    post,
    put,
    patch,
    delete: del,
    upload,
  };
};

export default useApi;
