
import React from 'react';
import { MiniGame } from './generator/types';

interface GameViewProps {
  miniGame: MiniGame;
  onBack?: () => void;
}

const GameView: React.FC<GameViewProps> = ({ miniGame, onBack }) => {
  return (
    <div className="w-full h-full flex flex-col">
      <div className="flex-1 relative overflow-hidden">
        <div className="h-full w-full flex items-center justify-center">
          <div className="text-center p-6">
            <h2 className="text-2xl font-bold mb-4">{miniGame.title}</h2>
            <p className="text-muted-foreground">{miniGame.description || "Interactive minigame"}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GameView;
