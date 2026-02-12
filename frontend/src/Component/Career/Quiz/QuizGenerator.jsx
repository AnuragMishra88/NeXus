// frontend/src/Component/Career/Quiz/QuizGenerator.jsx
import React from 'react';
import './QuizBank.css';

const QuizGenerator = ({ question, questionNumber, selectedAnswer, onAnswerSelect }) => {
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

export default QuizGenerator;