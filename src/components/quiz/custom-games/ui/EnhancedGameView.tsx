
import React, { useEffect, useState } from 'react';
import GameErrorDisplay from '../game-components/GameErrorDisplay';
import GameLoadingIndicator from '../game-components/GameLoadingIndicator';
import GameIframeRenderer from './GameIframeRenderer';
import CustomGameHeader from './CustomGameHeader';
import { useToast } from '@/hooks/use-toast';
import { useGameShareManager } from '../../hooks/useGameShareManager';
import { useIframeManager } from '../../hooks/useIframeManager';
import { createAndShareGame } from '@/utils/gameCreator';
import { Button } from '@/components/ui/button';
import { Settings } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { getGameAdminSettings, ensureAdminSettings } from '@/utils/gameAdmin';

interface EnhancedGameViewProps {
  miniGame: {
    title?: string;
    content: string;
  };
  onReload?: () => void;
  className?: string;
  onBack?: () => void;
  hideHeader?: boolean;
  onShare?: () => Promise<string>;
  onNewGame?: () => void;
  extraButton?: React.ReactNode;
  isTeacher?: boolean;
  gameExpired?: boolean;
  gameId?: string;
}

const EnhancedGameView: React.FC<EnhancedGameViewProps> = ({ 
  miniGame, 
  onReload,
  className,
  onBack,
  hideHeader = false,
  onShare,
  onNewGame,
  extraButton,
  isTeacher = false,
  gameExpired = false,
  gameId
}) => {
  const toast = useToast();
  const navigate = useNavigate();
  const [showAdminButton, setShowAdminButton] = useState(false);
  
  // Kiểm tra xem game có tính năng admin không
  useEffect(() => {
    const checkAdminFeature = async () => {
      if (gameId) {
        try {
          const adminSettings = await getGameAdminSettings(gameId);
          setShowAdminButton(!!adminSettings);
        } catch (error) {
          console.error("Lỗi kiểm tra tính năng admin:", error);
        }
      }
    };
    
    checkAdminFeature();
  }, [gameId]);
  
  // Tạo handle custom share với cài đặt admin đầy đủ
  const customShareHandler = async (): Promise<string> => {
    try {
      // Kiểm tra xem có cài đặt admin tạm thời không
      const tempAdminSettingsStr = localStorage.getItem('temp_admin_settings');
      let adminSettings = {
        adminPassword: '1234',
        expiryDays: 30,
        maxParticipants: 50,
        requestPlayerInfo: true
      };
      
      if (tempAdminSettingsStr) {
        try {
          const parsedSettings = JSON.parse(tempAdminSettingsStr);
          adminSettings = {
            ...adminSettings,
            ...parsedSettings
          };
          
          // Xóa cài đặt tạm thời sau khi sử dụng
          localStorage.removeItem('temp_admin_settings');
        } catch (error) {
          console.error("Không thể parse cài đặt admin:", error);
        }
      }
      
      // Sử dụng hàm createAndShareGame với cài đặt admin đầy đủ
      const result = await createAndShareGame({
        title: miniGame.title || 'Game tương tác',
        htmlContent: miniGame.content,
        description: `Game được tạo bởi AI`,
        expiryDays: adminSettings.expiryDays,
        adminPassword: adminSettings.adminPassword,
        maxParticipants: adminSettings.maxParticipants,
        requestPlayerInfo: adminSettings.requestPlayerInfo
      });
      
      if (result && result.sharedUrl) {
        return result.sharedUrl;
      } else {
        throw new Error("Không nhận được URL");
      }
    } catch (error) {
      console.error("Lỗi khi tạo game:", error);
      throw error;
    }
  };
  
  const goToAdminPanel = () => {
    if (gameId) {
      navigate(`/game/${gameId}/admin`);
    }
  };
  
  const { isSharing, handleShare } = useGameShareManager(miniGame, toast, customShareHandler);
  
  const { 
    iframeRef,
    iframeError, 
    isIframeLoaded, 
    loadingProgress,
    refreshGame,
    handleFullscreen 
  } = useIframeManager(miniGame, onReload, gameExpired);

  // Kết hợp nút admin với extraButton nếu cần
  const combinedButtons = (
    <>
      {extraButton}
      {showAdminButton && (
        <Button
          size="sm"
          variant="outline"
          className="text-xs ml-2"
          onClick={goToAdminPanel}
        >
          <Settings className="h-3.5 w-3.5 mr-1" />
          Quản trị
        </Button>
      )}
    </>
  );

  return (
    <div className={`w-full h-full flex flex-col ${className || ''}`}>
      {!hideHeader && (
        <CustomGameHeader
          onBack={onBack}
          onRefresh={refreshGame}
          onFullscreen={handleFullscreen}
          onShare={handleShare}
          onNewGame={onNewGame}
          showGameControls={true}
          isSharing={isSharing}
          isTeacher={isTeacher}
          gameType={miniGame?.title}
        />
      )}
      
      <div className="flex-1 relative overflow-hidden">
        {iframeError ? (
          <GameErrorDisplay 
            error={iframeError} 
            onRetry={refreshGame} 
          />
        ) : (
          <div className="absolute inset-0 w-full h-full">
            {!isIframeLoaded && (
              <GameLoadingIndicator 
                progress={loadingProgress}
              />
            )}
            <GameIframeRenderer 
              ref={iframeRef} 
              title={miniGame.title || "Game tương tác"} 
              isLoaded={isIframeLoaded}
            />
          </div>
        )}
        
        {(extraButton || showAdminButton) && (
          <div className="absolute bottom-4 right-4 z-10 flex items-center">
            {combinedButtons}
          </div>
        )}
      </div>
    </div>
  );
};

export default EnhancedGameView;
