
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Share2, Settings } from 'lucide-react';

interface GameHeaderProps {
  onBack?: () => void;
  onShare?: () => void;
  onSettings?: () => void;
  title?: string;
  showShare?: boolean;
  showSettings?: boolean;
}

const GameHeader: React.FC<GameHeaderProps> = ({
  onBack,
  onShare,
  onSettings,
  title,
  showShare = true,
  showSettings = true
}) => {
  return (
    <header className="flex items-center justify-between p-4 border-b bg-background/80 backdrop-blur-md">
      <div className="flex items-center gap-3">
        {onBack && (
          <Button variant="ghost" size="sm" onClick={onBack}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
        )}
        {title && <h2 className="font-semibold">{title}</h2>}
      </div>
      
      <div className="flex items-center gap-2">
        {showSettings && onSettings && (
          <Button variant="ghost" size="sm" onClick={onSettings}>
            <Settings className="h-4 w-4" />
          </Button>
        )}
        {showShare && onShare && (
          <Button variant="default" size="sm" onClick={onShare}>
            <Share2 className="h-4 w-4 mr-2" />
            Chia sẻ
          </Button>
        )}
      </div>
    </header>
  );
};

export default GameHeader;
