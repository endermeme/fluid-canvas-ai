
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
    <div className="flex-shrink-0 p-2 border-t border-primary/10">
      <div className="flex gap-2">
        {allowHints && (
          <Button
            variant="outline"
            size="sm"
            onClick={onHint}
            className="flex-1 text-xs h-8"
          >
            <Lightbulb className="h-3 w-3 mr-1 text-yellow-500" />
            Gợi ý (-10s)
          </Button>
        )}
        
        <Button
          variant="outline"
          size="sm"
          onClick={onRestart}
          className="flex-1 text-xs h-8"
        >
          <RefreshCw className="h-3 w-3 mr-1" />
          Làm lại
        </Button>
      </div>
    </div>
  );
};

export default MemoryFooter;
