
import React, { useRef, useEffect, useState } from 'react';
import { enhanceIframeContent } from '../utils/iframe-utils';
import { saveCustomGame } from './utils/customGameAPI';
import CustomGameHeader from './CustomGameHeader';
import { useToast } from '@/hooks/use-toast';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { QRCodeSVG } from 'qrcode.react';
import { Copy, Check } from 'lucide-react';

interface EnhancedGameViewProps {
  miniGame: {
    title?: string;
    content: string;
  };
  onReload?: () => void;
  className?: string;
  onBack?: () => void;
  onNewGame?: () => void;
  onShare?: () => void;
  extraButton?: React.ReactNode;
  hideHeader?: boolean;
}

const EnhancedGameView: React.FC<EnhancedGameViewProps> = ({ 
  miniGame, 
  onReload,
  className,
  onBack,
  onNewGame,
  onShare,
  extraButton,
  hideHeader = false
}) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [iframeError, setIframeError] = useState<string | null>(null);
  const [isIframeLoaded, setIsIframeLoaded] = useState<boolean>(false);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [isSharing, setIsSharing] = useState<boolean>(false);
  const [showShareDialog, setShowShareDialog] = useState(false);
  const [shareUrl, setShareUrl] = useState('');
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (iframeRef.current && miniGame?.content) {
      try {
        const enhancedContent = enhanceIframeContent(miniGame.content, miniGame.title);
        iframeRef.current.srcdoc = enhancedContent;
        setIframeError(null);
        
        iframeRef.current.onload = () => {
          console.log("Iframe đã được tải xong");
          setIsIframeLoaded(true);
        };
      } catch (error) {
        console.error("Error setting iframe content:", error);
        setIframeError("Không thể tải nội dung game. Vui lòng thử lại.");
      }
    }
  }, [miniGame]);

  const handleShareGame = async () => {
    if (!miniGame?.content || !isIframeLoaded) {
      toast({
        title: "Chưa thể chia sẻ",
        description: "Game đang được tải, vui lòng đợi một chút",
        variant: "destructive"
      });
      return;
    }
    
    try {
      setIsSharing(true);
      
      toast({
        title: "Đang xử lý",
        description: "Đang lưu và tạo liên kết chia sẻ...",
      });
      
      const gameData = {
        title: miniGame.title || "Game tương tác",
        content: miniGame.content,
        gameType: 'custom',
        description: "Game tương tác tùy chỉnh",
        settings: {
          allowSharing: true,
          showTimer: true
        }
      };
      
      const result = await saveCustomGame(gameData);
      
      if (result && result.id) {
        const shareUrl = `${window.location.origin}/game/${result.id}`;
        console.log("Đã tạo URL chia sẻ:", shareUrl);
        
        setShareUrl(shareUrl);
        setShowShareDialog(true);
        
        if (onShare) {
          onShare();
        }
        
        toast({
          title: "Game đã được chia sẻ",
          description: "Liên kết chia sẻ đã được tạo thành công",
        });
      } else {
        throw new Error("Không nhận được ID game sau khi lưu");
      }
    } catch (error) {
      console.error("Lỗi khi chia sẻ game:", error);
      toast({
        title: "Lỗi chia sẻ game",
        description: "Không thể tạo liên kết chia sẻ. Vui lòng thử lại.",
        variant: "destructive"
      });
    } finally {
      setIsSharing(false);
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareUrl)
      .then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
        
        toast({
          title: "Đã sao chép",
          description: "Liên kết đã được sao chép vào clipboard",
        });
      })
      .catch(err => {
        console.error("Không thể sao chép liên kết:", err);
        toast({
          title: "Lỗi",
          description: "Không thể sao chép liên kết",
          variant: "destructive"
        });
      });
  };

  const refreshGame = () => {
    if (iframeRef.current && miniGame?.content) {
      try {
        setIsIframeLoaded(false);
        const enhancedContent = enhanceIframeContent(miniGame.content, miniGame.title);
        iframeRef.current.srcdoc = enhancedContent;
        setIframeError(null);
        
        if (onReload) {
          onReload();
        }
      } catch (error) {
        console.error("Error refreshing game:", error);
        setIframeError("Không thể tải lại game. Vui lòng thử lại.");
      }
    }
  };

  const handleFullscreen = () => {
    if (!iframeRef.current) return;
    
    const iframe = iframeRef.current;
    
    if (!document.fullscreenElement) {
      iframe.requestFullscreen().catch(err => {
        console.error("Không thể vào chế độ toàn màn hình:", err);
      });
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  return (
    <div className={`w-full h-full flex flex-col ${className || ''}`}>
      {!hideHeader && (
        <CustomGameHeader
          onBack={onBack}
          onNewGame={onNewGame}
          onShare={handleShareGame}
          onRefresh={() => refreshGame()}
          onFullscreen={handleFullscreen}
          showShare={true}
          isGameCreated={isIframeLoaded}
          showGameControls={true}
          isSharing={isSharing}
        />
      )}
      
      <div className="flex-1 relative overflow-hidden">
        {iframeError ? (
          <div className="flex flex-col items-center justify-center h-full p-6 bg-destructive/10">
            <p className="text-destructive mb-4">{iframeError}</p>
            <button 
              className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
              onClick={() => refreshGame()}
            >
              Tải lại
            </button>
          </div>
        ) : (
          <div className="relative w-full h-full">
            {!isIframeLoaded && (
              <div className="absolute inset-0 flex items-center justify-center bg-background/50 backdrop-blur-sm z-10">
                <div className="flex flex-col items-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mb-4"></div>
                  <p className="text-primary font-medium">Đang tải game...</p>
                </div>
              </div>
            )}
            <iframe
              ref={iframeRef}
              className="w-full h-full"
              sandbox="allow-scripts allow-same-origin allow-forms allow-modals allow-popups"
              title={miniGame.title || "Game tương tác"}
              style={{
                border: 'none',
                display: 'block',
                width: '100%',
                height: '100%'
              }}
            />
          </div>
        )}
      </div>

      <Dialog open={showShareDialog} onOpenChange={setShowShareDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Chia sẻ game</DialogTitle>
            <DialogDescription>
              Chia sẻ game này với bạn bè để họ có thể tham gia chơi
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col items-center space-y-4 py-4">
            <div className="p-4 bg-white rounded-lg">
              <QRCodeSVG value={shareUrl} size={200} />
            </div>
            
            <div className="w-full space-y-2">
              <Label htmlFor="share-link">Liên kết chia sẻ</Label>
              <div className="flex">
                <Input 
                  id="share-link" 
                  value={shareUrl} 
                  readOnly 
                  className="rounded-r-none"
                />
                <Button 
                  variant="outline" 
                  className="rounded-l-none"
                  onClick={handleCopyLink}
                >
                  {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                </Button>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button onClick={() => setShowShareDialog(false)}>Đóng</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default EnhancedGameView;
