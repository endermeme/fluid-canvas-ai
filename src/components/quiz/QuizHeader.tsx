import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft, PlusCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
// Game sharing moved to separate handlers

interface QuizHeaderProps {
  showBackButton?: boolean;
  showCreateButton?: boolean;
  onBack?: () => void;
  onCreate?: () => void;
  headerRight?: React.ReactNode;
}

const QuizHeader: React.FC<QuizHeaderProps> = ({
  showBackButton = true,
  showCreateButton = false,
  onBack,
  onCreate,
  headerRight
}) => {

  return (
    <>
      <div className="flex justify-between items-center px-3 sm:px-4 py-2 sm:py-3 border-b border-primary/10">
        {showBackButton && (
          <Button variant="ghost" size="sm" onClick={onBack} className="flex items-center gap-2" title="Quay lại">
            <ArrowLeft className="h-4 w-4" />
            <span>Quay lại</span>
          </Button>
        )}
        
        {headerRight}
        
        <div className="flex items-center gap-3">
          {showCreateButton && (
            <Button variant="outline" size="sm" onClick={onCreate} className="flex items-center gap-2" title="Tạo mới">
              <PlusCircle className="h-4 w-4" />
              <span>Tạo</span>
            </Button>
          )}

        </div>
      </div>

    </>
  );
};

export default QuizHeader;
