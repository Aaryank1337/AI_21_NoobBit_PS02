// api.js - Simple axios instance for frontend to backend communication
import axios from 'axios';

// Create base axios instance with default configuration
const api = axios.create({
  baseURL: 'http://localhost:5000', // Your backend server URL
  headers: {
    'Content-Type': 'application/json'
  },
  timeout: 8000 // 8 seconds
});

// Simple error handling
api.interceptors.response.use(
  response => response,
  error => {
    console.error('API Error:', error.message);
    return Promise.reject(error);
  }
);

export default api;