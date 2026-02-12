// frontend/src/Component/Career/Quiz/SkillAssessment.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../../../Api/AuthContext';
import QuizGenerator from './QuizGenerator';
import QuizResults from './QuizResults';
import './QuizBank.css';

const SkillAssessment = ({ setActivePage }) => {
    const { user } = useAuth();
    const [topic, setTopic] = useState('');
    const [numQuestions, setNumQuestions] = useState(5);
    const [difficulty, setDifficulty] = useState('medium');
    const [suggestedSkills, setSuggestedSkills] = useState([]);
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
        setActivePage('skill-assessment');
        fetchSuggestedSkills();
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

    const fetchSuggestedSkills = async () => {
        try {
            const response = await axios.get(`${API_URL}/quiz/topics`);
            if (response.data.success) {
                setSuggestedSkills(response.data.topics);
            }
        } catch (error) {
            console.error('Error fetching skills:', error);
        }
    };

    const handleGenerateQuiz = async (e) => {
        e.preventDefault();
        if (!topic.trim()) {
            setError('Please select a skill to assess');
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
                setError('Failed to generate assessment');
            }
        } catch (error) {
            console.error('Quiz generation error:', error);
            setError(error.response?.data?.message || 'Failed to generate assessment');
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
                setError('Failed to evaluate assessment');
            }
        } catch (error) {
            console.error('Quiz evaluation error:', error);
            setError(error.response?.data?.message || 'Failed to evaluate assessment');
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

    const handleSkillSelect = (selectedSkill) => {
        setTopic(selectedSkill);
    };

    return (
        <div className="skill-assessment-container">
            <div className="assessment-header">
                <h2>🎯 Skill Assessment</h2>
                <p className="assessment-subtitle">
                    Test your knowledge and get certified in various technical skills
                    {fastapiStatus === 'fallback' && (
                        <span className="fallback-badge">⚡ Practice Mode</span>
                    )}
                </p>
            </div>

            {!quiz ? (
                <div className="assessment-setup">
                    <form onSubmit={handleGenerateQuiz} className="assessment-form">
                        <div className="form-group">
                            <label htmlFor="topic">Select Skill to Assess:</label>
                            <input
                                type="text"
                                id="topic"
                                value={topic}
                                onChange={(e) => setTopic(e.target.value)}
                                placeholder="e.g., Python, React, Machine Learning"
                                className="topic-input"
                                autoComplete="off"
                            />
                        </div>

                        {suggestedSkills.length > 0 && (
                            <div className="suggested-skills">
                                <label>Popular Skills:</label>
                                <div className="skill-chips">
                                    {suggestedSkills.slice(0, 12).map((skill, index) => (
                                        <button
                                            key={index}
                                            type="button"
                                            className="skill-chip"
                                            onClick={() => handleSkillSelect(skill)}
                                        >
                                            {skill}
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
                                    <option value="easy">Beginner</option>
                                    <option value="medium">Intermediate</option>
                                    <option value="hard">Advanced</option>
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
                                <span className="loading-spinner">⏳ Generating Assessment...</span>
                            ) : (
                                <span>🎯 Start Assessment</span>
                            )}
                        </button>
                    </form>
                </div>
            ) : (
                <div className="assessment-active">
                    {!quizSubmitted ? (
                        <>
                            <div className="assessment-progress">
                                <h3>{quiz.topic} - Skill Assessment</h3>
                                {quiz.is_fallback && (
                                    <span className="fallback-indicator">⚡ Practice Mode</span>
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

                            <QuizGenerator
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
                                        {loading ? 'Submitting...' : '📤 Submit Assessment'}
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
                                ↻ Cancel Assessment
                            </button>
                        </>
                    ) : (
                        <QuizResults 
                            results={results} 
                            questions={quiz.questions}
                            userAnswers={userAnswers}
                            onRetry={handleReset}
                            topic={quiz.topic}
                            assessmentMode={true}
                        />
                    )}
                </div>
            )}
        </div>
    );
};

export default SkillAssessment;