
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Home, RefreshCw } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';

interface QuizContainerProps {
  children: React.ReactNode;
  title: string;
  showBackButton?: boolean;
  showRefreshButton?: boolean;
  showHomeButton?: boolean;
  onBack?: () => void;
  onRefresh?: () => void;
  className?: string;
}

const QuizContainer: React.FC<QuizContainerProps> = ({
  children,
  title,
  showBackButton = true,
  showRefreshButton = false,
  showHomeButton = true,
  onBack,
  onRefresh,
  className,
}) => {
  const navigate = useNavigate();
  
  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      navigate(-1);
    }
  };
  
  const handleHome = () => {
    navigate('/');
  };
  
  return (
    <div className="h-full flex flex-col">
      <div className="bg-background border-b py-2 px-4 flex items-center justify-between">
        <div className="flex items-center">
          {showBackButton && (
            <Button variant="ghost" size="sm" onClick={handleBack} className="mr-2">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Quay lại
            </Button>
          )}
          <h1 className="text-xl font-semibold truncate">{title}</h1>
        </div>
        
        <div className="flex items-center space-x-2">
          {showRefreshButton && onRefresh && (
            <Button variant="ghost" size="icon" onClick={onRefresh}>
              <RefreshCw className="h-4 w-4" />
            </Button>
          )}
          
          {showHomeButton && (
            <Button variant="ghost" size="icon" onClick={handleHome}>
              <Home className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
      
      <div className={cn("flex-1 overflow-hidden", className)}>
        {children}
      </div>
    </div>
  );
};

export default QuizContainer;
