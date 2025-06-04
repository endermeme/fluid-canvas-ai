
import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Trophy, Star, RotateCcw } from 'lucide-react';

interface GameResultModalProps {
  score: number;
  caughtObjects: {correct: number, wrong: number};
  onRestart: () => void;
  onBack?: () => void;
}

const GameResultModal: React.FC<GameResultModalProps> = ({
  score,
  caughtObjects,
  onRestart,
  onBack
}) => {
  const calculateStars = () => {
    const accuracy = caughtObjects.correct + caughtObjects.wrong > 0 
      ? (caughtObjects.correct / (caughtObjects.correct + caughtObjects.wrong)) * 100 
      : 0;
    if (accuracy >= 90) return 3;
    if (accuracy >= 70) return 2;
    if (accuracy >= 50) return 1;
    return 0;
  };

  const stars = calculateStars();
  const accuracy = Math.round((caughtObjects.correct / (caughtObjects.correct + caughtObjects.wrong || 1)) * 100);

  return (
    <div className="result-modal-overlay">
      <Card className="result-modal">
        <Trophy className="result-trophy" />
        <h2 className="result-title">Hết giờ!</h2>
        
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
          <p>Bắt đúng: {caughtObjects.correct}</p>
          <p>Bắt sai: {caughtObjects.wrong}</p>
          <p>Độ chính xác: {accuracy}%</p>
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
