// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';

export const StressOrb = ({ stressLevel }) => {
    const getOrbStyles = () => {
        switch (stressLevel) {
            case 'CRITICAL': return { color: 'glow-red', text: 'Let\'s Reset Now 🆘' };
            case 'HIGH': return { color: 'glow-orange', text: 'Stress Detected 🌩' };
            case 'MEDIUM': return { color: 'glow-amber', text: 'A Little Tense 🌤' };
            default: return { color: 'glow-cyan', text: 'You\'re Calm 🌊' };
        }
    };

    const { color, text } = getOrbStyles();

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center justify-center space-y-6"
        >
            <motion.div
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
                className={`w-48 h-48 rounded-full ${color} bg-black/20 flex items-center justify-center`}
            >
                <div className={`w-32 h-32 rounded-full ${color} opacity-70 blur-md`}></div>
            </motion.div>
            <h2 className="text-2xl font-bold tracking-wider">{text}</h2>
        </motion.div>
    );
};
