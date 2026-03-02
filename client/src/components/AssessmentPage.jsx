import React, { useState } from 'react';
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import './AssessmentPage.css';

const QUESTIONS = [
    "How often have you felt overwhelmed lately?",
    "How frequently do you have trouble sleeping?",
    "How often do you feel anxious without a clear reason?",
    "How difficult is it for you to relax?",
    "How often do you feel emotionally drained?"
];

const OPTIONS = [
    { label: "Rarely", emoji: "😌", score: 1 },
    { label: "Sometimes", emoji: "🙂", score: 2 },
    { label: "Often", emoji: "😟", score: 3 },
    { label: "Always", emoji: "😰", score: 4 }
];

export const AssessmentPage = () => {
    const navigate = useNavigate();
    const [currentStep, setCurrentStep] = useState(0);
    const [answers, setAnswers] = useState([]);
    const [isFinished, setIsFinished] = useState(false);

    const handleOptionClick = (score) => {
        const newAnswers = [...answers, score];
        setAnswers(newAnswers);

        if (currentStep < QUESTIONS.length - 1) {
            setCurrentStep(prev => prev + 1);
        } else {
            setIsFinished(true);
        }
    };

    const calculateResult = () => {
        if (answers.length === 0) return { percent: 0, level: 'Low', message: "You're doing great!" };
        const totalScore = answers.reduce((a, b) => a + b, 0);
        const maxScore = QUESTIONS.length * 4;
        const minScore = QUESTIONS.length * 1;

        // Normalize to 0-100%
        const normalizedScore = ((totalScore - minScore) / (maxScore - minScore)) * 100;
        const percent = Math.round(normalizedScore);

        let level = 'Low';
        let message = "You're mostly relaxed. Keep up the good work!";
        let color = '#4caf50'; // Green

        if (percent >= 66) {
            level = 'High';
            message = "Your stress levels are elevated. It might be time to take a break.";
            color = '#f44336'; // Red
        } else if (percent >= 33) {
            level = 'Medium';
            message = "You have some stress. Remember to take time for yourself.";
            color = '#ff9800'; // Orange
        }

        return { percent, level, message, color };
    };

    const result = isFinished ? calculateResult() : null;

    const navAnimation = {
        initial: { opacity: 0, x: 50 },
        animate: { opacity: 1, x: 0 },
        exit: { opacity: 0, x: -50 },
        transition: { duration: 0.4 }
    };

    return (
        <div className="assessment-container">
            <div className="assessment-card">
                {!isFinished ? (
                    <>
                        <div className="progress-container">
                            <div className="progress-text">Step {currentStep + 1} of {QUESTIONS.length}</div>
                            <div className="progress-bar-bg">
                                <motion.div
                                    className="progress-bar-fill"
                                    initial={{ width: `${(currentStep / QUESTIONS.length) * 100}%` }}
                                    animate={{ width: `${((currentStep + 1) / QUESTIONS.length) * 100}%` }}
                                    transition={{ duration: 0.3 }}
                                />
                            </div>
                        </div>

                        <div className="question-wrapper">
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={currentStep}
                                    {...navAnimation}
                                >
                                    <h2 className="question-text">{QUESTIONS[currentStep]}</h2>

                                    <div className="options-grid">
                                        {OPTIONS.map((opt, idx) => (
                                            <motion.button
                                                key={idx}
                                                className="option-btn"
                                                whileHover={{ scale: 1.02 }}
                                                whileTap={{ scale: 0.98 }}
                                                onClick={() => handleOptionClick(opt.score)}
                                            >
                                                <span className="option-emoji">{opt.emoji}</span>
                                                <span className="option-label">{opt.label}</span>
                                            </motion.button>
                                        ))}
                                    </div>
                                </motion.div>
                            </AnimatePresence>
                        </div>
                    </>
                ) : (
                    <motion.div
                        className="result-wrapper"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5 }}
                    >
                        <h2 className="result-title">Your Assessment</h2>

                        <div className="meter-container">
                            <svg className="circular-meter" viewBox="0 0 100 100">
                                <circle
                                    className="meter-bg"
                                    cx="50" cy="50" r="40"
                                />
                                <motion.circle
                                    className="meter-fill"
                                    cx="50" cy="50" r="40"
                                    stroke={result.color}
                                    initial={{ strokeDashoffset: 251.2 }} // 2 * pi * 40
                                    animate={{ strokeDashoffset: 251.2 - (251.2 * result.percent / 100) }}
                                    transition={{ duration: 1.5, ease: "easeOut" }}
                                />
                            </svg>
                            <div className="meter-text">
                                <span className="meter-percent">{result.percent}%</span>
                                <span className="meter-label">Stress</span>
                            </div>
                        </div>

                        <div className="result-info">
                            <h3 style={{ color: result.color }}>{result.level} Stress</h3>
                            <p>{result.message}</p>
                        </div>

                        <motion.button
                            className="tips-btn"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => navigate('/intervention')}
                        >
                            Start Intervention
                        </motion.button>
                    </motion.div>
                )}
            </div>
        </div>
    );
};
