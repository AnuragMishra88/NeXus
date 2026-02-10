import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:8000/api/v1/user',
  withCredentials: true, 
  headers: {
    'Content-Type': 'application/json'
  }
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