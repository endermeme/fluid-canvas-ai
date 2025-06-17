
import React from 'react';
import { Progress } from '@/components/ui/progress';
import { Clock, Trophy } from 'lucide-react';

interface MemoryHeaderProps {
  matchedPairs: number;
  totalPairs: number;
  moves: number;
  timeLeft: number;
}

const MemoryHeader: React.FC<MemoryHeaderProps> = ({
  matchedPairs,
  totalPairs,
  moves,
  timeLeft
}) => {
  const progressPercentage = (matchedPairs / totalPairs) * 100;

  return (
    <div className="flex-shrink-0 p-2 pt-16 sm:pt-18">
      <div className="flex justify-between items-center mb-1">
        <div className="text-xs font-medium px-2 py-1 bg-primary/10 rounded-full">
          {matchedPairs}/{totalPairs}
        </div>
        <div className="flex items-center gap-1 text-xs">
          <div className="flex items-center px-2 py-1 bg-primary/10 rounded-full">
            <Clock className="h-3 w-3 mr-1 text-primary" />
            {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
          </div>
          <div className="px-2 py-1 bg-primary/10 rounded-full">
            {moves} lượt
          </div>
        </div>
      </div>
      <Progress value={progressPercentage} className="h-1.5" />
    </div>
  );
};

export default MemoryHeader;
