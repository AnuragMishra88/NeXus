import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-section">
          <h3>StudySuite</h3>
          <p>Empowering students with AI-powered tools for academic and career success.</p>
        </div>
        <div className="footer-section">
          <h4>Contact</h4>
          <p>support@studysuite.com</p>
          <p>+1 (555) 123-4567</p>
        </div>
      </div>
      <div className="footer-bottom">
        <p>&copy; 2024 StudySuite. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;