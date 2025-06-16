
import React, { useEffect } from 'react';
import { Progress } from '@/components/ui/progress';
import { Sparkles, Crown, Brain } from 'lucide-react';
import { useLoadingProgress } from '@/hooks/useLoadingProgress';
import BackgroundParticles from '@/components/ui/background-particles';

interface GameLoadingProps {
  topic: string;
  progress?: number;
}

const GameLoading: React.FC<GameLoadingProps> = ({ topic, progress: externalProgress }) => {
  const { progress, statusText, startProgress, resetProgress } = useLoadingProgress({
    stages: [
      'Đang phân tích chủ đề...',
      'Đang thiết kế câu hỏi và nội dung...',
      'Đang tạo giao diện trò chơi...',
      'Đang tối ưu hóa trải nghiệm người chơi...',
      'Hoàn thiện trò chơi...'
    ],
    stageDuration: 1200,
    finalStageDelay: 600
  });

  const currentProgress = externalProgress !== undefined ? Math.min(Math.max(externalProgress, 0), 100) : progress;
  const currentStatus = externalProgress !== undefined ? getStatusForProgress(externalProgress) : statusText;

  useEffect(() => {
    if (externalProgress === undefined) {
      startProgress();
    } else {
      resetProgress();
    }
  }, [externalProgress, startProgress, resetProgress]);

  function getStatusForProgress(prog: number): string {
    if (prog < 20) return 'Đang phân tích chủ đề...';
    if (prog < 40) return 'Đang thiết kế câu hỏi và nội dung...';
    if (prog < 60) return 'Đang tạo giao diện trò chơi...';
    if (prog < 80) return 'Đang tối ưu hóa trải nghiệm người chơi...';
    return 'Hoàn thiện trò chơi...';
  }

  return (
    <div className="flex flex-col items-center justify-center h-full bg-gradient-to-b from-background to-background/90 p-6 relative overflow-hidden">
      <BackgroundParticles particleCount={12} />
      
      <div className="relative z-10 w-full max-w-lg">
        <div className="mb-8 relative flex justify-center">
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
        
        <p className="text-center text-muted-foreground max-w-md mb-8 mx-auto">
          Đang tạo minigame cho chủ đề <span className="font-medium text-primary/80">{topic}</span>.
          Quá trình này có thể mất một chút thời gian.
        </p>
        
        <div className="w-full space-y-4">
          <div className="relative">
            <Progress 
              value={currentProgress} 
              className="h-3 bg-muted/30"
              indicatorColor="bg-gradient-to-r from-blue-500 to-sky-500"
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="bg-white/90 dark:bg-slate-900/90 px-2 py-0.5 rounded-full text-xs font-bold text-primary">
                {Math.round(currentProgress)}%
              </div>
            </div>
          </div>
          
          <div className="text-center">
            <p className="text-sm text-muted-foreground font-medium">
              {currentStatus}
            </p>
          </div>
          
          <div className="mt-6 bg-primary/5 p-4 rounded-lg border border-primary/10 text-sm">
            <p className="text-center text-muted-foreground">
              <Crown className="w-4 h-4 inline mr-2 text-primary" />
              Mẹo: Bạn có thể tạo minigame theo nhiều chủ đề và độ khó khác nhau, từ trò chơi giáo dục đến giải trí.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GameLoading;
