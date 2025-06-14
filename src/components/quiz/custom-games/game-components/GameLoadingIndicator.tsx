
import React from 'react';
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import LoadingSpinner from './LoadingSpinner';

interface GameLoadingIndicatorProps {
  progress: number;
}

const GameLoadingIndicator: React.FC<GameLoadingIndicatorProps> = ({ 
  progress
}) => {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center bg-background/90 backdrop-blur z-20 transition-all">
      <div className="w-full max-w-sm flex flex-col items-center gap-7 shadow-md rounded-xl bg-card/70 p-8 border border-border">
        <LoadingSpinner size="lg" />
        <div className="text-center space-y-2">
          <h3 className="text-xl font-semibold text-foreground tracking-tight">Đang tạo trò chơi</h3>
          <p className="text-sm text-muted-foreground">Vui lòng chờ trong giây lát...</p>
        </div>
        <Progress 
          value={progress} 
          className="h-3"
          indicatorColor="bg-primary"
        />
        <div className="w-full flex justify-between text-xs text-muted-foreground">
          <span>{progress < 10 ? 'Khởi tạo...' : progress < 40 ? 'Phân tích chủ đề...' : progress < 80 ? 'Tối ưu trải nghiệm...' : progress < 95 ? 'Hoàn thiện...' : 'Sẵn sàng!'}</span>
          <span className="font-semibold text-primary">{Math.round(progress)}%</span>
        </div>
        {/* Skeleton effect for UI */}
        <div className="w-full space-y-2 pt-2">
          <Skeleton className="h-4 w-4/5" />
          <Skeleton className="h-4 w-3/5" />
        </div>
      </div>
    </div>
  );
};

export default GameLoadingIndicator;
