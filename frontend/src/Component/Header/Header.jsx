import './Header.css';
import { useNavigate } from 'react-router-dom';
import nexus_logo from '../../assets/nexus.png';
import logo from '../../assets/logo.png';

const Header = () => {
  const navigate = useNavigate();
  
  return (
    <header className="header">
      <div className="header-left">
        
        <h1 onClick={() => navigate('/')}>
          <span className="logo-accent"><img src={nexus_logo} alt="logo" height={150}  width={190} style={{marginTop:10}}/></span>
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