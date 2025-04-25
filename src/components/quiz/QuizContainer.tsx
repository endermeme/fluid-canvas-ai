
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Home, RefreshCw, Settings, ArrowLeft, PlusCircle, Share2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { cn } from "@/lib/utils";
import { saveGameForSharing } from '@/utils/gameExport';
import { ShareDialog } from '../quiz/container/ShareDialog';
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { QRCodeSVG } from 'qrcode.react';
import { Copy, Check } from 'lucide-react';

interface QuizContainerProps {
  children: React.ReactNode;
  title?: string;
  showBackButton?: boolean;
  showHomeButton?: boolean;
  showRefreshButton?: boolean;
  showSettingsButton?: boolean;
  showCreateButton?: boolean;
  showShareButton?: boolean;
  isGameCreated?: boolean;
  gameContent?: unknown;
  onBack?: () => void;
  onRefresh?: () => void;
  onSettings?: () => void;
  onCreate?: () => void;
  footerContent?: React.ReactNode;
  headerRight?: React.ReactNode;
  className?: string;
  isCreatingGame?: boolean;
  onHandleCreate?: () => void;
  onHandleShare?: () => Promise<string>;
}

const QuizContainer: React.FC<QuizContainerProps> = ({
  children,
  title = "Minigame Tương Tác",
  showBackButton = true,
  showHomeButton = false,
  showRefreshButton = false,
  showSettingsButton = false,
  showCreateButton = false,
  showShareButton = false,
  isGameCreated = false,
  gameContent = null,
  onBack,
  onRefresh,
  onSettings,
  onCreate,
  footerContent,
  headerRight,
  className,
  isCreatingGame = false,
  onHandleCreate = () => { },
  onHandleShare = () => Promise.resolve("")
}) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [showShareDialog, setShowShareDialog] = useState(false);
  const [shareUrl, setShareUrl] = useState('');
  const [copied, setCopied] = useState(false);

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      navigate(-1);
    }
  };

  const handleRefresh = () => {
    if (onRefresh) {
      onRefresh();
    } else {
      window.location.reload();
    }
  };

  const handleCreate = () => {
    if (onCreate) {
      onCreate();
    } else if (onHandleCreate) {
      onHandleCreate();
    } else {
      navigate('/quiz?create=true');
    }
  };

  const handleShare = async () => {
    if (onHandleShare) {
      const url = await onHandleShare();
      if (url) {
        setShareUrl(url);
        setShowShareDialog(true);
        return url;
      }
      return "";
    }

    if (!gameContent) {
      toast({
        title: "Không thể chia sẻ",
        description: "Không có nội dung game để chia sẻ",
        variant: "destructive"
      });
      return "";
    }

    try {
      const gameContainer = document.getElementById('game-container');
      const html = gameContainer?.innerHTML || '';
      const url = await saveGameForSharing(
        title,
        'custom',
        gameContent,
        html,
        `Shared game: ${title}`
      );
      
      if (url) {
        setShareUrl(url);
        setShowShareDialog(true);
        toast({
          title: "Game đã được chia sẻ",
          description: "Đường dẫn đã được tạo để chia sẻ trò chơi.",
        });
        return url;
      }
      return "";
    } catch (error) {
      console.error("Error sharing game:", error);
      toast({
        title: "Lỗi chia sẻ",
        description: "Không thể tạo link chia sẻ. Vui lòng thử lại.",
        variant: "destructive"
      });
      return "";
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareUrl)
      .then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
        toast({
          title: "Đã sao chép",
          description: "Đường dẫn đã được sao chép vào clipboard.",
        });
      })
      .catch(err => {
        console.error('Không thể sao chép liên kết:', err);
        toast({
          title: "Lỗi sao chép",
          description: "Không thể sao chép đường dẫn. Vui lòng thử lại.",
          variant: "destructive"
        });
      });
  };

  return (
    <div className={cn("relative h-full w-full flex flex-col bg-gradient-to-b from-background to-background/95 shadow-lg rounded-lg overflow-hidden", className)}>
      {/* Streamlined Header */}
      <div className="flex justify-between items-center bg-background/90 backdrop-blur-md px-2 py-1.5 border-b border-primary/10 shadow-sm">
        <div className="flex items-center gap-1">
          {showBackButton && (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={handleBack}
              className="w-7 h-7 p-0"
              title="Quay lại"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
            </Button>
          )}
          
          {showHomeButton && (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => navigate('/')}
              className="w-7 h-7 p-0"
              title="Trang chủ"
            >
              <Home className="h-3.5 w-3.5" />
            </Button>
          )}
          
          <h2 className="text-sm font-medium truncate max-w-[180px] ml-1">{title}</h2>
        </div>
        
        <div className="flex items-center gap-1">
          {headerRight}
          
          {showCreateButton && (
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleCreate}
              className="h-7 px-2 text-xs"
              title="Tạo mới"
            >
              <PlusCircle className="h-3 w-3 mr-1" />
              Tạo mới
            </Button>
          )}

          {showShareButton && isGameCreated && (
            <Button
              variant="default"
              size="sm"
              onClick={handleShare}
              className="h-7 px-3 bg-primary text-primary-foreground hover:bg-primary/90 flex items-center gap-1 transition-all duration-300 ease-in-out transform hover:scale-105 active:scale-95"
              title="Chia sẻ game"
            >
              <Share2 className="h-3 w-3 mr-1" />
              Chia sẻ
            </Button>
          )}
          
          {showRefreshButton && (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={handleRefresh}
              className="w-7 h-7 p-0"
              title="Tải lại"
            >
              <RefreshCw className="h-3.5 w-3.5" />
            </Button>
          )}
          
          {showSettingsButton && (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={onSettings}
              className="w-7 h-7 p-0"
              title="Cài đặt"
            >
              <Settings className="h-3.5 w-3.5" />
            </Button>
          )}
        </div>
      </div>
      
      {/* Main content */}
      <div className="flex-1 overflow-hidden p-0 relative">
        {children}
      </div>
      
      {footerContent && (
        <div className="bg-background/90 backdrop-blur-md p-2 border-t border-primary/10">
          {footerContent}
        </div>
      )}

      {/* Share Dialog */}
      <ShareDialog 
        open={showShareDialog} 
        onOpenChange={setShowShareDialog}
        shareUrl={shareUrl}
      />
    </div>
  );
};

export default QuizContainer;
