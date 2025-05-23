import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { cn } from "@/lib/utils";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { QRCodeSVG } from 'qrcode.react';
import { Copy, Check } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { saveGameForSharing } from '@/lib/gameExport';
import QuizHeader from './QuizHeader';

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
  title = "", // Changed default title to empty string
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
      navigate('/');
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
      {/* Sử dụng component QuizHeader mới */}
      {!isCreatingGame && (
        <QuizHeader 
          showBackButton={showBackButton}
          showCreateButton={showCreateButton}
          showShareButton={showShareButton}
          isGameCreated={isGameCreated}
          onBack={handleBack}
          onCreate={handleCreate}
          onShare={() => handleShare()}
          headerRight={headerRight}
        />
      )}
      
      {/* Main content */}
      <div className="flex-1 overflow-hidden p-0 relative">
        {children}
      </div>
      
      {/* Footer (optional) */}
      {footerContent && (
        <div className="bg-background/90 backdrop-blur-md p-2 border-t border-primary/10">
          {footerContent}
        </div>
      )}

      {/* Share Dialog */}
      <Dialog open={showShareDialog} onOpenChange={setShowShareDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
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

export default QuizContainer;
