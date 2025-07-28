import React from 'react';
import { useParams } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { Card } from '@/components/ui/card';
import PresetGameRenderer from '../../custom-games/PresetGameRenderer';
import PresetGameHeader from '../PresetGameHeader';

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

  const handleGameComplete = async (result: any) => {
    console.log('🎯 [PresetGameView] Game completed:', result);
    toast({
      title: "🎉 Hoàn thành!",
      description: `Điểm số: ${result.score}/${result.totalQuestions || result.score}`
    });
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-background via-background/95 to-primary/5">
      {!hideHeader && (
        <PresetGameHeader
          onBack={onBack}
        />
      )}
      
      <div className="flex-1 p-4">
        <Card className="h-full border-0 shadow-lg">
          <PresetGameRenderer
            gameType={miniGame.gameType || 'quiz'}
            data={miniGame.data}
            onBack={onBack}
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