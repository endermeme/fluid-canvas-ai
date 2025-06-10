
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { RefreshCw } from 'lucide-react';
import PresetGameHeader from '../PresetGameHeader';

interface GameErrorDisplayProps {
  error: string;
  onBack: () => void;
  onRetry: () => void;
}

const GameErrorDisplay: React.FC<GameErrorDisplayProps> = ({ error, onBack, onRetry }) => {
  return (
    <div className="flex flex-col items-center justify-center h-full">
      <PresetGameHeader 
        showShare={false} 
        isGameCreated={false}
        onBack={onBack}
      />
      <Card className="p-6 max-w-md mt-4">
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
      </Card>
    </div>
  );
};

export default GameErrorDisplay;
