import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useTapRhythm } from '../hooks/useTapRhythm';
import { useAccelerometer } from '../hooks/useAccelerometer';
import { useLightSensor } from '../hooks/useLightSensor';

export const TapZone = ({ onAnalysisComplete }) => {
    const { tapSpeed, tapCount, isTracking, startTracking, stopTracking, handleTap } = useTapRhythm();
    const { rms } = useAccelerometer();
    const { lux } = useLightSensor();
    const [timeLeft, setTimeLeft] = useState(5);

    useEffect(() => {
        let timer;
        if (isTracking && timeLeft > 0) {
            timer = setTimeout(() => setTimeLeft(prev => prev - 1), 1000);
        } else if (isTracking && timeLeft === 0) {
            stopTracking();
            onAnalysisComplete({ tapSpeed });
        }
        return () => clearTimeout(timer);
    }, [isTracking, timeLeft, onAnalysisComplete, tapSpeed, stopTracking]);

    const getGlowColor = () => {
        if (tapSpeed > 4) return 'glow-red bg-red-900/40 text-red-500';
        if (tapSpeed > 2.5) return 'glow-amber bg-amber-900/40 text-amber-500';
        return 'glow-cyan bg-cyan-900/40 text-cyan-500';
    };

    return (
        <div className="relative flex flex-col items-center justify-center flex-1 w-full p-4 select-none">
            {/* Background Sensor Overlay */}
            <div className="absolute top-6 left-6 text-xs font-mono text-cyan-500/30 whitespace-nowrap z-0">
                <div className="animate-pulse">SYS.SENSORS_ACTIVE</div>
                <div>ACC_RMS: {rms ? rms.toFixed(2) : '0.00'} g</div>
                <div>AMB_LUM: {lux ? lux.toFixed(0) : '---'} lx</div>
            </div>

            <h2 className="z-10 text-xl mb-12 text-gray-300">
                {!isTracking ? "Tap gently to start" : `Analyzing: ${timeLeft}s`}
            </h2>

            <motion.div
                whileTap={{ scale: 0.95 }}
                onPointerDown={() => {
                    if (!isTracking && timeLeft === 5) startTracking();
                    handleTap();
                }}
                animate={{ scale: isTracking ? [1, 1.02, 1] : 1 }}
                transition={{ duration: 0.3 }}
                className={`z-10 w-64 h-64 rounded-full flex flex-col items-center justify-center cursor-pointer transition-colors duration-300 relative ${isTracking ? getGlowColor() : 'glow-violet bg-violet-900/30'}`}
            >
                {/* Secondary expanding rings */}
                {isTracking && [1, 2, 3].map(i => (
                    <motion.div
                        key={`ring-${i}`}
                        className="absolute inset-0 rounded-full border border-current opacity-20 pointer-events-none"
                        animate={{ scale: [1, 1 + (tapSpeed * 0.1 * i)], opacity: [0.5, 0] }}
                        transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.2 }}
                    />
                ))}

                {isTracking ? (
                    <>
                        <span className="text-4xl font-bold number-font mb-2">{tapSpeed.toFixed(1)}</span>
                        <span className="text-sm opacity-70 tracking-widest">TAPS/SEC</span>
                    </>
                ) : (
                    <span className="text-center px-8 text-lg font-medium tracking-wide">Hold & tap to let us feel your stress</span>
                )}
            </motion.div>

            {isTracking && (
                <div className="z-10 mt-12 text-gray-400">
                    <span className="number-font">{tapCount}</span> total taps
                </div>
            )}
        </div>
    );
};
