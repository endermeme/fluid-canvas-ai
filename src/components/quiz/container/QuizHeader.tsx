
import React from 'react';
import { Button } from '@/components/ui/button';
import { Home, RefreshCw, Settings, ArrowLeft, PlusCircle, Share2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface QuizHeaderProps {
  title: string;
  showBackButton?: boolean;
  showHomeButton?: boolean;
  showRefreshButton?: boolean;
  showSettingsButton?: boolean;
  showCreateButton?: boolean;
  showShareButton?: boolean;
  isGameCreated?: boolean;
  onBack?: () => void;
  onRefresh?: () => void;
  onSettings?: () => void;
  onCreate?: () => void;
  onShare?: () => void;
  headerRight?: React.ReactNode;
}

export const QuizHeader: React.FC<QuizHeaderProps> = ({
  title,
  showBackButton = true,
  showHomeButton = true,
  showRefreshButton = true,
  showSettingsButton = false,
  showCreateButton = false,
  showShareButton = false,
  isGameCreated = false,
  onBack,
  onRefresh,
  onSettings,
  onCreate,
  onShare,
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

  return (
    <div className="flex justify-between items-center bg-background/90 backdrop-blur-md px-2 py-1.5 border-b border-primary/10 shadow-sm">
      <div className="flex items-center gap-1">
        {showBackButton && (
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={handleBack}
            className="w-7 h-7 p-0"
            title="Quay lại"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
          </Button>
        )}
        
        {showHomeButton && (
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => navigate('/')}
            className="w-7 h-7 p-0"
            title="Trang chủ"
          >
            <Home className="h-3.5 w-3.5" />
          </Button>
        )}
        
        <h2 className="text-sm font-medium truncate max-w-[180px] ml-1">{title}</h2>
      </div>
      
      <div className="flex items-center gap-1">
        {headerRight}
        
        {showCreateButton && (
          <Button 
            variant="outline" 
            size="sm" 
            onClick={onCreate}
            className="h-7 px-2 text-xs"
            title="Tạo mới"
          >
            <PlusCircle className="h-3 w-3 mr-1" />
            Tạo mới
          </Button>
        )}

        {showShareButton && isGameCreated && (
          <Button
            variant="default"
            size="sm"
            onClick={onShare}
            className="h-7 px-3 bg-primary text-primary-foreground hover:bg-primary/90 flex items-center gap-1 transition-all duration-300 ease-in-out transform hover:scale-105 active:scale-95"
            title="Chia sẻ game"
          >
            <Share2 className="h-3 w-3 mr-1" />
            Chia sẻ
          </Button>
        )}
        
        {showRefreshButton && (
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={onRefresh}
            className="w-7 h-7 p-0"
            title="Tải lại"
          >
            <RefreshCw className="h-3.5 w-3.5" />
          </Button>
        )}
        
        {showSettingsButton && (
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={onSettings}
            className="w-7 h-7 p-0"
            title="Cài đặt"
          >
            <Settings className="h-3.5 w-3.5" />
          </Button>
        )}
      </div>
    </div>
  );
};
