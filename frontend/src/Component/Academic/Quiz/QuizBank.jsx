// frontend/src/Component/Career/QuizBank.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../../../Api/AuthContext';
import './QuizBank.css';

const QuizBank = ({ setActivePage }) => {
    const { user } = useAuth();
    const [topic, setTopic] = useState('');
    const [numQuestions, setNumQuestions] = useState(5);
    const [difficulty, setDifficulty] = useState('medium');
    const [suggestedTopics, setSuggestedTopics] = useState([]);
    const [loading, setLoading] = useState(false);
    const [quiz, setQuiz] = useState(null);
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [userAnswers, setUserAnswers] = useState([]);
    const [quizSubmitted, setQuizSubmitted] = useState(false);
    const [results, setResults] = useState(null);
    const [error, setError] = useState('');
    const [fastapiStatus, setFastapiStatus] = useState('checking');

    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1';

    useEffect(() => {
        setActivePage('quiz');
        fetchSuggestedTopics();
        checkFastAPIHealth();
    }, []);

    const checkFastAPIHealth = async () => {
        try {
            const response = await axios.get(`${API_URL}/quiz/health`);
            if (response.data.status === 'connected') {
                setFastapiStatus('connected');
                console.log('✅ FastAPI quiz service connected');
            } else {
                setFastapiStatus('fallback');
                console.log('⚠️ Using fallback quiz mode');
            }
        } catch (error) {
            setFastapiStatus('fallback');
            console.log('⚠️ Using fallback quiz mode');
        }
    };

    const fetchSuggestedTopics = async () => {
        try {
            const response = await axios.get(`${API_URL}/quiz/topics`);
            if (response.data.success) {
                setSuggestedTopics(response.data.topics);
            }
        } catch (error) {
            console.error('Error fetching topics:', error);
        }
    };

    const handleGenerateQuiz = async (e) => {
        e.preventDefault();
        if (!topic.trim()) {
            setError('Please enter a topic');
            return;
        }

        setLoading(true);
        setError('');
        setQuiz(null);
        setQuizSubmitted(false);
        setResults(null);
        setCurrentQuestion(0);
        setUserAnswers([]);

        try {
            const response = await axios.post(`${API_URL}/quiz/generate`, {
                topic: topic.trim(),
                num_questions: numQuestions,
                difficulty
            });

            if (response.data.success) {
                setQuiz(response.data);
                setUserAnswers(new Array(response.data.questions.length).fill(''));
                if (response.data.is_fallback) {
                    setFastapiStatus('fallback');
                }
            } else {
                setError('Failed to generate quiz');
            }
        } catch (error) {
            console.error('Quiz generation error:', error);
            setError(error.response?.data?.message || 'Failed to generate quiz');
        } finally {
            setLoading(false);
        }
    };

    const handleAnswerSelect = (answer) => {
        const updatedAnswers = [...userAnswers];
        updatedAnswers[currentQuestion] = answer;
        setUserAnswers(updatedAnswers);
    };

    const handleNext = () => {
        if (currentQuestion < quiz.questions.length - 1) {
            setCurrentQuestion(currentQuestion + 1);
        }
    };

    const handlePrevious = () => {
        if (currentQuestion > 0) {
            setCurrentQuestion(currentQuestion - 1);
        }
    };

    const handleSubmitQuiz = async () => {
        if (userAnswers.some(answer => answer === '')) {
            setError('Please answer all questions before submitting');
            return;
        }

        setLoading(true);
        setError('');

        try {
            const response = await axios.post(`${API_URL}/quiz/evaluate`, {
                questions: quiz.questions,
                answers: userAnswers
            });

            if (response.data.success) {
                setResults(response.data);
                setQuizSubmitted(true);
            } else {
                setError('Failed to evaluate quiz');
            }
        } catch (error) {
            console.error('Quiz evaluation error:', error);
            setError(error.response?.data?.message || 'Failed to evaluate quiz');
        } finally {
            setLoading(false);
        }
    };

    const handleReset = () => {
        setQuiz(null);
        setUserAnswers([]);
        setCurrentQuestion(0);
        setQuizSubmitted(false);
        setResults(null);
        setError('');
        setTopic('');
        setNumQuestions(5);
        setDifficulty('medium');
    };

    const handleTopicSelect = (selectedTopic) => {
        setTopic(selectedTopic);
    };

    return (
        <div className="quiz-bank-container">
            <div className="quiz-header">
                <h2>📝 AI Quiz Generator</h2>
                <p className="quiz-subtitle">
                    Generate custom quizzes on any topic using Groq AI
                    {fastapiStatus === 'fallback' && (
                        <span className="fallback-badge">⚡ Fallback Mode Active</span>
                    )}
                </p>
            </div>

            {!quiz ? (
                <div className="quiz-setup">
                    <form onSubmit={handleGenerateQuiz} className="quiz-form">
                        <div className="form-group">
                            <label htmlFor="topic">Enter Topic:</label>
                            <input
                                type="text"
                                id="topic"
                                value={topic}
                                onChange={(e) => setTopic(e.target.value)}
                                placeholder="e.g., Python, Machine Learning, React.js"
                                className="topic-input"
                                autoComplete="off"
                            />
                        </div>

                        {suggestedTopics.length > 0 && (
                            <div className="suggested-topics">
                                <label>Suggested Topics:</label>
                                <div className="topic-chips">
                                    {suggestedTopics.slice(0, 10).map((topicItem, index) => (
                                        <button
                                            key={index}
                                            type="button"
                                            className="topic-chip"
                                            onClick={() => handleTopicSelect(topicItem)}
                                        >
                                            {topicItem}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        <div className="form-row">
                            <div className="form-group">
                                <label>Number of Questions:</label>
                                <div className="button-group">
                                    {[5, 10, 20, 30].map((num) => (
                                        <button
                                            key={num}
                                            type="button"
                                            className={`num-btn ${numQuestions === num ? 'active' : ''}`}
                                            onClick={() => setNumQuestions(num)}
                                        >
                                            {num}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="form-group">
                                <label htmlFor="difficulty">Difficulty Level:</label>
                                <select
                                    id="difficulty"
                                    value={difficulty}
                                    onChange={(e) => setDifficulty(e.target.value)}
                                    className="difficulty-select"
                                >
                                    <option value="easy">Easy</option>
                                    <option value="medium">Medium</option>
                                    <option value="hard">Hard</option>
                                </select>
                            </div>
                        </div>

                        {error && <div className="error-message">{error}</div>}

                        <button 
                            type="submit" 
                            className="generate-btn"
                            disabled={loading}
                        >
                            {loading ? (
                                <span className="loading-spinner">⏳ Generating Quiz...</span>
                            ) : (
                                <span>🎯 Generate Quiz</span>
                            )}
                        </button>
                    </form>
                </div>
            ) : (
                <div className="quiz-active">
                    {!quizSubmitted ? (
                        <>
                            <div className="quiz-progress">
                                <h3>{quiz.topic}</h3>
                                {quiz.is_fallback && (
                                    <span className="fallback-indicator">⚡ Fallback Quiz</span>
                                )}
                                <div className="progress-bar">
                                    <div 
                                        className="progress-fill" 
                                        style={{ width: `${((currentQuestion + 1) / quiz.questions.length) * 100}%` }}
                                    ></div>
                                </div>
                                <p className="question-counter">
                                    Question {currentQuestion + 1} of {quiz.questions.length}
                                </p>
                            </div>

                            <QuizQuestion
                                question={quiz.questions[currentQuestion]}
                                questionNumber={currentQuestion + 1}
                                selectedAnswer={userAnswers[currentQuestion]}
                                onAnswerSelect={handleAnswerSelect}
                            />

                            <div className="quiz-navigation">
                                <button 
                                    onClick={handlePrevious}
                                    disabled={currentQuestion === 0}
                                    className="nav-btn"
                                >
                                    ← Previous
                                </button>
                                
                                {currentQuestion === quiz.questions.length - 1 ? (
                                    <button 
                                        onClick={handleSubmitQuiz}
                                        className="submit-btn"
                                        disabled={loading}
                                    >
                                        {loading ? 'Submitting...' : '📤 Submit Quiz'}
                                    </button>
                                ) : (
                                    <button 
                                        onClick={handleNext}
                                        className="nav-btn"
                                    >
                                        Next →
                                    </button>
                                )}
                            </div>

                            <button onClick={handleReset} className="reset-btn">
                                ↻ Start Over
                            </button>
                        </>
                    ) : (
                        <QuizResults 
                            results={results} 
                            questions={quiz.questions}
                            userAnswers={userAnswers}
                            onRetry={handleReset}
                            topic={quiz.topic}
                        />
                    )}
                </div>
            )}
        </div>
    );
};

// Quiz Question Component
const QuizQuestion = ({ question, questionNumber, selectedAnswer, onAnswerSelect }) => {
    const options = question.options || [];
    const optionLabels = ['A', 'B', 'C', 'D'];

    return (
        <div className="quiz-question-container">
            <div className="question-header">
                <span className="question-badge">Question {questionNumber}</span>
            </div>
            
            <div className="question-text">
                <p>{question.question}</p>
            </div>

            <div className="options-container">
                {options.map((option, index) => (
                    <div 
                        key={index}
                        className={`option-item ${selectedAnswer === option ? 'selected' : ''}`}
                        onClick={() => onAnswerSelect(option)}
                    >
                        <span className="option-label">{optionLabels[index]}</span>
                        <span className="option-text">{option}</span>
                        {selectedAnswer === option && (
                            <span className="check-mark">✓</span>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

// Quiz Results Component
const QuizResults = ({ results, questions, userAnswers, onRetry, topic }) => {
    const { score, total, percentage, detailed_results } = results;

    const getScoreColor = () => {
        if (percentage >= 80) return 'excellent';
        if (percentage >= 60) return 'good';
        if (percentage >= 40) return 'average';
        return 'needs-improvement';
    };

    return (
        <div className="quiz-results-container">
            <div className="results-header">
                <h3>🎉 Quiz Completed!</h3>
                <p className="results-topic">Topic: {topic}</p>
                <div className={`score-circle ${getScoreColor()}`}>
                    <span className="score-percentage">{percentage}%</span>
                    <span className="score-fraction">{score}/{total}</span>
                </div>
            </div>

            <div className="results-summary">
                <div className="summary-stats">
                    <div className="stat-item">
                        <span className="stat-label">Correct Answers:</span>
                        <span className="stat-value correct">{score}</span>
                    </div>
                    <div className="stat-item">
                        <span className="stat-label">Incorrect Answers:</span>
                        <span className="stat-value incorrect">{total - score}</span>
                    </div>
                    <div className="stat-item">
                        <span className="stat-label">Accuracy:</span>
                        <span className="stat-value">{percentage}%</span>
                    </div>
                </div>
            </div>

            <div className="detailed-results">
                <h4>📋 Detailed Review</h4>
                {detailed_results.map((result, index) => (
                    <div 
                        key={index} 
                        className={`result-card ${result.is_correct ? 'correct' : 'incorrect'}`}
                    >
                        <div className="result-question">
                            <span className="question-num">Q{result.question_num}.</span>
                            <span className="question-text">{result.question}</span>
                            <span className="result-badge">
                                {result.is_correct ? '✓ Correct' : '✗ Incorrect'}
                            </span>
                        </div>
                        
                        <div className="result-answers">
                            <div className="user-answer">
                                <strong>Your answer:</strong> 
                                <span className={result.is_correct ? 'answer-correct' : 'answer-incorrect'}>
                                    {result.user_answer || 'Not answered'}
                                </span>
                            </div>
                            
                            {!result.is_correct && (
                                <div className="correct-answer">
                                    <strong>Correct answer:</strong> 
                                    <span className="answer-correct">{result.correct_answer}</span>
                                </div>
                            )}
                        </div>
                        
                        <div className="answer-explanation">
                            <strong>📝 Explanation:</strong>
                            <p>{result.explanation}</p>
                        </div>
                    </div>
                ))}
            </div>

            <div className="results-actions">
                <button onClick={onRetry} className="retry-btn">
                    🔄 Generate New Quiz
                </button>
            </div>
        </div>
    );
};

export default QuizBank;