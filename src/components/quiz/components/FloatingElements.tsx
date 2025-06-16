
import React, { useState, useEffect } from 'react';
import { Sparkles, Crown, Star, Gamepad2, Wand2 } from 'lucide-react';

const FloatingElements: React.FC = () => {
  const [currentIcon, setCurrentIcon] = useState(0);
  const floatingIcons = [Sparkles, Crown, Star, Gamepad2, Wand2];
  
  useEffect(() => {
    // Icon rotation effect for floating icons
    const iconInterval = setInterval(() => {
      setCurrentIcon(prev => (prev + 1) % floatingIcons.length);
    }, 2000);
    
    return () => clearInterval(iconInterval);
  }, []);

  const FloatingIcon = floatingIcons[currentIcon];

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Floating icons */}
      {[...Array(6)].map((_, i) => (
        <div
          key={i}
          className="absolute animate-bounce-subtle opacity-20"
          style={{
            left: `${15 + i * 15}%`,
            top: `${20 + (i % 3) * 25}%`,
            animationDelay: `${i * 0.5}s`,
            animationDuration: `${3 + i * 0.5}s`
          }}
        >
          <FloatingIcon className="h-8 w-8 text-primary/30" />
        </div>
      ))}
      
      {/* Gradient orbs */}
      <div className="absolute top-10 left-10 w-32 h-32 bg-gradient-to-r from-blue-400/20 to-purple-400/20 rounded-full blur-xl animate-pulse-soft" />
      <div className="absolute bottom-10 right-10 w-24 h-24 bg-gradient-to-r from-green-400/20 to-blue-400/20 rounded-full blur-xl animate-pulse-soft" style={{ animationDelay: '1s' }} />
    </div>
  );
};

export default FloatingElements;
