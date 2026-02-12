// backend/controllers/quiz.controller.js
const axios = require('axios');

// FastAPI service URL
const FASTAPI_URL = 'http://127.0.0.1:8001';

/**
 * @desc    Generate quiz questions using Groq via FastAPI
 * @route   POST /api/quiz/generate
 * @access  Private (if authentication required)
 */
exports.generateQuiz = async (req, res) => {
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
            timeout: 30000 // 30 second timeout for LLM generation
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
        if (error.code === 'ECONNREFUSED' || error.code === 'ECONNABORTED') {
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
};

/**
 * @desc    Evaluate quiz answers
 * @route   POST /api/quiz/evaluate
 * @access  Private (if authentication required)
 */
exports.evaluateQuiz = async (req, res) => {
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
        if (error.code === 'ECONNREFUSED') {
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
};

/**
 * @desc    Get suggested quiz topics
 * @route   GET /api/quiz/topics
 * @access  Public
 */
exports.getSuggestedTopics = async (req, res) => {
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
            "Database Systems",
            "Cloud Computing",
            "Cybersecurity",
            "Artificial Intelligence",
            "Software Engineering",
            "React.js",
            "Docker & Kubernetes",
            "AWS Services",
            "JavaScript",
            "Java Programming",
            "C++ Programming",
            "System Design",
            "DevOps",
            "Blockchain",
            "IoT"
        ];
        
        return res.status(200).json({
            success: true,
            topics: fallbackTopics
        });
    }
};

/**
 * @desc    Generate quiz from text/document (similar to summarize but for quiz)
 * @route   POST /api/quiz/from-text
 * @access  Private
 */
exports.generateQuizFromText = async (req, res) => {
    try {
        const { text, num_questions = 5 } = req.body;

        if (!text || text.trim() === '') {
            return res.status(400).json({
                success: false,
                message: 'Text is required'
            });
        }

        // Validate question count
        const validCounts = [5, 10, 20, 30];
        const questionCount = validCounts.includes(parseInt(num_questions)) ? parseInt(num_questions) : 5;

        // Create a prompt-based quiz from the provided text
        // This calls your existing summarizer or a dedicated endpoint
        const response = await axios.post(`${FASTAPI_URL}/quiz/generate`, {
            topic: "Based on provided content",
            num_questions: questionCount,
            difficulty: "medium",
            context: text.substring(0, 3000) // Send first 3000 chars as context
        });

        return res.status(200).json({
            success: true,
            questions: response.data.questions || [],
            total_questions: response.data.questions?.length || 0
        });

    } catch (error) {
        console.error('Text to quiz error:', error.message);
        return res.status(500).json({
            success: false,
            message: 'Failed to generate quiz from text',
            error: error.message
        });
    }
};

// ==================== FALLBACK FUNCTIONS ====================

/**
 * Generate fallback quiz when FastAPI is unavailable
 */
function generateFallbackQuiz(topic, numQuestions = 5) {
    const questions = [];
    const count = Math.min(parseInt(numQuestions) || 5, 5); // Max 5 fallback questions
    
    for (let i = 0; i < count; i++) {
        questions.push({
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

/**
 * Evaluate fallback quiz when FastAPI is unavailable
 */
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
            explanation: q.explanation
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