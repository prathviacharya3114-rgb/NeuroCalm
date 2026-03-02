import { useCallback, useState, useEffect } from 'react';

export const useHaptics = () => {
    const [isSupported, setIsSupported] = useState(false);

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setIsSupported('vibrate' in navigator);
    }, []);

    const breatheIn = useCallback(() => {
        if (isSupported) navigator.vibrate(4000);
    }, [isSupported]);

    const breatheOut = useCallback(() => {
        if (isSupported) navigator.vibrate([0, 100, 4000]);
    }, [isSupported]);

    const anxietyReset = useCallback(() => {
        if (isSupported) navigator.vibrate([100, 50, 100, 50, 100]);
    }, [isSupported]);

    return { breatheIn, breatheOut, anxietyReset, isSupported };
};
