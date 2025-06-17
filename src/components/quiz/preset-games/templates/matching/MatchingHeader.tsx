
import React from 'react';
import { Progress } from '@/components/ui/progress';
import { Clock, Trophy } from 'lucide-react';

interface MatchingHeaderProps {
  matchedPairs: number;
  totalPairs: number;
  score: number;
  timeLeft: number;
}

const MatchingHeader: React.FC<MatchingHeaderProps> = ({
  matchedPairs,
  totalPairs,
  score,
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
            <Trophy className="h-3 w-3 mr-1 text-yellow-500" />
            {score}
          </div>
          <div className="flex items-center px-2 py-1 bg-primary/10 rounded-full">
            <Clock className="h-3 w-3 mr-1" />
            {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
          </div>
        </div>
      </div>
      <Progress value={progressPercentage} className="h-1.5" />
    </div>
  );
};

export default MatchingHeader;
