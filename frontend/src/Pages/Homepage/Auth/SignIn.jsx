import './Auth.css';
import { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FaEnvelope, FaLock, FaTimes, FaEye, FaEyeSlash } from 'react-icons/fa';
import { useAuth } from '../../../Api/AuthContext'; // 1. Import useAuth

const SignIn = ({ setActivePage }) => {
  const navigate = useNavigate();
  const modalRef = useRef(null);
  
  // 2. Extract login, loading, and authError from Context
  const { login, loading: authLoading, error: authError } = useAuth();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  });
  
  const [errors, setErrors] = useState({});
  const [isVisible, setIsVisible] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isScrolling, setIsScrolling] = useState(false);
  const [localError, setLocalError] = useState(''); // For specific UI feedback

  useEffect(() => {
    setIsVisible(true);
    document.body.classList.add('modal-open');
    return () => {
      document.body.classList.remove('modal-open');
    };
  }, []);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
    if (errors[name]) setErrors({ ...errors, [name]: '' });
    if (localError) setLocalError('');
  };

  const handleCloseModal = () => {
    setIsVisible(false);
    setTimeout(() => {
      navigate('/');
      setActivePage('home');
    }, 300);
  };

  // 3. Updated handleSubmit for Backend Integration
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError('');
    
    const isValid = () => {
      const newErrors = {};
      if (!formData.email.trim()) newErrors.email = 'Email is required';
      if (!formData.password) newErrors.password = 'Password is required';
      setErrors(newErrors);
      return Object.keys(newErrors).length === 0;
    };

    if (isValid()) {
      try {
        // Call the login function from AuthContext
        await login(formData.email, formData.password);
        
        // Success: Close modal (Context handles state and redirects)
        handleCloseModal();
      } catch (err) {
        // Error: Display message from backend
        setLocalError(err.message || 'Invalid email or password');
      }
    }
  };

  return (
    <div className={`modal-overlay ${isVisible ? 'visible' : ''}`} onClick={handleCloseModal}>
      <div 
        ref={modalRef}
        className={`modal-container ${isVisible ? 'visible' : ''}`} 
        style={{maxWidth: 410}}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <h2>Welcome Back to NEXUS</h2>
          <button className="close-btn" onClick={handleCloseModal}>
            <FaTimes />
          </button>
        </div>

        {/* 4. Display Backend Errors */}
        {(localError || authError) && (
          <div className="error-banner" style={{ margin: '10px 20px', padding: '10px', background: '#fee2e2', color: '#dc2626', borderRadius: '8px', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <FaTimes /> <span>{localError || authError}</span>
          </div>
        )}

        <div className="login-card">
          <form onSubmit={handleSubmit}>
            <div className="form-group" style={{paddingTop:20}}>
              <label htmlFor="email">
                <FaEnvelope className="input-icon" /> Email Address *
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="Enter your email"
                className={errors.email ? 'error' : ''}
                autoFocus
              />
              {errors.email && <span className="error-message">{errors.email}</span>}
            </div>

            <div className="form-group" style={{paddingTop:20}}>
              <label htmlFor="password">
                <FaLock className="input-icon" /> Password *
              </label>
              <div className="password-input-container">
                <input
                  type={showPassword ? 'text' : 'password'}
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

            <div className="login-options" style={{paddingTop:10}}>
              <label className="checkbox-container">
                <input type="checkbox" name="rememberMe" checked={formData.rememberMe} onChange={handleInputChange} />
                <span className="checkmark"></span>
                Remember me
              </label>
              <Link to="/forgot-password" style={{ color: '#667eea', fontSize: '14px', textDecoration: 'none' }}>
                Forgot Password?
              </Link>
            </div>

            {/* 5. Update Button Loading State */}
            <button type="submit" className="login-btn" disabled={authLoading}>
              {authLoading ? 'Verifying...' : 'Sign In'}
            </button>

            <div className="divider"><span>Or continue with</span></div>

            <div className="social-login">
              <button type="button" className="social-btn google"><img src="/google-icon.svg" alt="Google" /></button>
              <button type="button" className="social-btn github"><img src="/github-icon.svg" alt="GitHub" /></button>
            </div>

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