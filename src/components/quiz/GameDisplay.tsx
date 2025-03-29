
import React from 'react';
import { MiniGame } from '@/utils/AIGameGenerator';
import GameShareSection from './GameShareSection';
import { Card, CardContent } from '@/components/ui/card';

interface GameDisplayProps {
  miniGame: MiniGame | null;
}

const GameDisplay = ({ miniGame }: GameDisplayProps) => {
  if (!miniGame) return null;

  return (
    <div className="flex flex-col h-full overflow-hidden ocean-card">
      <div className="bg-background/80 backdrop-blur-md border-b border-sky-200 dark:border-sky-800 p-3 flex items-center justify-between">
        <h3 className="font-medium text-primary truncate mr-2 flex items-center">
          <span className="w-2 h-2 bg-primary rounded-full mr-2 animate-pulse"></span>
          {miniGame.title}
        </h3>
        <div className="flex items-center gap-2">
          <GameShareSection miniGame={miniGame} />
        </div>
      </div>
      <div className="flex-1 overflow-hidden p-1">
        <iframe
          srcDoc={miniGame.htmlContent}
          title={miniGame.title}
          sandbox="allow-scripts allow-same-origin"
          className="w-full h-full border-none game-frame bg-white"
          style={{ height: '100%', width: '100%' }}
        />
      </div>
    </div>
  );
};

export default GameDisplay;
