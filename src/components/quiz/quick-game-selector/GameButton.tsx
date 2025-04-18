
import React, { useState, useEffect } from 'react';
import { GameType } from '../types';
import { Gamepad } from 'lucide-react';

interface GameButtonProps {
  gameType: GameType;
  onClick: (gameType: GameType) => void;
  getIconComponent?: (iconName: string) => React.ReactNode;
}

const GameButton: React.FC<GameButtonProps> = ({ gameType, onClick, getIconComponent }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isAnimated, setIsAnimated] = useState(false);

  // Simulate entrance animation effect
  useEffect(() => {
    // Delay the animation slightly for a staggered effect
    const delay = Math.random() * 200;
    setTimeout(() => setIsAnimated(true), delay);
  }, []);

  // Handle button click with loading state
  const handleClick = () => {
    setIsLoading(true);
    
    // Call the actual onClick handler
    onClick(gameType);
    
    // Reset loading state after a short delay
    setTimeout(() => {
      setIsLoading(false);
    }, 800);
  };

  // Determine the icon to display
  const renderIcon = () => {
    if (getIconComponent) {
      return getIconComponent(gameType.icon);
    }
    
    // Default icon if no getIconComponent provided
    return <Gamepad size={28} />;
  };

  return (
    <button
      className={`
        game-button relative overflow-hidden rounded-xl transition-all duration-300
        ${isAnimated ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}
        ${isLoading ? 'pointer-events-none' : ''}
        group
      `}
      onClick={handleClick}
      disabled={isLoading}
      style={{ transitionDelay: `${Math.random() * 0.3}s` }}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-background border border-primary/20 rounded-xl transition-all duration-300 group-hover:from-primary/10 group-hover:to-primary/5"></div>
      
      {/* Loading overlay */}
      {isLoading && (
        <div className="absolute inset-0 bg-background/50 backdrop-blur-sm flex items-center justify-center z-10 rounded-xl">
          <div className="flex space-x-1">
            <span className="typing-indicator" style={{ '--dot-index': 0 } as React.CSSProperties}>
              <span className="w-1.5 h-1.5 bg-primary rounded-full inline-block"></span>
            </span>
            <span className="typing-indicator" style={{ '--dot-index': 1 } as React.CSSProperties}>
              <span className="w-1.5 h-1.5 bg-primary rounded-full inline-block"></span>
            </span>
            <span className="typing-indicator" style={{ '--dot-index': 2 } as React.CSSProperties}>
              <span className="w-1.5 h-1.5 bg-primary rounded-full inline-block"></span>
            </span>
          </div>
        </div>
      )}

      <div className="p-4 flex flex-col items-center justify-center gap-3 relative z-0">
        {/* Icon container with pulse effect on hover */}
        <div className="p-3 rounded-lg bg-primary/10 text-primary group-hover:bg-primary/20 transition-all duration-300 transform group-hover:scale-110">
          {renderIcon()}
        </div>
        
        {/* Game type name */}
        <h3 className="font-medium text-sm text-center line-clamp-2 h-10 text-primary/90">
          {gameType.name}
        </h3>
      </div>
      
      {/* Background shimmer effect */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-transparent via-primary/5 to-transparent shimmer-effect opacity-0 group-hover:opacity-100"></div>
    </button>
  );
};

export default GameButton;
