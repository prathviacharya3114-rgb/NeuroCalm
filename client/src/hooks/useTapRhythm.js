import { useState, useRef, useCallback } from 'react';

export const useTapRhythm = () => {
    const [tapSpeed, setTapSpeed] = useState(0);
    const [tapCount, setTapCount] = useState(0);
    const [isTracking, setIsTracking] = useState(false);
    const tapsRef = useRef([]);
    const isTrackingRef = useRef(false);

    const handleTap = useCallback(() => {
        if (!isTrackingRef.current) return;
        const now = Date.now();
        tapsRef.current.push(now);

        // Keep only taps from the last 3 seconds
        tapsRef.current = tapsRef.current.filter(time => now - time <= 3000);

        setTapCount(prev => prev + 1);
        setTapSpeed(tapsRef.current.length / 3);
    }, []);

    const startTracking = useCallback(() => {
        setIsTracking(true);
        isTrackingRef.current = true;
        tapsRef.current = [];
        setTapCount(0);
        setTapSpeed(0);
    }, []);

    const stopTracking = useCallback(() => {
        setIsTracking(false);
        isTrackingRef.current = false;
    }, []);

    return { tapSpeed, tapCount, isTracking, startTracking, stopTracking, handleTap };
};
