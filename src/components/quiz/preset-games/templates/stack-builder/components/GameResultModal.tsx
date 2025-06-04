
import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Trophy, Star, RotateCcw } from 'lucide-react';

interface GameResultModalProps {
  score: number;
  totalSequences: number;
  currentSequence: number;
  timeLeft: number;
  onRestart: () => void;
  onBack?: () => void;
}

const GameResultModal: React.FC<GameResultModalProps> = ({
  score,
  totalSequences,
  currentSequence,
  timeLeft,
  onRestart,
  onBack
}) => {
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const calculateStars = () => {
    const maxScore = totalSequences * 20; // Assuming 20 points per correct sequence
    const percentage = (score / maxScore) * 100;
    if (percentage >= 90) return 3;
    if (percentage >= 70) return 2;
    if (percentage >= 50) return 1;
    return 0;
  };

  const stars = calculateStars();

  return (
    <div className="result-modal-overlay">
      <Card className="result-modal">
        <Trophy className="result-trophy" />
        <h2 className="result-title">Hoàn thành!</h2>
        
        <div className="stars-container">
          {[1, 2, 3].map((star) => (
            <Star
              key={star}
              className={`star ${star <= stars ? 'star-filled' : 'star-empty'}`}
            />
          ))}
        </div>
        
        <div className="result-stats">
          <p className="final-score">Điểm số: <span>{score}</span></p>
          <p>Chuỗi hoàn thành: {currentSequence}/{totalSequences}</p>
          <p>Thời gian còn lại: {formatTime(timeLeft)}</p>
        </div>
        
        <div className="result-actions">
          <Button onClick={onRestart} variant="outline">
            <RotateCcw className="h-4 w-4 mr-2" />
            Chơi lại
          </Button>
          {onBack && (
            <Button onClick={onBack}>
              Về trang chủ
            </Button>
          )}
        </div>
      </Card>
    </div>
  );
};

export default GameResultModal;
