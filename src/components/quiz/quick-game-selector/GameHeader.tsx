
import React from 'react';
import { School } from 'lucide-react';

interface GameHeaderProps {
  onTitleClick: () => void;
}

const GameHeader: React.FC<GameHeaderProps> = ({ onTitleClick }) => {
  return (
    <>
      <div className="text-primary mb-4 animate-float-in">
        <div className="relative">
          <div className="absolute inset-0 blur-xl bg-primary/20 rounded-full animate-pulse-soft"></div>
          <School size={56} className="relative z-10 text-primary" />
        </div>
      </div>
      
      <h2 
        className="text-2xl font-bold mb-2 bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent animate-fade-in cursor-pointer"
        onClick={onTitleClick}
      >
        Minigames Giáo Dục
      </h2>
    </>
  );
};

export default GameHeader;
