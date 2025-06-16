import React from 'react';
import { Progress } from "@/components/ui/progress";

interface GameLoadingIndicatorProps {
  progress: number;
}

const GameLoadingIndicator: React.FC<GameLoadingIndicatorProps> = ({ 
  progress
}) => {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center bg-background/80 backdrop-blur-md z-10 p-6">
      <div className="w-full max-w-xs space-y-4">
        <Progress value={progress} className="w-full" />
        <p className="text-center text-sm text-muted-foreground">
          Đang tải game... {Math.round(progress)}%
        </p>
      </div>
    </div>
  );
};

export default GameLoadingIndicator;
