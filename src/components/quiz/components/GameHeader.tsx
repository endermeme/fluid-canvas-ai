
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft, RefreshCw, Share2 } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

export interface GameHeaderProps {
  title?: string;
  progress: number;
  timeLeft?: number;
  score?: number;
  currentItem: number;
  totalItems: number;
  onBack?: () => void;
  onRefresh?: () => void;
  onShare?: () => Promise<void>;
  extraButton?: React.ReactNode;
}

const GameHeader: React.FC<GameHeaderProps> = ({
  title,
  progress,
  timeLeft,
  score,
  currentItem,
  totalItems,
  onBack,
  onRefresh,
  onShare,
  extraButton
}) => {
  return (
    <div className="p-4 space-y-2">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          {onBack && (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={onBack}
              className="h-8 px-2"
            >
              <ArrowLeft className="h-4 w-4 mr-1" />
              <span>Quay lại</span>
            </Button>
          )}
          
          <h2 className="text-xl font-bold">{title || `Câu ${currentItem}/${totalItems}`}</h2>
        </div>
        
        <div className="flex items-center gap-2">
          {score !== undefined && (
            <div className="text-sm font-medium bg-primary/10 text-primary px-2.5 py-1 rounded">
              Điểm: {score}
            </div>
          )}
          
          {timeLeft !== undefined && timeLeft > 0 && (
            <div className="text-sm font-medium bg-secondary/20 px-2.5 py-1 rounded">
              {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
            </div>
          )}
          
          {onRefresh && (
            <Button 
              variant="ghost" 
              size="sm"
              onClick={onRefresh}
              className="h-8 w-8 p-0"
            >
              <RefreshCw className="h-4 w-4" />
            </Button>
          )}
          
          {onShare && (
            <Button 
              variant="ghost" 
              size="sm"
              onClick={onShare}
              className="h-8 w-8 p-0"
            >
              <Share2 className="h-4 w-4" />
            </Button>
          )}

          {extraButton}
        </div>
      </div>
      
      <Progress 
        value={progress} 
        className="h-1.5" 
      />
    </div>
  );
};

export default GameHeader;
