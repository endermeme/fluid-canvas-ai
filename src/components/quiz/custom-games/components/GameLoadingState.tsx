
import React, { useState, useEffect } from 'react';
import { Progress } from "@/components/ui/progress";
import { Card } from "@/components/ui/card";

interface GameLoadingStateProps {
  loadAttempts: number;
  maxAttempts: number;
}

const GameLoadingState: React.FC<GameLoadingStateProps> = ({ 
  loadAttempts,
  maxAttempts
}) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    
    // Nếu đang thử tải lại, tăng progress nhanh hơn
    const speedFactor = loadAttempts > 0 ? 1.5 : 1;
    
    interval = setInterval(() => {
      setProgress(currentProgress => {
        // Càng gần 100% thì tốc độ tăng càng chậm lại
        const increment = Math.random() * 15 * speedFactor * (1 - currentProgress / 100);
        const newProgress = currentProgress + increment;
        return newProgress > 90 ? 90 : newProgress;
      });
    }, 150);

    return () => clearInterval(interval);
  }, [loadAttempts]);

  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center bg-background/80 backdrop-blur-md z-10 p-6 transition-opacity duration-300">
      <Card className="max-w-xs w-full p-6 space-y-4 border border-primary/10 bg-card/70 backdrop-blur-sm shadow-lg">
        <div className="w-full space-y-2">
          <div className="flex justify-between items-center">
            <h4 className="font-medium text-sm text-foreground/80">Đang tải game</h4>
            <span className="text-sm font-mono text-muted-foreground">{Math.round(progress)}%</span>
          </div>
          <Progress value={progress} className="w-full h-2.5" />
        </div>
        
        {loadAttempts > 0 && (
          <div className="text-center">
            <p className="text-center text-xs text-amber-500 animate-pulse">
              Đang thử tải lại lần {loadAttempts}/{maxAttempts}...
            </p>
          </div>
        )}
      </Card>
    </div>
  );
};

export default GameLoadingState;
