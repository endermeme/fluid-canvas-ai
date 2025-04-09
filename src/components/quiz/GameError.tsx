
import React from 'react';
import { Button } from '@/components/ui/button';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface GameErrorProps {
  errorMessage: string;
  onRetry: () => void;
  topic: string;
}

const GameError: React.FC<GameErrorProps> = ({ errorMessage, onRetry, topic }) => {
  return (
    <div className="flex flex-col items-center justify-center h-full bg-gradient-to-b from-background to-background/80 p-6">
      <div className="mb-6 bg-destructive/10 p-4 rounded-full">
        <AlertTriangle className="h-12 w-12 text-destructive" />
      </div>
      
      <h2 className="text-2xl font-bold text-center mb-4 text-destructive">
        Không thể tạo minigame
      </h2>
      
      <p className="text-center text-muted-foreground max-w-md mb-6">
        {errorMessage}
      </p>
      
      <p className="text-center text-sm text-muted-foreground mb-8">
        Chủ đề: <span className="font-medium">{topic}</span>
      </p>
      
      <div className="flex gap-4">
        <Button 
          onClick={onRetry}
          className="bg-primary/90 hover:bg-primary flex items-center gap-2"
        >
          <RefreshCw className="h-4 w-4" />
          Thử lại
        </Button>
      </div>
    </div>
  );
};

export default GameError;
