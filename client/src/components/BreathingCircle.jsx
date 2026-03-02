import { useEffect, useState } from 'react';
import { AnimatePresence } from 'framer-motion';
// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';
import { useHaptics } from '../hooks/useHaptics';

export const BreathingCircle = ({ onComplete }) => {
    const { breatheIn, breatheOut } = useHaptics();
    const [phase, setPhase] = useState('inhale'); // 'inhale', 'hold', 'exhale'
    const [timeLeft, setTimeLeft] = useState(60);

    useEffect(() => {
        if (timeLeft <= 0) {
            onComplete();
            return;
        }
        const timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
        return () => clearInterval(timer);
    }, [timeLeft, onComplete]);

    useEffect(() => {
        let timeout;
        if (phase === 'inhale') {
            breatheIn();
            timeout = setTimeout(() => setPhase('hold'), 4000);
        } else if (phase === 'hold') {
            timeout = setTimeout(() => setPhase('exhale'), 2000);
        } else if (phase === 'exhale') {
            breatheOut();
            timeout = setTimeout(() => setPhase('inhale'), 6000);
        }
        return () => clearTimeout(timeout);
    }, [phase, breatheIn, breatheOut]);

    const getCircleScale = () => {
        if (phase === 'inhale') return 1.5;
        if (phase === 'hold') return 1.5;
        return 1;
    };

    const getPhaseText = () => {
        if (phase === 'inhale') return 'Breathe In...';
        if (phase === 'hold') return 'Hold...';
        return 'Breathe Out...';
    };

    return (
        <div className="flex flex-col items-center justify-center flex-1 w-full space-y-16">
            <div className="text-xl text-cyan-200 opacity-80 number-font">{timeLeft}s remaining</div>

            <div className="relative flex items-center justify-center w-64 h-64">
                <motion.div
                    animate={{ scale: getCircleScale() }}
                    transition={{ duration: phase === 'inhale' ? 4 : phase === 'exhale' ? 6 : 2, ease: "easeInOut" }}
                    className="absolute inset-0 rounded-full glow-cyan bg-cyan-900/30"
                />
                {[1, 2, 3].map(i => (
                    <motion.div
                        key={`bc-ring-${i}`}
                        animate={{ scale: phase === 'inhale' ? 1 + (i * 0.2) : 1, opacity: phase === 'exhale' ? 0.8 : 0.3 }}
                        transition={{ duration: phase === 'inhale' ? 4 : phase === 'exhale' ? 6 : 2, delay: i * 0.15, ease: 'easeInOut' }}
                        className="absolute inset-0 rounded-full border border-cyan-500/30 pointer-events-none"
                    />
                ))}
                <AnimatePresence mode="wait">
                    <motion.h2
                        key={phase}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="z-10 text-2xl font-light tracking-widest text-white drop-shadow-lg"
                    >
                        {getPhaseText()}
                    </motion.h2>
                </AnimatePresence>
            </div>
        </div>
    );
};
