import React, { useEffect, useState } from 'react';

interface Particle {
  id: number;
  x: number;
  y: number;
  char: string;
  opacity: number;
  speed: number;
  size: number;
}

const CodingParticles = () => {
  const [particles, setParticles] = useState<Particle[]>([]);

  const codingChars = ['<', '>', '{', '}', '(', ')', ';', '=', '+', '-', '*', '/', '&', '|', '!', '?', '0', '1'];

  useEffect(() => {
    // Initialize particles
    const initialParticles: Particle[] = Array.from({ length: 30 }, (_, i) => ({
      id: i,
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      char: codingChars[Math.floor(Math.random() * codingChars.length)],
      opacity: 0.1 + Math.random() * 0.3,
      speed: 0.5 + Math.random() * 1,
      size: 12 + Math.random() * 8,
    }));
    setParticles(initialParticles);
  }, []);

  useEffect(() => {
    const animateParticles = () => {
      setParticles(prevParticles =>
        prevParticles.map(particle => {
          let newY = particle.y - particle.speed;
          let newOpacity = particle.opacity;

          // Reset particle when it goes off screen
          if (newY < -20) {
            newY = window.innerHeight + 20;
            newOpacity = 0.1 + Math.random() * 0.3;
          }

          return {
            ...particle,
            y: newY,
            opacity: newOpacity,
          };
        })
      );
    };

    const interval = setInterval(animateParticles, 50);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-5">
      {particles.map(particle => (
        <div
          key={particle.id}
          className="absolute font-mono text-cyan-400 select-none"
          style={{
            left: particle.x,
            top: particle.y,
            opacity: particle.opacity,
            fontSize: particle.size,
            transform: 'translateZ(0)', // Hardware acceleration
          }}
        >
          {particle.char}
        </div>
      ))}
    </div>
  );
};

export default CodingParticles;