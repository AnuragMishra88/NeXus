// backend/controllers/careerRoadmap.controller.js
import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const FASTAPI_URL = process.env.FASTAPI_URL || 'http://127.0.0.1:8001';

/**
 * @desc    Generate personalized career roadmap
 * @route   POST /api/v1/career/roadmap/generate
 * @access  Private
 */
export const generateRoadmap = async (req, res) => {
    try {
        const { current_role, target_role, experience_level, time_frame, skills } = req.body;

        if (!current_role || !target_role) {
            return res.status(400).json({
                success: false,
                message: 'Current role and target role are required'
            });
        }

        console.log(`🗺️ Generating career roadmap: ${current_role} → ${target_role}`);

        const response = await axios.post(`${FASTAPI_URL}/career/roadmap/generate`, {
            current_role: current_role.trim(),
            target_role: target_role.trim(),
            experience_level: experience_level || 'entry',
            time_frame: time_frame || '6 months',
            skills: skills || ''
        }, {
            timeout: 40000
        });

        if (response.data.success) {
            return res.status(200).json({
                success: true,
                current_role: response.data.current_role,
                target_role: response.data.target_role,
                roadmap: response.data.roadmap
            });
        } else {
            throw new Error('Invalid response from roadmap service');
        }

    } catch (error) {
        console.error('Roadmap generation error:', error.message);
        
        if (error.code === 'ECONNREFUSED' || error.code === 'ECONNABORTED') {
            const fallbackRoadmap = generateFallbackRoadmap(
                req.body.current_role,
                req.body.target_role
            );
            return res.status(200).json({
                success: true,
                current_role: req.body.current_role,
                target_role: req.body.target_role,
                roadmap: fallbackRoadmap,
                is_fallback: true
            });
        }

        return res.status(500).json({
            success: false,
            message: 'Failed to generate career roadmap',
            error: error.message
        });
    }
};

/**
 * @desc    Get trending career paths
 * @route   GET /api/v1/career/roadmap/trending
 * @access  Public
 */
export const getTrendingCareers = async (req, res) => {
    try {
        const response = await axios.get(`${FASTAPI_URL}/career/roadmap/trending`);
        return res.status(200).json(response.data);
    } catch (error) {
        // Fallback trending careers
        const trending = [
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
        
        return res.status(200).json({
            success: true,
            trending
        });
    }
};

/**
 * @desc    Get career roadmap history (future feature)
 * @route   GET /api/v1/career/roadmap/history
 * @access  Private
 */
export const getRoadmapHistory = async (req, res) => {
    try {
        // This would fetch from MongoDB in future
        return res.status(200).json({
            success: true,
            history: []
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Failed to fetch roadmap history'
        });
    }
};

// ==================== FALLBACK GENERATOR ====================
function generateFallbackRoadmap(currentRole, targetRole) {
    return {
        summary: `🚀 Your journey from ${currentRole} to ${targetRole} starts now! With dedication and the right roadmap, you can achieve this transformation in 6-12 months.`,
        
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
                technologies: ["Multiple technologies"],
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
}