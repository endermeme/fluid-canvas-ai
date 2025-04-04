
import React, { useEffect, useRef } from 'react';
import { GameType } from '../types';
import { animateBlockCreation } from '@/lib/animations';
import GameButton from './GameButton';

interface GameGridProps {
  gameTypes: GameType[];
  onTopicSelect: (gameType: GameType) => void;
  getIconComponent?: (iconName: string) => React.ReactNode;
}

const GameGrid: React.FC<GameGridProps> = ({ gameTypes, onTopicSelect, getIconComponent }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const gameButtons = containerRef.current?.querySelectorAll('.game-button');
    gameButtons?.forEach((button, index) => {
      setTimeout(() => {
        if (button instanceof HTMLElement) {
          animateBlockCreation(button);
        }
      }, index * 40); // Faster animation for more items
    });
  }, []);

  return (
    <div 
      ref={containerRef} 
      className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 max-w-6xl w-full"
    >
      {gameTypes.map((gameType) => (
        <GameButton 
          key={gameType.id} 
          gameType={gameType} 
          onClick={onTopicSelect} 
          getIconComponent={getIconComponent}
        />
      ))}
    </div>
  );
};

export default GameGrid;
