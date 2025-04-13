
import React from 'react';
import { Button } from "@/components/ui/button";
import { Home, RefreshCw, Settings, ArrowLeft, PlusCircle, Gamepad2, History, SparklesIcon } from 'lucide-react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import GameSettings from './GameSettings';
import GameView from './GameView';
import QuizGenerator from './QuizGenerator';
import { useToast } from '@/hooks/use-toast';
import NotificationsMenu from './share/NotificationsMenu';

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
  headerRight
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  
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
    <div className="relative h-full w-full flex flex-col bg-gradient-to-b from-background to-background/95 shadow-lg rounded-lg overflow-hidden">
      {/* Header */}
      <header className="border-b bg-background/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="container flex h-14 max-w-screen-2xl items-center">
          <div className="flex items-center gap-1 mr-4">
            <Gamepad2 className="h-5 w-5 text-primary" />
            <span className="font-semibold">AIGameCreator</span>
          </div>
          
          <nav className="flex items-center space-x-1 text-sm lg:space-x-2 lg:text-base">
            <Button 
              variant={location.pathname === '/preset-games' ? 'secondary' : 'ghost'} 
              size="sm" asChild
            >
              <Link to="/preset-games" className="flex items-center gap-1.5">
                <Home className="h-4 w-4" />
                <span>Trang chủ</span>
              </Link>
            </Button>
            
            <Button 
              variant={location.pathname === '/quiz' ? 'secondary' : 'ghost'} 
              size="sm" asChild
            >
              <Link to="/quiz" className="flex items-center gap-1.5">
                <SparklesIcon className="h-4 w-4" />
                <span>Tạo game</span>
              </Link>
            </Button>
            
            <Button 
              variant={location.pathname === '/game-history' ? 'secondary' : 'ghost'} 
              size="sm" asChild
            >
              <Link to="/game-history" className="flex items-center gap-1.5">
                <History className="h-4 w-4" />
                <span>Lịch sử</span>
              </Link>
            </Button>
          </nav>
          
          <div className="ml-auto flex items-center gap-2">
            <NotificationsMenu />
            
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => navigate('/settings')}
              className="flex items-center gap-1.5"
            >
              <Settings className="h-4 w-4" />
              <span className="hidden md:inline">Cài đặt</span>
            </Button>
          </div>
        </div>
      </header>
      
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
