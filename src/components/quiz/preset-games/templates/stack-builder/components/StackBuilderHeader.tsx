
import React from 'react';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Clock } from 'lucide-react';

interface StackBuilderHeaderProps {
  title: string;
  timeLeft: number;
  score: number;
  currentSequence: number;
  totalSequences: number;
}

const StackBuilderHeader: React.FC<StackBuilderHeaderProps> = ({
  title,
  timeLeft,
  score,
  currentSequence,
  totalSequences
}) => {
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="stack-header">
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
          <div className="sequence-info">
            {currentSequence}/{totalSequences} chuỗi
          </div>
        </div>
      </div>
      <Progress value={(currentSequence / totalSequences) * 100} className="progress-bar" />
    </div>
  );
};

export default StackBuilderHeader;
