import './Auth.css';
import { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FaEnvelope, FaLock, FaTimes, FaEye, FaEyeSlash } from 'react-icons/fa';
import { useAuth } from '../../../Api/AuthContext'; 
import { useSignIn, useClerk, useUser } from "@clerk/clerk-react"; 

const SignIn = ({ setActivePage }) => {
  const navigate = useNavigate();
  const modalRef = useRef(null);
  const { isLoaded, signIn, setActive } = useSignIn();
  const { signOut } = useClerk();
  const { user: clerkUser, isSignedIn } = useUser(); 
  const { login, loading: authLoading, error: authError } = useAuth();

  const [formData, setFormData] = useState({ email: '', password: '' });
  const [isVisible, setIsVisible] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [localError, setLocalError] = useState(''); 
  const [isSocialLoading, setIsSocialLoading] = useState(false);

  useEffect(() => {
    setIsVisible(true);
    document.body.classList.add('modal-open');
    return () => document.body.classList.remove('modal-open');
  }, []);

  // Logic to handle Google/GitHub auto-registration or login
  useEffect(() => {
    const handleSocialAuth = async () => {
      if (isSignedIn && clerkUser) {
        try {
          const email = clerkUser.primaryEmailAddress.emailAddress;
          const clerkId = clerkUser.id;
          const fullName = clerkUser.fullName || clerkUser.username || "Social User";

          const response = await login(email, "GOOGLE_AUTH_VERIFIED", clerkId, fullName);

          if (response && response.success) {
            handleCloseModal();
          }
        } catch (err) {
          console.error("Social Auth error", err);
          setLocalError("Authentication failed. Please try again.");
          await signOut(); 
        }
      }
    };
    handleSocialAuth();
  }, [isSignedIn, clerkUser]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleCloseModal = () => {
    setIsVisible(false);
    setTimeout(() => {
      navigate('/');
      if (setActivePage) setActivePage('home');
    }, 300);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError('');
    if (!formData.email || !formData.password) return;
    try {
      await login(formData.email, formData.password);
      handleCloseModal();
    } catch (err) {
      setLocalError(err.message || 'Invalid email or password');
    }
  };

  const initiateSocialLogin = async (strategy) => {
    if (!isLoaded) return;
    setIsSocialLoading(true);
    try {
      await signIn.authenticateWithRedirect({
        strategy: strategy,
        redirectUrl: "/sso-callback",
        redirectUrlComplete: "/signin" 
      });
    } catch (err) {
      setLocalError("Login failed. Please try again.");
    } finally {
      setIsSocialLoading(false);
    }
  };

  return (
    <div className={`modal-overlay ${isVisible ? 'visible' : ''}`} onClick={handleCloseModal}>
      <div className={`modal-container ${isVisible ? 'visible' : ''}`} style={{maxWidth: 410}} onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>NEXUS</h2>
          <button className="close-btn" onClick={handleCloseModal}><FaTimes /></button>
        </div>

        {(localError || authError) && (
          <div className="error-banner">
            <FaTimes /> <span>{localError || authError}</span>
          </div>
        )}

        <div className="login-card">
          <div className="welcome-header">
            <h3>Welcome back</h3>
            <p>Please enter your details to sign in</p>
          </div>

          <form onSubmit={handleSubmit} className="login-form">
            <div className="form-group">
              <label><FaEnvelope className="input-icon" /> Email Address</label>
              <input 
                type="email" 
                name="email" 
                value={formData.email} 
                onChange={handleInputChange} 
                placeholder="name@example.com" 
                required 
              />
            </div>

            <div className="form-group">
              <label><FaLock className="input-icon" /> Password</label>
              <div className="password-input-container">
                <input 
                  type={showPassword ? 'text' : 'password'} 
                  name="password" 
                  value={formData.password} 
                  onChange={handleInputChange} 
                  placeholder="••••••••" 
                  required 
                />
                <button type="button" className="password-toggle" onClick={() => setShowPassword(!showPassword)}>
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>

            <div className="login-options">
               <label className="checkbox-container">
                <input type="checkbox" name="rememberMe" />
                <span className="checkmark"></span>
                Remember me
              </label>
              <Link to="/forgot-password" title="Forgot Password" className="forgot-password">
                Forgot Password?
              </Link>
            </div>

            <button type="submit" className="login-btn" disabled={authLoading}>
              {authLoading ? <span className="spinner"></span> : 'Sign in to account'}
            </button>

            <div className="divider"><span>Or continue with</span></div>

            <div className="social-login-container">
              <button 
                type="button" 
                className="social-button google" 
                onClick={() => initiateSocialLogin("oauth_google")} 
                disabled={isSocialLoading}
              >
                <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" />
                <span>Google</span>
              </button>

              <button 
                type="button" 
                className="social-button github" 
                onClick={() => initiateSocialLogin("oauth_github")} 
                disabled={isSocialLoading}
              >
                <img src="https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png" alt="GitHub" />
                <span>GitHub</span>
              </button>
            </div>

            <div className="signup-link">
              Don't have an account? <Link to="/register">Create an account</Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SignIn;