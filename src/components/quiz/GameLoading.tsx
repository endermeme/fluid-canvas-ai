
import React from 'react';
import { Loader2 } from 'lucide-react';

const GameLoading: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center h-full w-full space-y-4">
      <Loader2 className="w-12 h-12 animate-spin text-primary" />
      <p className="text-lg">Đang tạo minigame từ chủ đề của bạn...</p>
    </div>
  );
};

export default GameLoading;
