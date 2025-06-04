
import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Trophy, Star, RotateCcw } from 'lucide-react';

interface GameResultModalProps {
  score: number;
  answeredQuestions: number;
  totalQuestions: number;
  timeLeft: number;
  onRestart: () => void;
  onBack?: () => void;
}

const GameResultModal: React.FC<GameResultModalProps> = ({
  score,
  answeredQuestions,
  totalQuestions,
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
    <div className="flex flex-col items-center justify-center min-h-[500px] p-6">
      <Card className="p-8 max-w-md w-full text-center bg-gradient-to-br from-purple-50 to-pink-50">
        <Trophy className="h-20 w-20 text-yellow-500 mx-auto mb-6" />
        <h2 className="text-3xl font-bold mb-4 text-purple-800">Hoàn thành!</h2>
        
        <div className="flex justify-center mb-6">
          {[1, 2, 3].map((star) => (
            <Star
              key={star}
              className={`h-10 w-10 ${
                star <= stars ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'
              }`}
            />
          ))}
        </div>
        
        <div className="space-y-3 mb-8 text-lg">
          <p>Điểm số: <span className="font-bold text-purple-600 text-2xl">{score}</span></p>
          <p>Câu đã trả lời: <span className="font-semibold">{answeredQuestions}/{totalQuestions}</span></p>
          <p>Thời gian còn lại: <span className="font-semibold">{formatTime(timeLeft)}</span></p>
          <p>Độ chính xác: <span className="font-semibold">{Math.round((score / (answeredQuestions * 10)) * 100)}%</span></p>
        </div>
        
        <div className="flex gap-3 justify-center">
          <Button 
            onClick={onRestart} 
            variant="outline"
            className="flex-1"
          >
            <RotateCcw className="h-4 w-4 mr-2" />
            Chơi lại
          </Button>
          {onBack && (
            <Button 
              onClick={onBack}
              className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
            >
              Về trang chủ
            </Button>
          )}
        </div>
      </Card>
    </div>
  );
};

export default GameResultModal;
