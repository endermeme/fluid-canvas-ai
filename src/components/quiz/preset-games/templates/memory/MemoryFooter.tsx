
import React from 'react';
import { Button } from '@/components/ui/button';
import { RefreshCw, Lightbulb } from 'lucide-react';

interface MemoryFooterProps {
  allowHints?: boolean;
  onHint: () => void;
  onRestart: () => void;
}

const MemoryFooter: React.FC<MemoryFooterProps> = ({
  allowHints,
  onHint,
  onRestart
}) => {
  return (
    <div className="flex-shrink-0 p-1 sm:p-2 border-t border-primary/10 bg-background/95 backdrop-blur-sm">
      <div className="flex gap-1 sm:gap-2">
        {allowHints && (
          <Button
            variant="outline"
            size="sm"
            onClick={onHint}
            className="flex-1 text-xs h-7 sm:h-8 px-1 sm:px-2"
          >
            <Lightbulb className="h-3 w-3 sm:mr-1 text-yellow-500" />
            <span className="hidden sm:inline">Gợi ý (-10s)</span>
            <span className="sm:hidden">Gợi ý</span>
          </Button>
        )}
        
        <Button
          variant="outline"
          size="sm"
          onClick={onRestart}
          className="flex-1 text-xs h-7 sm:h-8 px-1 sm:px-2"
        >
          <RefreshCw className="h-3 w-3 sm:mr-1" />
          <span className="hidden sm:inline">Làm lại</span>
          <span className="sm:hidden">Reset</span>
        </Button>
      </div>
    </div>
  );
};

export default MemoryFooter;
