
import React from 'react';
import { motion } from 'framer-motion';

interface BackgroundParticlesProps {
  particleCount?: number;
  className?: string;
}

const BackgroundParticles: React.FC<BackgroundParticlesProps> = ({ 
  particleCount = 15, 
  className = "" 
}) => {
  // Generate stable particles that won't change on re-renders
  const particles = React.useMemo(() => 
    Array.from({ length: particleCount }, (_, i) => ({
      id: i,
      size: Math.random() * 8 + 4,
      delay: Math.random() * 10,
      duration: Math.random() * 15 + 15, // Slower animation
      x: Math.random() * 100,
      y: Math.random() * 100,
      opacity: Math.random() * 0.4 + 0.1,
    }))
  , [particleCount]);

  return (
    <div className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}>
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute rounded-full bg-gradient-to-r from-blue-400 to-sky-500"
          style={{
            width: particle.size,
            height: particle.size,
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            opacity: particle.opacity,
          }}
          animate={{
            x: [0, 30, -20, 40, 0],
            y: [0, -30, 20, -25, 0],
            scale: [1, 1.2, 0.9, 1.1, 1],
          }}
          transition={{
            duration: particle.duration,
            repeat: Infinity,
            delay: particle.delay,
            ease: "easeInOut",
            repeatType: "loop"
          }}
        />
      ))}
    </div>
  );
};

export default BackgroundParticles;
