import React from 'react';
import { useEffect, useState } from 'react';
import { Progress } from '@/components/ui/progress';
import { Sparkles, Crown, Brain } from 'lucide-react';

interface GameLoadingProps {
  topic?: string;
  message?: string;
  progress?: number;
}

const loadingMessages = [
  "Đang khởi động trí tuệ nhân tạo...",
  "Đang nghiên cứu chủ đề của bạn...",
  "Đang tạo các câu hỏi thông minh...",
  "Đang thiết kế giao diện game...",
  "Đang thiết lập rules cho game...",
  "Đang tối ưu hóa trải nghiệm người dùng...",
  "Đang kết nối với máy chủ AI...",
  "Đang sáng tạo nội dung game...",
  "Dễ chưa? Đang cố gắng làm cho game thêm thú vị...",
  "Thế này là đủ khó chưa nhỉ?",
  "Thêm một chút phép màu cho game...",
  "Còn chút nữa thôi...",
  "Sắp hoàn thành rồi...",
];

const GameLoading: React.FC<GameLoadingProps> = ({ topic = "loading", message, progress: externalProgress }) => {
  const [loadingIndex, setLoadingIndex] = useState(0);
  const [dots, setDots] = useState('');
  const [progress, setProgress] = useState(0);
  const [statusText, setStatusText] = useState('Khởi tạo minigame...');
  
  // Nếu có message được truyền vào, sử dụng nó, ngược lại sử dụng thông báo tự động
  const displayMessage = message || loadingMessages[loadingIndex];
  
  // Hiệu ứng thay đổi thông báo và dots
  useEffect(() => {
    // Hàm thay đổi số lượng dots
    const dotsInterval = setInterval(() => {
      setDots(prev => prev.length < 3 ? prev + '.' : '');
    }, 400);
    
    // Chỉ thay đổi thông báo nếu không có message được truyền vào
    let messagesInterval: NodeJS.Timeout | null = null;
    if (!message) {
      messagesInterval = setInterval(() => {
        setLoadingIndex(prev => (prev + 1) % loadingMessages.length);
      }, 3000);
    }
    
    return () => {
      clearInterval(dotsInterval);
      if (messagesInterval) clearInterval(messagesInterval);
    };
  }, [message]);

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
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-background to-background/80 p-4">
      <div className="relative mb-12 flex items-center justify-center">
        <div className="absolute inset-0 rounded-full bg-primary/5 blur-3xl"></div>
        
        <div className="relative z-10 flex flex-col items-center">
          <div className="mb-8 h-24 w-24 rounded-full border-4 border-primary/30 border-t-primary animate-spin"></div>
          
          <h1 className="mb-2 text-center text-2xl font-bold">
            {topic.charAt(0).toUpperCase() + topic.slice(1)}
          </h1>
          
          <div className="text-center text-muted-foreground">
            <p className="text-lg">{displayMessage}{dots}</p>
          </div>
        </div>
      </div>
      
      <div className="mt-12 w-full max-w-md">
        <div className="flex h-2 w-full animate-pulse items-center justify-center space-x-2">
          <div className="h-2 flex-1 animate-pulse rounded-full bg-primary/20 delay-75"></div>
          <div className="h-2 flex-1 animate-pulse rounded-full bg-primary/40 delay-100"></div>
          <div className="h-2 flex-1 animate-pulse rounded-full bg-primary/60 delay-150"></div>
          <div className="h-2 flex-1 animate-pulse rounded-full bg-primary/80 delay-200"></div>
          <div className="h-2 flex-1 animate-pulse rounded-full bg-primary delay-300"></div>
        </div>
      </div>
      
      {message ? (
        <div className="mt-8 text-sm text-muted-foreground animate-pulse">
          <p>AI đang xử lý yêu cầu của bạn. Vui lòng đợi trong giây lát...</p>
        </div>
      ) : (
        <div className="mt-8 text-sm text-muted-foreground">
          <p>AI đang nghiên cứu chủ đề để tạo ra game phù hợp nhất.</p>
          <p className="mt-1 text-center">Quá trình này có thể mất 15-30 giây.</p>
        </div>
      )}
    </div>
  );
};

export default GameLoading;
