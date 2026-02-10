import API from './axios';

export const authService = {
  /**
   * Register User
   * @param {FormData | Object} userData - Can be FormData (for files) or Object
   */
  register: async (userData) => {
    try {
      // NOTE: When sending FormData, do NOT manually set Content-Type.
      // Axios and the browser will handle the 'multipart/form-data' boundary automatically.
      const response = await API.post('/register', userData);
      return response.data;
    } catch (error) {
      // Improved error handling to catch backend messages
      throw error.response?.data || { message: 'Registration failed' };
    }
  },

  /**
   * Login User
   */
  login: async (email, password) => {
    try {
      const response = await API.post('/login', { email, password });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Login failed' };
    }
  },

  /**
   * Get User Profile (Checks if user is logged in)
   */
  getProfile: async () => {
    try {
      const response = await API.get('/profile');
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch profile' };
    }
  },

  /**
   * Update Profile
   * @param {FormData} formData - Should be FormData to support Resume/Photo updates
   */
  updateProfile: async (formData) => {
    try {
      const response = await API.post('/profile/update', formData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Update failed' };
    }
  },

  /**
   * Upload Profile Photo Specifically
   */
  uploadProfilePhoto: async (file) => {
    const formData = new FormData();
    formData.append('file', file); // 'file' matches your singleUpload middleware key
    
    try {
      const response = await API.post('/profile/upload-photo', formData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Upload failed' };
    }
  },

  /**
   * Logout User
   */
  logout: async () => {
    try {
      const response = await API.get('/logout');
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Logout failed' };
    }
  }
};