
import React from 'react';
import { GameType } from '../types';
import { Gamepad } from 'lucide-react';

interface GameButtonProps {
  gameType: GameType;
  onClick: (gameType: GameType) => void;
  getIconComponent?: (iconName: string) => React.ReactNode;
}

const GameButton: React.FC<GameButtonProps> = ({ gameType, onClick, getIconComponent }) => {
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
      className="game-button bg-background/80 border border-border/50 hover:border-border hover:bg-accent/50 p-4 rounded-xl flex flex-col items-center justify-center gap-2 transition-all duration-300 opacity-0 shadow-sm hover:shadow"
      onClick={() => onClick(gameType)}
    >
      <div className="p-2 rounded-lg bg-primary/10 text-primary">
        {renderIcon()}
      </div>
      <h3 className="font-medium text-sm text-center line-clamp-2 h-10">
        {gameType.name}
      </h3>
    </button>
  );
};

export default GameButton;
