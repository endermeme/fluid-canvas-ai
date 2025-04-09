
import React from 'react';

interface GameLoadingProps {
  topic: string;
}

const GameLoading: React.FC<GameLoadingProps> = ({ topic }) => {
  return (
    <div className="flex flex-col items-center justify-center h-full bg-gradient-to-b from-background to-background/80 p-6">
      <div className="mb-8 relative">
        <div className="h-16 w-16 rounded-full border-4 border-primary/20 border-t-primary animate-spin"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="h-8 w-8 rounded-full bg-primary/10 animate-pulse"></div>
        </div>
      </div>
      
      <h2 className="text-2xl font-bold text-center mb-2 text-primary">
        Đang tạo minigame...
      </h2>
      
      <p className="text-center text-muted-foreground max-w-md">
        Đang tạo minigame cho chủ đề <span className="font-medium text-primary/80">{topic}</span>.
        Quá trình này có thể mất vài giây.
      </p>
      
      <div className="mt-8 w-full max-w-md space-y-4">
        <div className="h-3 bg-primary/10 rounded-full w-full overflow-hidden">
          <div className="h-full bg-primary rounded-full animate-progress"></div>
        </div>
        
        <style jsx global>{`
          @keyframes progress {
            0% { width: 0%; }
            50% { width: 70%; }
            100% { width: 100%; }
          }
          
          .animate-progress {
            animation: progress 3s ease-in-out infinite;
          }
        `}</style>
      </div>
    </div>
  );
};

export default GameLoading;
