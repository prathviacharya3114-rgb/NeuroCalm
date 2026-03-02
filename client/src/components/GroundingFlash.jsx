import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const MAPPING = [
    { count: 5, sense: "SEE 👁", color: "from-cyan-900/40 to-blue-900/40" },
    { count: 4, sense: "FEEL ✋", color: "from-violet-900/40 to-fuchsia-900/40" },
    { count: 3, sense: "HEAR 👂", color: "from-amber-900/40 to-orange-900/40" },
    { count: 2, sense: "SMELL 👃", color: "from-emerald-900/40 to-teal-900/40" },
    { count: 1, sense: "TASTE 👅", color: "from-rose-900/40 to-pink-900/40" }
];

export const GroundingFlash = ({ onComplete }) => {
    const [step, setStep] = useState(0);

    const handleNext = () => {
        if (step < MAPPING.length - 1) {
            setStep(prev => prev + 1);
        } else {
            onComplete();
        }
    };

    const current = MAPPING[step];

    return (
        <div
            onClick={handleNext}
            className={`absolute inset-0 flex flex-col items-center justify-center cursor-pointer select-none bg-gradient-to-br ${current.color} transition-colors duration-1000 z-50`}
        >
            <AnimatePresence mode="wait">
                <motion.div
                    key={step}
                    initial={{ opacity: 0, scale: 0.9, filter: "blur(10px)" }}
                    animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                    exit={{ opacity: 0, scale: 1.1, filter: "blur(10px)" }}
                    transition={{ duration: 0.8 }}
                    className="flex flex-col items-center space-y-8"
                >
                    <div className="text-6xl font-bold number-font opacity-80">{current.count}</div>
                    <h2 className="text-3xl font-light tracking-wide text-center px-4">
                        things you can <span className="font-bold">{current.sense}</span>
                    </h2>
                    <div className="mt-12 text-sm uppercase tracking-widest opacity-50 animate-pulse">
                        Tap anywhere to continue
                    </div>
                </motion.div>
            </AnimatePresence>

            <div className="absolute bottom-12 flex space-x-4 z-50">
                {MAPPING.map((_, i) => (
                    <motion.div
                        key={`dot-${i}`}
                        animate={{
                            scale: i === step ? 1.5 : 1,
                            opacity: i === step ? 1 : 0.3,
                            backgroundColor: i === step ? "#00F5FF" : "#ffffff"
                        }}
                        className="w-2 h-2 rounded-full"
                    />
                ))}
            </div>
        </div>
    );
};
