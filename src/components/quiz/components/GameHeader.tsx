
import React from 'react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { ArrowLeft, Clock, Trophy } from 'lucide-react';

interface GameHeaderProps {
  onBack?: () => void;
  progress: number;
  timeLeft: number;
  score?: number;
  currentItem: number;
  totalItems: number;
  title?: string;
}

const GameHeader: React.FC<GameHeaderProps> = ({
  onBack,
  progress,
  timeLeft,
  score,
  currentItem,
  totalItems,
  title
}) => {
  return (
    <div className="mb-4 mt-12">
      {onBack && (
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={onBack} 
          className="absolute top-4 left-4 z-10 flex items-center gap-1 bg-background/80 hover:bg-background/90 backdrop-blur-sm shadow-sm"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Quay lại</span>
        </Button>
      )}

      <div className="flex justify-between items-center mb-2">
        <div className="text-sm font-medium px-3 py-1 bg-primary/10 rounded-full">
          {title || `Câu ${currentItem + 1}/${totalItems}`}
        </div>
        <div className="flex items-center gap-2">
          {score !== undefined && (
            <div className="flex items-center text-sm font-medium px-3 py-1 bg-primary/10 rounded-full">
              <Trophy className="h-4 w-4 mr-1 text-yellow-500" />
              <span>Điểm: {score}</span>
            </div>
          )}
          <div className="text-sm font-medium flex items-center px-3 py-1 bg-primary/10 rounded-full">
            <Clock className="h-4 w-4 mr-1" />
            <span>{Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}</span>
          </div>
        </div>
      </div>
      <Progress value={progress} className="h-2 bg-secondary" />
    </div>
  );
};

export default GameHeader;
