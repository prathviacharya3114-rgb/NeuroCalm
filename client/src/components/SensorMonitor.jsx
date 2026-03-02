import { useEffect } from 'react';
import { useAccelerometer } from '../hooks/useAccelerometer';
import { useLightSensor } from '../hooks/useLightSensor';

export const SensorMonitor = ({ onSensorData, permissionRequested }) => {
    const { rms, requestPermission, permissionGranted } = useAccelerometer();
    const { lux, isLateNight } = useLightSensor();

    useEffect(() => {
        if (permissionRequested && !permissionGranted) {
            requestPermission();
        }
    }, [permissionRequested, permissionGranted, requestPermission]);

    useEffect(() => {
        onSensorData({
            accelerometerRMS: rms,
            ambientLight: lux || 100,
            isLateNight
        });
    }, [rms, lux, isLateNight, onSensorData]);

    return null; // Headless component
};
