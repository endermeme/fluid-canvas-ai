
import React from 'react';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';

interface ReloadButtonProps {
  onClick: () => void;
}

const ReloadButton = ({ onClick }: ReloadButtonProps) => {
  return (
    <Button 
      variant="ghost" 
      size="sm" 
      onClick={onClick}
      className="w-8 h-8 p-0"
      title="Chơi lại"
    >
      <RefreshCw className="h-3.5 w-3.5" />
    </Button>
  );
};

export default ReloadButton;
