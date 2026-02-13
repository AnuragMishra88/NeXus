// frontend/src/Component/Career/CareerRoadmap/CareerRoadmap.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../Api/AuthContext';
import {
    FaRoad,
    FaChartLine,
    FaCertificate,
    FaProjectDiagram,
    FaBook,
    FaMoneyBillWave,
    FaUsers,
    FaCalendarAlt,
    FaRocket,
    FaBrain,
    FaCode,
    FaCloud,
    FaShieldAlt,
    FaRobot,
    FaArrowRight,
    FaCheckCircle,
    FaStar,
    FaMedal,
    FaFire,
    FaClock,
    FaLightbulb,
    FaDownload,
    FaShare,
    FaBullseye
} from 'react-icons/fa';
import './CareerRoadmap.css';

const CareerRoadmap = ({ setActivePage }) => {
    const { user, isAuthenticated } = useAuth();
    const [currentRole, setCurrentRole] = useState('');
    const [targetRole, setTargetRole] = useState('');
    const [experienceLevel, setExperienceLevel] = useState('entry');
    const [timeFrame, setTimeFrame] = useState('6 months');
    const [skills, setSkills] = useState('');
    const [loading, setLoading] = useState(false);
    const [roadmap, setRoadmap] = useState(null);
    const [trending, setTrending] = useState([]);
    const [activePhase, setActivePhase] = useState(0);
    const [error, setError] = useState('');

    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1';

    useEffect(() => {
        setActivePage('roadmap');
        fetchTrendingCareers();
    }, []);

    // FETCH TRENDING CAREERS - PUBLIC ROUTE
    const fetchTrendingCareers = async () => {
        try {
            const response = await axios.get(`${API_URL}/career/roadmap/trending`, {
                withCredentials: true
            });
            if (response.data.success) {
                setTrending(response.data.trending);
            } else {
                setTrending(fallbackTrending);
            }
        } catch (error) {
            console.error('Error fetching trending careers:', error);
            setTrending(fallbackTrending);
        }
    };

    // Fallback trending data
    const fallbackTrending = [
        {
            role: "AI Engineer",
            growth: "+45%",
            demand: "🔥🔥🔥",
            avg_salary: "$145,000",
            icon: "🤖",
            color: "#8b5cf6"
        },
        {
            role: "Cloud Architect",
            growth: "+32%",
            demand: "🔥🔥🔥",
            avg_salary: "$155,000",
            icon: "☁️",
            color: "#3b82f6"
        },
        {
            role: "DevOps Engineer",
            growth: "+28%",
            demand: "🔥🔥",
            avg_salary: "$135,000",
            icon: "⚙️",
            color: "#10b981"
        },
        {
            role: "Data Scientist",
            growth: "+25%",
            demand: "🔥🔥",
            avg_salary: "$140,000",
            icon: "📊",
            color: "#f59e0b"
        },
        {
            role: "Cybersecurity Analyst",
            growth: "+35%",
            demand: "🔥🔥🔥",
            avg_salary: "$125,000",
            icon: "🛡️",
            color: "#ef4444"
        }
    ];

    // GENERATE ROADMAP - COOKIE-BASED AUTH
    const handleGenerateRoadmap = async (e) => {
        e.preventDefault();
        
        if (!isAuthenticated) {
            setError('Please login to generate a roadmap');
            return;
        }

        if (!currentRole.trim() || !targetRole.trim()) {
            setError('Please enter both current and target roles');
            return;
        }

        setLoading(true);
        setError('');

        try {
            // withCredentials: true sends the cookie automatically
            const response = await axios.post(
                `${API_URL}/career/roadmap/generate`,
                {
                    current_role: currentRole.trim(),
                    target_role: targetRole.trim(),
                    experience_level: experienceLevel,
                    time_frame: timeFrame,
                    skills: skills
                },
                {
                    withCredentials: true,
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }
            );

            if (response.data.success) {
                setRoadmap(response.data.roadmap);
                setActivePhase(0);
            } else {
                setError('Failed to generate roadmap');
                generateFallbackRoadmap();
            }
        } catch (error) {
            console.error('Roadmap generation error:', error);
            
            if (error.response?.status === 401) {
                setError('Please login to generate a roadmap');
            } else {
                setError(error.response?.data?.message || 'Failed to generate roadmap');
                generateFallbackRoadmap();
            }
        } finally {
            setLoading(false);
        }
    };

    // FALLBACK ROADMAP GENERATOR
    const generateFallbackRoadmap = () => {
        const fallbackRoadmap = {
            summary: `🚀 Your journey from ${currentRole || 'your current role'} to ${targetRole || 'your target role'} starts now! With dedication and the right roadmap, you can achieve this transformation in 6-12 months.`,
            
            phases: [
                {
                    phase: 1,
                    name: "⚡ Foundation Storm",
                    duration: "Weeks 1-4",
                    icon: "🚀",
                    color: "#3b82f6",
                    topics: ["Industry Fundamentals", "Core Tools & Technologies", "Best Practices"],
                    exercises: ["Daily learning (1 hour)", "Hands-on practice", "Join communities"],
                    projects: ["Portfolio website", "Simple CLI tool"],
                    milestone: "Strong foundation in core concepts",
                    motivation: "The journey of a thousand miles begins with a single step!"
                },
                {
                    phase: 2,
                    name: "🌊 Skill Surge",
                    duration: "Weeks 5-8",
                    icon: "⚡",
                    color: "#10b981",
                    topics: ["Advanced Concepts", "Framework Mastery", "Industry Tools"],
                    exercises: ["Build CRUD apps", "API integration", "Database design"],
                    projects: ["Full-stack application", "REST API service"],
                    milestone: "Confidence in building real applications",
                    motivation: "Skills don't come from reading, they come from building!"
                },
                {
                    phase: 3,
                    name: "🏔️ Project Peak",
                    duration: "Weeks 9-12",
                    icon: "🎯",
                    color: "#8b5cf6",
                    topics: ["System Design", "Performance Optimization", "Testing"],
                    exercises: ["Code reviews", "Optimization challenges", "Bug fixing"],
                    projects: ["Capstone project", "Open source contribution"],
                    milestone: "Portfolio-ready projects",
                    motivation: "Your projects speak louder than your resume!"
                },
                {
                    phase: 4,
                    name: "🚀 Mastery Launch",
                    duration: "Weeks 13-16",
                    icon: "🌟",
                    color: "#f59e0b",
                    topics: ["Interview Prep", "Networking", "Personal Branding"],
                    exercises: ["Mock interviews", "LinkedIn optimization", "Resume crafting"],
                    projects: ["Polish portfolio", "Technical blog post"],
                    milestone: "Job-ready and confident",
                    motivation: "Your dream job is waiting for you!"
                }
            ],
            
            skills_to_learn: [
                "🎯 Core Technical Skills",
                "🎯 Problem Solving",
                "🎯 System Design",
                "✨ Communication",
                "✨ Collaboration",
                "✨ Time Management"
            ],
            
            certifications: [
                {
                    name: "Industry Foundation Certification",
                    provider: "Top Provider",
                    icon: "🏆",
                    duration: "8 weeks",
                    cost: "Free - $300",
                    relevance: 9,
                    badge_color: "gold"
                },
                {
                    name: "Advanced Specialization",
                    provider: "Professional Body",
                    icon: "🎓",
                    duration: "12 weeks",
                    cost: "$400-600",
                    relevance: 8,
                    badge_color: "silver"
                }
            ],
            
            projects: [
                {
                    name: "Portfolio Website",
                    difficulty: "Beginner",
                    impact: "Showcases your work and brand",
                    technologies: ["HTML/CSS", "JavaScript", "React"],
                    estimated_time: "2 weeks",
                    portfolio_worth: "⭐⭐⭐⭐⭐"
                },
                {
                    name: "Full-Stack Application",
                    difficulty: "Intermediate",
                    impact: "Demonstrates end-to-end development",
                    technologies: ["React", "Node.js", "MongoDB"],
                    estimated_time: "4 weeks",
                    portfolio_worth: "⭐⭐⭐⭐⭐"
                },
                {
                    name: "Capstone Project",
                    difficulty: "Advanced",
                    impact: "Shows complex problem-solving",
                    technologies: ["React", "Node.js", "MongoDB", "AWS"],
                    estimated_time: "6 weeks",
                    portfolio_worth: "⭐⭐⭐⭐⭐"
                }
            ],
            
            resources: [
                {
                    type: "📚 Course",
                    name: "Complete Career Path",
                    platform: "Coursera/Udemy",
                    duration: "40 hours",
                    cost: "$49.99",
                    rating: 4.8
                },
                {
                    type: "📖 Book",
                    name: "Essential Reading",
                    platform: "Amazon/O'Reilly",
                    duration: "Self-paced",
                    cost: "$39.99",
                    rating: 4.7
                },
                {
                    type: "🎥 YouTube",
                    name: "Free Tutorials",
                    platform: "YouTube",
                    duration: "10+ hours",
                    cost: "Free",
                    rating: 4.9
                }
            ],
            
            salary_progression: [
                { stage: "Entry Level", salary: "$65,000 - $85,000", timeframe: "0-1 year" },
                { stage: "Mid Level", salary: "$85,000 - $115,000", timeframe: "1-3 years" },
                { stage: "Senior Level", salary: "$115,000 - $150,000+", timeframe: "3-5 years" }
            ],
            
            market_demand: "🔥 High - Growing faster than average",
            difficulty_level: "⭐⭐ Intermediate",
            timeline_months: 6,
            
            success_stories: [
                "✨ Sarah: From teacher to software engineer in 8 months",
                "✨ Mike: Built 3 projects, got hired at a Fortune 500 company",
                "✨ Priya: Self-taught, now leading a development team"
            ],
            
            daily_schedule: {
                morning: "🌅 30 mins - Learning concepts",
                afternoon: "☀️ 1 hour - Hands-on coding",
                evening: "🌙 30 mins - Project work",
                weekly: "🎯 Weekend - Build complete features"
            }
        };
        
        setRoadmap(fallbackRoadmap);
    };

    const handleSelectTrending = (role) => {
        setTargetRole(role);
    };

    const getDifficultyColor = (level) => {
        if (level?.includes('Beginner')) return '#10b981';
        if (level?.includes('Intermediate')) return '#f59e0b';
        return '#ef4444';
    };

    return (
        <motion.div 
            className="career-roadmap-container"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
        >
            {/* Hero Section */}
            <div className="roadmap-hero">
                <motion.div 
                    className="hero-content"
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                >
                    <h1>
                        <span className="gradient-text">🗺️ Career Roadmap</span>
                    </h1>
                    <p className="hero-subtitle">
                        Transform your career with AI-powered personalized roadmaps
                    </p>
                </motion.div>

                {/* Trending Careers Marquee */}
                {trending.length > 0 && (
                    <div className="trending-marquee">
                        <div className="trending-header">
                            <FaFire className="trending-icon" />
                            <span>Trending Career Paths</span>
                        </div>
                        <div className="trending-scroll">
                            {trending.map((career, index) => (
                                <motion.button
                                    key={index}
                                    className="trending-card"
                                    style={{ borderColor: career.color }}
                                    onClick={() => handleSelectTrending(career.role)}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    <span className="trending-icon-large">{career.icon}</span>
                                    <div className="trending-info">
                                        <h4>{career.role}</h4>
                                        <div className="trending-stats">
                                            <span style={{ color: career.color }}>{career.growth}</span>
                                            <span>{career.demand}</span>
                                        </div>
                                        <p className="trending-salary">{career.avg_salary}</p>
                                    </div>
                                </motion.button>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {!roadmap ? (
                <motion.div 
                    className="roadmap-setup"
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.3 }}
                >
                    <div className="setup-header">
                        <h2>✨ Design Your Journey</h2>
                        <p>Answer a few questions to get your personalized roadmap</p>
                    </div>

                    <form onSubmit={handleGenerateRoadmap} className="roadmap-form">
                        <div className="form-grid">
                            <div className="form-group animate-input">
                                <label>
                                    <FaRoad className="input-icon" />
                                    Current Role
                                </label>
                                <input
                                    type="text"
                                    value={currentRole}
                                    onChange={(e) => setCurrentRole(e.target.value)}
                                    placeholder="e.g., Student, Junior Developer, Designer"
                                    className="glass-input"
                                />
                            </div>

                            <div className="form-group animate-input">
                                <label>
                                    <FaBullseye className="input-icon" />
                                    Target Role
                                </label>
                                <input
                                    type="text"
                                    value={targetRole}
                                    onChange={(e) => setTargetRole(e.target.value)}
                                    placeholder="e.g., AI Engineer, Cloud Architect"
                                    className="glass-input"
                                />
                            </div>

                            <div className="form-group animate-input">
                                <label>
                                    <FaBrain className="input-icon" />
                                    Experience Level
                                </label>
                                <div className="experience-chips">
                                    {['entry', 'mid', 'senior'].map((level) => (
                                        <button
                                            key={level}
                                            type="button"
                                            className={`chip ${experienceLevel === level ? 'active' : ''}`}
                                            onClick={() => setExperienceLevel(level)}
                                        >
                                            {level.charAt(0).toUpperCase() + level.slice(1)}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="form-group animate-input">
                                <label>
                                    <FaClock className="input-icon" />
                                    Time Frame
                                </label>
                                <select
                                    value={timeFrame}
                                    onChange={(e) => setTimeFrame(e.target.value)}
                                    className="glass-select"
                                >
                                    <option value="3 months">⚡ 3 Months (Intensive)</option>
                                    <option value="6 months">🚀 6 Months (Balanced)</option>
                                    <option value="1 year">🌟 1 Year (Thorough)</option>
                                    <option value="2 years">🎯 2 Years (Mastery)</option>
                                </select>
                            </div>
                        </div>

                        <div className="form-group animate-input">
                            <label>
                                <FaCode className="input-icon" />
                                Current Skills (Optional)
                            </label>
                            <textarea
                                value={skills}
                                onChange={(e) => setSkills(e.target.value)}
                                placeholder="List your current skills, technologies, or experience..."
                                rows="3"
                                className="glass-textarea"
                            />
                        </div>

                        {error && (
                            <motion.div 
                                className="error-message"
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                            >
                                {error}
                            </motion.div>
                        )}

                        <motion.button
                            type="submit"
                            className="generate-roadmap-btn"
                            disabled={loading}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            {loading ? (
                                <span className="loading-spinner">
                                    <FaRocket className="spinning" />
                                    Generating Your Roadmap...
                                </span>
                            ) : (
                                <span>
                                    <FaRocket />
                                    Launch My Career Roadmap
                                </span>
                            )}
                        </motion.button>
                    </form>
                </motion.div>
            ) : (
                <motion.div 
                    className="roadmap-display"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                >
                    {/* Roadmap Header */}
                    <div className="roadmap-header">
                        <div className="header-left">
                            <span className="current-role">{currentRole}</span>
                            <FaArrowRight className="arrow-icon" />
                            <span className="target-role">{targetRole}</span>
                        </div>
                        <div className="header-right">
                            <button className="icon-btn" onClick={() => setRoadmap(null)}>
                                ← New Roadmap
                            </button>
                            <button className="icon-btn">
                                <FaDownload />
                            </button>
                            <button className="icon-btn">
                                <FaShare />
                            </button>
                        </div>
                    </div>

                    {/* Career Summary Card */}
                    <motion.div 
                        className="summary-card"
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.1 }}
                    >
                        <div className="summary-icon">🎯</div>
                        <div className="summary-content">
                            <h3>Your Career Transformation Journey</h3>
                            <p>{roadmap.summary}</p>
                        </div>
                        <div className="summary-badges">
                            <span className="badge" style={{ background: getDifficultyColor(roadmap.difficulty_level) }}>
                                {roadmap.difficulty_level}
                            </span>
                            <span className="badge timeline">
                                <FaCalendarAlt /> {roadmap.timeline_months} Months
                            </span>
                            <span className="badge demand">
                                <FaFire /> {roadmap.market_demand}
                            </span>
                        </div>
                    </motion.div>

                    {/* Phases Timeline */}
                    <div className="phases-timeline">
                        <h3 className="section-title">
                            <FaRoad className="section-icon" />
                            Your 4-Phase Journey
                        </h3>
                        
                        <div className="phases-navigation">
                            {roadmap.phases.map((phase, index) => (
                                <motion.button
                                    key={index}
                                    className={`phase-tab ${activePhase === index ? 'active' : ''}`}
                                    onClick={() => setActivePhase(index)}
                                    whileHover={{ y: -2 }}
                                    style={{ '--phase-color': phase.color }}
                                >
                                    <span className="phase-icon" style={{ background: phase.color }}>
                                        {phase.icon}
                                    </span>
                                    <div className="phase-info">
                                        <h4>{phase.name}</h4>
                                        <p>{phase.duration}</p>
                                    </div>
                                </motion.button>
                            ))}
                        </div>

                        <AnimatePresence mode="wait">
                            <motion.div
                                key={activePhase}
                                className="phase-detail"
                                initial={{ x: 20, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                exit={{ x: -20, opacity: 0 }}
                                transition={{ duration: 0.3 }}
                            >
                                <div className="phase-content">
                                    <div className="phase-header">
                                        <h4 style={{ color: roadmap.phases[activePhase].color }}>
                                            {roadmap.phases[activePhase].name}
                                        </h4>
                                        <span className="phase-milestone">
                                            <FaCheckCircle />
                                            {roadmap.phases[activePhase].milestone}
                                        </span>
                                    </div>

                                    <div className="phase-grid">
                                        <div className="phase-topics">
                                            <h5>📚 Topics to Master</h5>
                                            <ul>
                                                {roadmap.phases[activePhase].topics.map((topic, i) => (
                                                    <motion.li
                                                        key={i}
                                                        initial={{ opacity: 0, x: -10 }}
                                                        animate={{ opacity: 1, x: 0 }}
                                                        transition={{ delay: i * 0.1 }}
                                                    >
                                                        <FaCheckCircle className="check-icon" />
                                                        {topic}
                                                    </motion.li>
                                                ))}
                                            </ul>
                                        </div>

                                        <div className="phase-exercises">
                                            <h5>💪 Hands-on Exercises</h5>
                                            <ul>
                                                {roadmap.phases[activePhase].exercises.map((exercise, i) => (
                                                    <motion.li
                                                        key={i}
                                                        initial={{ opacity: 0, x: -10 }}
                                                        animate={{ opacity: 1, x: 0 }}
                                                        transition={{ delay: i * 0.1 + 0.3 }}
                                                    >
                                                        <FaLightbulb className="bulb-icon" />
                                                        {exercise}
                                                    </motion.li>
                                                ))}
                                            </ul>
                                        </div>
                                    </div>

                                    <div className="phase-projects">
                                        <h5>🚀 Mini Projects</h5>
                                        <div className="project-chips">
                                            {roadmap.phases[activePhase].projects.map((project, i) => (
                                                <span key={i} className="project-chip">
                                                    {project}
                                                </span>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="phase-motivation">
                                        <FaStar className="star-icon" />
                                        <p>{roadmap.phases[activePhase].motivation}</p>
                                    </div>
                                </div>
                            </motion.div>
                        </AnimatePresence>
                    </div>

                    {/* Skills & Certifications Grid */}
                    <div className="skills-cert-grid">
                        <motion.div 
                            className="skills-card"
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.2 }}
                        >
                            <h4>
                                <FaBrain />
                                Skills to Acquire
                            </h4>
                            <div className="skills-list">
                                {roadmap.skills_to_learn.map((skill, index) => (
                                    <div key={index} className="skill-item">
                                        <span className="skill-icon">{skill.split(' ')[0]}</span>
                                        <span className="skill-name">{skill.substring(2)}</span>
                                    </div>
                                ))}
                            </div>
                        </motion.div>

                        <motion.div 
                            className="certifications-card"
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.3 }}
                        >
                            <h4>
                                <FaCertificate />
                                Recommended Certifications
                            </h4>
                            <div className="cert-list">
                                {roadmap.certifications.map((cert, index) => (
                                    <div key={index} className="cert-item">
                                        <span className="cert-icon">{cert.icon}</span>
                                        <div className="cert-details">
                                            <h5>{cert.name}</h5>
                                            <p>{cert.provider}</p>
                                            <div className="cert-meta">
                                                <span className="cert-duration">{cert.duration}</span>
                                                <span className="cert-cost">{cert.cost}</span>
                                                <span className={`cert-badge ${cert.badge_color}`}>
                                                    Relevance: {cert.relevance}/10
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    </div>

                    {/* Projects & Resources */}
                    <div className="projects-resources-grid">
                        <motion.div 
                            className="projects-card"
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.4 }}
                        >
                            <h4>
                                <FaProjectDiagram />
                                Portfolio Projects
                            </h4>
                            <div className="projects-list">
                                {roadmap.projects.map((project, index) => (
                                    <div key={index} className="project-card">
                                        <div className="project-header">
                                            <h5>{project.name}</h5>
                                            <span className="project-difficulty" style={{
                                                background: project.difficulty === 'Beginner' ? '#10b981' :
                                                            project.difficulty === 'Intermediate' ? '#f59e0b' : '#ef4444'
                                            }}>
                                                {project.difficulty}
                                            </span>
                                        </div>
                                        <p className="project-impact">{project.impact}</p>
                                        <div className="project-tech">
                                            {project.technologies.map((tech, i) => (
                                                <span key={i} className="tech-tag">{tech}</span>
                                            ))}
                                        </div>
                                        <div className="project-meta">
                                            <span className="project-time">
                                                <FaClock /> {project.estimated_time}
                                            </span>
                                            <span className="project-worth">
                                                {project.portfolio_worth}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </motion.div>

                        <motion.div 
                            className="resources-card"
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.5 }}
                        >
                            <h4>
                                <FaBook />
                                Learning Resources
                            </h4>
                            <div className="resources-list">
                                {roadmap.resources.map((resource, index) => (
                                    <div key={index} className="resource-item">
                                        <span className="resource-type">{resource.type}</span>
                                        <div className="resource-details">
                                            <h5>{resource.name}</h5>
                                            <p>{resource.platform}</p>
                                            <div className="resource-meta">
                                                <span className="resource-duration">{resource.duration}</span>
                                                <span className="resource-cost">{resource.cost}</span>
                                                <span className="resource-rating">
                                                    {'⭐'.repeat(Math.floor(resource.rating))}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    </div>

                    {/* Salary & Success Stories */}
                    <div className="career-insights-grid">
                        <motion.div 
                            className="salary-card"
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.6 }}
                        >
                            <h4>
                                <FaMoneyBillWave />
                                Salary Progression
                            </h4>
                            <div className="salary-timeline">
                                {roadmap.salary_progression.map((stage, index) => (
                                    <div key={index} className="salary-stage">
                                        <div className="stage-dot"></div>
                                        <div className="stage-content">
                                            <h5>{stage.stage}</h5>
                                            <p className="stage-salary">{stage.salary}</p>
                                            <p className="stage-timeframe">{stage.timeframe}</p>
                                        </div>
                                        {index < roadmap.salary_progression.length - 1 && (
                                            <div className="stage-line"></div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </motion.div>

                        <motion.div 
                            className="success-stories-card"
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.7 }}
                        >
                            <h4>
                                <FaUsers />
                                Success Stories
                            </h4>
                            <div className="stories-list">
                                {roadmap.success_stories.map((story, index) => (
                                    <div key={index} className="story-item">
                                        <span className="story-icon">✨</span>
                                        <p>{story}</p>
                                    </div>
                                ))}
                            </div>
                            
                            <div className="daily-schedule">
                                <h5>
                                    <FaClock />
                                    Recommended Daily Schedule
                                </h5>
                                <div className="schedule-grid">
                                    <div className="schedule-item">
                                        <span className="time">🌅 Morning</span>
                                        <span className="activity">{roadmap.daily_schedule.morning}</span>
                                    </div>
                                    <div className="schedule-item">
                                        <span className="time">☀️ Afternoon</span>
                                        <span className="activity">{roadmap.daily_schedule.afternoon}</span>
                                    </div>
                                    <div className="schedule-item">
                                        <span className="time">🌙 Evening</span>
                                        <span className="activity">{roadmap.daily_schedule.evening}</span>
                                    </div>
                                    <div className="schedule-item">
                                        <span className="time">🎯 Weekly</span>
                                        <span className="activity">{roadmap.daily_schedule.weekly}</span>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>

                    {/* Action Buttons */}
                    <div className="roadmap-actions">
                        <motion.button
                            className="action-btn primary"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <FaDownload />
                            Download Roadmap PDF
                        </motion.button>
                        <motion.button
                            className="action-btn secondary"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <FaShare />
                            Share with Mentor
                        </motion.button>
                        <motion.button
                            className="action-btn tertiary"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => {
                                setRoadmap(null);
                                setCurrentRole('');
                                setTargetRole('');
                            }}
                        >
                            ← Create New Roadmap
                        </motion.button>
                    </div>
                </motion.div>
            )}
        </motion.div>
    );
};

export default CareerRoadmap;