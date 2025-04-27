
import React from 'react';
import { Progress } from '@/components/ui/progress';

interface GameLoadingProps {
  topic: string;
  progress: number;
}

const GameLoading: React.FC<GameLoadingProps> = ({ topic, progress }) => {
  return (
    <div className="flex flex-col items-center justify-center h-full p-6">
      <div className="w-full max-w-md text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto mb-4"></div>
        <h3 className="text-lg font-medium mb-2">Đang tạo game...</h3>
        <p className="text-muted-foreground mb-4">
          {topic ? `Chủ đề: ${topic}` : 'Đang chuẩn bị nội dung game'}
        </p>
        <Progress value={progress} className="h-2" />
        <p className="mt-2 text-sm text-muted-foreground">{Math.round(progress)}%</p>
      </div>
    </div>
  );
};

export default GameLoading;
