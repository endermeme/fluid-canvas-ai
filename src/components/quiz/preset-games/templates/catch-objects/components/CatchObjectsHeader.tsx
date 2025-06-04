
import React from 'react';
import { Progress } from '@/components/ui/progress';
import { Clock } from 'lucide-react';

interface CatchObjectsHeaderProps {
  title: string;
  timeLeft: number;
  score: number;
  caughtObjects: {correct: number, wrong: number};
}

const CatchObjectsHeader: React.FC<CatchObjectsHeaderProps> = ({
  title,
  timeLeft,
  score,
  caughtObjects
}) => {
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="catch-header">
      <div className="header-content">
        <div className="title-section">
          <h1 className="game-title">{title}</h1>
          <div className="timer">
            <Clock className="h-4 w-4" />
            {formatTime(timeLeft)}
          </div>
        </div>
        <div className="stats-section">
          <div className="score">Điểm: {score}</div>
          <div className="caught-stats">
            Đúng: {caughtObjects.correct} | Sai: {caughtObjects.wrong}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CatchObjectsHeader;
