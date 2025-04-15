
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

interface BackButtonProps {
  onClick: () => void;
}

const BackButton = ({ onClick }: BackButtonProps) => {
  return (
    <Button 
      variant="ghost" 
      size="sm" 
      onClick={onClick} 
      className="gap-1 text-xs"
    >
      <ArrowLeft className="h-3.5 w-3.5" />
      Quay lại
    </Button>
  );
};

export default BackButton;
