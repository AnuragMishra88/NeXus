// frontend/src/Component/CodingPlatform/CodingPlatform.jsx
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { useAuth } from '../../Api/AuthContext';
import {
    FaCode,
    FaUser,
    FaStar,
    FaChartLine,
    FaTrophy,
    FaMedal,
    FaFire,
    FaCalendarAlt,
    FaGithub,
    FaExternalLinkAlt,
    FaSearch,
    FaSpinner,
    FaCheckCircle,
    FaExclamationTriangle,
    FaCrown,
    FaArrowRight,
    FaDownload,
    FaShare,
    FaGitAlt,
    FaCodeBranch,
    FaEye,
    FaHeart,
    FaHistory,
    FaAward,
    FaRocket
} from 'react-icons/fa';
import { SiCodechef, SiCodeforces, SiLeetcode, SiGeeksforgeeks } from 'react-icons/si';
import './CodingPlatform.css';

const CodingPlatform = ({ setActivePage }) => {
    const { user, isAuthenticated } = useAuth();
    const [username, setUsername] = useState('');
    const [platform, setPlatform] = useState('leetcode');
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState(null);
    const [error, setError] = useState('');
    const [activeTab, setActiveTab] = useState('overview');
    const [trending, setTrending] = useState(null);
    const [fetchingTrending, setFetchingTrending] = useState(false);

    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1';

    const platforms = [
        { id: 'leetcode', name: 'LeetCode', icon: <SiLeetcode />, color: '#ffa116', bgColor: 'rgba(255, 161, 22, 0.1)' },
        { id: 'codeforces', name: 'Codeforces', icon: <SiCodeforces />, color: '#1f8acb', bgColor: 'rgba(31, 138, 203, 0.1)' },
        { id: 'codechef', name: 'CodeChef', icon: <SiCodechef />, color: '#5b4638', bgColor: 'rgba(91, 70, 56, 0.1)' },
        { id: 'geeksforgeeks', name: 'GeeksforGeeks', icon: <SiGeeksforgeeks />, color: '#2f8d46', bgColor: 'rgba(47, 141, 70, 0.1)' },
        { id: 'github', name: 'GitHub', icon: <FaGithub />, color: '#171515', bgColor: 'rgba(23, 21, 21, 0.1)' }
    ];

    // Fallback trending data in case API fails
    const fallbackTrending = {
        leetcode: [
            { name: "Two Sum", difficulty: "Easy", acceptance: "45%", solved: "2M+" },
            { name: "Add Two Numbers", difficulty: "Medium", acceptance: "35%", solved: "1.5M+" },
            { name: "Longest Substring Without Repeating Characters", difficulty: "Medium", acceptance: "30%", solved: "1M+" },
            { name: "Median of Two Sorted Arrays", difficulty: "Hard", acceptance: "28%", solved: "800K+" },
            { name: "Reverse Integer", difficulty: "Easy", acceptance: "42%", solved: "1.2M+" }
        ],
        codeforces: [
            { name: "Watermelon (4A)", difficulty: "800", solved: "500K+" },
            { name: "Way Too Long Words (71A)", difficulty: "800", solved: "450K+" },
            { name: "Team (231A)", difficulty: "800", solved: "400K+" },
            { name: "Next Round (158A)", difficulty: "800", solved: "380K+" },
            { name: "Domino piling (50A)", difficulty: "800", solved: "350K+" }
        ]
    };

    useEffect(() => {
        setActivePage('coding');
        fetchTrending();
    }, []);

    const fetchTrending = async () => {
        setFetchingTrending(true);
        try {
            const response = await axios.get(`${API_URL}/coding/trending`, {
                withCredentials: true,
                timeout: 5000
            });
            if (response.data.success) {
                setTrending(response.data.trending);
            } else {
                // Use fallback data if API returns unsuccessful
                setTrending(fallbackTrending);
            }
        } catch (error) {
            console.error('Error fetching trending:', error);
            // Use fallback data on error
            setTrending(fallbackTrending);
        } finally {
            setFetchingTrending(false);
        }
    };

    const fetchProfile = async () => {
        if (!username.trim()) {
            setError('Please enter a username');
            return;
        }

        // Check authentication for GitHub (optional)
        if (platform === 'github' && !isAuthenticated) {
            setError('Please login to fetch GitHub data');
            return;
        }

        setLoading(true);
        setError('');
        setData(null);

        try {
            const response = await axios.post(`${API_URL}/coding/profile`, {
                username: username.trim(),
                platform: platform
            }, {
                withCredentials: true,
                timeout: 10000
            });

            if (response.data.success) {
                setData(response.data.data);
            } else {
                setError('Failed to fetch profile data');
            }
        } catch (error) {
            console.error('Error fetching profile:', error);
            if (error.code === 'ECONNABORTED') {
                setError('Request timeout. Please try again.');
            } else if (error.response?.status === 404) {
                setError('User not found on this platform');
            } else if (error.response?.status === 401) {
                setError('Authentication required. Please login.');
            } else {
                setError(error.response?.data?.message || 'Failed to fetch profile data');
            }
            // Generate fallback data for demo
            generateFallbackData();
        } finally {
            setLoading(false);
        }
    };

    const generateFallbackData = () => {
        const fallbackData = {
            platform: platforms.find(p => p.id === platform)?.name || platform,
            username: username,
            rating: 1500 + Math.floor(Math.random() * 500),
            maxRating: 1800 + Math.floor(Math.random() * 300),
            rank: "Expert",
            globalRank: Math.floor(Math.random() * 50000) + 10000,
            problemsSolved: Math.floor(Math.random() * 500) + 100,
            difficultyBreakdown: {
                easy: Math.floor(Math.random() * 200) + 50,
                medium: Math.floor(Math.random() * 150) + 30,
                hard: Math.floor(Math.random() * 50) + 10
            },
            contestsParticipated: Math.floor(Math.random() * 30) + 5,
            badges: [
                { name: "100 Days Badge", icon: "🔥" },
                { name: "Problem Solver", icon: "⭐" },
                { name: "Contest Participant", icon: "🏆" }
            ],
            languages: ["Python", "JavaScript", "Java", "C++"],
            recentSubmissions: [
                { problem: "Two Sum", difficulty: "Easy", status: "Accepted", time: "2 hours ago" },
                { problem: "Add Two Numbers", difficulty: "Medium", status: "Accepted", time: "1 day ago" },
                { problem: "Longest Substring", difficulty: "Medium", status: "Wrong Answer", time: "2 days ago" },
                { problem: "Median of Arrays", difficulty: "Hard", status: "Accepted", time: "3 days ago" }
            ]
        };
        setData(fallbackData);
    };

    const getPlatformIcon = (platformId) => {
        const platform = platforms.find(p => p.id === platformId);
        return platform?.icon || <FaCode />;
    };

    const getPlatformColor = (platformId) => {
        const platform = platforms.find(p => p.id === platformId);
        return platform?.color || '#6366f1';
    };

    const renderLeetCode = () => (
        <div className="platform-data">
            <div className="stats-grid">
                <div className="stat-card">
                    <div className="stat-icon">🏆</div>
                    <div className="stat-content">
                        <span className="stat-label">Rating</span>
                        <span className="stat-value">{data.rating || 'N/A'}</span>
                    </div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon">📊</div>
                    <div className="stat-content">
                        <span className="stat-label">Problems Solved</span>
                        <span className="stat-value">{data.problemsSolved}</span>
                    </div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon">🌍</div>
                    <div className="stat-content">
                        <span className="stat-label">Global Rank</span>
                        <span className="stat-value">#{data.globalRank?.toLocaleString()}</span>
                    </div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon">🎯</div>
                    <div className="stat-content">
                        <span className="stat-label">Contests</span>
                        <span className="stat-value">{data.contestsParticipated}</span>
                    </div>
                </div>
            </div>

            <div className="difficulty-breakdown">
                <h4>Problem Breakdown</h4>
                <div className="difficulty-bars">
                    <div className="difficulty-item">
                        <span className="difficulty-label easy">Easy</span>
                        <div className="progress-bar">
                            <div className="progress easy" style={{ width: `${(data.difficultyBreakdown?.easy / data.problemsSolved) * 100}%` }}></div>
                        </div>
                        <span className="difficulty-count">{data.difficultyBreakdown?.easy}</span>
                    </div>
                    <div className="difficulty-item">
                        <span className="difficulty-label medium">Medium</span>
                        <div className="progress-bar">
                            <div className="progress medium" style={{ width: `${(data.difficultyBreakdown?.medium / data.problemsSolved) * 100}%` }}></div>
                        </div>
                        <span className="difficulty-count">{data.difficultyBreakdown?.medium}</span>
                    </div>
                    <div className="difficulty-item">
                        <span className="difficulty-label hard">Hard</span>
                        <div className="progress-bar">
                            <div className="progress hard" style={{ width: `${(data.difficultyBreakdown?.hard / data.problemsSolved) * 100}%` }}></div>
                        </div>
                        <span className="difficulty-count">{data.difficultyBreakdown?.hard}</span>
                    </div>
                </div>
            </div>

            <div className="badges-section">
                <h4>Badges & Achievements</h4>
                <div className="badges-grid">
                    {data.badges?.map((badge, index) => (
                        <div key={index} className="badge-item">
                            <span className="badge-icon">{badge.icon}</span>
                            <span className="badge-name">{badge.name}</span>
                        </div>
                    ))}
                </div>
            </div>

            <div className="recent-submissions">
                <h4>Recent Submissions</h4>
                <div className="submissions-list">
                    {data.recentSubmissions?.map((sub, index) => (
                        <div key={index} className="submission-item">
                            <span className="problem-name">{sub.problem}</span>
                            <span className={`difficulty-tag ${sub.difficulty?.toLowerCase()}`}>{sub.difficulty}</span>
                            <span className={`status ${sub.status === 'Accepted' ? 'accepted' : 'wrong'}`}>
                                {sub.status === 'Accepted' ? <FaCheckCircle /> : <FaExclamationTriangle />}
                                {sub.status}
                            </span>
                            <span className="submission-time">{sub.time}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );

    const renderCodeforces = () => (
        <div className="platform-data">
            <div className="stats-grid">
                <div className="stat-card">
                    <div className="stat-icon">🏆</div>
                    <div className="stat-content">
                        <span className="stat-label">Rating</span>
                        <span className="stat-value">{data.rating || 'Unrated'}</span>
                    </div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon">📊</div>
                    <div className="stat-content">
                        <span className="stat-label">Max Rating</span>
                        <span className="stat-value">{data.maxRating || 'Unrated'}</span>
                    </div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon">👑</div>
                    <div className="stat-content">
                        <span className="stat-label">Rank</span>
                        <span className="stat-value">{data.rank}</span>
                    </div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon">🎯</div>
                    <div className="stat-content">
                        <span className="stat-label">Solved</span>
                        <span className="stat-value">{data.problemsSolved}</span>
                    </div>
                </div>
            </div>

            <div className="info-grid">
                <div className="info-card">
                    <h4><FaHistory /> Contest History</h4>
                    <p>Participated in {data.contestsParticipated} contests</p>
                    <p>Contribution: {data.contribution || 0}</p>
                    <p>Friend of: {data.friendOf || 0} users</p>
                </div>
                <div className="info-card">
                    <h4><FaUser /> Account Info</h4>
                    <p>Organization: {data.organization || 'N/A'}</p>
                    <p>Registered: {data.registered ? new Date(data.registered * 1000).toLocaleDateString() : 'N/A'}</p>
                    <p>Last Online: {data.lastOnline || 'N/A'}</p>
                </div>
            </div>

            <div className="recent-submissions">
                <h4>Recent Submissions</h4>
                <div className="submissions-list">
                    {data.recentSubmissions?.map((sub, index) => (
                        <div key={index} className="submission-item">
                            <span className="problem-name">{sub.problem}</span>
                            <span className="contest-name">{sub.contest}</span>
                            <span className={`verdict ${sub.verdict === 'OK' ? 'accepted' : 'wrong'}`}>
                                {sub.verdict === 'OK' ? <FaCheckCircle /> : <FaExclamationTriangle />}
                                {sub.verdict}
                            </span>
                            <span className="submission-time">{sub.time}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );

    const renderCodeChef = () => (
        <div className="platform-data">
            <div className="stats-grid">
                <div className="stat-card">
                    <div className="stat-icon">⭐</div>
                    <div className="stat-content">
                        <span className="stat-label">Stars</span>
                        <span className="stat-value">{data.stars || '3'}★</span>
                    </div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon">🏆</div>
                    <div className="stat-content">
                        <span className="stat-label">Rating</span>
                        <span className="stat-value">{data.rating || 'N/A'}</span>
                    </div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon">📊</div>
                    <div className="stat-content">
                        <span className="stat-label">Solved</span>
                        <span className="stat-value">{data.problemsSolved}</span>
                    </div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon">🌍</div>
                    <div className="stat-content">
                        <span className="stat-label">Global Rank</span>
                        <span className="stat-value">#{data.globalRank}</span>
                    </div>
                </div>
            </div>

            <div className="info-grid">
                <div className="info-card">
                    <h4><FaAward /> Rankings</h4>
                    <p>Global Rank: #{data.globalRank}</p>
                    <p>Country Rank: #{data.countryRank}</p>
                    <p>Division: {data.division || 2}</p>
                </div>
                <div className="info-card">
                    <h4><FaRocket /> Activity</h4>
                    <p>Contests: {data.contestsParticipated}</p>
                    <p>Institution: {data.institution || 'N/A'}</p>
                </div>
            </div>
        </div>
    );

    const renderGFG = () => (
        <div className="platform-data">
            <div className="stats-grid">
                <div className="stat-card">
                    <div className="stat-icon">📊</div>
                    <div className="stat-content">
                        <span className="stat-label">Coding Score</span>
                        <span className="stat-value">{data.codingScore}</span>
                    </div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon">✅</div>
                    <div className="stat-content">
                        <span className="stat-label">Problems</span>
                        <span className="stat-value">{data.problemsSolved}</span>
                    </div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon">🏆</div>
                    <div className="stat-content">
                        <span className="stat-label">Rank</span>
                        <span className="stat-value">#{data.rank}</span>
                    </div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon">🔥</div>
                    <div className="stat-content">
                        <span className="stat-label">Streak</span>
                        <span className="stat-value">{data.currentStreak || 0} days</span>
                    </div>
                </div>
            </div>

            <div className="skills-section">
                <h4>Skills</h4>
                <div className="skills-tags">
                    {data.skillTags?.map((skill, index) => (
                        <span key={index} className="skill-tag">{skill}</span>
                    ))}
                </div>
            </div>
        </div>
    );

    const renderGitHub = () => (
        <div className="platform-data">
            <div className="stats-grid">
                <div className="stat-card">
                    <div className="stat-icon">📊</div>
                    <div className="stat-content">
                        <span className="stat-label">Contributions</span>
                        <span className="stat-value">{data.totalContributions}</span>
                    </div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon">🔥</div>
                    <div className="stat-content">
                        <span className="stat-label">Current Streak</span>
                        <span className="stat-value">{data.currentStreak || 0} days</span>
                    </div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon">📦</div>
                    <div className="stat-content">
                        <span className="stat-label">Repos</span>
                        <span className="stat-value">{data.repositories}</span>
                    </div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon">👥</div>
                    <div className="stat-content">
                        <span className="stat-label">Followers</span>
                        <span className="stat-value">{data.followers}</span>
                    </div>
                </div>
            </div>

            <div className="info-grid">
                <div className="info-card">
                    <h4><FaGitAlt /> Social Stats</h4>
                    <p><FaEye /> Following: {data.following}</p>
                    <p><FaStar /> Stars: {data.stars}</p>
                    <p><FaCodeBranch /> PRs: {data.pullRequests}</p>
                    <p><FaHeart /> Issues: {data.issues}</p>
                </div>
                <div className="info-card">
                    <h4><FaCode /> Top Languages</h4>
                    <div className="languages-list">
                        {data.topLanguages?.map((lang, index) => (
                            <span key={index} className="language-tag">{lang}</span>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );

    const renderPlatformData = () => {
        if (!data) return null;

        switch (platform) {
            case 'leetcode':
                return renderLeetCode();
            case 'codeforces':
                return renderCodeforces();
            case 'codechef':
                return renderCodeChef();
            case 'geeksforgeeks':
                return renderGFG();
            case 'github':
                return renderGitHub();
            default:
                return null;
        }
    };

    return (
        <motion.div
            className="coding-platform-container"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
        >
            {/* Header */}
            <div className="coding-header">
                <motion.h1
                    initial={{ y: -20 }}
                    animate={{ y: 0 }}
                >
                    <span className="gradient-text">💻 Coding Profile Analyzer</span>
                </motion.h1>
                <p className="subtitle">Track your progress across multiple coding platforms</p>
                {!isAuthenticated && (
                    <p className="auth-warning">
                        <FaExclamationTriangle /> Login to save your profiles
                    </p>
                )}
            </div>

            {/* Platform Selector */}
            <div className="platform-selector">
                {platforms.map(p => (
                    <motion.button
                        key={p.id}
                        className={`platform-btn ${platform === p.id ? 'active' : ''}`}
                        style={{ '--platform-color': p.color }}
                        onClick={() => setPlatform(p.id)}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <span className="platform-icon" style={{ color: p.color }}>{p.icon}</span>
                        <span className="platform-name">{p.name}</span>
                    </motion.button>
                ))}
            </div>

            {/* Search Section */}
            <div className="search-section">
                <div className="search-container">
                    <input
                        type="text"
                        className="search-input"
                        placeholder={`Enter ${platforms.find(p => p.id === platform)?.name} username...`}
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && fetchProfile()}
                    />
                    <motion.button
                        className="search-btn"
                        onClick={fetchProfile}
                        disabled={loading}
                        style={{ background: getPlatformColor(platform) }}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                    >
                        {loading ? <FaSpinner className="spinning" /> : <FaSearch />}
                        {loading ? 'Fetching...' : 'Analyze'}
                    </motion.button>
                </div>
                {error && (
                    <motion.div
                        className="error-message"
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        <FaExclamationTriangle /> {error}
                    </motion.div>
                )}
            </div>

            {/* Results Section */}
            <AnimatePresence mode="wait">
                {data && (
                    <motion.div
                        key="results"
                        className="results-container"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                    >
                        {/* Profile Header */}
                        <div className="profile-header">
                            <div className="profile-info">
                                <div className="profile-avatar" style={{ background: getPlatformColor(platform) }}>
                                    {getPlatformIcon(platform)}
                                </div>
                                <div className="profile-details">
                                    <h2>{data.username}</h2>
                                    <p className="platform-badge" style={{ color: getPlatformColor(platform) }}>
                                        {data.platform}
                                    </p>
                                </div>
                            </div>
                            <a
                                href={`https://${platform}.com/${username}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="profile-link"
                                style={{ color: getPlatformColor(platform) }}
                            >
                                View Profile <FaExternalLinkAlt />
                            </a>
                        </div>

                        {/* Tabs */}
                        <div className="profile-tabs">
                            <button
                                className={`tab-btn ${activeTab === 'overview' ? 'active' : ''}`}
                                onClick={() => setActiveTab('overview')}
                            >
                                <FaChartLine /> Overview
                            </button>
                            <button
                                className={`tab-btn ${activeTab === 'submissions' ? 'active' : ''}`}
                                onClick={() => setActiveTab('submissions')}
                            >
                                <FaCode /> Submissions
                            </button>
                            <button
                                className={`tab-btn ${activeTab === 'badges' ? 'active' : ''}`}
                                onClick={() => setActiveTab('badges')}
                            >
                                <FaTrophy /> Badges
                            </button>
                            <button
                                className={`tab-btn ${activeTab === 'stats' ? 'active' : ''}`}
                                onClick={() => setActiveTab('stats')}
                            >
                                <FaMedal /> Statistics
                            </button>
                        </div>

                        {/* Tab Content */}
                        <div className="tab-content">
                            {activeTab === 'overview' && renderPlatformData()}
                            {activeTab === 'submissions' && (
                                <div className="submissions-full">
                                    <h3>All Submissions</h3>
                                    {data.recentSubmissions?.map((sub, index) => (
                                        <div key={index} className="submission-card">
                                            <span className="submission-problem">{sub.problem}</span>
                                            <span className="submission-status">{sub.status || sub.verdict}</span>
                                            <span className="submission-time">{sub.time}</span>
                                        </div>
                                    ))}
                                </div>
                            )}
                            {activeTab === 'badges' && (
                                <div className="badges-full">
                                    <h3>All Badges</h3>
                                    <div className="badges-grid-full">
                                        {data.badges?.map((badge, index) => (
                                            <div key={index} className="badge-card">
                                                <span className="badge-icon-large">{badge.icon}</span>
                                                <h4>{badge.name}</h4>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                            {activeTab === 'stats' && (
                                <div className="stats-full">
                                    <h3>Detailed Statistics</h3>
                                    <div className="stats-json">
                                        <p><strong>Total Problems:</strong> {data.problemsSolved}</p>
                                        <p><strong>Rating:</strong> {data.rating || 'N/A'}</p>
                                        <p><strong>Rank:</strong> {data.rank || 'N/A'}</p>
                                        <p><strong>Contests:</strong> {data.contestsParticipated}</p>
                                        <p><strong>Languages:</strong> {data.languages?.join(', ')}</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Trending Section */}
            {trending && (
                <motion.div
                    className="trending-section"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                >
                    <h3><FaFire /> Trending Problems</h3>
                    {fetchingTrending ? (
                        <div className="loading-trending">
                            <FaSpinner className="spinning" /> Loading trending problems...
                        </div>
                    ) : (
                        <div className="trending-grid">
                            {trending.leetcode?.map((problem, index) => (
                                <div key={index} className="trending-card">
                                    <h4>{problem.name}</h4>
                                    <p><strong>Difficulty:</strong> {problem.difficulty}</p>
                                    <p><strong>Acceptance:</strong> {problem.acceptance}</p>
                                    <p><strong>Solved:</strong> {problem.solved}</p>
                                </div>
                            ))}
                        </div>
                    )}
                </motion.div>
            )}
        </motion.div>
    );
};

export default CodingPlatform;