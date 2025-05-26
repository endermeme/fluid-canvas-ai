
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft, RefreshCw, Maximize, Share2, Plus, Settings } from 'lucide-react';

interface CustomGameHeaderProps {
  onBack?: () => void;
  onRefresh?: () => void;
  onFullscreen?: () => void;
  onShare?: () => void;
  onNewGame?: () => void;
  onSettings?: () => void;
  showGameControls?: boolean;
  isSharing?: boolean;
  isTeacher?: boolean;
  gameType?: string;
}

const CustomGameHeader: React.FC<CustomGameHeaderProps> = ({
  onBack,
  onRefresh,
  onFullscreen,
  onShare,
  onNewGame,
  onSettings,
  showGameControls = true,
  isSharing = false,
  isTeacher = false,
  gameType
}) => {
  return (
    <div className="flex items-center justify-between p-4 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex items-center gap-2">
        {onBack && (
          <Button variant="outline" size="sm" onClick={onBack}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Quay lại
          </Button>
        )}
        {gameType && (
          <div className="hidden sm:block">
            <h1 className="text-lg font-semibold text-muted-foreground">
              {gameType}
            </h1>
          </div>
        )}
      </div>

      {showGameControls && (
        <div className="flex items-center gap-2">
          {onRefresh && (
            <Button variant="outline" size="sm" onClick={onRefresh}>
              <RefreshCw className="h-4 w-4" />
              <span className="hidden sm:inline ml-2">Làm mới</span>
            </Button>
          )}
          
          {onFullscreen && (
            <Button variant="outline" size="sm" onClick={onFullscreen}>
              <Maximize className="h-4 w-4" />
              <span className="hidden sm:inline ml-2">Toàn màn hình</span>
            </Button>
          )}
          
          {onShare && (
            <Button 
              variant="outline" 
              size="sm" 
              onClick={onShare}
              disabled={isSharing}
            >
              <Share2 className="h-4 w-4" />
              <span className="hidden sm:inline ml-2">
                {isSharing ? 'Đang chia sẻ...' : 'Chia sẻ'}
              </span>
            </Button>
          )}
          
          {onNewGame && (
            <Button variant="outline" size="sm" onClick={onNewGame}>
              <Plus className="h-4 w-4" />
              <span className="hidden sm:inline ml-2">Game mới</span>
            </Button>
          )}
          
          {isTeacher && onSettings && (
            <Button variant="outline" size="sm" onClick={onSettings}>
              <Settings className="h-4 w-4" />
              <span className="hidden sm:inline ml-2">Cài đặt</span>
            </Button>
          )}
        </div>
      )}
    </div>
  );
};

export default CustomGameHeader;
