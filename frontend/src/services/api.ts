import axios from 'axios';

// Production'da Nginx proxy kullanır (/api), development'ta localhost:5000
// VITE_API_URL set edilmemişse, relative path kullan (Nginx proxy üzerinden)
const API_URL = import.meta.env.VITE_API_URL || '/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 300000, // 5 dakika default timeout (WhatsApp otomasyonu için)
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle 401 errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/admin-panel/login';
    }
    return Promise.reject(error);
  }
);

export default api;

