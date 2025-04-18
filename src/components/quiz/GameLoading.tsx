
import React from 'react';
import { Loader2 } from 'lucide-react';

interface GameLoadingProps {
  topic: string;
}

const GameLoading: React.FC<GameLoadingProps> = ({ topic }) => {
  return (
    <div className="flex flex-col items-center justify-center h-full p-6">
      <div className="mb-4">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
      <h2 className="text-xl font-semibold mb-2">Preparing Game</h2>
      <p className="text-center text-muted-foreground mb-4">
        Setting up your game about "{topic}"
      </p>
    </div>
  );
};

export default GameLoading;
