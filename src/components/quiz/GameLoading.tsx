
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
  const [statusText, setStatusText] = useState('Khởi tạo minigame...');
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
    <div className="flex flex-col items-center justify-center h-full bg-gradient-to-br from-background via-background/95 to-primary/5 p-6 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-r from-primary/3 via-blue-500/3 to-purple-500/3 animate-pulse" />
      <div className="absolute top-10 left-10 w-32 h-32 bg-primary/5 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-10 right-10 w-40 h-40 bg-blue-500/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      
      <div className="relative z-10 max-w-2xl w-full space-y-8">
        {/* Main Loading Animation */}
        <div className="flex flex-col items-center space-y-6">
          {/* Central Loading Spinner */}
          <div className="relative">
            <LoadingSpinner size="lg" variant="gradient" />
            <div className="absolute inset-0 flex items-center justify-center">
              <CurrentIcon className="h-8 w-8 text-primary animate-pulse" />
            </div>
          </div>
          
          {/* Title with Animation */}
          <div className="text-center space-y-3">
            <h2 className="text-3xl font-bold bg-gradient-to-r from-primary via-blue-600 to-purple-600 bg-clip-text text-transparent animate-fade-in">
              Đang tạo minigame...
            </h2>
            
            <div className="flex items-center justify-center gap-2 text-muted-foreground">
              <Sparkles className="h-4 w-4 animate-spin" />
              <p className="max-w-md">
                Đang tạo minigame cho chủ đề{' '}
                <span className="font-semibold text-primary bg-primary/10 px-2 py-1 rounded-lg">
                  {topic}
                </span>
              </p>
              <Sparkles className="h-4 w-4 animate-spin" style={{ animationDirection: 'reverse' }} />
            </div>
          </div>
        </div>
        
        {/* Progress Section */}
        <div className="space-y-6">
          <div className="bg-background/60 backdrop-blur-xl rounded-2xl p-6 border border-primary/10 shadow-lg">
            <div className="space-y-4">
              <Progress 
                value={progress} 
                className="h-4 bg-muted/30"
                indicatorColor="bg-gradient-to-r from-primary via-blue-500 to-purple-500"
                showPercentage={true}
              />
              
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <CurrentIcon className="h-4 w-4 text-primary animate-pulse" />
                  <span className="text-sm font-medium text-foreground">
                    {statusText}
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  {[...Array(3)].map((_, i) => (
                    <div 
                      key={i}
                      className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce"
                      style={{ animationDelay: `${i * 0.2}s` }}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
          
          {/* Tips Section */}
          <div className="bg-gradient-to-r from-primary/5 via-blue-500/5 to-purple-500/5 backdrop-blur-sm p-5 rounded-xl border border-primary/20">
            <div className="flex items-start gap-3">
              <div className="p-1.5 bg-primary/10 rounded-lg">
                <Crown className="w-4 h-4 text-primary" />
              </div>
              <div className="flex-1">
                <h4 className="font-medium text-foreground mb-1">Mẹo hay</h4>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Bạn có thể tạo minigame theo nhiều chủ đề và độ khó khác nhau, 
                  từ trò chơi giáo dục đến giải trí. AI sẽ tự động tối ưu game cho thiết bị của bạn.
                </p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Floating Animation Elements */}
        <div className="absolute top-0 left-1/4 w-2 h-2 bg-primary/40 rounded-full animate-bounce" style={{ animationDelay: '0s' }} />
        <div className="absolute top-1/4 right-1/4 w-1.5 h-1.5 bg-blue-500/40 rounded-full animate-bounce" style={{ animationDelay: '0.7s' }} />
        <div className="absolute bottom-1/3 left-1/3 w-1 h-1 bg-purple-500/40 rounded-full animate-bounce" style={{ animationDelay: '1.4s' }} />
      </div>
    </div>
  );
};

export default GameLoading;
