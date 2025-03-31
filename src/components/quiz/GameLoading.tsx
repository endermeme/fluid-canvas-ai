
import React, { useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';

const GameLoading: React.FC = () => {
  const [loadingText, setLoadingText] = useState("Đang tạo minigame từ chủ đề của bạn");
  
  useEffect(() => {
    const texts = [
      "Đang tạo minigame từ chủ đề của bạn",
      "Thiết kế trò chơi tương tác",
      "Chuẩn bị câu hỏi và nội dung",
      "Thiết kế giao diện trò chơi",
      "Tối ưu hóa trải nghiệm người chơi",
      "Gần xong rồi..."
    ];
    
    let index = 0;
    const interval = setInterval(() => {
      index = (index + 1) % texts.length;
      setLoadingText(texts[index]);
    }, 3000);
    
    return () => clearInterval(interval);
  }, []);
  
  return (
    <div className="flex flex-col items-center justify-center h-full w-full space-y-6">
      <div className="relative">
        <div className="w-16 h-16 rounded-full border-4 border-primary/30 border-t-primary animate-spin"></div>
        <Loader2 className="w-10 h-10 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-primary animate-pulse" />
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
    </div>
  );
};

export default GameLoading;
