import { useState, useEffect, useRef } from 'react';

export const useAccelerometer = () => {
    const [rms, setRms] = useState(0);
    const [isSupported, setIsSupported] = useState(false);
    const [permissionGranted, setPermissionGranted] = useState(false);
    const readingsRef = useRef([]);

    useEffect(() => {
        if (typeof window.DeviceMotionEvent !== 'undefined') {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setIsSupported(true);
        }
    }, []);

    const requestPermission = async () => {
        if (typeof DeviceMotionEvent.requestPermission === 'function') {
            try {
                const permission = await DeviceMotionEvent.requestPermission();
                if (permission === 'granted') {
                    setPermissionGranted(true);
                }
            } catch (error) {
                console.error('Permission to access device motion was denied', error);
            }
        } else {
            setPermissionGranted(true); // Non-iOS devices
        }
    };

    useEffect(() => {
        if (!permissionGranted) return;

        const handleMotion = (event) => {
            const acc = event.accelerationIncludingGravity;
            if (acc && acc.x !== null) {
                const currentRms = Math.sqrt(acc.x * acc.x + acc.y * acc.y + acc.z * acc.z);
                const now = Date.now();
                readingsRef.current.push({ val: currentRms, time: now });
                readingsRef.current = readingsRef.current.filter(r => now - r.time <= 2000);

                const avgRms = readingsRef.current.reduce((sum, r) => sum + r.val, 0) / Math.max(1, readingsRef.current.length);
                setRms(avgRms);
            }
        };

        window.addEventListener('devicemotion', handleMotion);
        return () => window.removeEventListener('devicemotion', handleMotion);
    }, [permissionGranted]);

    return { rms, isSupported, requestPermission, permissionGranted };
};
