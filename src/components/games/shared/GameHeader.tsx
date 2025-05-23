
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Home, RefreshCw, Share2, Maximize } from 'lucide-react';

interface GameHeaderProps {
  title: string;
  onBack?: () => void;
  onHome?: () => void;
  onRefresh?: () => void;
  onShare?: () => void;
  onFullscreen?: () => void;
  showHomeButton?: boolean;
  showRefreshButton?: boolean;
  showShareButton?: boolean;
  showFullscreenButton?: boolean;
  score?: number;
  extraButton?: React.ReactNode;
}

const GameHeader: React.FC<GameHeaderProps> = ({
  title,
  onBack,
  onHome,
  onRefresh,
  onShare,
  onFullscreen,
  showHomeButton = true,
  showRefreshButton = true,
  showShareButton = true,
  showFullscreenButton = true,
  score,
  extraButton
}) => {
  return (
    <div className="flex justify-between items-center bg-background/80 backdrop-blur-md px-4 py-2 border-b border-primary/10 sticky top-0 z-50">
      <div className="flex items-center gap-2">
        {onBack && (
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={onBack}
            className="flex items-center gap-1.5 text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Quay lại
          </Button>
        )}
        <h1 className="text-lg font-medium truncate">{title}</h1>
        {score !== undefined && (
          <div className="ml-4 px-3 py-1 bg-primary/10 rounded-full text-sm font-medium">
            Điểm: {score}
          </div>
        )}
      </div>
      
      <div className="flex items-center gap-2">
        {showRefreshButton && onRefresh && (
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={onRefresh}
            className="h-8 w-8"
          >
            <RefreshCw className="h-4 w-4" />
          </Button>
        )}
        
        {showHomeButton && onHome && (
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={onHome}
            className="h-8 w-8"
          >
            <Home className="h-4 w-4" />
          </Button>
        )}

        {showShareButton && onShare && (
          <Button
            variant="ghost"
            size="icon"
            onClick={onShare}
            className="h-8 w-8"
          >
            <Share2 className="h-4 w-4" />
          </Button>
        )}

        {showFullscreenButton && onFullscreen && (
          <Button
            variant="ghost"
            size="icon"
            onClick={onFullscreen}
            className="h-8 w-8"
          >
            <Maximize className="h-4 w-4" />
          </Button>
        )}
        
        {extraButton}
      </div>
    </div>
  );
};

export default GameHeader;
