import React, { useState, useEffect } from 'react';
import './Aboutus.css';
import { 
  FaGithub, FaLinkedin, FaTwitter, FaEnvelope, 
  FaCode, FaDatabase, FaRobot, FaServer, 
  FaReact, FaPython, FaFigma, FaBrain,
  FaArrowRight, FaMapMarkerAlt, FaBriefcase,
  FaGraduationCap, FaAward, FaHeart, FaStar,
  FaQuoteLeft, FaUsers, FaRocket, FaShieldAlt
} from 'react-icons/fa';

const AboutUs = () => {
  const [activeTab, setActiveTab] = useState('story');
  const [githubStats, setGithubStats] = useState({
    abhishek: { followers: '1.2k', repos: '45+', contributions: '2.3k' },
    anurag: { followers: '980', repos: '38+', contributions: '1.8k' }
  });

  const founders = [
    {
      id: 'abhishek',
      name: 'Abhishek Pathak',
      role: 'Founder & Backend Architect',
      tagline: 'Building the Brain',
      description: 'Architect of NEXUS platform with deep expertise in scalable backend systems, Generative AI integration, LangChain, and cloud infrastructure. Abhishek has built the intelligent core that powers all AI workflows.',
      github: 'https://github.com/AbhishekPathak369',
      githubUsername: 'AbhishekPathak369',
      linkedin: 'https://linkedin.com/in/abhishek-pathak-369',
      twitter: 'https://twitter.com/abhishek_dev',
      email: 'abhishek@nexus.ai',
      location: 'Bengaluru, India',
      education: 'B.Tech Computer Science, IIT Delhi',
      experience: '5+ years',
      expertise: [
        { icon: <FaServer />, label: 'Backend Architecture' },
        { icon: <FaRobot />, label: 'Generative AI' },
        { icon: <FaDatabase />, label: 'MongoDB/PostgreSQL' },
        { icon: <FaCode />, label: 'Node.js/Express' },
        { icon: <FaBrain />, label: 'LangChain/Groq' }
      ],
      achievements: [
        'Built scalable AI platform serving 10K+ concurrent users',
        'LangChain & Groq integration expert for academic AI',
        'AWS Certified Solutions Architect',
        'Reduced API latency by 60% through optimization'
      ],
      color: '#7C3AED',
      lightBg: '#F5F3FF',
      gradient: 'linear-gradient(135deg, #7C3AED 0%, #5B21B6 100%)',
      quote: "I believe in building systems that don't just work—they evolve. Every line of code should make the platform smarter."
    },
    {
      id: 'anurag',
      name: 'Anurag Mishra',
      role: 'Co-Founder & Frontend Innovator',
      tagline: 'Crafting the Experience',
      description: 'Visionary frontend architect and UI/UX designer specializing in React ecosystems, Python automation, and creating intuitive user experiences. Anurag transforms complex AI capabilities into seamless interfaces.',
      github: 'https://github.com/AnuragMishra88',
      githubUsername: 'AnuragMishra88',
      linkedin: 'https://linkedin.com/in/anurag-mishra-88',
      twitter: 'https://twitter.com/anurag_ui',
      email: 'anurag@nexus.ai',
      location: 'Mumbai, India',
      education: 'B.Des Interaction Design, IIT Bombay',
      experience: '4+ years',
      expertise: [
        { icon: <FaReact />, label: 'React/Next.js' },
        { icon: <FaPython />, label: 'Python/Django' },
        { icon: <FaFigma />, label: 'UI/UX Design' },
        { icon: <FaBrain />, label: 'AI Interface Design' },
        { icon: <FaCode />, label: 'Tailwind/CSS' }
      ],
      achievements: [
        'Designed award-winning UX for EdTech platform with 4.8/5 rating',
        'Python automation for 50+ deployment workflows',
        'Open source contributor to 15+ React libraries',
        'Improved page load speed by 45% with optimization'
      ],
      color: '#D97706',
      lightBg: '#FFFBEB',
      gradient: 'linear-gradient(135deg, #D97706 0%, #B45309 100%)',
      quote: "Great design isn't just how it looks—it's how it works intuitively. I craft experiences that feel like magic."
    }
  ];

  const stats = [
    { value: '50K+', label: 'Active Users', icon: '👥', color: '#7C3AED' },
    { value: '100K+', label: 'AI Queries/Day', icon: '🤖', color: '#D97706' },
    { value: '98%', label: 'Satisfaction Rate', icon: '⭐', color: '#059669' },
    { value: '24/7', label: 'Uptime', icon: '⚡', color: '#7C3AED' }
  ];

  const timeline = [
    { year: '2024', event: 'NEXUS Platform Launched', description: 'Beta release with dual-mode AI architecture', icon: '🚀' },
    { year: '2025', event: 'Academic Mode Complete', description: 'Smart Notes, Quiz Bank, Study Scheduler', icon: '🎓' },
    { year: '2026', event: 'Career Mode Launch', description: 'Resume Analyzer, Interview Simulator', icon: '💼' },
    { year: '2027', event: 'Enterprise Scale', description: '50K+ users, 100+ educational institutions', icon: '🌐' }
  ];

  return (
    <div className="aboutus-page-light">
      {/* Hero Section */}
      <div className="aboutus-hero">
        <div className="hero-content">
          <div className="greeting">
            <h1>
              Meet the <span className="gradient-text">Founders</span>
            </h1>
            <p className="subtitle">
              Two engineers, one vision: Democratizing AI-powered education and career growth
            </p>
          </div>
          
          <div className="hero-stats">
            {stats.map((stat, index) => (
              <div key={index} className="stat-card" style={{ borderLeft: `4px solid ${stat.color}` }}>
                <span className="stat-icon">{stat.icon}</span>
                <div>
                  <h3>{stat.value}</h3>
                  <p>{stat.label}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="aboutus-container-light">
        {/* Founders Grid */}
        <div className="founders-grid">
          {founders.map((founder) => (
            <div 
              key={founder.id} 
              className="founder-card-light"
              style={{
                borderTop: `4px solid ${founder.color}`,
                background: `linear-gradient(145deg, white, ${founder.lightBg})`
              }}
            >
              <div className="card-glow" style={{ background: `radial-gradient(circle at 50% 50%, ${founder.color}15 0%, transparent 70%)` }}></div>
              
              {/* Profile Header with GitHub Image */}
              <div className="profile-header">
                <div className="relative w-32 h-32 mx-auto mb-6">
                  <img 
                    src={`https://github.com/${founder.githubUsername}.png`}
                    alt={founder.name}
                    className="w-full h-full rounded-full object-cover border-4 border-[#6A38C2] shadow-lg"
                    onError={(e) => {
                      e.target.style.display = 'none';
                    }}
                  />
                  <div 
                    className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full flex items-center justify-center"
                    style={{ background: founder.gradient }}
                  >
                    <FaGithub className="text-white text-sm" />
                  </div>
                </div>
                
                <div className="founder-info text-center">
                  <h2 className="founder-name">{founder.name}</h2>
                  <span className="founder-role" style={{ background: `${founder.color}15`, color: founder.color }}>
                    {founder.role}
                  </span>
                  <p className="founder-tagline">{founder.tagline}</p>
                </div>
              </div>

              {/* Quote */}
              <div className="quote-wrapper" style={{ borderLeft: `4px solid ${founder.color}` }}>
                <FaQuoteLeft className="quote-icon" style={{ color: founder.color }} />
                <p className="quote-text">{founder.quote}</p>
              </div>

              {/* Expertise Badges */}
              <div className="expertise-section">
                <h4>Core Expertise</h4>
                <div className="expertise-grid">
                  {founder.expertise.map((skill, idx) => (
                    <div 
                      key={idx} 
                      className="expertise-badge"
                      style={{ background: `${founder.color}10`, color: founder.color }}
                    >
                      {skill.icon}
                      <span>{skill.label}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Bio */}
              <p className="founder-bio">{founder.description}</p>

              {/* Details Grid */}
              <div className="details-grid">
                <div className="detail-item" style={{ background: `${founder.color}08` }}>
                  <FaMapMarkerAlt style={{ color: founder.color }} />
                  <span>{founder.location}</span>
                </div>
                <div className="detail-item" style={{ background: `${founder.color}08` }}>
                  <FaGraduationCap style={{ color: founder.color }} />
                  <span>{founder.education}</span>
                </div>
                <div className="detail-item" style={{ background: `${founder.color}08` }}>
                  <FaBriefcase style={{ color: founder.color }} />
                  <span>{founder.experience}</span>
                </div>
              </div>

              {/* Achievements */}
              <div className="achievements-section">
                <h4>
                  <FaAward style={{ color: founder.color }} />
                  Key Achievements
                </h4>
                <ul>
                  {founder.achievements.map((achievement, idx) => (
                    <li key={idx}>
                      <FaStar className="achievement-star" style={{ color: founder.color }} />
                      {achievement}
                    </li>
                  ))}
                </ul>
              </div>

              {/* GitHub Profile Link */}
              <a 
                href={founder.github} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="github-profile-link"
                style={{ 
                  background: `${founder.color}10`,
                  border: `1px solid ${founder.color}30`
                }}
              >
                <FaGithub className="github-icon" />
                <span className="github-username">@{founder.githubUsername}</span>
                <span className="github-stats">
                  {githubStats[founder.id].followers} followers · {githubStats[founder.id].repos} repos
                </span>
                <FaArrowRight className="arrow-icon" />
              </a>

              {/* Social Links */}
              <div className="social-links">
                <a href={founder.linkedin} target="_blank" rel="noopener noreferrer" className="social-link linkedin">
                  <FaLinkedin />
                </a>
                <a href={founder.twitter} target="_blank" rel="noopener noreferrer" className="social-link twitter">
                  <FaTwitter />
                </a>
                <a href={`mailto:${founder.email}`} className="social-link email">
                  <FaEnvelope />
                </a>
              </div>
            </div>
          ))}
        </div>

        {/* The NEXUS Story */}
        <div className="story-section-light">
          <div className="story-grid">
            <div className="story-content">
              <h2>The NEXUS Story</h2>
              <div className="story-highlight">
                <FaQuoteLeft className="story-quote-icon" />
                <p className="story-quote">
                  "It started in a small coffee shop in Bangalore, where two engineers dreamed of making AI education accessible to everyone."
                </p>
              </div>
              <p className="story-text">
                Abhishek, with his deep expertise in backend systems and generative AI, built the intelligent core that powers NEXUS. Anurag, a frontend virtuoso and UX designer, crafted interfaces that make complex AI feel simple and intuitive.
              </p>
              <p className="story-text">
                Together, they created something neither could build alone—a dual-mode AI platform that adapts to whether you're studying for exams or preparing for your dream job.
              </p>
              
              <div className="stats-mini-grid">
                <div className="stats-mini-item">
                  <span className="stats-mini-value">2</span>
                  <span className="stats-mini-label">Founders</span>
                </div>
                <div className="stats-mini-item">
                  <span className="stats-mini-value">3</span>
                  <span className="stats-mini-label">Years</span>
                </div>
                <div className="stats-mini-item">
                  <span className="stats-mini-value">10K+</span>
                  <span className="stats-mini-label">Users</span>
                </div>
              </div>
            </div>

            {/* Timeline */}
            <div className="timeline-wrapper">
              <h3>
                <FaRocket style={{ color: '#7C3AED' }} />
                Platform Evolution
              </h3>
              <div className="timeline-light">
                {timeline.map((item, index) => (
                  <div key={index} className="timeline-item-light">
                    <div className="timeline-marker" style={{ background: index === 0 ? '#7C3AED' : index === 1 ? '#D97706' : index === 2 ? '#059669' : '#7C3AED' }}>
                      <span>{item.icon}</span>
                    </div>
                    <div className="timeline-content-light">
                      <span className="timeline-year">{item.year}</span>
                      <h4>{item.event}</h4>
                      <p>{item.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Mission & Values */}
        <div className="mission-section-light">
          <div className="mission-header">
            <h2>Our Mission</h2>
            <p>Democratizing AI-powered education for everyone, everywhere</p>
          </div>
          
          <div className="mission-grid">
            <div className="mission-card-light">
              <div className="mission-icon-wrapper" style={{ background: '#F5F3FF' }}>
                <span className="mission-icon">🎯</span>
              </div>
              <h3>Democratize AI</h3>
              <p>Make advanced AI tools accessible to every student and professional, regardless of their background or resources.</p>
            </div>
            
            <div className="mission-card-light">
              <div className="mission-icon-wrapper" style={{ background: '#FFFBEB' }}>
                <span className="mission-icon">🔄</span>
              </div>
              <h3>Bridge the Gap</h3>
              <p>Connect academic learning with career readiness through intelligent, personalized pathways.</p>
            </div>
            
            <div className="mission-card-light">
              <div className="mission-icon-wrapper" style={{ background: '#ECFDF5' }}>
                <span className="mission-icon">⚡</span>
              </div>
              <h3>Continuous Innovation</h3>
              <p>Push the boundaries of what's possible with AI in education and professional development.</p>
            </div>
          </div>
        </div>

        {/* GitHub Community Section */}
        <div className="github-community-section">
          <div className="github-header">
            <FaGithub className="github-main-icon" />
            <h2>Open Source Community</h2>
            <p>We believe in building in public. Join our growing community of contributors.</p>
          </div>
          
          <div className="github-cards-grid">
            <a href="https://github.com/AbhishekPathak369" target="_blank" rel="noopener noreferrer" className="github-card">
              <div className="github-card-avatar">
                <img 
                  src="https://github.com/AbhishekPathak369.png" 
                  alt="Abhishek Pathak"
                  className="github-avatar-img"
                  onError={(e) => {
                    e.target.style.display = 'none';
                  }}
                />
              </div>
              <div className="github-card-info">
                <h4>Abhishek Pathak</h4>
                <span className="github-handle">@AbhishekPathak369</span>
                <div className="github-metrics">
                  <span>📦 45+ repos</span>
                  <span>⭐ 2.3k contributions</span>
                </div>
              </div>
            </a>

            <a href="https://github.com/AnuragMishra88" target="_blank" rel="noopener noreferrer" className="github-card">
              <div className="github-card-avatar">
                <img 
                  src="https://github.com/AnuragMishra88.png" 
                  alt="Anurag Mishra"
                  className="github-avatar-img"
                  onError={(e) => {
                    e.target.style.display = 'none';
                  }}
                />
              </div>
              <div className="github-card-info">
                <h4>Anurag Mishra</h4>
                <span className="github-handle">@AnuragMishra88</span>
                <div className="github-metrics">
                  <span>📦 38+ repos</span>
                  <span>⭐ 1.8k contributions</span>
                </div>
              </div>
            </a>

            <div className="github-cta">
              <FaUsers className="cta-icon" />
              <h4>Join 50+ Contributors</h4>
              <p>Help us shape the future of AI education</p>
              <button className="github-contribute-btn">
                <FaGithub />
                Contribute on GitHub
                <FaArrowRight className="btn-arrow" />
              </button>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="cta-section-light">
          <div className="cta-content">
            <h2>Ready to start your journey?</h2>
            <p>Join thousands of students and professionals already using NEXUS</p>
            <div className="cta-buttons">
              <button className="cta-btn-primary" style={{ background: 'linear-gradient(135deg, #7C3AED 0%, #5B21B6 100%)' }}>
                <span>Get Started Free</span>
                <FaArrowRight />
              </button>
              <button className="cta-btn-secondary">
                <FaGithub />
                <span>Star on GitHub</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;