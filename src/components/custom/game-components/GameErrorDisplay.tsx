
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { AlertCircle, RefreshCw } from 'lucide-react';

interface GameErrorDisplayProps {
  error: string;
  onRetry: () => void;
}

const GameErrorDisplay: React.FC<GameErrorDisplayProps> = ({ error, onRetry }) => {
  return (
    <Card className="flex items-center justify-center h-full">
      <div className="text-center p-8 max-w-md">
        <AlertCircle className="h-16 w-16 mx-auto mb-4 text-destructive" />
        <h3 className="text-xl font-bold mb-2">Đã xảy ra lỗi</h3>
        <p className="text-muted-foreground mb-6">{error}</p>
        <Button onClick={onRetry} className="flex items-center gap-2">
          <RefreshCw className="h-4 w-4" />
          Thử lại
        </Button>
      </div>
    </Card>
  );
};

export default GameErrorDisplay;
