import React, { useState, useEffect } from 'react';
// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';

export const BreathingGame = ({ onComplete }) => {
    const [timeLeft, setTimeLeft] = useState(60);
    const [phase, setPhase] = useState('inhale'); // inhale, exhale
    const [score, setScore] = useState(0);
    const [isHolding, setIsHolding] = useState(false);

    useEffect(() => {
        if (timeLeft <= 0) {
            onComplete({ gameScore: score });
            return;
        }
        const timer = setInterval(() => {
            setTimeLeft((prev) => prev - 1);
        }, 1000);
        return () => clearInterval(timer);
    }, [timeLeft, onComplete, score]);

    useEffect(() => {
        // Breathing cycle: 5s inhale, 5s exhale
        const cycle = setInterval(() => {
            setPhase((prev) => prev === 'inhale' ? 'exhale' : 'inhale');
        }, 5000);
        return () => clearInterval(cycle);
    }, []);

    useEffect(() => {
        let scoreTimer;
        if (isHolding) {
            scoreTimer = setInterval(() => {
                setScore((prev) => prev + 1);
            }, 100);
        }
        return () => clearInterval(scoreTimer);
    }, [isHolding]);

    const handlePointerDown = () => setIsHolding(true);
    const handlePointerUp = () => setIsHolding(false);

    return (
        <div className="flex flex-col items-center justify-center flex-1 w-full space-y-8 select-none"
            onPointerDown={handlePointerDown}
            onPointerUp={handlePointerUp}
            onPointerLeave={handlePointerUp}>
            <div className="text-cyan-400 text-4xl font-bold tracking-widest mb-4">
                0:{timeLeft.toString().padStart(2, '0')}
            </div>

            <motion.div
                animate={{
                    scale: phase === 'inhale' ? 1.5 : 0.8,
                    opacity: phase === 'inhale' ? 1 : 0.6
                }}
                transition={{ duration: 5, ease: "easeInOut" }}
                className="w-48 h-48 rounded-full bg-cyan-500/20 glow-cyan flex items-center justify-center border-2 border-cyan-400/50 relative"
            >
                <motion.div
                    animate={{ scale: isHolding ? 1.1 : 1 }}
                    className={`absolute w-full h-full rounded-full transition-colors duration-300 ${isHolding ? 'bg-cyan-400/30' : 'bg-transparent'}`}
                />
                <h2 className="text-2xl tracking-widest text-cyan-100 z-10 transition-transform font-bold">
                    {phase === 'inhale' ? 'INHALE' : 'EXHALE'}
                </h2>
            </motion.div>

            <div className="flex flex-col items-center space-y-2 pt-12">
                <p className="text-gray-400 tracking-wider text-sm transition-opacity duration-300" style={{ opacity: isHolding ? 0.5 : 1 }}>
                    PRESS AND HOLD TO SYNC
                </p>
                <p className="text-cyan-500 font-mono text-xl">Focus Score: {score}</p>
            </div>
        </div>
    );
};
