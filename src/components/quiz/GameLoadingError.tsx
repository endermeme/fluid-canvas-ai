
import React from 'react';
import { Loader2, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface GameLoadingErrorProps {
  isLoading: boolean;
  errorMessage: string | null;
  onRetry: () => void;
  topic: string;
}

const GameLoadingError = ({ isLoading, errorMessage, onRetry, topic }: GameLoadingErrorProps) => {
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-full w-full space-y-4">
        <Loader2 className="w-12 h-12 animate-spin text-primary" />
        <p className="text-lg">Đang tạo minigame từ chủ đề của bạn...</p>
      </div>
    );
  }

  if (errorMessage) {
    return (
      <div className="flex flex-col items-center justify-center h-full w-full space-y-6">
        <div className="text-red-500">
          <X size={48} />
        </div>
        <p className="text-lg text-center">{errorMessage}</p>
        <Button onClick={onRetry} size="lg">Thử Lại</Button>
      </div>
    );
  }

  return null;
};

export default GameLoadingError;
