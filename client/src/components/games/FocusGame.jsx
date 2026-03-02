import React, { useState, useEffect } from 'react';
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from 'framer-motion';

export const FocusGame = ({ onComplete }) => {
    const [timeLeft, setTimeLeft] = useState(60);
    const [score, setScore] = useState(0);
    const [orbs, setOrbs] = useState([]);

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
        const spawnTimer = setInterval(() => {
            if (orbs.length < 5) {
                const newOrb = {
                    id: Math.random().toString(36).substring(2, 9),
                    x: Math.random() * 60 + 20, // 20% to 80% to avoid edges
                    y: Math.random() * 60 + 20,
                    targetX: (Math.random() - 0.5) * 60,
                    targetY: (Math.random() - 0.5) * 60
                };
                setOrbs(prev => [...prev, newOrb]);
            }
        }, 1500);
        return () => clearInterval(spawnTimer);
    }, [orbs]);

    const handleOrbClick = (id) => {
        setOrbs(prev => prev.filter(orb => orb.id !== id));
        setScore(prev => prev + 10);
    };

    return (
        <div className="flex flex-col items-center w-full flex-1 relative overflow-hidden select-none py-12">
            <div className="text-amber-400 text-4xl font-bold tracking-widest z-10 mb-4">
                0:{timeLeft.toString().padStart(2, '0')}
            </div>
            <p className="text-gray-400 tracking-wider text-sm z-10">GENTLY TAP THE ORBS</p>
            <p className="text-amber-500 font-mono text-xl z-10 mt-2">Calmness Score: {score}</p>

            <div className="absolute inset-0 w-full h-full mt-32">
                <AnimatePresence>
                    {orbs.map(orb => (
                        <motion.div
                            key={orb.id}
                            initial={{ opacity: 0, scale: 0 }}
                            animate={{
                                opacity: 1,
                                scale: [1, 1.2, 1],
                                x: [0, orb.targetX, 0],
                                y: [0, orb.targetY, 0]
                            }}
                            exit={{ opacity: 0, scale: 0 }}
                            transition={{
                                scale: { repeat: Infinity, duration: 3 },
                                x: { repeat: Infinity, duration: 4, ease: "easeInOut" },
                                y: { repeat: Infinity, duration: 5, ease: "easeInOut" }
                            }}
                            onPointerDown={() => handleOrbClick(orb.id)}
                            className="absolute w-20 h-20 rounded-full bg-amber-500/20 border border-amber-400/50 glow-amber flex items-center justify-center cursor-pointer"
                            style={{ left: `${orb.x}%`, top: `${orb.y}%` }}
                        >
                            <div className="w-10 h-10 rounded-full bg-amber-400 opacity-50 blur-md pointer-events-none"></div>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>
        </div>
    );
};
