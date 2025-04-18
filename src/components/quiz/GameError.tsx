
import React, { useEffect, useRef } from 'react';
import { X, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { animateBlockCreation } from '@/lib/animations';

interface GameErrorProps {
  errorMessage: string;
  onRetry: () => void;
  topic: string;
}

const GameError: React.FC<GameErrorProps> = ({ errorMessage, onRetry, topic }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (containerRef.current) {
      animateBlockCreation(containerRef.current);
    }
  }, []);
  
  return (
    <div 
      ref={containerRef}
      className="flex flex-col items-center justify-center h-full w-full space-y-6 opacity-0 scale-95"
    >
      <div className="text-red-500 bg-red-100 dark:bg-red-950/30 p-4 rounded-full">
        <X size={48} />
      </div>
      <p className="text-lg text-center max-w-md px-4">{errorMessage}</p>
      <Button 
        onClick={onRetry} 
        size="lg"
        className="transition-transform active:scale-95"
      >
        <RefreshCw className="mr-2 h-4 w-4" /> Thử Lại
      </Button>
    </div>
  );
};

export default GameError;
