import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

export const Home = () => {
    const navigate = useNavigate();

    const particles = Array.from({ length: 40 }).map((_, i) => ({
        id: i,
        size: Math.random() * 4 + 1,
        x: Math.random() * 100,
        y: Math.random() * 100,
        duration: Math.random() * 20 + 10,
        delay: Math.random() * 5
    }));

    return (
        <div className="relative flex flex-col items-center justify-center min-h-screen p-6 overflow-hidden bg-gradient-to-b from-navy-900 to-black">
            {/* Background Particles/Noise Mock */}
            <div className="absolute inset-0 z-0 opacity-20" style={{ backgroundImage: 'radial-gradient(circle at center, #00F5FF 0%, transparent 80%)', filter: 'blur(100px)' }} />

            <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
                {particles.map(p => (
                    <motion.div
                        key={p.id}
                        className="absolute bg-cyan-400 rounded-full glow-cyan"
                        style={{ width: p.size, height: p.size, top: `${p.y}%`, left: `${p.x}%` }}
                        animate={{ y: [0, -100, 0], opacity: [0.1, 0.5, 0.1] }}
                        transition={{ duration: p.duration, repeat: Infinity, delay: p.delay, ease: "linear" }}
                    />
                ))}
            </div>

            <motion.div
                initial={{ y: -50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 1, ease: 'easeOut' }}
                className="z-10 flex flex-col items-center text-center space-y-8"
            >
                <div
                    className="text-6xl md:text-8xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-violet-500 animate-glitch"
                    data-text="NeuroCalm"
                >
                    NeuroCalm
                </div>

                <p className="max-w-md text-lg text-gray-300 font-light tracking-wide leading-relaxed">
                    Your silent stress shield. No forms. No journals. Just breathe.
                </p>

                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => navigate('/intervention')}
                    className="px-10 py-4 mt-12 text-lg font-bold tracking-widest text-[#050B18] transition-all rounded-full bg-cyan-400 glow-cyan hover:bg-cyan-300"
                >
                    [TAP TO BEGIN]
                </motion.button>
            </motion.div>
        </div>
    );
};
