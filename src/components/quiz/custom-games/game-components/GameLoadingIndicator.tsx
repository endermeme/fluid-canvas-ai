
import React from 'react';
import { Progress } from "@/components/ui/progress";

interface GameLoadingIndicatorProps {
  progress: number;
  loadAttempts?: number;
  maxAttempts?: number;
}

const GameLoadingIndicator: React.FC<GameLoadingIndicatorProps> = ({ 
  progress,
  loadAttempts,
  maxAttempts
}) => {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center bg-background/80 backdrop-blur-md z-10 p-6">
      <div className="w-full max-w-xs space-y-4">
        <Progress value={progress} className="w-full" />
        <p className="text-center text-sm text-muted-foreground">
          Đang tải game... {Math.round(progress)}%
          {loadAttempts && maxAttempts && (
            <span className="block text-xs mt-1">
              Lần thử: {loadAttempts}/{maxAttempts}
            </span>
          )}
        </p>
      </div>
    </div>
  );
};

export default GameLoadingIndicator;
