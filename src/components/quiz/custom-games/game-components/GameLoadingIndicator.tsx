
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
    <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-background/95 via-background/90 to-background/95 backdrop-blur-xl z-10 p-8">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-blue-500/5 to-purple-500/5 animate-pulse" />
      
      <div className="relative w-full max-w-md space-y-8">
        {/* Loading Icon */}
        <div className="flex justify-center mb-6">
          <LoadingSpinner size="lg" variant="gradient" />
        </div>
        
        {/* Progress Section */}
        <div className="space-y-4">
          <div className="text-center space-y-2">
            <h3 className="text-xl font-semibold text-foreground">
              Đang tải game...
            </h3>
            <p className="text-sm text-muted-foreground">
              Quá trình này có thể mất vài giây
            </p>
          </div>
          
          {/* Enhanced Progress Bar */}
          <div className="space-y-3">
            <Progress 
              value={progress} 
              className="h-3 bg-muted/50"
              indicatorColor="bg-gradient-to-r from-primary via-blue-500 to-purple-500"
            />
            
            <div className="flex justify-between items-center text-sm">
              <span className="text-muted-foreground">
                Đang xử lý...
              </span>
              <span className="font-medium text-primary bg-primary/10 px-2 py-1 rounded-full text-xs">
                {Math.round(progress)}%
              </span>
            </div>
          </div>
        </div>
        
        {/* Loading Skeletons */}
        <div className="space-y-3 pt-4">
          <div className="space-y-2">
            <Skeleton className="h-4 w-3/4 bg-gradient-to-r from-muted to-muted/50" />
            <Skeleton className="h-4 w-1/2 bg-gradient-to-r from-muted to-muted/50" />
            <Skeleton className="h-4 w-2/3 bg-gradient-to-r from-muted to-muted/50" />
          </div>
        </div>
        
        {/* Floating Particles Effect */}
        <div className="absolute -top-4 -left-4 w-2 h-2 bg-primary/30 rounded-full animate-bounce" style={{ animationDelay: '0s' }} />
        <div className="absolute -top-2 -right-6 w-1.5 h-1.5 bg-blue-500/30 rounded-full animate-bounce" style={{ animationDelay: '0.5s' }} />
        <div className="absolute -bottom-6 left-8 w-1 h-1 bg-purple-500/30 rounded-full animate-bounce" style={{ animationDelay: '1s' }} />
      </div>
    </div>
  );
};

export default GameLoadingIndicator;
