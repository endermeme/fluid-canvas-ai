
import React from 'react';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';

interface GameErrorProps {
  error: string | null;
  onBack: () => void;
  onRetry: () => void;
}

const GameError: React.FC<GameErrorProps> = ({ error, onBack, onRetry }) => {
  return (
    <div className="flex flex-col items-center justify-center h-full">
      <div className="text-center">
        <h3 className="text-xl font-bold mb-2">Đã xảy ra lỗi</h3>
        <p className="text-gray-500 mb-4">{error}</p>
        <div className="flex gap-2">
          <Button onClick={onBack}>Quay lại</Button>
          <Button onClick={onRetry} variant="outline">
            <RefreshCw className="h-4 w-4 mr-2" />
            Thử lại
          </Button>
        </div>
      </div>
    </div>
  );
};

export default GameError;
