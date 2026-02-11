// frontend/src/Api/authService.js
import API from './axios';

export const authService = {
  /**
   * Register User
   */
  register: async (userData) => {
    try {
      const response = await API.post('/register', userData);
      return response.data;
    } catch (error) {
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
   * Get User Profile
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
   * Upload Profile Photo
   */
  uploadProfilePhoto: async (formData) => {
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
  },

  // ============ NEW RESUME METHODS ============
  
  /**
   * Analyze resume from text
   */
  analyzeResumeText: async (resumeText, jobDescription = '') => {
    try {
      const response = await API.post('/resume/analyze/text', {
        resume_text: resumeText,
        job_description: jobDescription
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Resume analysis failed' };
    }
  },

  /**
   * Analyze resume from PDF file
   */
  analyzeResumeFile: async (file, jobDescription = '') => {
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('job_description', jobDescription);
      
      const response = await API.post('/resume/analyze/file', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'File analysis failed' };
    }
  },

  /**
   * Rewrite bullet point
   */
  rewriteBulletPoint: async (bulletPoint, targetRole = 'Software Engineer') => {
    try {
      const response = await API.post('/resume/rewrite', {
        bullet_point: bulletPoint,
        target_role: targetRole
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Rewrite failed' };
    }
  },

  /**
   * Get skill suggestions
   */
  getSkillSuggestions: async (role = 'Software Engineer') => {
    try {
      const response = await API.get(`/resume/skill-suggestions?role=${encodeURIComponent(role)}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch skills' };
    }
  },

  /**
   * Check resume service health
   */
  checkResumeHealth: async () => {
    try {
      const response = await API.get('/resume/health');
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Health check failed' };
    }
  }
};