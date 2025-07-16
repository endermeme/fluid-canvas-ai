import React, { useEffect, useState } from 'react';
import { Progress } from '@/components/ui/progress';
import { Card } from '@/components/ui/card';
import { Timer, Zap, Award, Shield } from 'lucide-react';
import { cn } from '@/lib/utils';
import { TimerMode } from '../types';

interface VisualTimerIndicatorProps {
  timeLeft: number;
  totalTime: number;
  timerMode: TimerMode;
  isRunning: boolean;
  performanceBonus?: boolean;
  speedBonus?: boolean;
  timePenalty?: boolean;
  onTimeUp?: () => void;
  className?: string;
}

export const VisualTimerIndicator: React.FC<VisualTimerIndicatorProps> = ({
  timeLeft,
  totalTime,
  timerMode,
  isRunning,
  performanceBonus = false,
  speedBonus = false,
  timePenalty = false,
  onTimeUp,
  className
}) => {
  const [isWarning, setIsWarning] = useState(false);
  const [isDanger, setIsDanger] = useState(false);

  useEffect(() => {
    const percentage = (timeLeft / totalTime) * 100;
    setIsWarning(percentage <= 30 && percentage > 10);
    setIsDanger(percentage <= 10);

    if (timeLeft <= 0 && onTimeUp) {
      onTimeUp();
    }
  }, [timeLeft, totalTime, onTimeUp]);

  const getTimerColor = () => {
    if (isDanger) return 'bg-red-500';
    if (isWarning) return 'bg-yellow-500';
    
    switch (timerMode) {
      case 'progressive':
        return 'bg-blue-500';
      case 'rush':
        return 'bg-orange-500';
      case 'relaxed':
        return 'bg-green-500';
      default:
        return 'bg-primary';
    }
  };

  const getTimerModeIcon = () => {
    switch (timerMode) {
      case 'progressive':
        return <Zap className="h-4 w-4" />;
      case 'rush':
        return <Timer className="h-4 w-4 animate-pulse" />;
      case 'relaxed':
        return <Timer className="h-4 w-4" />;
      default:
        return <Timer className="h-4 w-4" />;
    }
  };

  const getModeLabel = () => {
    switch (timerMode) {
      case 'progressive':
        return 'Tiến bộ';
      case 'rush':
        return 'Tốc độ';
      case 'relaxed':
        return 'Thư giãn';
      default:
        return 'Bình thường';
    }
  };

  const percentage = Math.max(0, (timeLeft / totalTime) * 100);

  return (
    <Card className={cn('p-4 space-y-3', className)}>
      {/* Timer Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {getTimerModeIcon()}
          <span className="text-sm font-medium">{getModeLabel()}</span>
        </div>
        <div className={cn(
          'text-lg font-bold transition-colors',
          isDanger ? 'text-red-600' : isWarning ? 'text-yellow-600' : 'text-foreground'
        )}>
          {Math.ceil(timeLeft)}s
        </div>
      </div>

      {/* Progress Bar */}
      <div className="space-y-2">
        <Progress 
          value={percentage} 
          className={cn(
            'h-2',
            '[&>div]:transition-all [&>div]:duration-300',
            getTimerColor()
          )}
        />
        
        {/* Mode-specific visual effects */}
        {timerMode === 'rush' && isRunning && (
          <div className="h-1 bg-gradient-to-r from-orange-400 via-red-500 to-pink-500 animate-pulse rounded-full" />
        )}
        
        {timerMode === 'progressive' && (
          <div className="text-xs text-muted-foreground">
            Thời gian sẽ giảm dần qua từng câu
          </div>
        )}
      </div>

      {/* Active Features */}
      {(performanceBonus || speedBonus || timePenalty) && (
        <div className="flex gap-2 pt-2 border-t border-border/20">
          {performanceBonus && (
            <div className="flex items-center gap-1 text-xs text-green-600">
              <Award className="h-3 w-3" />
              <span>Thưởng hiệu suất</span>
            </div>
          )}
          {speedBonus && (
            <div className="flex items-center gap-1 text-xs text-orange-600">
              <Zap className="h-3 w-3" />
              <span>Thưởng tốc độ</span>
            </div>
          )}
          {timePenalty && (
            <div className="flex items-center gap-1 text-xs text-red-600">
              <Shield className="h-3 w-3" />
              <span>Phạt thời gian</span>
            </div>
          )}
        </div>
      )}
    </Card>
  );
};