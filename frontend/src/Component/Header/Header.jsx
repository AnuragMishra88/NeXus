import './Header.css';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../Api/AuthContext'; // Integrated AuthContext
import nexus_logo from '../../assets/nexus.png';
import { FaUserCircle, FaSignOutAlt } from 'react-icons/fa'; // Icons for the profile

const Header = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth(); // Accessing user and logout

  const handleLogout = async () => {
    await logout();
    navigate('/');
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
        {user ? (
          /* SHOW IF LOGGED IN */
          <div className="user-section">
            <div className="user-info" onClick={() => navigate('/profile')}>
              <FaUserCircle className="user-icon" />
              <span className="user-name">Hi, {user.fullName.split(' ')[0]}</span>
            </div>
            <button className="auth-btn secondary logout-btn" onClick={handleLogout}>
              <FaSignOutAlt />
            </button>
          </div>
        ) : (
          /* SHOW IF LOGGED OUT */
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