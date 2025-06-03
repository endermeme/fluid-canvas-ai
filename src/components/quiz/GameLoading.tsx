
import React, { useState, useEffect } from 'react';
import { Progress } from '@/components/ui/progress';
import { Sparkles, Crown, Brain } from 'lucide-react';

interface GameLoadingProps {
  topic: string;
  progress?: number;
}

const GameLoading: React.FC<GameLoadingProps> = ({ topic, progress: externalProgress }) => {
  const [progress, setProgress] = useState(0);
  const [statusText, setStatusText] = useState('Khởi tạo minigame...');
  
  useEffect(() => {
    // If external progress is provided, use it instead of internal progress
    if (externalProgress !== undefined) {
      setProgress(externalProgress);
      
      // Update status text based on progress
      if (externalProgress < 20) {
        setStatusText('Đang phân tích chủ đề...');
      } else if (externalProgress < 40) {
        setStatusText('Đang thiết kế câu hỏi và nội dung...');
      } else if (externalProgress < 60) {
        setStatusText('Đang tạo giao diện trò chơi...');
      } else if (externalProgress < 80) {
        setStatusText('Đang tối ưu hóa trải nghiệm người chơi...');
      } else {
        setStatusText('Hoàn thiện trò chơi...');
      }
      
      return;
    }
    
    // If no external progress is provided, simulate progress
    const timer = setInterval(() => {
      setProgress(prevProgress => {
        if (prevProgress >= 95) {
          clearInterval(timer);
          setStatusText('Chuẩn bị hiển thị trò chơi...');
          return prevProgress;
        }
        
        // Update status text based on progress
        if (prevProgress < 20) {
          setStatusText('Đang phân tích chủ đề...');
        } else if (prevProgress < 40) {
          setStatusText('Đang thiết kế câu hỏi và nội dung...');
        } else if (prevProgress < 60) {
          setStatusText('Đang tạo giao diện trò chơi...');
        } else if (prevProgress < 80) {
          setStatusText('Đang tối ưu hóa trải nghiệm người chơi...');
        } else {
          setStatusText('Hoàn thiện trò chơi...');
        }
        
        return prevProgress + Math.random() * 5 + 1;
      });
    }, 400);
    
    return () => clearInterval(timer);
  }, [externalProgress]);

  return (
    <div className="flex flex-col items-center justify-center h-full bg-gradient-to-b from-background to-background/90 p-6">
      <div className="mb-8 relative">
        <div className="h-16 w-16 rounded-full border-4 border-primary/20 border-t-primary animate-spin"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="relative">
            <Brain className="h-8 w-8 text-primary/50" />
            <Sparkles className="h-4 w-4 text-primary absolute top-0 right-0 animate-pulse" />
          </div>
        </div>
      </div>
      
      <h2 className="text-2xl font-bold text-center mb-2 text-primary">
        Đang tạo minigame...
      </h2>
      
      <p className="text-center text-muted-foreground max-w-md mb-6">
        Đang tạo minigame cho chủ đề <span className="font-medium text-primary/80">{topic}</span>.
        Quá trình này có thể mất một chút thời gian.
      </p>
      
      <div className="w-full max-w-md space-y-3">
        <Progress value={progress} className="h-2.5" />
        
        <div className="flex justify-between items-center text-sm text-muted-foreground">
          <span>{statusText}</span>
          <span className="bg-primary/10 px-2 py-0.5 rounded-full text-xs font-medium">
            {Math.round(progress)}%
          </span>
        </div>
        
        <div className="mt-8 bg-primary/5 p-3 rounded-lg border border-primary/10 text-sm">
          <p className="text-center text-muted-foreground">
            Mẹo: Bạn có thể tạo minigame theo nhiều chủ đề và độ khó khác nhau, từ trò chơi giáo dục đến giải trí.
          </p>
        </div>
      </div>
    </div>
  );
};

export default GameLoading;
