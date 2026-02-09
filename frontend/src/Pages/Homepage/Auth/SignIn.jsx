import './Auth.css';
import { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FaEnvelope, FaLock, FaTimes, FaEye, FaEyeSlash } from 'react-icons/fa';

const SignIn = ({ setActivePage }) => {
  const navigate = useNavigate();
  const modalRef = useRef(null);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  });
  const [errors, setErrors] = useState({});
  const [isVisible, setIsVisible] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isScrolling, setIsScrolling] = useState(false);

  useEffect(() => {
    setIsVisible(true);
    document.body.classList.add('modal-open');
    return () => {
      document.body.classList.remove('modal-open');
    };
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (modalRef.current) {
        setIsScrolling(modalRef.current.scrollTop > 10);
      }
    };

    const modalElement = modalRef.current;
    if (modalElement) {
      modalElement.addEventListener('scroll', handleScroll);
      return () => modalElement.removeEventListener('scroll', handleScroll);
    }
  }, []);

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email is invalid';
    
    if (!formData.password) newErrors.password = 'Password is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
    
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };

  const handleCloseModal = () => {
    setIsVisible(false);
    setTimeout(() => {
      navigate('/');
      setActivePage('home');
    }, 300);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      setIsLoading(true);
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        console.log('Login successful:', formData);
        handleCloseModal();
      } catch (error) {
        alert('Login failed. Please check your credentials.');
      } finally {
        setIsLoading(false);
      }
    }
  };

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') handleCloseModal();
    };
    
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, []);

  return (
    <div className={`modal-overlay ${isVisible ? 'visible' : ''}`} onClick={handleCloseModal}>
      <div 
        ref={modalRef}
        className={`modal-container ${isVisible ? 'visible' : ''} ${isScrolling ? 'scrolling' : ''}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <h2>Welcome Back to NEXUS</h2>
          <button className="close-btn" onClick={handleCloseModal}>
            <FaTimes />
          </button>
        </div>

        <div className="login-card">
          <div className="login-header">
            <p>Sign in to access your personalized dashboard</p>
          </div>

          <form onSubmit={handleSubmit}>
            {/* Email Field */}
            <div className="form-group">
              <label htmlFor="email">
                <FaEnvelope className="input-icon" />
                Email Address *
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="Enter your email"
                className={errors.email ? 'error' : ''}
                autoFocus
              />
              {errors.email && <span className="error-message">{errors.email}</span>}
            </div>

            {/* Password Field */}
            <div className="form-group">
              <label htmlFor="password">
                <FaLock className="input-icon" />
                Password *
              </label>
              <div className="password-input-container">
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="Enter your password"
                  className={errors.password ? 'error' : ''}
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
              {errors.password && <span className="error-message">{errors.password}</span>}
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="login-options">
              <label className="checkbox-container">
                <input
                  type="checkbox"
                  name="rememberMe"
                  checked={formData.rememberMe}
                  onChange={handleInputChange}
                />
                <span className="checkmark"></span>
                Remember me
              </label>
              <Link to="/forgot-password" className="forgot-password">
                Forgot Password?
              </Link>
            </div>

            {/* Submit Button */}
            <button 
              type="submit" 
              className="login-btn"
              disabled={isLoading}
            >
              {isLoading ? 'Signing In...' : 'Sign In'}
            </button>

            {/* Divider */}
            <div className="divider">
              <span>Or continue with</span>
            </div>

            {/* Social Login */}
            <div className="social-login">
              <button type="button" className="social-btn google">
                <img src="/google-icon.svg" alt="Google" />
                Google
              </button>
              <button type="button" className="social-btn github">
                <img src="/github-icon.svg" alt="GitHub" />
                GitHub
              </button>
            </div>

            {/* Sign Up Link */}
            <div className="signup-link">
              Don't have an account? <Link to="/register">Create Account</Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SignIn;