
import React from 'react';
import { Button } from '@/components/ui/button';
import { Share2 } from 'lucide-react';

interface ShareButtonProps {
  onClick: () => void;
  disabled?: boolean;
}

const ShareButton = ({ onClick, disabled }: ShareButtonProps) => {
  return (
    <Button 
      variant="outline" 
      size="sm" 
      onClick={onClick}
      disabled={disabled}
      className="gap-1 text-xs"
    >
      <Share2 className="h-3.5 w-3.5" />
      Chia Sẻ
    </Button>
  );
};

export default ShareButton;
