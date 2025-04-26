
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft, RefreshCw, Fullscreen, Share2, PlusCircle } from 'lucide-react';

interface CustomGameHeaderProps {
  onBack?: () => void;
  onRefresh?: () => void;
  onFullscreen?: () => void;
  onShare?: () => void; // Added new prop
  onNewGame?: () => void; // Added new prop
  showGameControls?: boolean;
}

const CustomGameHeader: React.FC<CustomGameHeaderProps> = ({
  onBack,
  onRefresh,
  onFullscreen,
  onShare,
  onNewGame,
  showGameControls = false,
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
        {showGameControls && (
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
            
            {onShare && (
              <Button 
                variant="ghost" 
                size="sm"
                onClick={onShare}
                className="h-8 w-8 p-0"
                title="Chia sẻ"
              >
                <Share2 className="h-4 w-4" />
              </Button>
            )}
            
            {onNewGame && (
              <Button 
                variant="ghost" 
                size="sm"
                onClick={onNewGame}
                className="h-8 w-8 p-0"
                title="Tạo game mới"
              >
                <PlusCircle className="h-4 w-4" />
              </Button>
            )}
          </>
        )}
      </div>
    </header>
  );
};

export default CustomGameHeader;
