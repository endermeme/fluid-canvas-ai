
import React from 'react';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';

interface MatchingFooterProps {
  onRestart: () => void;
}

const MatchingFooter: React.FC<MatchingFooterProps> = ({ onRestart }) => {
  return (
    <div className="flex-shrink-0 p-1 sm:p-2 border-t border-primary/10 bg-background/95 backdrop-blur-sm">
      <Button 
        variant="outline" 
        onClick={onRestart}
        className="w-full bg-gradient-to-r from-secondary/30 to-background/90 border-primary/20 text-xs sm:text-sm h-7 sm:h-8 px-2"
        size="sm"
      >
        <RefreshCw className="mr-1 sm:mr-2 h-3 w-3" />
        <span className="hidden sm:inline">Làm lại</span>
        <span className="sm:hidden">Reset</span>
      </Button>
    </div>
  );
};

export default MatchingFooter;
