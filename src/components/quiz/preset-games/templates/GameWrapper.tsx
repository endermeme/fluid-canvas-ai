
import React from 'react';
import { Progress } from '@/components/ui/progress';
import { Clock, BrainCircuit } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface GameWrapperProps {
  children: React.ReactNode;
  onBack?: () => void;
  progress?: number;
  timeLeft?: number;
  score?: number;
  currentItem?: number;
  totalItems?: number;
  onShare?: () => void;
  title?: string;
  gameId?: string;
}

/**
 * GameWrapper là component chung để bọc tất cả các game templates,
 * giúp tách biệt logic header với nội dung game
 */
const GameWrapper: React.FC<GameWrapperProps> = ({
  children,
  progress = 0,
  timeLeft = 0,
  score = 0,
  currentItem = 0,
  totalItems = 0,
  title = "Quiz Game",
  gameId,
  onBack,
}) => {
  // Format time as MM:SS
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="flex flex-col h-screen bg-background overflow-hidden relative">
      {/* Header */}
      <div className="p-4 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={onBack}
            title="Quay lại"
          >
            <span className="sr-only">Quay lại</span>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
              <path d="m12 19-7-7 7-7"></path>
              <path d="M19 12H5"></path>
            </svg>
          </Button>
          <h2 className="text-xl font-bold">{title}</h2>
        </div>
      </div>
      
      {/* Progress bar */}
      <Progress value={progress} className="w-full h-1.5 bg-secondary/40" />
      
      {/* Game stats */}
      <div className="bg-background px-4 py-2 flex justify-between items-center border-b">
        <div className="flex items-center space-x-2">
          <Clock className="h-4 w-4 text-primary" />
          <span className="text-sm font-medium">{formatTime(timeLeft)}</span>
        </div>
        
        <div className="flex items-center space-x-1">
          <span className="text-sm font-medium">{currentItem}/{totalItems}</span>
        </div>
        
        <div className="flex items-center space-x-2">
          <BrainCircuit className="h-4 w-4 text-primary" />
          <span className="text-sm font-medium">{score} pt</span>
        </div>
      </div>
      
      {/* Game content */}
      <div className="flex-grow overflow-auto p-4">
        {children}
      </div>
    </div>
  );
};

export default GameWrapper;
