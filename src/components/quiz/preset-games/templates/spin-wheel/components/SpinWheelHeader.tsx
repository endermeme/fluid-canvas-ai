
import React from 'react';
import { Progress } from '@/components/ui/progress';
import { Clock, Trophy } from 'lucide-react';

interface SpinWheelHeaderProps {
  title: string;
  timeLeft: number;
  score: number;
  answeredQuestions: number;
  totalQuestions: number;
  onShare?: () => void;
}

const SpinWheelHeader: React.FC<SpinWheelHeaderProps> = ({
  title,
  timeLeft,
  score,
  answeredQuestions,
  totalQuestions,
  onShare
}) => {
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-4">
          <h1 className="text-2xl font-bold text-purple-800">{title}</h1>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Clock className="h-4 w-4" />
            {formatTime(timeLeft)}
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center text-lg font-semibold">
            <Trophy className="h-5 w-5 mr-2 text-yellow-500" />
            Điểm: {score}
          </div>
          <div className="text-sm text-muted-foreground">
            {answeredQuestions}/{totalQuestions} câu
          </div>
        </div>
      </div>
      <Progress value={(answeredQuestions / totalQuestions) * 100} className="mb-6" />
    </div>
  );
};

export default SpinWheelHeader;
