
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Code, Copy, ChevronDown, ChevronUp } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface SourceCodeViewerProps {
  htmlContent: string;
}

const SourceCodeViewer: React.FC<SourceCodeViewerProps> = ({ htmlContent }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const { toast } = useToast();

  const handleCopyCode = () => {
    navigator.clipboard.writeText(htmlContent);
    toast({
      title: "Đã sao chép mã nguồn",
      description: "Mã nguồn đã được sao chép vào clipboard",
    });
  };

  return (
    <div className="w-full border rounded-md mb-4 bg-background">
      <div 
        className="flex items-center justify-between p-3 cursor-pointer border-b" 
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center">
          <Code size={18} className="mr-2 text-primary" />
          <h3 className="font-medium">Mã nguồn</h3>
        </div>
        <div className="flex items-center">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={(e) => {
              e.stopPropagation(); // Prevent toggle when clicking copy
              handleCopyCode();
            }}
          >
            <Copy size={16} className="mr-1" />
            Sao chép
          </Button>
          {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
        </div>
      </div>
      
      {isExpanded && (
        <div className="p-2">
          <ScrollArea className="h-[300px] w-full rounded border bg-muted/50">
            <Textarea
              className="font-mono text-xs p-3 min-h-[300px] w-full resize-none"
              value={htmlContent}
              readOnly
            />
          </ScrollArea>
        </div>
      )}
    </div>
  );
};

export default SourceCodeViewer;
