import React, { useCallback } from 'react';
import Particles from "react-tsparticles";
import { loadFull } from "tsparticles";

const ParticleBackground = () => {
    const particlesInit = useCallback(async engine => {
        await loadFull(engine);
    }, []);

    // eslint-disable-next-line no-unused-vars
    const particlesLoaded = useCallback(async container => {
        // await console.log(container);
    }, []);

    return (
        <Particles
            id="tsparticles"
            init={particlesInit}
            loaded={particlesLoaded}
            options={{
                background: {
                    color: {
                        value: "#050B18", // Dark base
                    },
                },
                fpsLimit: 60,
                interactivity: {
                    events: {
                        onHover: {
                            enable: true,
                            mode: "grab", // Creates a magnetic pulling effect to the mouse
                        },
                        onClick: {
                            enable: true,
                            mode: "push", // Adds more particles on click
                        },
                        resize: true,
                    },
                    modes: {
                        grab: {
                            distance: 200,
                            links: {
                                opacity: 0.8,
                                color: "#00F5FF"
                            }
                        },
                        push: {
                            quantity: 4,
                        },
                    },
                },
                particles: {
                    color: {
                        value: ["#00F5FF", "#7B2FFF", "#00FFaa"], // Cyan, Violet, soft teal
                    },
                    links: {
                        color: "#7B2FFF",
                        distance: 180,
                        enable: true,
                        opacity: 0.3,
                        width: 1.5,
                        triangles: {
                            enable: true,
                            opacity: 0.05
                        }
                    },
                    move: {
                        direction: "none",
                        enable: true,
                        outModes: {
                            default: "bounce", // Keeps them on screen softly bouncing
                        },
                        random: true,
                        speed: 0.8, // Slow, calming speed
                        straight: false,
                    },
                    number: {
                        density: {
                            enable: true,
                            area: 800,
                        },
                        value: 65, // Slightly higher density
                    },
                    opacity: {
                        value: { min: 0.3, max: 0.8 },
                        animation: {
                            enable: true,
                            speed: 1,
                            sync: false,
                        } // Gentle glowing effect
                    },
                    shape: {
                        type: "circle",
                    },
                    size: {
                        value: { min: 1, max: 4 },
                        animation: {
                            enable: true,
                            speed: 2,
                            sync: false
                        } // Gentle pulsing
                    },
                },
                detectRetina: true,
                zLayers: 1, // Keep it strictly in the background
            }}
            className="absolute inset-0 w-full h-full -z-10 pointer-events-auto"
        />
    );
};

export default ParticleBackground;
