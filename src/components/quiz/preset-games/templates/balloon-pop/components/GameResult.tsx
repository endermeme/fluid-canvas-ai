
import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Trophy, Star, RotateCcw } from 'lucide-react';

interface GameResultProps {
  score: number;
  totalQuestions: number;
  poppedBalloons: number;
  timeLeft: number;
  onRestart: () => void;
  onBack?: () => void;
}

const GameResult: React.FC<GameResultProps> = ({
  score,
  totalQuestions,
  poppedBalloons,
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
    const percentage = (score / (totalQuestions * 10)) * 100;
    if (percentage >= 90) return 3;
    if (percentage >= 70) return 2;
    if (percentage >= 50) return 1;
    return 0;
  };

  const stars = calculateStars();

  return (
    <div className="result-screen">
      <div className="result-container">
        <Card className="result-card">
          <div className="result-header">
            <Trophy className="h-20 w-20 text-yellow-500 mx-auto mb-4" />
            <h2 className="text-4xl font-bold mb-4 text-gray-800">
              🎉 Hoàn thành!
            </h2>
          </div>
          
          <div className="stars-display">
            {[1, 2, 3].map((star) => (
              <Star
                key={star}
                className={`h-12 w-12 ${
                  star <= stars ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'
                }`}
              />
            ))}
          </div>
          
          <div className="result-stats">
            <div className="stat-item">
              <span className="stat-label">🏆 Điểm số:</span>
              <span className="stat-value">{score}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">🎈 Bóng bay đã nổ:</span>
              <span className="stat-value">{poppedBalloons}/{totalQuestions}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">⏱️ Thời gian còn lại:</span>
              <span className="stat-value">{formatTime(timeLeft)}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">📊 Độ chính xác:</span>
              <span className="stat-value">
                {Math.round((score / (totalQuestions * 10)) * 100)}%
              </span>
            </div>
          </div>
          
          <div className="result-actions">
            <Button onClick={onRestart} variant="outline" className="action-button">
              <RotateCcw className="h-5 w-5 mr-2" />
              🔄 Chơi lại
            </Button>
            {onBack && (
              <Button onClick={onBack} className="action-button primary">
                🏠 Về trang chủ
              </Button>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default GameResult;
