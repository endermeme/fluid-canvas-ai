
import React, { useState, useRef } from 'react';
import { StoredGame, getRemainingTime } from '@/utils/gameExport';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ChartLine, RefreshCw } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { enhanceIframeContent } from '../utils/iframe-utils';
import { useToast } from '@/hooks/use-toast';

interface GamePlayViewProps {
  game: StoredGame;
  playerName: string;
  onBack: () => void;
}

const GamePlayView: React.FC<GamePlayViewProps> = ({ 
  game, 
  playerName, 
  onBack 
}) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  
  // Xử lý game content data nếu có
  let gameContent = null;
  try {
    // Tìm dữ liệu được mã hóa trong nội dung HTML
    const contentMatch = game.htmlContent.match(/data-game-content="([^"]*)"/);
    if (contentMatch && contentMatch[1]) {
      gameContent = JSON.parse(decodeURIComponent(contentMatch[1]));
      console.log("Đã trích xuất dữ liệu game:", gameContent);
    }
  } catch (error) {
    console.error("Lỗi khi phân tích dữ liệu game:", error);
  }

  const handleReload = () => {
    if (!game) return;
    
    setIsLoading(true);
    try {
      if (iframeRef.current) {
        const enhancedContent = enhanceIframeContent(game.htmlContent, game.title);
        iframeRef.current.srcdoc = enhancedContent;
        
        toast({
          title: "Đã tải lại",
          description: "Game đã được tải lại thành công",
        });
      }
    } catch (error) {
      console.error("Lỗi khi tải lại game:", error);
      toast({
        title: "Lỗi",
        description: "Không thể tải lại game",
        variant: "destructive"
      });
    } finally {
      setTimeout(() => setIsLoading(false), 500);
    }
  };

  // Tạo nội dung đã được tăng cường
  const enhancedContent = enhanceIframeContent(game.htmlContent, game.title);

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      <header className="bg-background/80 backdrop-blur-sm p-4 flex items-center justify-between border-b">
        <div className="flex items-center">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={onBack}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Quay lại
          </Button>
          <div className="ml-4 hidden sm:block">
            <span className="font-medium">{game.title}</span>
            <span className="ml-2 text-sm text-muted-foreground">
              (Chơi với tên: {playerName})
            </span>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <div className="text-sm text-muted-foreground hidden sm:block mr-2">
            Còn lại: {getRemainingTime(game.expiresAt)}
          </div>
          
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleReload}
            disabled={isLoading}
            className="h-8 w-8 p-0"
          >
            <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
            <span className="sr-only">Tải lại</span>
          </Button>
          
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => navigate(`${window.location.pathname}/dashboard`)}
          >
            <ChartLine className="h-4 w-4 mr-2" />
            Thống kê
          </Button>
        </div>
      </header>

      <main className="flex-1 overflow-hidden">
        <iframe
          ref={iframeRef}
          srcDoc={enhancedContent}
          sandbox="allow-scripts allow-same-origin allow-forms allow-modals allow-popups"
          className="w-full h-full border-none"
          title={game.title || "Shared Game"}
        />
      </main>
    </div>
  );
};

export default GamePlayView;
