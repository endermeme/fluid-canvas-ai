
import React, { useEffect, useState } from 'react';
import { Progress } from '@/components/ui/progress';

interface GameLoadingProps {
  topic?: string;
}

const GameLoading: React.FC<GameLoadingProps> = ({ topic = "chủ đề" }) => {
  const [loadingText, setLoadingText] = useState("Đang tạo minigame từ chủ đề của bạn");
  const [progress, setProgress] = useState(0);
  
  const progressMessages = [
    `Đang tạo minigame về "${topic}"`,
    "Thiết kế trò chơi tương tác",
    "Chuẩn bị câu hỏi và nội dung",
    "Thiết kế giao diện trò chơi",
    "Tối ưu hóa trải nghiệm người chơi",
    "Kiểm tra logic trò chơi",
    "Đảm bảo tính tương thích",
    "Gần xong rồi..."
  ];
  
  useEffect(() => {
    // Main loading text animation
    let index = 0;
    const textInterval = setInterval(() => {
      index = (index + 1) % progressMessages.length;
      setLoadingText(progressMessages[index]);
    }, 3000);
    
    // Simulate progress bar filling up
    const progressInterval = setInterval(() => {
      setProgress(oldProgress => {
        // Calculate new progress
        const newProgress = Math.min(oldProgress + (Math.random() * 2), 100);
        
        // If we're getting close to 100%, slow down the progress
        if (newProgress > 95) {
          clearInterval(progressInterval); 
          
          // Fill to 100% after a delay to simulate final processing
          setTimeout(() => setProgress(100), 2000);
        }
        
        return newProgress;
      });
    }, 400);
    
    // Cleanup on unmount
    return () => {
      clearInterval(textInterval);
      clearInterval(progressInterval);
    };
  }, [topic]);
  
  return (
    <div className="flex flex-col items-center justify-center h-full w-full space-y-6 fixed inset-0 overflow-hidden">
      <div className="relative">
        <div className="w-16 h-16 rounded-full border-4 border-primary/30 border-t-primary animate-spin"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <img 
            src="https://cdn.glitch.global/1eee455c-65a0-428f-a71b-89f07640b91b/Thi%E1%BA%BFt%20k%E1%BA%BF%20ch%C6%B0a%20c%C3%B3%20t%C3%AAn.svg?v=1742919732332" 
            alt="Logo" 
            className="w-8 h-8 animate-pulse"
          />
        </div>
      </div>
      
      <div className="space-y-2 text-center">
        <p className="text-lg font-medium animate-fade-in">{loadingText}...</p>
        <div className="flex justify-center">
          <div className="typing-indicator">
            <span style={{'--dot-index': '0'} as any}></span>
            <span style={{'--dot-index': '1'} as any}></span>
            <span style={{'--dot-index': '2'} as any}></span>
          </div>
        </div>
      </div>
      
      <div className="max-w-md w-full px-8">
        <Progress 
          value={progress} 
          indicatorColor="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"
          className="h-3"
          showPercentage
        />
      </div>
      
      <div className="max-w-md text-center mt-2 px-4">
        <p className="text-sm text-muted-foreground bg-yellow-500/10 border border-yellow-500/30 p-3 rounded-md">
          Minigame bởi AI khi tạo ra có thể bị lỗi hoặc không hoạt động như mong muốn, vui lòng tạo lại khi gặp lỗi
        </p>
      </div>
    </div>
  );
};

export default GameLoading;
