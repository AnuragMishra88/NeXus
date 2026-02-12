import React, { useState, useEffect } from 'react';
import './FAQ.css';
import { 
  FaGraduationCap, FaBriefcase, FaCog, FaSearch, 
  FaTimes, FaArrowRight, FaCheck, FaBook, 
  FaRobot, FaChartLine, FaFileAlt, FaComments,
  FaGithub, FaTwitter, FaLinkedin, FaEnvelope
} from 'react-icons/fa';

const FAQ = () => {
  const [activeIndex, setActiveIndex] = useState(null);
  const [activeCategory, setActiveCategory] = useState('all');
  const [formStatus, setFormStatus] = useState('');
  const [formMessage, setFormMessage] = useState('');

  const faqData = [
    // Academic Mode FAQs
    {
      id: 1,
      category: 'academic',
      question: "How does Smart Notes Maker work?",
      answer: "Smart Notes Maker uses AI to analyze lecture content, textbooks, or PDFs and automatically generates structured, summarized notes with key concepts, bullet points, and visual aids. It adapts to your learning style over time.",
      icon: <FaBook />,
      color: "#7C3AED",
      lightBg: "#F5F3FF"
    },
    {
      id: 2,
      category: 'academic',
      question: "Can Lecture Notes Generator process video lectures?",
      answer: "Yes! Our Lecture Notes Generator can transcribe video/audio lectures in real-time, extract key information, and generate comprehensive notes with timestamps, summaries, and important quotes.",
      icon: <FaGraduationCap />,
      color: "#7C3AED",
      lightBg: "#F5F3FF"
    },
    {
      id: 3,
      category: 'academic',
      question: "How accurate is the Assignment Helper?",
      answer: "Assignment Helper provides 95%+ accurate solutions by cross-referencing multiple sources and academic databases. It doesn't just give answers—it explains concepts step-by-step and cites references.",
      icon: <FaFileAlt />,
      color: "#7C3AED",
      lightBg: "#F5F3FF"
    },
    {
      id: 4,
      category: 'academic',
      question: "What types of questions can Exam Prep Buddy handle?",
      answer: "Exam Prep Buddy handles multiple-choice, short answer, essay questions, numerical problems, and case studies across all subjects. It creates personalized revision strategies based on your weak areas.",
      icon: <FaChartLine />,
      color: "#7C3AED",
      lightBg: "#F5F3FF"
    },
    
    // Career Mode FAQs
    {
      id: 5,
      category: 'career',
      question: "How does Resume Analyzer evaluate my resume?",
      answer: "Resume Analyzer uses AI to scan your resume against 50+ parameters including ATS compatibility, keyword optimization, experience phrasing, quantifiable achievements, and industry-specific standards. It provides a score and actionable recommendations.",
      icon: <FaFileAlt />,
      color: "#D97706",
      lightBg: "#FFFBEB"
    },
    {
      id: 6,
      category: 'career',
      question: "Is Career Roadmap Generator personalized?",
      answer: "Yes! Based on your skills, education, interests, and market trends, it creates a 1-5 year personalized career roadmap with milestones, skill acquisition timeline, certification recommendations, and networking strategies.",
      icon: <FaBriefcase />,
      color: "#D97706",
      lightBg: "#FFFBEB"
    },
    {
      id: 7,
      category: 'career',
      question: "How realistic is the Interview Simulator?",
      answer: "Interview Simulator uses real interview questions from top companies (FAANG, MNCs, startups). It provides real-time feedback on your answers, body language, tone, and suggests better phrasing.",
      icon: <FaComments />,
      color: "#D97706",
      lightBg: "#FFFBEB"
    },
    {
      id: 8,
      category: 'career',
      question: "How does LinkedIn Optimizer improve my profile?",
      answer: "LinkedIn Optimizer analyzes your profile against recruiter search patterns, suggests keyword optimization, headline improvements, experience descriptions, and posting strategies to increase visibility by up to 10x.",
      icon: <FaSearch />,
      color: "#D97706",
      lightBg: "#FFFBEB"
    },
    
    // Platform FAQs
    {
      id: 9,
      category: 'platform',
      question: "How does the dual-mode architecture work?",
      answer: "NEXUS features a configuration-driven dual-mode (Academic + Career) architecture. The UI, features, and routes dynamically adapt based on your selected mode. Built with React Router and Context API for seamless transitions.",
      icon: <FaCog />,
      color: "#059669",
      lightBg: "#ECFDF5"
    },
    {
      id: 10,
      category: 'platform',
      question: "Is my data secure on NEXUS?",
      answer: "Absolutely. We use end-to-end encryption, secure authentication with JWT, and never share your personal data. Your privacy and security are our top priorities.",
      icon: <FaSearch />,
      color: "#059669",
      lightBg: "#ECFDF5"
    }
  ];

  const categories = [
    { id: 'all', label: 'All Questions', icon: '📋' },
    { id: 'academic', label: 'Academic Mode', icon: '🎓' },
    { id: 'career', label: 'Career Mode', icon: '💼' },
    { id: 'platform', label: 'Platform', icon: '⚙️' }
  ];

  const filteredFaqs = activeCategory === 'all' 
    ? faqData 
    : faqData.filter(faq => faq.category === activeCategory);

  const toggleFAQ = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  const handleFormSubmit = async (event) => {
    event.preventDefault();
    setFormStatus('sending');
    setFormMessage('Sending your message...');

    const formData = new FormData(event.target);
    formData.append("access_key", "bf893cad-b2b7-4668-bb94-c32a1b725e92");
    formData.append("subject", "NEXUS FAQ - New Question");
    formData.append("from_name", "NEXUS Platform");

    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        body: formData
      });

      const data = await response.json();

      if (data.success) {
        setFormStatus('success');
        setFormMessage('✅ Message sent! Our team will respond within 24 hours.');
        event.target.reset();

        setTimeout(() => {
          setFormStatus('');
          setFormMessage('');
        }, 5000);
      } else {
        setFormStatus('error');
        setFormMessage('❌ Failed to send. Please try again.');
      }
    } catch (error) {
      setFormStatus('error');
      setFormMessage('❌ Network error. Check your connection.');
    }
  };

  return (
    <div className="faq-page-light">
      {/* Hero Section */}
      <div className="faq-hero">
        <div className="hero-content">
          <div className="greeting">
            <h1>
              Hello, <span className="gradient-text">How can we help?</span>
            </h1>
            <p className="subtitle" style={{color:'white'}}>
              Search our knowledge base or browse popular topics below
            </p>
          </div>
          
          <div className="hero-stats">
            <div className="stat-card">
              <span className="stat-icon">📚</span>
              <div>
                <h3>50+</h3>
                <p>Knowledge Articles</p>
              </div>
            </div>
            <div className="stat-card">
              <span className="stat-icon">⚡</span>
              <div>
                <h3>24/7</h3>
                <p>AI Support</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="faq-container-light">
        {/* Category Pills */}
        <div className="category-section">
          <div className="category-pills">
            {categories.map(category => (
              <button
                key={category.id}
                className={`category-pill ${activeCategory === category.id ? 'active' : ''}`}
                onClick={() => setActiveCategory(category.id)}
                style={activeCategory === category.id ? {
                  background: category.id === 'academic' ? 'linear-gradient(135deg, #7C3AED, #6D28D9)' :
                              category.id === 'career' ? 'linear-gradient(135deg, #D97706, #B45309)' :
                              category.id === 'platform' ? 'linear-gradient(135deg, #059669, #047857)' :
                              'linear-gradient(135deg, #6A38C2, #5B21B6)'
                } : {}}
              >
                <span className="pill-icon">{category.icon}</span>
                {category.label}
              </button>
            ))}
          </div>
        </div>

        {/* FAQ Grid */}
        <div className="faq-grid-light">
          {filteredFaqs.map((faq, index) => (
            <div
              key={faq.id}
              className={`faq-card-light ${activeIndex === index ? 'active' : ''}`}
              onClick={() => toggleFAQ(index)}
              style={{
                borderTop: `4px solid ${faq.color}`,
                background: activeIndex === index ? `linear-gradient(135deg, white, ${faq.lightBg})` : 'white'
              }}
            >
              <div className="card-content">
                <div className="card-header">
                  <div 
                    className="faq-icon-wrapper"
                    style={{ background: `${faq.color}15` }}
                  >
                    <span style={{ color: faq.color }}>{faq.icon}</span>
                  </div>
                  <h3 className="faq-question-light">{faq.question}</h3>
                  <div className="expand-indicator">
                    <div className={`expand-line ${activeIndex === index ? 'active' : ''}`}></div>
                  </div>
                </div>
                <div className={`faq-answer-light ${activeIndex === index ? 'expanded' : ''}`}>
                  <p>{faq.answer}</p>
                  
                  {/* Related Links */}
                  <div className="related-links">
                    <span className="related-badge" style={{ background: `${faq.color}10`, color: faq.color }}>
                      <FaBook /> Documentation
                    </span>
                    <span className="related-badge" style={{ background: `${faq.color}10`, color: faq.color }}>
                      <FaRobot /> Try it now
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Contact Form Section */}
        <div className="contact-section-light">
          <div className="contact-header">
            <h2>Still have questions?</h2>
            <p>Get in touch with our support team</p>
          </div>

          <form className="contact-form-light" onSubmit={handleFormSubmit}>
            <div className="form-row">
              <div className="form-group">
                <input
                  type="text"
                  name="name"
                  placeholder="Your name"
                  required
                  className="form-input-light"
                />
              </div>
              <div className="form-group">
                <input
                  type="email"
                  name="email"
                  placeholder="Your email"
                  required
                  className="form-input-light"
                />
              </div>
            </div>

            <div className="form-group">
              <select name="category" className="form-select-light">
                <option value="academic">📚 Academic Mode Query</option>
                <option value="career">💼 Career Mode Query</option>
                <option value="technical">⚙️ Technical Support</option>
                <option value="other">❓ Other</option>
              </select>
            </div>

            <div className="form-group">
              <textarea
                name="message"
                placeholder="Describe your question or issue..."
                required
                className="form-textarea-light"
                rows="4"
              ></textarea>
            </div>

            {formMessage && (
              <div className={`form-status-light ${formStatus}`}>
                {formMessage}
              </div>
            )}

            <button 
              type="submit" 
              className="submit-btn-light"
              disabled={formStatus === 'sending'}
            >
              {formStatus === 'sending' ? 'Sending...' : 'Send Message'}
              <FaArrowRight className="btn-icon" />
            </button>
          </form>

          <div className="contact-footer">
            <p>⚡ Average response time: &lt; 2 hours</p>
            <div className="social-links">
              <a href="#"><FaGithub /></a>
              <a href="#"><FaTwitter /></a>
              <a href="#"><FaLinkedin /></a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FAQ;