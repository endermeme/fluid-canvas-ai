
import React from 'react';
import { Button } from '@/components/ui/button';
import { AlertCircle, RefreshCw, Frown } from 'lucide-react';

interface GameErrorProps {
  errorMessage: string;
  onRetry: () => void;
  topic: string;
}

const GameError: React.FC<GameErrorProps> = ({ errorMessage, onRetry, topic }) => {
  return (
    <div className="h-full flex flex-col items-center justify-center p-8 bg-gradient-to-b from-background to-background/95">
      <div className="w-20 h-20 rounded-full bg-destructive/10 flex items-center justify-center mb-6">
        <Frown className="h-10 w-10 text-destructive" />
      </div>
      
      <h2 className="text-2xl font-bold mb-2 text-center">Đã xảy ra lỗi</h2>
      <p className="text-lg text-center text-muted-foreground mb-4">
        Chủ đề: <span className="font-medium text-foreground">{topic}</span>
      </p>
      
      <div className="max-w-md text-center p-4 bg-destructive/5 rounded-lg border border-destructive/20 mb-6">
        <div className="flex items-start">
          <AlertCircle className="h-5 w-5 text-destructive mt-0.5 mr-2 flex-shrink-0" />
          <p className="text-destructive/90">{errorMessage}</p>
        </div>
      </div>
      
      <Button onClick={onRetry} className="mb-4">
        <RefreshCw className="h-4 w-4 mr-2" />
        Thử lại
      </Button>
      
      <p className="text-sm text-center text-muted-foreground max-w-md">
        Nếu vấn đề vẫn tiếp diễn, hãy thử với một chủ đề khác hoặc kiểm tra kết nối mạng của bạn.
      </p>
    </div>
  );
};

export default GameError;
