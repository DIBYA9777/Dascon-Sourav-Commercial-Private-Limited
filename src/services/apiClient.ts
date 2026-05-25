import axios from 'axios';

const apiClient = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to dynamically inject the token into headers on every call
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('nway_token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for streamlined error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const serverMessage = error.response?.data?.message || error.response?.data?.error;
    const customError = new Error(serverMessage || error.message || 'API request failed');
    (customError as any).status = error.response?.status;
    return Promise.reject(customError);
  }
);

export default apiClient;
