
import React from 'react';
import { Loader2 } from 'lucide-react';

interface GameLoadingProps {
  topic: string;
}

const GameLoading: React.FC<GameLoadingProps> = ({ topic }) => {
  return (
    <div className="h-full flex flex-col items-center justify-center bg-gradient-to-b from-background to-background/90 p-8">
      <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center mb-6">
        <Loader2 className="h-12 w-12 text-primary animate-spin" />
      </div>
      
      <h2 className="text-2xl font-bold mb-2 text-center">Đang tạo trò chơi</h2>
      <p className="text-lg text-center text-muted-foreground mb-6">
        Chủ đề: <span className="font-medium text-foreground">{topic}</span>
      </p>
      
      <div className="max-w-md text-center space-y-2">
        <div className="h-4 bg-primary/10 rounded animate-pulse"></div>
        <div className="h-4 bg-primary/10 rounded animate-pulse" style={{ width: '80%', margin: '0 auto' }}></div>
        <div className="h-4 bg-primary/10 rounded animate-pulse" style={{ width: '60%', margin: '0 auto' }}></div>
      </div>
      
      <div className="mt-8 text-sm text-center text-muted-foreground">
        <p>Quá trình này có thể mất vài giây...</p>
      </div>
    </div>
  );
};

export default GameLoading;
