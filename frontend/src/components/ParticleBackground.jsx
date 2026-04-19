import React, { useCallback } from 'react';
import Particles from 'react-tsparticles';
import { loadSlim } from '@tsparticles/slim';

const ParticleBackground = ({ theme }) => {
  const particlesInit = useCallback(async (engine) => {
    // load slim option to avoid loading the whole tsParticles bundle
    await loadSlim(engine);
  }, []);

  const isLight = theme === 'light';

  return (
    <Particles
      id="tsparticles"
      init={particlesInit}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 0,
        pointerEvents: 'none' // allow clicks to pass through except for hover where grabbed
      }}
      options={{
        background: { color: { value: "transparent" } },
        fullScreen: { enable: false, zIndex: 0 },
        fpsLimit: 60,
        interactivity: {
          events: {
            onHover: { enable: true, mode: "grab" },
            resize: true,
          },
          modes: {
            grab: { 
              distance: 180, 
              links: { opacity: isLight ? 0.35 : 0.6, color: isLight ? "#6474c8" : "#8b5cf6" } 
            },
          },
        },
        particles: {
          color: { value: isLight ? "#4f46e5" : "#a78bfa" },
          links: {
            color: isLight ? "#6474c8" : "#7c5cfc",
            distance: 140,
            enable: true,
            opacity: isLight ? 0.12 : 0.2,
            width: 1,
          },
          move: {
            direction: "none",
            enable: true,
            outModes: { default: "bounce" },
            random: true,
            speed: 0.6,
            straight: false,
          },
          number: {
            density: { enable: true, area: 900 },
            value: 70,
          },
          opacity: {
            value: isLight ? 0.25 : 0.45,
            animation: { enable: true, speed: 0.5, minimumValue: 0.1 }
          },
          shape: { type: "circle" },
          size: { 
            value: { min: 1, max: 2.5 },
            animation: { enable: true, speed: 2, minimumValue: 0.5 }
          },
        },
        detectRetina: true,
      }}
    />
  );
};

export default ParticleBackground;
