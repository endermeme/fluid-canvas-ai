
import React from 'react';
import { Trophy } from 'lucide-react';

interface ScoreDisplayProps {
  score: number;
}

const ScoreDisplay = ({ score }: ScoreDisplayProps) => {
  return (
    <div className="px-2 py-1 bg-primary/10 rounded-full text-xs font-medium flex items-center">
      <Trophy className="h-3 w-3 text-primary mr-1" />
      {score} điểm
    </div>
  );
};

export default ScoreDisplay;
