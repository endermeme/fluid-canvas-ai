
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
  const [timeRemaining, setTimeRemaining] = useState('');
  
  useEffect(() => {
    // If external progress is provided, use it instead of internal progress
    if (externalProgress !== undefined) {
      setProgress(externalProgress);
      
      // Tính thời gian còn lại dựa trên tiến trình (10 phút tổng cộng)
      const totalSeconds = 600; // 10 phút
      const remainingSeconds = Math.round((100 - externalProgress) / 100 * totalSeconds);
      const minutes = Math.floor(remainingSeconds / 60);
      const seconds = remainingSeconds % 60;
      
      if (remainingSeconds > 0) {
        setTimeRemaining(`Còn lại khoảng ${minutes}:${seconds.toString().padStart(2, '0')}`);
      } else {
        setTimeRemaining('Sắp hoàn thành...');
      }
      
      // Update status text based on progress
      if (externalProgress < 10) {
        setStatusText('Đang phân tích chủ đề và yêu cầu...');
      } else if (externalProgress < 25) {
        setStatusText('Đang thiết kế cấu trúc game và logic...');
      } else if (externalProgress < 40) {
        setStatusText('Đang tạo nội dung và câu hỏi...');
      } else if (externalProgress < 55) {
        setStatusText('Đang xây dựng giao diện người dùng...');
      } else if (externalProgress < 70) {
        setStatusText('Đang tối ưu hóa trải nghiệm chơi...');
      } else if (externalProgress < 85) {
        setStatusText('Đang kiểm tra và hoàn thiện code...');
      } else if (externalProgress < 95) {
        setStatusText('Đang chuẩn bị trò chơi...');
      } else {
        setStatusText('Hoàn thành! Đang khởi động game...');
      }
      
      return;
    }
    
    // If no external progress is provided, simulate 10-minute progress
    const timer = setInterval(() => {
      setProgress(prevProgress => {
        if (prevProgress >= 95) {
          clearInterval(timer);
          setStatusText('Chuẩn bị hiển thị trò chơi...');
          setTimeRemaining('Sắp hoàn thành...');
          return prevProgress;
        }
        
        const newProgress = prevProgress + (100 / 600); // 600 giây = 10 phút
        
        // Tính thời gian còn lại
        const totalSeconds = 600;
        const remainingSeconds = Math.round((100 - newProgress) / 100 * totalSeconds);
        const minutes = Math.floor(remainingSeconds / 60);
        const seconds = remainingSeconds % 60;
        
        if (remainingSeconds > 0) {
          setTimeRemaining(`Còn lại khoảng ${minutes}:${seconds.toString().padStart(2, '0')}`);
        } else {
          setTimeRemaining('Sắp hoàn thành...');
        }
        
        // Update status text based on progress
        if (newProgress < 10) {
          setStatusText('Đang phân tích chủ đề và yêu cầu...');
        } else if (newProgress < 25) {
          setStatusText('Đang thiết kế cấu trúc game và logic...');
        } else if (newProgress < 40) {
          setStatusText('Đang tạo nội dung và câu hỏi...');
        } else if (newProgress < 55) {
          setStatusText('Đang xây dựng giao diện người dùng...');
        } else if (newProgress < 70) {
          setStatusText('Đang tối ưu hóa trải nghiệm chơi...');
        } else if (newProgress < 85) {
          setStatusText('Đang kiểm tra và hoàn thiện code...');
        } else if (newProgress < 95) {
          setStatusText('Đang chuẩn bị trò chơi...');
        } else {
          setStatusText('Hoàn thành! Đang khởi động game...');
        }
        
        return newProgress;
      });
    }, 1000); // Cập nhật mỗi giây
    
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
        Quá trình này sẽ mất khoảng 10 phút để đảm bảo chất lượng tốt nhất.
      </p>
      
      <div className="w-full max-w-md space-y-3">
        <Progress value={progress} className="h-3" />
        
        <div className="flex justify-between items-center text-sm text-muted-foreground">
          <span>{statusText}</span>
          <span className="bg-primary/10 px-2 py-0.5 rounded-full text-xs font-medium">
            {Math.round(progress)}%
          </span>
        </div>
        
        {timeRemaining && (
          <div className="text-center text-xs text-muted-foreground/80">
            {timeRemaining}
          </div>
        )}
        
        <div className="mt-8 bg-primary/5 p-4 rounded-lg border border-primary/10 text-sm">
          <p className="text-center text-muted-foreground mb-2">
            <strong>Lưu ý:</strong> Thời gian tạo game dài để đảm bảo chất lượng cao nhất.
          </p>
          <p className="text-center text-muted-foreground text-xs">
            Bạn có thể rời khỏi trang này và quay lại sau. Game sẽ được lưu tự động.
          </p>
        </div>
      </div>
    </div>
  );
};

export default GameLoading;
