
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
      <div className="flex flex-col items-center justify-center h-full w-full space-y-8 p-8 bg-gradient-to-b from-sky-50 to-white dark:from-sky-900/30 dark:to-slate-900/80 rounded-xl shadow-lg">
        <div className="relative">
          <div className="absolute inset-0 animate-spin rounded-full blur-md bg-gradient-to-r from-primary to-blue-400"></div>
          <div className="relative bg-white dark:bg-slate-800 rounded-full p-4 shadow-lg">
            <Loader2 className="w-16 h-16 animate-spin text-primary" />
          </div>
        </div>
        <div className="bg-white/80 dark:bg-slate-800/50 backdrop-blur-md rounded-xl p-6 shadow-lg border border-sky-100 dark:border-sky-800/30 max-w-md">
          <p className="text-2xl font-bold text-center text-primary mb-3">Đang tạo minigame</p>
          <p className="text-slate-600 dark:text-slate-300 text-center">Từ chủ đề: <span className="font-medium text-slate-800 dark:text-white">{topic}</span></p>
          <div className="mt-6 flex justify-center">
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
      <div className="flex flex-col items-center justify-center h-full w-full space-y-8 p-8 bg-gradient-to-b from-sky-50 to-white dark:from-sky-900/30 dark:to-slate-900/80 rounded-xl shadow-lg">
        <div className="relative">
          <div className="absolute inset-0 animate-pulse rounded-full blur-md bg-gradient-to-r from-red-400 to-red-500"></div>
          <div className="relative bg-white dark:bg-slate-800 rounded-full p-4 shadow-lg">
            <AlertCircle className="w-16 h-16 text-destructive" />
          </div>
        </div>
        <div className="bg-white/80 dark:bg-slate-800/50 backdrop-blur-md rounded-xl p-6 shadow-lg border border-red-100 dark:border-red-900/30 max-w-md">
          <p className="text-2xl font-bold text-center mb-3 text-destructive">Không thể tạo Minigame</p>
          <p className="text-slate-600 dark:text-slate-300 text-center">{errorMessage}</p>
          <div className="mt-6 flex justify-center">
            <Button onClick={onRetry} size="lg" className="px-8 bg-gradient-to-r from-primary to-blue-500 hover:from-primary/90 hover:to-blue-600 shadow-md">
              Thử Lại
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return null;
};

export default GameLoadingError;
