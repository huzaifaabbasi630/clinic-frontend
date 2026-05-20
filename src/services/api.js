import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json'
  },
  withCredentials: true
});

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    // Backend normalization: Ensure we always return the nested data if it exists
    return response.data;
  },
  (error) => {
    const message = error.response?.data?.message || 'Something went wrong';
    const status = error.response?.status;

    // ONLY auto-logout if it's truly unauthorized
    if (status === 401) {
      // Using window.location sparingly to avoid loops during auth transitions
      if (!window.location.pathname.includes('/login')) {
         window.location.href = '/login';
      }
    }
    
    return Promise.reject(message);
  }
);

export default api;
