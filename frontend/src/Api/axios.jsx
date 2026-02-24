import axios from 'axios';
const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1';
const API = axios.create({
  baseURL: baseURL+'/user',
  withCredentials: true, 
 
});

API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.warn('Unauthorized - user likely logged out');
    }
    return Promise.reject(error);
  }
);

export default API;