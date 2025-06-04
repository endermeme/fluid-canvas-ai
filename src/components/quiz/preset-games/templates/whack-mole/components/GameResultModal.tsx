
import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Trophy, Star, RotateCcw } from 'lucide-react';

interface GameResultModalProps {
  score: number;
  currentQuestionIndex: number;
  totalQuestions: number;
  hitMoles: number;
  onRestart: () => void;
  onBack?: () => void;
  pointsPerCorrect: number;
}

const GameResultModal: React.FC<GameResultModalProps> = ({
  score,
  currentQuestionIndex,
  totalQuestions,
  hitMoles,
  onRestart,
  onBack,
  pointsPerCorrect
}) => {
  const calculateStars = () => {
    const maxScore = totalQuestions * pointsPerCorrect;
    const percentage = (score / maxScore) * 100;
    if (percentage >= 80) return 3;
    if (percentage >= 60) return 2;
    if (percentage >= 40) return 1;
    return 0;
  };

  const stars = calculateStars();

  return (
    <div className="flex flex-col items-center justify-center h-full p-6">
      <Card className="p-8 max-w-md w-full text-center bg-gradient-to-br from-green-50 to-yellow-50">
        <Trophy className="h-20 w-20 text-yellow-500 mx-auto mb-6" />
        <h2 className="text-3xl font-bold mb-4 text-green-800">Hết giờ!</h2>
        
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
          <p>Điểm số: <span className="font-bold text-green-600 text-2xl">{score}</span></p>
          <p>Câu đã trả lời: <span className="font-semibold">{currentQuestionIndex}/{totalQuestions}</span></p>
          <p>Chuột đã đập: <span className="font-semibold">{hitMoles}</span></p>
          <p>Độ chính xác: <span className="font-semibold">
            {hitMoles > 0 ? Math.round((score / (hitMoles * pointsPerCorrect)) * 100) : 0}%
          </span></p>
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
              className="flex-1 bg-gradient-to-r from-green-600 to-yellow-600 hover:from-green-700 hover:to-yellow-700"
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
