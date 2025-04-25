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
      <div className="flex items-center">
        {/* Nội dung đã bị xóa */}
      </div>
      
      <div className="flex items-center gap-1">
        {/* Nội dung đã bị xóa */}
      </div>
    </div>
  );
};

export default QuizHeader; 