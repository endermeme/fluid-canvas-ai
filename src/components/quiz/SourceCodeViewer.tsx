
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Code, Copy, ChevronDown, ChevronUp, ExternalLink } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface SourceCodeViewerProps {
  htmlContent: string;
  initialExpanded?: boolean;
  showPreviewButton?: boolean;
  gameId?: string;
}

const SourceCodeViewer: React.FC<SourceCodeViewerProps> = ({ 
  htmlContent, 
  initialExpanded = false,
  showPreviewButton = false,
  gameId
}) => {
  const [isExpanded, setIsExpanded] = useState(initialExpanded);
  const { toast } = useToast();

  const handleCopyCode = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    navigator.clipboard.writeText(htmlContent);
    toast({
      title: "Đã sao chép mã nguồn",
      description: "Mã nguồn đã được sao chép vào clipboard",
    });
  };
  
  const handleOpenPreview = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (gameId) {
      window.open(`/quiz/shared/${gameId}`, '_blank');
    } else {
      // Create a temporary blob URL to preview the HTML
      const blob = new Blob([htmlContent], { type: 'text/html' });
      const url = URL.createObjectURL(blob);
      window.open(url, '_blank');
      
      // Clean up the blob URL after a short delay
      setTimeout(() => URL.revokeObjectURL(url), 1000);
    }
  };

  return (
    <div className="w-full border rounded-md mb-2 bg-background shadow-sm">
      <div 
        className="flex items-center justify-between p-2 cursor-pointer border-b" 
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center">
          <Code size={16} className="mr-2 text-primary" />
          <h3 className="font-medium text-sm">Mã nguồn</h3>
        </div>
        <div className="flex items-center gap-1">
          {showPreviewButton && (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={handleOpenPreview}
              className="h-7 px-2"
            >
              <ExternalLink size={14} className="mr-1" />
              Xem
            </Button>
          )}
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={(e) => {
              e.stopPropagation(); // Prevent toggle when clicking copy
              handleCopyCode(e);
            }}
            className="h-7 px-2"
          >
            <Copy size={14} className="mr-1" />
            Sao chép
          </Button>
          {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </div>
      </div>
      
      {isExpanded && (
        <div className="p-2">
          <ScrollArea className="h-[250px] w-full rounded border bg-muted/50">
            <Textarea
              className="font-mono text-xs p-3 min-h-[250px] w-full resize-none"
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
