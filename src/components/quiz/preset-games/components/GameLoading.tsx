
import React from 'react';

interface GameLoadingProps {
  message?: string;
}

const GameLoading: React.FC<GameLoadingProps> = ({ message = "Đang tạo trò chơi với AI..." }) => {
  return (
    <div className="flex items-center justify-center h-full">
      <div className="text-center">
        <div className="h-12 w-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-lg font-medium">{message}</p>
        <p className="text-sm text-muted-foreground mt-2">Việc này có thể mất vài giây</p>
      </div>
    </div>
  );
};

export default GameLoading;
