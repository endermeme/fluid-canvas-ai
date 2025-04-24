
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { cn } from "@/lib/utils";
import { saveGameForSharing } from '@/utils/gameExport';
import { QuizHeader } from './container/QuizHeader';
import { ShareDialog } from './container/ShareDialog';

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
  gameContent?: any;
  onBack?: () => void;
  onRefresh?: () => void;
  onSettings?: () => void;
  onCreate?: () => void;
  footerContent?: React.ReactNode;
  headerRight?: React.ReactNode;
  className?: string;
}

const QuizContainer: React.FC<QuizContainerProps> = ({
  children,
  title = "Minigame Tương Tác",
  showBackButton = true,
  showHomeButton = true,
  showRefreshButton = true,
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
  className
}) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [showShareDialog, setShowShareDialog] = useState(false);
  const [shareUrl, setShareUrl] = useState('');

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
    } else {
      navigate('/quiz?create=true');
    }
  };

  const handleShare = async () => {
    if (!gameContent) {
      toast({
        title: "Không thể chia sẻ",
        description: "Không có nội dung game để chia sẻ",
        variant: "destructive"
      });
      return;
    }

    try {
      const gameContainer = document.getElementById('game-container');
      let html = gameContainer?.innerHTML || '';
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
      }
    } catch (error) {
      console.error("Error sharing game:", error);
      toast({
        title: "Lỗi chia sẻ",
        description: "Không thể tạo link chia sẻ. Vui lòng thử lại.",
        variant: "destructive"
      });
    }
  };

  return (
    <div className={cn("relative h-full w-full flex flex-col bg-gradient-to-b from-background to-background/95 shadow-lg rounded-lg overflow-hidden", className)}>
      <QuizHeader
        title={title}
        showBackButton={showBackButton}
        showHomeButton={showHomeButton}
        showRefreshButton={showRefreshButton}
        showSettingsButton={showSettingsButton}
        showCreateButton={showCreateButton}
        showShareButton={showShareButton}
        isGameCreated={isGameCreated}
        onBack={onBack}
        onRefresh={handleRefresh}
        onSettings={onSettings}
        onCreate={handleCreate}
        onShare={handleShare}
        headerRight={headerRight}
      />
      
      <div className="flex-1 overflow-hidden p-0 relative">
        {children}
      </div>
      
      {footerContent && (
        <div className="bg-background/90 backdrop-blur-md p-2 border-t border-primary/10">
          {footerContent}
        </div>
      )}

      <ShareDialog
        open={showShareDialog}
        onOpenChange={setShowShareDialog}
        shareUrl={shareUrl}
      />
    </div>
  );
};

export default QuizContainer;
