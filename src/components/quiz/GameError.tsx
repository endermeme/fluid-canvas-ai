
import React from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface GameErrorProps {
  errorMessage: string;
  onRetry: () => void;
  topic: string;
}

const GameError: React.FC<GameErrorProps> = ({ errorMessage, onRetry, topic }) => {
  return (
    <div className="flex flex-col items-center justify-center h-full w-full space-y-6">
      <div className="text-red-500">
        <X size={48} />
      </div>
      <p className="text-lg text-center">{errorMessage}</p>
      <Button onClick={onRetry} size="lg">Thử Lại</Button>
    </div>
  );
};

export default GameError;
