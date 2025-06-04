
import React from 'react';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Clock, Trophy, Play, Pause, RotateCcw } from 'lucide-react';

interface WhackMoleHeaderProps {
  title: string;
  timeLeft: number;
  score: number;
  currentQuestionIndex: number;
  totalQuestions: number;
  onShare?: () => void;
  onPause: () => void;
  onReset: () => void;
  gameState: 'playing' | 'paused';
}

const WhackMoleHeader: React.FC<WhackMoleHeaderProps> = ({
  title,
  timeLeft,
  score,
  currentQuestionIndex,
  totalQuestions,
  onShare,
  onPause,
  onReset,
  gameState
}) => {
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-4">
          <h1 className="text-2xl font-bold text-green-800">{title}</h1>
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
            Câu {currentQuestionIndex + 1}/{totalQuestions}
          </div>
          <div className="flex gap-2">
            <Button onClick={onPause} variant="outline" size="sm">
              {gameState === 'playing' ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
            </Button>
            <Button onClick={onReset} variant="outline" size="sm">
              <RotateCcw className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
      <Progress value={(currentQuestionIndex / totalQuestions) * 100} className="mb-4" />
    </div>
  );
};

export default WhackMoleHeader;
