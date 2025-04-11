
import React from 'react';
import { Button } from '@/components/ui/button';
import { Home, RefreshCw, Settings, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface QuizContainerProps {
  children: React.ReactNode;
  title?: string;
  showBackButton?: boolean;
  showHomeButton?: boolean;
  showRefreshButton?: boolean;
  showSettingsButton?: boolean;
  onBack?: () => void;
  onRefresh?: () => void;
  onSettings?: () => void;
  footerContent?: React.ReactNode;
  headerRight?: React.ReactNode;
}

const QuizContainer: React.FC<QuizContainerProps> = ({
  children,
  title = "Minigame Tương Tác",
  showBackButton = true,
  showHomeButton = true,
  showRefreshButton = true,
  showSettingsButton = false,
  onBack,
  onRefresh,
  onSettings,
  footerContent,
  headerRight
}) => {
  const navigate = useNavigate();
  
  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      navigate('/');
    }
  };
  
  const handleRefresh = () => {
    if (onRefresh) {
      onRefresh();
    } else {
      window.location.reload();
    }
  };

  return (
    <div className="relative h-full w-full flex flex-col bg-gradient-to-b from-background to-background/95 shadow-lg rounded-lg overflow-hidden">
      {/* Header */}
      <div className="flex justify-between items-center bg-background/80 backdrop-blur-md p-3 border-b border-primary/10 shadow-sm">
        <div className="flex items-center gap-2">
          {showBackButton && (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={handleBack}
              className="h-8 w-8 p-0 flex items-center justify-center"
              title="Quay lại"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
          )}
          
          {showHomeButton && (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => navigate('/')}
              className="h-8 w-8 p-0 flex items-center justify-center"
              title="Trang chủ"
            >
              <Home className="h-4 w-4" />
            </Button>
          )}
          
          <h2 className="text-sm font-medium truncate max-w-[200px] ml-2">{title}</h2>
        </div>
        
        <div className="flex items-center gap-2">
          {headerRight}
          
          {showRefreshButton && (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={handleRefresh}
              className="h-8 w-8 p-0 flex items-center justify-center"
              title="Tải lại"
            >
              <RefreshCw className="h-4 w-4" />
            </Button>
          )}
          
          {showSettingsButton && (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={onSettings}
              className="h-8 w-8 p-0 flex items-center justify-center"
              title="Cài đặt"
            >
              <Settings className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
      
      {/* Main content */}
      <div className="flex-1 overflow-auto p-0 relative">
        {children}
      </div>
      
      {/* Footer (optional) */}
      {footerContent && (
        <div className="bg-background/80 backdrop-blur-md p-3 border-t border-primary/10">
          {footerContent}
        </div>
      )}
    </div>
  );
};

export default QuizContainer;
