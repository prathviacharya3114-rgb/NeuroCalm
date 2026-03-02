import { useState, useEffect } from 'react';

export const useLightSensor = () => {
    const [lux, setLux] = useState(null);
    const [isLateNight, setIsLateNight] = useState(false);
    const [isSupported, setIsSupported] = useState(false);

    useEffect(() => {
        const checkTime = () => {
            const hour = new Date().getHours();
            setIsLateNight(hour >= 22 || hour <= 5);
        };
        checkTime();

        if ('AmbientLightSensor' in window) {
            try {
                const sensor = new window.AmbientLightSensor();
                sensor.addEventListener('reading', () => {
                    setLux(sensor.illuminance);
                });
                sensor.start();
                // eslint-disable-next-line react-hooks/set-state-in-effect
                setIsSupported(true);
                return () => sensor.stop();
                // eslint-disable-next-line no-unused-vars
            } catch (err) {
                // eslint-disable-next-line react-hooks/set-state-in-effect
                setIsSupported(false);
            }
        } else {
            setIsSupported(false);
            // Fallback
            if (window.matchMedia) {
                const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                if (prefersDark) setLux(40); // Mocking low lux
            }
        }
    }, []);

    return { lux, isLateNight, isSupported };
};
