
import React from 'react';
import { Progress } from '@/components/ui/progress';
import { Loader2 } from 'lucide-react';

interface GameLoadingIndicatorProps {
  progress: number;
  loadAttempts: number;
  maxAttempts: number;
}

const GameLoadingIndicator: React.FC<GameLoadingIndicatorProps> = ({ 
  progress, 
  loadAttempts, 
  maxAttempts 
}) => {
  return (
    <div className="absolute inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-10">
      <div className="text-center max-w-md p-8">
        <Loader2 className="h-12 w-12 animate-spin mx-auto mb-4 text-primary" />
        <h3 className="text-lg font-semibold mb-2">Đang tải game...</h3>
        <Progress value={progress} className="mb-4" />
        <p className="text-sm text-muted-foreground">
          Lần thử {loadAttempts}/{maxAttempts}
        </p>
      </div>
    </div>
  );
};

export default GameLoadingIndicator;
