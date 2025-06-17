
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { RefreshCw } from 'lucide-react';

interface MatchingGameEndProps {
  gameWon: boolean;
  gameOver: boolean;
  totalPairs: number;
  matchedPairs: number;
  score: number;
  timeLeft: number;
  onRestart: () => void;
}

const MatchingGameEnd: React.FC<MatchingGameEndProps> = ({
  gameWon,
  gameOver,
  totalPairs,
  matchedPairs,
  score,
  timeLeft,
  onRestart
}) => {
  if (gameWon) {
    return (
      <div className="flex-1 flex items-center justify-center p-3 overflow-auto">
        <Card className="p-4 text-center max-w-sm w-full">
          <h2 className="text-xl font-bold mb-3">Chúc mừng!</h2>
          <p className="mb-2 text-sm">Hoàn thành với {totalPairs} cặp từ.</p>
          <p className="mb-2 text-lg font-bold text-primary">Điểm: {score}</p>
          <p className="mb-4 text-sm">
            Thời gian: {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
          </p>
          <Button onClick={onRestart} className="w-full">
            <RefreshCw className="mr-2 h-4 w-4" />
            Chơi lại
          </Button>
        </Card>
      </div>
    );
  }

  if (gameOver) {
    return (
      <div className="flex-1 flex items-center justify-center p-3 overflow-auto">
        <Card className="p-4 text-center max-w-sm w-full">
          <h2 className="text-xl font-bold mb-3">Hết thời gian!</h2>
          <p className="mb-2 text-sm">Ghép được {matchedPairs}/{totalPairs} cặp từ.</p>
          <p className="mb-2 text-lg font-bold text-primary">Điểm: {score}</p>
          <Button onClick={onRestart} className="w-full">
            <RefreshCw className="mr-2 h-4 w-4" />
            Chơi lại
          </Button>
        </Card>
      </div>
    );
  }

  return null;
};

export default MatchingGameEnd;
