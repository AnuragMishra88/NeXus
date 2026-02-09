import './Header.css';
import { useNavigate } from 'react-router-dom';

const Header = () => {
  const navigate = useNavigate();
  
  return (
    <header className="header">
      <div className="header-left">
        <h1 className="logo" onClick={() => navigate('/')}>
          <span className="logo-accent">NEXUS</span>
        </h1>
       
      </div>
      <div className="header-right">
        <button className="auth-btn secondary" onClick={() => navigate('/signin')}>
          Sign In
        </button>
        <button className="auth-btn primary" onClick={() => navigate('/register')}>
          Get Started
        </button>
      </div>
    </header>
  );
};

export default Header;