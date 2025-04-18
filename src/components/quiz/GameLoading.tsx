
import React from 'react';
import { Loader2 } from 'lucide-react';

interface GameLoadingProps {
  topic: string;
  progress?: number;
}

const GameLoading: React.FC<GameLoadingProps> = ({ topic, progress }) => {
  return (
    <div className="flex flex-col items-center justify-center h-full p-6">
      <div className="mb-4">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
      <h2 className="text-xl font-semibold mb-2">Preparing Game</h2>
      <p className="text-center text-muted-foreground mb-4">
        Setting up your game about "{topic}"
      </p>
      
      {progress !== undefined && (
        <div className="w-64 bg-secondary/30 rounded-full h-2 mt-2">
          <div 
            className="bg-primary h-2 rounded-full transition-all duration-300 ease-in-out"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      )}
    </div>
  );
};

export default GameLoading;
