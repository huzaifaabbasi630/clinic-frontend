import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request interceptor to attach JWT
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('hospital_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    // Backend normalization: Ensure we always return the nested data if it exists
    return response.data;
  },
  (error) => {
    const message = error.response?.data?.message || 'Something went wrong';
    const status = error.response?.status;
    
    // Check if we are using a mock token (for development/fallback mode)
    const token = localStorage.getItem('hospital_token');
    const isMockToken = token && token.startsWith('mock-');

    // ONLY auto-logout if it's a real token and truly unauthorized
    // If it's a mock token, we let the service catch the 401 and use fallback data
    if (status === 401 && !isMockToken) {
      localStorage.removeItem('hospital_token');
      localStorage.removeItem('hospital_user');
      // Using window.location sparingly to avoid loops during auth transitions
      if (!window.location.pathname.includes('/login')) {
         window.location.href = '/login';
      }
    }
    
    return Promise.reject(message);
  }
);

export default api;
