// frontend/src/Component/Career/Quiz/QuizResults.jsx
import React from 'react';
import './QuizBank.css';

const QuizResults = ({ results, questions, userAnswers, onRetry, topic, assessmentMode = false }) => {
    const { score, total, percentage, detailed_results } = results;

    const getScoreColor = () => {
        if (percentage >= 80) return 'excellent';
        if (percentage >= 60) return 'good';
        if (percentage >= 40) return 'average';
        return 'needs-improvement';
    };

    const getSkillLevel = () => {
        if (percentage >= 80) return 'Expert';
        if (percentage >= 60) return 'Intermediate';
        if (percentage >= 40) return 'Beginner';
        return 'Needs Improvement';
    };

    return (
        <div className="quiz-results-container">
            <div className="results-header">
                <h3>{assessmentMode ? '🎯 Assessment Complete!' : '🎉 Quiz Completed!'}</h3>
                <p className="results-topic">Skill: {topic}</p>
                {assessmentMode && (
                    <p className="skill-level">Level: <strong>{getSkillLevel()}</strong></p>
                )}
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
                    🔄 New Assessment
                </button>
                {assessmentMode && percentage >= 60 && (
                    <button className="certificate-btn">
                        🎓 Download Certificate
                    </button>
                )}
            </div>
        </div>
    );
};

export default QuizResults;