
import React from 'react';
import { MiniGame } from '@/utils/AIGameGenerator';
import GameShareSection from './GameShareSection';

interface GameDisplayProps {
  miniGame: MiniGame | null;
}

const GameDisplay = ({ miniGame }: GameDisplayProps) => {
  if (!miniGame) return null;

  return (
    <div className="flex flex-col h-full overflow-hidden rounded-xl shadow-xl border border-sky-200/30 dark:border-sky-800/30">
      <div className="bg-gradient-to-r from-primary/90 via-primary/80 to-primary/70 backdrop-blur-md p-4 flex items-center justify-between text-white">
        <h3 className="font-medium text-lg truncate mr-2 flex items-center">
          <span className="w-2 h-2 bg-white rounded-full mr-2 animate-pulse"></span>
          {miniGame.title}
        </h3>
        <div className="flex items-center gap-2">
          <GameShareSection miniGame={miniGame} />
        </div>
      </div>
      <div className="flex-1 overflow-hidden bg-gradient-to-b from-sky-50/50 to-white/50 dark:from-sky-900/20 dark:to-slate-900/30 p-3">
        <div className="rounded-lg shadow-inner bg-white/90 dark:bg-slate-800/40 h-full overflow-hidden border border-sky-100/50 dark:border-sky-900/50 backdrop-blur-sm">
          <iframe
            srcDoc={miniGame.htmlContent}
            title={miniGame.title}
            sandbox="allow-scripts allow-same-origin"
            className="w-full h-full border-none game-frame transition-transform hover:scale-[1.01]"
            style={{ height: '100%', width: '100%' }}
          />
        </div>
      </div>
    </div>
  );
};

export default GameDisplay;
