
import React from 'react';
import { MiniGame } from '@/utils/AIGameGenerator';
import GameShareSection from './GameShareSection';

interface GameDisplayProps {
  miniGame: MiniGame | null;
}

const GameDisplay = ({ miniGame }: GameDisplayProps) => {
  if (!miniGame) return null;

  return (
    <>
      <div className="bg-background border-b p-2 flex items-center justify-between">
        <h3 className="text-sm font-medium truncate mr-2">
          {miniGame.title}
        </h3>
        <div className="flex items-center gap-2">
          <GameShareSection miniGame={miniGame} />
        </div>
      </div>
      <div className="flex-1 overflow-hidden">
        <iframe
          srcDoc={miniGame.htmlContent}
          title={miniGame.title}
          sandbox="allow-scripts allow-same-origin"
          className="w-full h-full border-none"
          style={{ height: '100%', width: '100%' }}
        />
      </div>
    </>
  );
};

export default GameDisplay;
