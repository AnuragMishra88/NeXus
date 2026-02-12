// backend/routes/quiz.route.js
import express from 'express';
import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const router = express.Router();

// FastAPI service URL
const FASTAPI_URL = process.env.FASTAPI_URL || 'http://127.0.0.1:8001';

/**
 * @route   POST /api/v1/quiz/generate
 * @desc    Generate quiz questions using Groq via FastAPI
 * @access  Private (requires auth)
 */
router.post('/generate', async (req, res) => {
    try {
        const { topic, num_questions = 5, difficulty = 'medium' } = req.body;

        if (!topic || topic.trim() === '') {
            return res.status(400).json({
                success: false,
                message: 'Topic is required'
            });
        }

        // Validate question count - only allow 5, 10, 20, 30
        const validCounts = [5, 10, 20, 30];
        const questionCount = validCounts.includes(parseInt(num_questions)) 
            ? parseInt(num_questions) 
            : 5;

        console.log(`📝 Generating ${questionCount} questions on topic: ${topic}`);

        // Call FastAPI quiz generation endpoint
        const response = await axios.post(`${FASTAPI_URL}/quiz/generate`, {
            topic: topic.trim(),
            num_questions: questionCount,
            difficulty: difficulty
        }, {
            timeout: 30000,
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (response.data && response.data.questions) {
            return res.status(200).json({
                success: true,
                topic: response.data.topic || topic,
                questions: response.data.questions,
                total_questions: response.data.total_questions || response.data.questions.length
            });
        } else {
            throw new Error('Invalid response from quiz service');
        }

    } catch (error) {
        console.error('Quiz generation error:', error.message);
        
        // Return fallback quiz if service is unavailable
        if (error.code === 'ECONNREFUSED' || error.code === 'ECONNABORTED' || error.code === 'ETIMEDOUT') {
            console.log('⚠️ FastAPI service unavailable, using fallback quiz');
            const fallbackQuiz = generateFallbackQuiz(req.body.topic, req.body.num_questions);
            return res.status(200).json({
                success: true,
                topic: req.body.topic,
                questions: fallbackQuiz.questions,
                total_questions: fallbackQuiz.questions.length,
                is_fallback: true
            });
        }

        return res.status(500).json({
            success: false,
            message: 'Failed to generate quiz',
            error: error.message
        });
    }
});

/**
 * @route   POST /api/v1/quiz/evaluate
 * @desc    Evaluate quiz answers
 * @access  Private (requires auth)
 */
router.post('/evaluate', async (req, res) => {
    try {
        const { questions, answers } = req.body;

        if (!questions || !answers || !Array.isArray(questions) || !Array.isArray(answers)) {
            return res.status(400).json({
                success: false,
                message: 'Questions and answers are required as arrays'
            });
        }

        if (questions.length !== answers.length) {
            return res.status(400).json({
                success: false,
                message: 'Number of questions and answers must match'
            });
        }

        // Call FastAPI evaluation endpoint
        const response = await axios.post(`${FASTAPI_URL}/quiz/evaluate`, {
            questions,
            answers
        }, {
            timeout: 10000,
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (response.data) {
            return res.status(200).json({
                success: true,
                ...response.data
            });
        } else {
            throw new Error('Invalid response from evaluation service');
        }

    } catch (error) {
        console.error('Quiz evaluation error:', error.message);
        
        // Fallback evaluation if service is unavailable
        if (error.code === 'ECONNREFUSED' || error.code === 'ECONNABORTED') {
            const fallbackResult = evaluateFallbackQuiz(req.body.questions, req.body.answers);
            return res.status(200).json({
                success: true,
                ...fallbackResult
            });
        }

        return res.status(500).json({
            success: false,
            message: 'Failed to evaluate quiz',
            error: error.message
        });
    }
});

/**
 * @route   GET /api/v1/quiz/topics
 * @desc    Get suggested quiz topics
 * @access  Public
 */
router.get('/topics', async (req, res) => {
    try {
        // Try to get from FastAPI first
        const response = await axios.get(`${FASTAPI_URL}/quiz/topics`, {
            timeout: 5000
        });
        
        return res.status(200).json({
            success: true,
            topics: response.data.suggested_topics || []
        });
    } catch (error) {
        // Fallback topics if service is unavailable
        const fallbackTopics = [
            "Python Programming",
            "Machine Learning",
            "Data Structures",
            "Algorithms",
            "Web Development",
            "React.js",
            "JavaScript",
            "Java Programming",
            "Database Systems",
            "Cloud Computing",
            "Cybersecurity",
            "Artificial Intelligence",
            "Docker & Kubernetes",
            "AWS Services",
            "System Design",
            "DevOps",
            "Blockchain",
            "IoT",
            "C++ Programming",
            "Software Engineering"
        ];
        
        return res.status(200).json({
            success: true,
            topics: fallbackTopics
        });
    }
});

/**
 * @route   GET /api/v1/quiz/health
 * @desc    Check FastAPI quiz service health
 * @access  Public
 */
router.get('/health', async (req, res) => {
    try {
        const response = await axios.get(`${FASTAPI_URL}/health`, {
            timeout: 3000
        });
        
        return res.status(200).json({
            success: true,
            fastapi: response.data,
            status: 'connected'
        });
    } catch (error) {
        return res.status(200).json({
            success: true,
            fastapi: null,
            status: 'disconnected',
            message: 'FastAPI quiz service not available, using fallback mode'
        });
    }
});

// ==================== FALLBACK FUNCTIONS ====================

function generateFallbackQuiz(topic, numQuestions = 5) {
    const questions = [];
    const count = Math.min(parseInt(numQuestions) || 5, 5); // Max 5 fallback questions
    
    const fallbackQuestions = [
        {
            question: `What is the primary purpose of ${topic}?`,
            options: [
                `To solve specific problems in the domain of ${topic}`,
                `To make existing systems slower`,
                `To replace all other technologies`,
                `To complicate simple tasks`
            ],
            correct_answer: `To solve specific problems in the domain of ${topic}`,
            explanation: `${topic} is designed to address specific challenges and provide solutions in its domain.`
        },
        {
            question: `Which of the following is a key feature of ${topic}?`,
            options: [
                `Scalability and performance`,
                `Manual processing only`,
                `Limited functionality`,
                `Proprietary lock-in`
            ],
            correct_answer: `Scalability and performance`,
            explanation: `Modern ${topic} implementations focus on scalability and optimal performance.`
        },
        {
            question: `What makes ${topic} relevant in today's tech landscape?`,
            options: [
                `Its ability to adapt to modern requirements`,
                `Being outdated`,
                `Having no practical applications`,
                `Being difficult to learn`
            ],
            correct_answer: `Its ability to adapt to modern requirements`,
            explanation: `${topic} remains relevant because it evolves with technological advancements.`
        },
        {
            question: `Which skill is most important when learning ${topic}?`,
            options: [
                `Understanding core concepts`,
                `Memorizing syntax`,
                `Copy-pasting code`,
                `Avoiding practice`
            ],
            correct_answer: `Understanding core concepts`,
            explanation: `Strong foundational knowledge of core concepts is crucial for mastering ${topic}.`
        },
        {
            question: `How does ${topic} contribute to software development?`,
            options: [
                `By providing efficient solutions`,
                `By slowing down development`,
                `By creating more bugs`,
                `By increasing complexity`
            ],
            correct_answer: `By providing efficient solutions`,
            explanation: `${topic} offers streamlined approaches to common development challenges.`
        }
    ];
    
    for (let i = 0; i < count; i++) {
        questions.push(fallbackQuestions[i] || {
            question: `Sample question ${i + 1} about ${topic}?`,
            options: [
                `Correct answer about ${topic}`,
                `Common misconception about ${topic}`,
                `Related concept in ${topic}`,
                `Basic definition of ${topic}`
            ],
            correct_answer: `Correct answer about ${topic}`,
            explanation: `This is the correct answer because it accurately describes a key concept in ${topic}.`
        });
    }
    
    return { questions };
}

function evaluateFallbackQuiz(questions, userAnswers) {
    let score = 0;
    const detailedResults = [];
    const correctAnswers = [];
    
    questions.forEach((q, index) => {
        const userAns = userAnswers[index] || '';
        const isCorrect = userAns === q.correct_answer;
        
        if (isCorrect) {
            score++;
            correctAnswers.push(userAns);
        }
        
        detailedResults.push({
            question_num: index + 1,
            question: q.question,
            user_answer: userAns,
            correct_answer: q.correct_answer,
            is_correct: isCorrect,
            explanation: q.explanation || 'No explanation available'
        });
    });
    
    const total = questions.length;
    const percentage = total > 0 ? (score / total * 100).toFixed(2) : 0;
    
    return {
        score,
        total,
        percentage: parseFloat(percentage),
        correct_answers: correctAnswers,
        detailed_results: detailedResults
    };
}

export default router;