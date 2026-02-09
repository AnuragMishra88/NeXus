import './Homepage.css';
import { useEffect, useState } from 'react';
import {
  FaFileAlt, FaTasks, FaGraduationCap, FaQuestionCircle,
  FaCalendarAlt, FaChartLine, FaFileContract, FaRoad,
  FaComments, FaUserTie, FaLaptopCode, FaBriefcase,
  FaRocket, FaLightbulb, FaTrophy, FaUsers, FaClock,
  FaBrain, FaChartBar, FaStar, FaAward, FaCertificate
} from 'react-icons/fa';

const Homepage = ({ setActivePage, selectedMode = 'Academic' }) => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [greeting, setGreeting] = useState('');
  
  useEffect(() => {
    // Set greeting based on time of day
    const hour = new Date().getHours();
    if (hour < 12) setGreeting('Good Morning!');
    else if (hour < 17) setGreeting('Good Afternoon!');
    else setGreeting('Good Evening!');
  }, []);

  // Academic Suite Data
  const academicData = {
    title: "ACADEMIC SUITE",
    subtitle: "Your All-in-One Study Companion",
    tagline: "Transform your learning journey with AI-powered tools",
    features: [
      {
        icon: <FaFileAlt />,
        title: "Smart Notes Maker",
        description: "AI-powered note taking with automatic summarization",
        color: "#3b82f6",
        stats: "5,000+ notes created"
      },
      {
        icon: <FaTasks />,
        title: "Assignment Helper",
        description: "Get AI assistance for your assignments and projects",
        color: "#10b981",
        stats: "98% accuracy rate"
      },
      {
        icon: <FaGraduationCap />,
        title: "Exam Prep Buddy",
        description: "Personalized study plans and practice tests",
        color: "#8b5cf6",
        stats: "2,000+ exams prepared"
      },
      {
        icon: <FaQuestionCircle />,
        title: "Doubt Solver",
        description: "Instant solutions to your academic questions",
        color: "#f59e0b",
        stats: "10,000+ doubts solved"
      },
      {
        icon: <FaCalendarAlt />,
        title: "Study Scheduler",
        description: "AI-generated study schedules based on your goals",
        color: "#ef4444",
        stats: "500+ schedules created"
      },
      {
        icon: <FaChartLine />,
        title: "Progress Analytics",
        description: "Track your learning progress with detailed insights",
        color: "#06b6d4",
        stats: "95% user satisfaction"
      }
    ],
    stats: {
      totalUsers: "50,000+",
      activeNow: "2,500+",
      successRate: "94%",
      timeSaved: "15 hours/week"
    },
    quickActions: [
      { label: "Create Notes", icon: <FaFileAlt />, color: "#3b82f6" },
      { label: "Solve Doubt", icon: <FaQuestionCircle />, color: "#f59e0b" },
      { label: "Plan Schedule", icon: <FaCalendarAlt />, color: "#ef4444" },
      { label: "View Progress", icon: <FaChartLine />, color: "#06b6d4" }
    ]
  };

  // Career Suite Data
  const careerData = {
    title: "CAREER SUITE",
    subtitle: "Your Path to Professional Success",
    tagline: "Accelerate your career with intelligent tools",
    features: [
      {
        icon: <FaFileContract />,
        title: "Resume Analyzer",
        description: "AI-powered resume review with actionable feedback",
        color: "#3b82f6",
        stats: "10,000+ resumes improved"
      },
      {
        icon: <FaRoad />,
        title: "Career Roadmap",
        description: "Personalized career path based on your skills",
        color: "#10b981",
        stats: "5,000+ roadmaps created"
      },
      {
        icon: <FaComments />,
        title: "Q&A Assistant",
        description: "Get answers to career-related questions",
        color: "#8b5cf6",
        stats: "20,000+ questions answered"
      },
      {
        icon: <FaUserTie />,
        title: "Interview Simulator",
        description: "Practice interviews with AI-powered feedback",
        color: "#f59e0b",
        stats: "15,000+ mock interviews"
      },
      {
        icon: <FaLaptopCode />,
        title: "Coding Platforms",
        description: "Access to multiple coding practice platforms",
        color: "#ef4444",
        stats: "100,000+ problems solved"
      },
      {
        icon: <FaBriefcase />,
        title: "Portfolio Builder",
        description: "Create stunning portfolios to showcase your work",
        color: "#06b6d4",
        stats: "8,000+ portfolios built"
      }
    ],
    stats: {
      totalUsers: "75,000+",
      jobsFound: "50,000+",
      interviewRate: "85%",
      salaryBoost: "30% average"
    },
    quickActions: [
      { label: "Analyze Resume", icon: <FaFileContract />, color: "#3b82f6" },
      { label: "Practice Interview", icon: <FaUserTie />, color: "#f59e0b" },
      { label: "Build Portfolio", icon: <FaBriefcase />, color: "#06b6d4" },
      { label: "Get Roadmap", icon: <FaRoad />, color: "#10b981" }
    ]
  };

  const data = selectedMode === 'Academic' ? academicData : careerData;

  return (
    <div className="homepage">
      {/* Hero Section */}
      <div className="hero-section">
        <div className="hero-content">
          <div className="greeting">
            <h1>{greeting}</h1>
            <p className="subtitle">Welcome to your {selectedMode.toLowerCase()} dashboard</p>
          </div>
          <div className="hero-stats">
            <div className="stat-card">
              <FaRocket className="stat-icon" />
              <div>
                <h3>{data.stats.totalUsers}</h3>
                <p>Total Users</p>
              </div>
            </div>
            <div className="stat-card">
              <FaUsers className="stat-icon" />
              <div>
                <h3>{data.stats.activeNow}</h3>
                <p>Active Now</p>
              </div>
            </div>
            <div className="stat-card">
              <FaTrophy className="stat-icon" />
              <div>
                <h3>{data.stats.successRate}</h3>
                <p>Success Rate</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="quick-actions">
        <h2>Quick Actions</h2>
        <div className="actions-grid">
          {data.quickActions.map((action, index) => (
            <button
              key={index}
              className="action-button"
              style={{ '--action-color': action.color }}
            >
              <span className="action-icon">{action.icon}</span>
              <span className="action-label">{action.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Main Features Section */}
      <div className="features-section">
        <div className="section-header">
          <h2>{data.title} Features</h2>
          <p className="tagline">{data.tagline}</p>
        </div>
        
        <div className="features-grid">
          {data.features.map((feature, index) => (
            <div 
              key={index} 
              className="feature-card"
              style={{ '--feature-color': feature.color }}
            >
              <div className="feature-header">
                <div className="feature-icon" style={{ backgroundColor: `${feature.color}20`, color: feature.color }}>
                  {feature.icon}
                </div>
                <div className="feature-title">
                  <h3>{feature.title}</h3>
                  <p className="feature-stats">{feature.stats}</p>
                </div>
              </div>
              <p className="feature-description">{feature.description}</p>
              <div className="feature-footer">
                <button className="try-button">Try Now</button>
                <span className="feature-badge">
                  <FaStar /> Popular
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Dashboard Stats */}
      <div className="dashboard-stats">
        <div className="stats-card">
          <div className="stats-header">
            <FaLightbulb className="stats-header-icon" />
            <h3>Your {selectedMode} Insights</h3>
          </div>
          <div className="stats-content">
            <div className="insight">
              <FaClock className="insight-icon" />
              <div>
                <h4>Time Saved</h4>
                <p>{selectedMode === 'Academic' ? data.stats.timeSaved : data.stats.salaryBoost}</p>
              </div>
            </div>
            <div className="insight">
              <FaChartBar className="insight-icon" />
              <div>
                <h4>Progress</h4>
                <p>Excellent this week</p>
              </div>
            </div>
            <div className="insight">
              <FaBrain className="insight-icon" />
              <div>
                <h4>AI Usage</h4>
                <p>{selectedMode === 'Academic' ? 'High' : 'Optimal'}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="stats-card">
          <div className="stats-header">
            <FaAward className="stats-header-icon" />
            <h3>Achievements</h3>
          </div>
          <div className="achievements">
            <div className="achievement">
              <FaCertificate className="achievement-icon" />
              <div>
                <h4>Fast Learner</h4>
                <p>Completed 10 modules this month</p>
              </div>
            </div>
            <div className="achievement">
              <FaTrophy className="achievement-icon" />
              <div>
                <h4>Consistency</h4>
                <p>15-day streak active</p>
              </div>
            </div>
            <button className="view-all-btn">View All Achievements →</button>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="recent-activity">
        <h2>Recent Activity</h2>
        <div className="activity-list">
          <div className="activity-item">
            <div className="activity-icon">📝</div>
            <div className="activity-content">
              <h4>Created Smart Notes for "Machine Learning"</h4>
              <p>2 hours ago • 5 pages generated</p>
            </div>
            <span className="activity-badge">Academic</span>
          </div>
          <div className="activity-item">
            <div className="activity-icon">💼</div>
            <div className="activity-content">
              <h4>Resume analyzed with 92% score</h4>
              <p>1 day ago • 5 improvements suggested</p>
            </div>
            <span className="activity-badge">Career</span>
          </div>
          <div className="activity-item">
            <div className="activity-icon">🎯</div>
            <div className="activity-content">
              <h4>Completed interview simulation</h4>
              <p>2 days ago • Score: 85/100</p>
            </div>
            <span className="activity-badge">Career</span>
          </div>
        </div>
      </div>

      {/* AI Assistant Widget */}
      <div className="ai-assistant">
        <div className="ai-header">
          <FaBrain className="ai-icon" />
          <div>
            <h3>AI Assistant</h3>
            <p>Ask me anything about {selectedMode.toLowerCase()}</p>
          </div>
        </div>
        <div className="ai-questions">
          <button className="ai-question">How can I improve my study schedule?</button>
          <button className="ai-question">Review my resume for tech jobs</button>
          <button className="ai-question">Prepare for software engineer interview</button>
          <button className="ai-question">Best way to take notes for exams</button>
        </div>
        <div className="ai-input">
          <input type="text" placeholder={`Ask about ${selectedMode.toLowerCase()}...`} />
          <button className="ai-send">→</button>
        </div>
      </div>
    </div>
  );
};

export default Homepage;