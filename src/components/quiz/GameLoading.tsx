
import React from 'react';

interface GameLoadingProps {
  topic: string;
}

const GameLoading: React.FC<GameLoadingProps> = ({ topic }) => {
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
    </div>
  );
};

export default GameLoading;
