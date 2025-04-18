
import React from 'react';

interface GameLoadingProps {
  topic: string;
  progress?: number; // Adding the missing progress prop
}

const GameLoading: React.FC<GameLoadingProps> = ({ topic, progress }) => {
  return (
    <div className="h-full w-full flex flex-col items-center justify-center p-6">
      <div className="mb-4">
        <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
      </div>
      <h2 className="text-xl font-semibold mb-2">Đang tạo trò chơi...</h2>
      <p className="text-center text-muted-foreground">
        Đang xây dựng trò chơi tương tác về "{topic || 'chủ đề được chọn'}".<br />
        Quá trình này có thể mất một vài giây.
      </p>
      
      {progress !== undefined && (
        <div className="w-64 mt-4 bg-primary/10 rounded-full h-2.5 overflow-hidden">
          <div 
            className="bg-primary h-2.5 rounded-full transition-all" 
            style={{width: `${Math.min(100, progress)}%`}}
          ></div>
        </div>
      )}
    </div>
  );
};

export default GameLoading;
