
import React from 'react';
import { Button } from '@/components/ui/button';
import { Home, RefreshCw, Settings, ArrowLeft, PlusCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { cn } from "@/lib/utils";

interface QuizContainerProps {
  children: React.ReactNode;
  title?: string;
  showBackButton?: boolean;
  showHomeButton?: boolean;
  showRefreshButton?: boolean;
  showSettingsButton?: boolean;
  showCreateButton?: boolean;
  onBack?: () => void;
  onRefresh?: () => void;
  onSettings?: () => void;
  onCreate?: () => void;
  footerContent?: React.ReactNode;
  headerRight?: React.ReactNode;
  className?: string;
}

const QuizContainer: React.FC<QuizContainerProps> = ({
  children,
  title = "Minigame Tương Tác",
  showBackButton = true,
  showHomeButton = true,
  showRefreshButton = true,
  showSettingsButton = false,
  showCreateButton = false,
  onBack,
  onRefresh,
  onSettings,
  onCreate,
  footerContent,
  headerRight,
  className
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

  const handleCreate = () => {
    if (onCreate) {
      onCreate();
    } else {
      navigate('/quiz?create=true');
    }
  };

  return (
    <div className={cn("relative h-full w-full flex flex-col bg-gradient-to-b from-background to-background/95 shadow-lg rounded-lg overflow-hidden", className)}>
      {/* Streamlined Header */}
      <div className="flex justify-between items-center bg-background/90 backdrop-blur-md p-2.5 border-b border-primary/10 shadow-sm">
        <div className="flex items-center gap-1.5">
          {showBackButton && (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={handleBack}
              className="w-8 h-8 p-0"
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
              className="w-8 h-8 p-0"
              title="Trang chủ"
            >
              <Home className="h-4 w-4" />
            </Button>
          )}
          
          <h2 className="text-sm font-medium truncate max-w-[180px] ml-1.5">{title}</h2>
        </div>
        
        <div className="flex items-center gap-1.5">
          {headerRight}
          
          {showCreateButton && (
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleCreate}
              className="h-8 px-2.5 text-xs"
              title="Tạo mới"
            >
              <PlusCircle className="h-3.5 w-3.5 mr-1" />
              Tạo mới
            </Button>
          )}
          
          {showRefreshButton && (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={handleRefresh}
              className="w-8 h-8 p-0"
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
              className="w-8 h-8 p-0"
              title="Cài đặt"
            >
              <Settings className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
      
      {/* Main content */}
      <div className="flex-1 overflow-hidden p-0 relative">
        {children}
      </div>
      
      {/* Footer (optional) */}
      {footerContent && (
        <div className="bg-background/90 backdrop-blur-md p-2.5 border-t border-primary/10">
          {footerContent}
        </div>
      )}
    </div>
  );
};

export default QuizContainer;
