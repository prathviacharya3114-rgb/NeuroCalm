import React from 'react';
import { useNavigate } from 'react-router-dom';
// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';
import './LandingPage.css';
import ParticleBackground from './ParticleBackground';

export const LandingPage = () => {
    const navigate = useNavigate();

    return (
        <div className="landing-container">
            {/* Optional: We can reuse the awesome ParticleBackground we built earlier, 
                but we'll keep it subtle so the gradient shines through. */}
            <div className="landing-particles">
                <ParticleBackground />
            </div>

            <motion.div
                className="landing-card"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
            >
                <div className="landing-content">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3, duration: 0.8 }}
                    >
                        <h1 className="landing-title">
                            Welcome to Stress Level Detector
                        </h1>
                        <p className="landing-tagline">
                            Understand your stress. Improve your life.
                        </p>
                    </motion.div>

                    <motion.button
                        className="landing-button"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.6, duration: 0.5 }}
                        onClick={() => navigate('/assessment')}
                    >
                        Start Assessment
                    </motion.button>
                </div>
            </motion.div>
        </div>
    );
};
