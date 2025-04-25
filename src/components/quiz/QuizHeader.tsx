import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft, PlusCircle, Share2 } from 'lucide-react';

interface QuizHeaderProps {
  showBackButton?: boolean;
  showCreateButton?: boolean;
  showShareButton?: boolean;
  isGameCreated?: boolean;
  onBack?: () => void;
  onCreate?: () => void;
  onShare?: () => void;
  headerRight?: React.ReactNode;
}

const QuizHeader: React.FC<QuizHeaderProps> = ({
  showBackButton = true,
  showCreateButton = false,
  showShareButton = false,
  isGameCreated = false,
  onBack,
  onCreate,
  onShare,
  headerRight
}) => {
  return (
    <div className="flex justify-between items-center bg-background/90 backdrop-blur-md px-2 py-1.5 border-b border-primary/10 shadow-sm">
      {showBackButton && (
        <Button variant="ghost" size="sm" onClick={onBack} className="w-7 h-7 p-0" title="Quay lại">
          <ArrowLeft className="h-3.5 w-3.5" />
        </Button>
      )}
      
      {headerRight}
      
      {showCreateButton && (
        <Button variant="outline" size="sm" onClick={onCreate} className="h-7 px-2 text-xs" title="Tạo mới">
          <PlusCircle className="h-3 w-3 mr-1" />
          Tạo
        </Button>
      )}

      {showShareButton && isGameCreated && (
        <Button variant="default" size="sm" onClick={onShare} className="h-7 px-3 bg-primary text-primary-foreground hover:bg-primary/90" title="Chia sẻ game">
          <Share2 className="h-3 w-3 mr-1" />
          Chia sẻ
        </Button>
      )}
    </div>
  );
};

export default QuizHeader; 