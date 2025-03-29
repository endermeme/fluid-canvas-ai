
import React from 'react';
import { Loader2, X, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

interface GameLoadingErrorProps {
  isLoading: boolean;
  errorMessage: string | null;
  onRetry: () => void;
  topic: string;
}

const GameLoadingError = ({ isLoading, errorMessage, onRetry, topic }: GameLoadingErrorProps) => {
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-full w-full space-y-6 p-8 ocean-card">
        <div className="relative">
          <div className="absolute inset-0 animate-spin rounded-full blur-md bg-gradient-to-r from-primary to-sky-400"></div>
          <div className="relative bg-background rounded-full p-4">
            <Loader2 className="w-14 h-14 animate-spin text-primary" />
          </div>
        </div>
        <div>
          <p className="text-xl font-semibold text-center text-primary mb-2">Đang tạo minigame</p>
          <p className="text-muted-foreground text-center">Từ chủ đề: <span className="font-medium text-foreground">{topic}</span></p>
          <div className="mt-4 flex justify-center">
            <div className="typing-indicator">
              <span style={{ '--dot-index': '0' } as React.CSSProperties}></span>
              <span style={{ '--dot-index': '1' } as React.CSSProperties}></span>
              <span style={{ '--dot-index': '2' } as React.CSSProperties}></span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (errorMessage) {
    return (
      <div className="flex flex-col items-center justify-center h-full w-full space-y-6 p-8 ocean-card">
        <div className="relative">
          <div className="absolute inset-0 animate-pulse rounded-full blur-md bg-gradient-to-r from-red-400 to-red-500"></div>
          <div className="relative bg-background rounded-full p-4">
            <AlertCircle className="w-14 h-14 text-destructive" />
          </div>
        </div>
        <div className="max-w-md">
          <p className="text-xl font-semibold text-center mb-2">Không thể tạo Minigame</p>
          <p className="text-muted-foreground text-center">{errorMessage}</p>
        </div>
        <Button onClick={onRetry} size="lg" className="px-8">
          Thử Lại
        </Button>
      </div>
    );
  }

  return null;
};

export default GameLoadingError;
