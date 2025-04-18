
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { RefreshCw, ArrowLeft, Share2 } from 'lucide-react';

interface GameViewHeaderProps {
  onBack?: () => void;
  onReload?: () => void;
  onShare?: () => void;
  score?: number;
  shareInProgress?: boolean;
  extraButton?: React.ReactNode;
}

const GameViewHeader: React.FC<GameViewHeaderProps> = ({
  onBack,
  onReload,
  onShare,
  score,
  shareInProgress = false,
  extraButton
}) => {
  return (
    <div className="flex justify-between items-center p-1.5 bg-background/80 backdrop-blur-sm border-b border-primary/10 z-10">
      <div className="flex items-center gap-1">
        {onBack && (
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={onBack} 
            className="w-7 h-7 p-0"
            title="Quay lại"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
          </Button>
        )}
        
        {typeof score !== 'undefined' && (
          <Badge variant="secondary" className="ml-2">
            Điểm: {score}
          </Badge>
        )}
      </div>
      
      <div className="flex items-center gap-1">
        {extraButton}
        
        {onReload && (
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={onReload} 
            className="w-7 h-7 p-0"
            title="Tải lại game"
          >
            <RefreshCw className="h-3.5 w-3.5" />
          </Button>
        )}
        
        {onShare && (
          <Button 
            variant="outline" 
            size="sm" 
            onClick={onShare} 
            className="h-7 text-xs px-2"
            disabled={shareInProgress}
          >
            <Share2 className="h-3 w-3 mr-1" />
            {shareInProgress ? 'Đang xử lý...' : 'Chia sẻ'}
          </Button>
        )}
      </div>
    </div>
  );
};

export default GameViewHeader;
