import { useState, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
// eslint-disable-next-line no-unused-vars
import { AnimatePresence, motion } from 'framer-motion';
import { SensorMonitor } from '../components/SensorMonitor';
import { TapZone } from '../components/TapZone';
import { StressOrb } from '../components/StressOrb';
import { BreathingGame } from '../components/games/BreathingGame';
import { FocusGame } from '../components/games/FocusGame';
import { analyzeStress, saveSession } from '../api/neurocalm';
import { useAccelerometer } from '../hooks/useAccelerometer';

export const InterventionPage = () => {
    const navigate = useNavigate();
    const { isSupported, permissionGranted, requestPermission } = useAccelerometer();
    const [step, setStep] = useState('permission_check'); // permission_check, permission, tap, analyzing, result, intervention, done
    const [sensorData, setSensorData] = useState({});
    const [analysisResult, setAnalysisResult] = useState(null);

    const handleSensorData = useCallback((data) => {
        setSensorData(data);
    }, []);

    useEffect(() => {
        if (step === 'permission_check') {
            // Check if iOS by looking for the requestPermission function
            if (isSupported && !permissionGranted && typeof DeviceMotionEvent !== 'undefined' && typeof DeviceMotionEvent.requestPermission === 'function') {
                // eslint-disable-next-line react-hooks/set-state-in-effect
                setStep('permission');
            } else {
                // eslint-disable-next-line react-hooks/set-state-in-effect
                setStep('tap');
            }
        }
    }, [step, isSupported, permissionGranted]);

    const handleAnalysisComplete = async ({ tapSpeed }) => {
        setStep('analyzing');
        try {
            const payload = { ...sensorData, tapSpeed };
            const result = await analyzeStress(payload);
            setAnalysisResult(result);
            setStep('result');

            setTimeout(() => {
                if (result.stressLevel === 'LOW') {
                    handleInterventionComplete(result, 0); // Skip intervention
                } else {
                    setStep('intervention');
                }
            }, 3000); // show orb for 3s
        } catch (err) {
            console.error(err);
            navigate('/');
        }
    };

    const handleInterventionComplete = async (resultOverride, duration = 60) => {
        const finalResult = resultOverride || analysisResult;
        try {
            await saveSession({
                sessionId: crypto.randomUUID(),
                stressLevel: finalResult.stressLevel,
                stressScore: finalResult.stressScore,
                triggers: sensorData,
                interventionType: finalResult.interventionType,
                interventionDuration: duration,
                completedIntervention: true,
                gameScore: resultOverride?.gameScore || 0
            });
            setStep('done');
            setTimeout(() => navigate('/dashboard'), 2000);
        } catch (err) {
            console.error("Failed to save session", err);
            // Optional offline resilience via localStorage
            const offlineSessions = JSON.parse(localStorage.getItem('offlineSessions') || '[]');
            offlineSessions.push({ ...finalResult, timestamp: new Date() });
            localStorage.setItem('offlineSessions', JSON.stringify(offlineSessions));
            setStep('done');
            setTimeout(() => navigate('/dashboard'), 2000);
        }
    };

    return (
        <div className="relative flex flex-col items-center min-h-screen bg-[#050B18]">
            <SensorMonitor onSensorData={handleSensorData} permissionRequested={true} />

            <AnimatePresence mode="wait">
                {step === 'permission' && (
                    <motion.div key="permission" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col items-center justify-center flex-1 w-full space-y-8 px-6 text-center">
                        <div className="w-20 h-20 rounded-full bg-cyan-900/30 flex items-center justify-center text-4xl glow-cyan mb-4">📱</div>
                        <h2 className="text-2xl tracking-wide text-white">Motion Access Required</h2>
                        <p className="text-gray-400 max-w-sm leading-relaxed">
                            NeuroCalm needs motion access to detect your stress patterns via device micro-movements.
                        </p>
                        <button
                            onClick={async () => {
                                await requestPermission();
                                setStep('tap');
                            }}
                            className="px-8 py-4 mt-8 text-sm font-bold tracking-widest text-[#050B18] rounded-full bg-cyan-400 glow-cyan transition-transform hover:scale-105 active:scale-95"
                        >
                            TAP TO ALLOW
                        </button>
                    </motion.div>
                )}

                {step === 'tap' && (
                    <motion.div key="tap" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex w-full flex-1">
                        <TapZone onAnalysisComplete={handleAnalysisComplete} />
                    </motion.div>
                )}

                {step === 'analyzing' && (
                    <motion.div key="analyzing" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col items-center justify-center flex-1 w-full space-y-4">
                        <div className="w-16 h-16 border-4 border-cyan-500 rounded-full border-t-transparent animate-spin glow-cyan"></div>
                        <p className="tracking-widest text-cyan-500 animate-pulse">ANALYZING BIOMETRICS...</p>
                    </motion.div>
                )}

                {step === 'result' && analysisResult && (
                    <motion.div key="result" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 1.1 }} className="flex items-center justify-center flex-1 w-full">
                        <StressOrb stressLevel={analysisResult.stressLevel} />
                    </motion.div>
                )}

                {step === 'intervention' && analysisResult && (
                    <motion.div key="intervention" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-1 w-full">
                        {(analysisResult.interventionType === 'breathing') ? (
                            <BreathingGame onComplete={(res) => handleInterventionComplete(res, 60)} />
                        ) : analysisResult.interventionType === 'grounding' ? (
                            <FocusGame onComplete={(res) => handleInterventionComplete(res, 60)} />
                        ) : (
                            <FocusGame onComplete={(res) => handleInterventionComplete(res, 60)} />
                        )}
                    </motion.div>
                )}

                {step === 'done' && (
                    <motion.div key="done" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center justify-center flex-1 w-full space-y-4">
                        <div className="w-24 h-24 bg-green-500/20 text-green-500 rounded-full flex items-center justify-center text-4xl glow-cyan">✓</div>
                        <h2 className="text-2xl tracking-widest text-white">Session Saved</h2>
                        {analysisResult?.stressLevel === 'LOW' && <p className="text-cyan-200">Affirmation: You are doing great today. Keep up the calm energy.</p>}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};
