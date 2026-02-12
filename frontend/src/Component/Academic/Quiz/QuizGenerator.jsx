// frontend/src/components/QuizBank/QuizGenerator.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import QuizQuestion from './QuizQuestion';
import QuizResults from './QuizResults';
import './QuizBank.css';

const QuizGenerator = () => {
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

    const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

    useEffect(() => {
        fetchSuggestedTopics();
    }, []);

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
                // Initialize empty answers array
                setUserAnswers(new Array(response.data.questions.length).fill(''));
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
        // Check if all questions are answered
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
    };

    const handleTopicSelect = (selectedTopic) => {
        setTopic(selectedTopic);
    };

    return (
        <div className="quiz-generator-container">
            <div className="quiz-header">
                <h2>AI Quiz Generator</h2>
                
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
                                    {suggestedTopics.slice(0, 8).map((topicItem, index) => (
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
                                <label htmlFor="numQuestions">Number of Questions:</label>
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
                        />
                    )}
                </div>
            )}
        </div>
    );
};

export default QuizGenerator;