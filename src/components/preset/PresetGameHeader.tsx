import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Share2 } from 'lucide-react';

interface PresetGameHeaderProps {
  onShare?: () => void;
  showShare?: boolean;
  isGameCreated?: boolean;
}

const PresetGameHeader: React.FC<PresetGameHeaderProps> = ({
  onShare,
  showShare = false,
  isGameCreated = false
}) => {
  return (
    <div className="flex items-center justify-between p-4 border-b bg-background/80 backdrop-blur-sm">
      <div className="flex items-center gap-3">
        <h1 className="text-xl font-bold">Trò Chơi Có Sẵn</h1>
      </div>
      
      {showShare && isGameCreated && onShare && (
        <Button 
          onClick={onShare}
          className="flex items-center gap-2"
        >
          <Share2 className="h-4 w-4" />
          Chia sẻ
        </Button>
      )}
    </div>
  );
};

export default PresetGameHeader;
