
import React, { ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

interface QuizContainerProps {
  title: string;
  children: ReactNode;
  showBackButton?: boolean;
  onBack?: () => void;
  className?: string;
  headerAction?: ReactNode;
}

const QuizContainer: React.FC<QuizContainerProps> = ({
  title,
  children,
  showBackButton = false,
  onBack,
  className = '',
  headerAction,
}) => {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <header className="border-b px-4 py-3 flex items-center justify-between bg-background/95 backdrop-blur-sm sticky top-0 z-10">
        <div className="flex items-center">
          {showBackButton && onBack && (
            <Button
              variant="ghost"
              size="icon"
              className="mr-2"
              onClick={onBack}
              aria-label="Quay lại"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
          )}
          <h1 className="font-bold text-lg">{title}</h1>
        </div>
        {headerAction && <div>{headerAction}</div>}
      </header>
      <main className={`flex-1 overflow-auto ${className}`}>{children}</main>
    </div>
  );
};

export default QuizContainer;
