import React from 'react';
import { useParams } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { Card } from '@/components/ui/card';
import PresetGameRenderer from '../PresetGameRenderer';
import PresetGameHeader from '../PresetGameHeader';
import { usePresetGameShareManager } from '@/hooks/usePresetGameShareManager';
import { usePresetGameScoreManager } from '@/hooks/usePresetGameScoreManager';

interface PresetGameViewProps {
  miniGame: {
    title?: string;
    gameType?: string;
    data?: any;
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
  playerName?: string | null;
}

const PresetGameView: React.FC<PresetGameViewProps> = ({
  miniGame,
  onReload,
  onBack,
  hideHeader = false,
  onShare,
  onNewGame,
  extraButton,
  isTeacher = false,
  gameExpired = false,
  gameId,
  playerName
}) => {
  const { toast } = useToast();
  const { isSharing, handleShare } = usePresetGameShareManager(miniGame, toast, onShare);
  const { savePresetGameScore } = usePresetGameScoreManager();
  const { gameId: paramGameId } = useParams();

  const handleGameComplete = async (result: any) => {
    console.log('🎯 [PresetGameView] Game completed:', result);
    
    try {
      const currentGameId = gameId || paramGameId;
      const currentPlayerName = playerName || localStorage.getItem(`playerName_${currentGameId}`) || 'Anonymous';
      
      if (currentGameId && result) {
        await savePresetGameScore(
          currentGameId,
          currentPlayerName,
          result.score || 0,
          result.totalQuestions || 0,
          result.completionTime || 0,
          result.extraData || {}
        );
        
        toast({
          title: "🎉 Hoàn thành!",
          description: `Điểm số: ${result.score}/${result.totalQuestions || result.score}`
        });
      }
    } catch (error) {
      console.error('Error saving preset game score:', error);
      toast({
        title: "Lỗi",
        description: "Không thể lưu điểm số",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-background via-background/95 to-primary/5">
      {!hideHeader && (
        <PresetGameHeader
          title={miniGame.title || 'Preset Game'}
          onBack={onBack}
          onShare={isSharing ? undefined : handleShare}
          onReload={onReload}
          onNewGame={onNewGame}
          isSharing={isSharing}
          gameExpired={gameExpired}
          isTeacher={isTeacher}
        />
      )}
      
      <div className="flex-1 p-4">
        <Card className="h-full border-0 shadow-lg">
          <PresetGameRenderer
            gameType={miniGame.gameType || 'quiz'}
            data={miniGame.data}
            onBack={onBack}
            onGameComplete={handleGameComplete}
          />
        </Card>
      </div>
      
      {extraButton && (
        <div className="fixed bottom-4 right-4">
          {extraButton}
        </div>
      )}
    </div>
  );
};

export default PresetGameView;