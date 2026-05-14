import './Header.css';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../Api/AuthContext'; 
// 1. Import Clerk hooks for state and logout
import { useUser, useClerk } from '@clerk/clerk-react'; 
import nexus_logo from '../../assets/nexus.png';
import { FaUserCircle, FaSignOutAlt } from 'react-icons/fa';

const Header = () => {
  const navigate = useNavigate();
  
  // 2. Access both manual and Clerk (Google) auth states
  const { user: manualUser, logout: manualLogout } = useAuth();
  const { user: clerkUser, isSignedIn } = useUser();
  const { signOut } = useClerk();

  // 3. Determine which user data to display
  const currentUser = isSignedIn ? {
    fullName: clerkUser.fullName,
    firstName: clerkUser.firstName,
    profilePhoto: clerkUser.imageUrl,
    isClerk: true
  } : manualUser;

  // 4. FIXED: Combined logout handler to clear both sessions in one click
  const handleLogout = async () => {
    try {
      // Clear Clerk session if active
      if (isSignedIn) {
        await signOut(); 
      }
      
      // Always trigger manual logout to clear MongoDB cookies/JWT
      await manualLogout(); 
      
      // Navigate home after both are cleared
      navigate('/');
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <header className="header">
      <div className="header-left">
        <h1 onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>
          <span className="logo-accent">
            <img src={nexus_logo} alt="logo" height={150} width={190} style={{ marginTop: 10 }} />
          </span>
        </h1>
      </div>

      <div className="header-right">
        {currentUser ? (
          <div className="user-section">
            <div className="user-info" onClick={() => navigate('/profile')}>
              {currentUser.profilePhoto ? (
                <img src={currentUser.profilePhoto} className="user-avatar-img" alt="profile" style={{width: 30, height: 30, borderRadius: '50%'}} />
              ) : (
                <FaUserCircle className="user-icon" />
              )}
              <span className="user-name">
                Hi, {currentUser.isClerk ? currentUser.firstName : currentUser.fullName.split(' ')[0]}
              </span>
            </div>
            <button className="auth-btn secondary logout-btn" onClick={handleLogout}>
              <FaSignOutAlt />
            </button>
          </div>
        ) : (
          <>
            <button className="auth-btn secondary" onClick={() => navigate('/signin')}>
              Sign In
            </button>
            <button className="auth-btn primary" onClick={() => navigate('/register')}>
              Get Started
            </button>
          </>
        )}
      </div>
    </header>
  );
};

export default Header;
//new feature added