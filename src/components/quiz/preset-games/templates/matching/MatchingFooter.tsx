
import React from 'react';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';

interface MatchingFooterProps {
  onRestart: () => void;
}

const MatchingFooter: React.FC<MatchingFooterProps> = ({ onRestart }) => {
  return (
    <div className="flex-shrink-0 p-2 border-t border-primary/10">
      <Button 
        variant="outline" 
        onClick={onRestart}
        className="w-full bg-gradient-to-r from-secondary/30 to-background/90 border-primary/20 text-sm h-8"
        size="sm"
      >
        <RefreshCw className="mr-2 h-3 w-3" />
        Làm lại
      </Button>
    </div>
  );
};

export default MatchingFooter;
