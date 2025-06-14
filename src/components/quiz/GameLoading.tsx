import React, { useState, useEffect } from 'react';
import { Progress } from '@/components/ui/progress';
import { Sparkles, Crown, Brain, Zap, Star } from 'lucide-react';
import LoadingSpinner from './custom-games/game-components/LoadingSpinner';

interface GameLoadingProps {
  topic: string;
  progress?: number;
}

const GameLoading: React.FC<GameLoadingProps> = ({ topic, progress: externalProgress }) => {
  const [progress, setProgress] = useState(0);
  const [statusText, setStatusText] = useState('Đang chuẩn bị...');
  const [currentIcon, setCurrentIcon] = useState(0);
  
  const statusIcons = [Brain, Sparkles, Zap, Star, Crown];
  const statusMessages = [
    'Đang phân tích chủ đề...',
    'Đang thiết kế câu hỏi và nội dung...',
    'Đang tạo giao diện trò chơi...',
    'Đang tối ưu hóa trải nghiệm...',
    'Hoàn thiện trò chơi...'
  ];
  
  useEffect(() => {
    // Icon rotation effect
    const iconInterval = setInterval(() => {
      setCurrentIcon(prev => (prev + 1) % statusIcons.length);
    }, 1500);
    
    return () => clearInterval(iconInterval);
  }, []);
  
  useEffect(() => {
    if (externalProgress !== undefined) {
      setProgress(externalProgress);
      
      // Update status based on progress
      const statusIndex = Math.floor((externalProgress / 100) * statusMessages.length);
      setStatusText(statusMessages[Math.min(statusIndex, statusMessages.length - 1)]);
      return;
    }
    
    // Simulate progress if no external progress
    const timer = setInterval(() => {
      setProgress(prevProgress => {
        if (prevProgress >= 95) {
          clearInterval(timer);
          setStatusText('Chuẩn bị hiển thị trò chơi...');
          return prevProgress;
        }
        
        const newProgress = prevProgress + Math.random() * 5 + 1;
        const statusIndex = Math.floor((newProgress / 100) * statusMessages.length);
        setStatusText(statusMessages[Math.min(statusIndex, statusMessages.length - 1)]);
        
        return newProgress;
      });
    }, 400);
    
    return () => clearInterval(timer);
  }, [externalProgress]);

  const CurrentIcon = statusIcons[currentIcon];

  return (
    <div className="flex flex-col items-center justify-center h-full bg-background transition-colors p-4">
      <div className="w-full max-w-md shadow-md rounded-xl bg-card/70 p-8 border border-border flex flex-col items-center gap-8">
        {/* Loading Spinner */}
        <LoadingSpinner size="lg" />
        <div className="text-center space-y-3">
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground">Đang tạo minigame...</h2>
          <p className="text-sm text-muted-foreground">
            Hệ thống đang tạo minigame cho chủ đề&nbsp;
            <span className="font-semibold text-primary bg-primary/10 px-2 py-1 rounded-lg">{topic}</span>
          </p>
        </div>
        <Progress 
          value={progress} 
          className="h-3"
          indicatorColor="bg-primary"
          showPercentage={true}
        />
        <div className="w-full flex justify-between text-xs text-muted-foreground">
          <span>{statusText}</span>
          <span className="font-semibold text-primary">{Math.round(progress)}%</span>
        </div>
        <div className="w-full space-y-2 pt-3">
          <div className="flex flex-col gap-2">
            <span className="block h-4 w-4/5 bg-muted rounded shimmer-effect" />
            <span className="block h-4 w-2/3 bg-muted rounded shimmer-effect" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default GameLoading;
