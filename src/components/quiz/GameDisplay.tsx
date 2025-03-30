
import React from 'react';
import { MiniGame } from '@/utils/AIGameGenerator';
import GameShareSection from './GameShareSection';
import { FileText, Clock, ListOrdered, Users } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface GameDisplayProps {
  miniGame: MiniGame | null;
  hasCustomContent?: boolean;
  questionCount?: number;
  timePerQuestion?: number;
}

const GameDisplay = ({
  miniGame,
  hasCustomContent,
  questionCount,
  timePerQuestion
}: GameDisplayProps) => {
  if (!miniGame) return null;

  return (
    <div className="flex flex-col h-full overflow-hidden rounded-xl shadow-xl border border-sky-200/30 dark:border-sky-800/30">
      <div className="bg-gradient-to-r from-primary/90 via-primary/80 to-primary/70 backdrop-blur-md p-3 flex items-center justify-between text-white py-[12px]">
        <div className="flex items-center flex-1 overflow-hidden">
          <span className="w-2 h-2 bg-white rounded-full mr-2 animate-pulse flex-shrink-0"></span>
          <h3 className="font-medium text-lg truncate mr-2">
            {miniGame.title}
          </h3>
          <div className="flex items-center gap-1.5 flex-shrink-0 ml-auto">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Badge variant="secondary" className="bg-white/20 hover:bg-white/30 flex items-center gap-1">
                    <Users size={12} />
                    <span className="text-xs">Đa người chơi</span>
                  </Badge>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Học sinh có thể chơi cùng nhau với mã QR</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            
            {hasCustomContent && <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Badge variant="secondary" className="bg-white/20 hover:bg-white/30 flex items-center gap-1">
                      <FileText size={12} />
                      <span className="text-xs">Tùy chỉnh</span>
                    </Badge>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Trò chơi sử dụng nội dung tùy chỉnh</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>}
            
            {questionCount && <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Badge variant="secondary" className="bg-white/20 hover:bg-white/30 flex items-center gap-1">
                      <ListOrdered size={12} />
                      <span className="text-xs">{questionCount}</span>
                    </Badge>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Số lượng câu hỏi: {questionCount}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>}
            
            {timePerQuestion && <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Badge variant="secondary" className="bg-white/20 hover:bg-white/30 flex items-center gap-1">
                      <Clock size={12} />
                      <span className="text-xs">{timePerQuestion}s</span>
                    </Badge>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Thời gian mỗi câu: {timePerQuestion} giây</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>}
          </div>
        </div>
        <div className="flex items-center gap-2 ml-2 flex-shrink-0">
          <GameShareSection miniGame={miniGame} />
        </div>
      </div>
      <div className="flex-1 overflow-hidden" style={{ height: "calc(100% - 48px)" }}>
        <iframe 
          srcDoc={miniGame.htmlContent} 
          title={miniGame.title} 
          sandbox="allow-scripts allow-same-origin" 
          className="w-full h-full border-none" 
          style={{
            height: '100%',
            width: '100%',
            display: 'block'
          }} 
        />
      </div>
    </div>
  );
};

export default GameDisplay;
