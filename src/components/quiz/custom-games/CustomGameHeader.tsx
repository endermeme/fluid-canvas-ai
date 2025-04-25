
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft, RefreshCw, Share2, Fullscreen, PlusCircle } from 'lucide-react';

interface CustomGameHeaderProps {
  onBack?: () => void;
  onNewGame?: () => void;
  onShare?: () => void;
  onRefresh?: () => void;
  onFullscreen?: () => void;
  showShare?: boolean;
  isGameCreated?: boolean;
  showGameControls?: boolean;
  isSharing?: boolean;
}

const CustomGameHeader: React.FC<CustomGameHeaderProps> = ({
  onBack,
  onNewGame,
  onShare,
  onRefresh,
  onFullscreen,
  showShare = true,
  isGameCreated = false,
  showGameControls = false,
  isSharing = false,
}) => {
  const handleBack = () => {
    if (onBack) {
      onBack();
    }
  };

  return (
    <header className="bg-background/80 backdrop-blur-sm p-2 flex items-center justify-between border-b">
      <div className="flex items-center gap-2">
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={handleBack}
          className="h-8 w-8 p-0"
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
      </div>

      <div className="flex items-center gap-2">
        {isGameCreated && showGameControls && (
          <>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={onRefresh}
              className="h-8 w-8 p-0"
              title="Tải lại"
            >
              <RefreshCw className="h-4 w-4" />
            </Button>
            
            <Button 
              variant="ghost" 
              size="sm"
              onClick={onFullscreen}
              className="h-8 w-8 p-0"
              title="Toàn màn hình"
            >
              <Fullscreen className="h-4 w-4" />
            </Button>
          </>
        )}
        
        {onNewGame && (
          <Button 
            variant="outline" 
            size="sm"
            onClick={onNewGame}
            className="h-8 gap-1"
          >
            <PlusCircle className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Tạo mới</span>
          </Button>
        )}
        
        {showShare && isGameCreated && (
          <Button 
            variant="default" 
            size="sm"
            onClick={onShare}
            disabled={isSharing}
            className="h-8 gap-1"
          >
            <Share2 className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">{isSharing ? 'Đang xử lý...' : 'Chia sẻ'}</span>
          </Button>
        )}
      </div>
    </header>
  );
};

export default CustomGameHeader;
