
import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Trophy, RefreshCw } from 'lucide-react';

interface MemoryGameEndProps {
  gameWon: boolean;
  gameOver: boolean;
  moves: number;
  timeLeft: number;
  matchedPairs: number;
  totalPairs: number;
  onRestart: () => void;
}

const MemoryGameEnd: React.FC<MemoryGameEndProps> = ({
  gameWon,
  gameOver,
  moves,
  timeLeft,
  matchedPairs,
  totalPairs,
  onRestart
}) => {
  if (gameWon) {
    return (
      <div className="flex-1 flex items-center justify-center p-3 overflow-auto">
        <Card className="p-4 text-center max-w-sm w-full">
          <Trophy className="h-12 w-12 text-yellow-500 mx-auto mb-3" />
          <h2 className="text-xl font-bold mb-3 text-primary">Chúc mừng!</h2>
          <p className="mb-2 text-sm">Hoàn thành với {moves} lượt.</p>
          <p className="mb-4 text-sm">Thời gian: {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}</p>
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
          <h2 className="text-xl font-bold mb-3 text-destructive">Hết thời gian!</h2>
          <p className="mb-4 text-sm">Tìm được {matchedPairs}/{totalPairs} cặp thẻ.</p>
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

export default MemoryGameEnd;
