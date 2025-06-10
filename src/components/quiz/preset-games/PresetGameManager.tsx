
import React, { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import GameSettings from '../GameSettings';
import GameLoading from '../GameLoading';
import { GameSettingsData } from '../types';
import { Card } from '@/components/ui/card';
import PresetGameHeader from './PresetGameHeader';

// Import refactored components and hooks
import { useGameGeneration } from './hooks/useGameGeneration';
import { useGameSharing } from './hooks/useGameSharing';
import GameErrorDisplay from './components/GameErrorDisplay';
import GameContentRenderer from './components/GameContentRenderer';
import ShareDialog from './components/ShareDialog';
import { getGameTypeName } from './utils/gameUtils';
import { loadSampleData } from './utils/sampleDataLoader';

interface PresetGameManagerProps {
  gameType: string;
  onBack: () => void;
  initialTopic?: string;
}

const PresetGameManager: React.FC<PresetGameManagerProps> = ({ 
  gameType, 
  onBack, 
  initialTopic = "Learn interactively" 
}) => {
  const [loading, setLoading] = useState(false);
  const [gameContent, setGameContent] = useState(null);
  const [error, setError] = useState(null);
  const [gameStartTime, setGameStartTime] = useState<number | null>(null);
  const [showSettings, setShowSettings] = useState(true);
  const [settings, setSettings] = useState<GameSettingsData>({
    difficulty: 'medium',
    questionCount: 10,
    timePerQuestion: 30,
    category: 'general',
    totalTime: 0,
    bonusTime: 5,
    useTimer: true,
    prompt: initialTopic || "Learn interactively"
  });

  const { toast } = useToast();
  
  // Use refactored hooks
  const { generating, generationProgress, generateAIContent } = useGameGeneration();
  const { shareUrl, showShareDialog, copied, setShowShareDialog, handleShare, handleCopyLink } = useGameSharing();

  useEffect(() => {
    if (!loading && gameContent && !gameStartTime) {
      setGameStartTime(Date.now());
    }
  }, [loading, gameContent, gameStartTime]);

  const handleRetry = () => {
    if (initialTopic && initialTopic.trim() !== "") {
      handleAIGeneration(initialTopic, gameType, settings);
    } else {
      loadSampleData(gameType, initialTopic, settings, setLoading, setGameContent, setError);
    }
  };

  const handleAIGeneration = async (prompt: string, type: string, gameSettings: GameSettingsData) => {
    try {
      const content = await generateAIContent(prompt, type, gameSettings);
      setGameContent(content);
      setLoading(false);
    } catch (error) {
      setError('Không thể tạo nội dung với AI. Vui lòng thử lại sau.');
      setLoading(false);
      setGameContent(null);
    }
  };

  const handleStartGame = (gameSettings: GameSettingsData) => {
    setSettings(gameSettings);
    setShowSettings(false);
    setLoading(true);

    const aiPrompt = gameSettings.prompt || initialTopic;

    if (aiPrompt && aiPrompt.trim() !== "") {
      console.log(`Creating ${gameType} game with prompt: "${aiPrompt}" and settings:`, gameSettings);
      toast({
        title: "Đang tạo trò chơi",
        description: `Đang tạo trò chơi dạng ${getGameTypeName(gameType)} với các cài đặt đã chọn.`,
      });
      handleAIGeneration(aiPrompt, gameType, gameSettings);
    } else {
      console.log(`Loading sample data for ${gameType} game with settings:`, gameSettings);
      loadSampleData(gameType, initialTopic, settings, setLoading, setGameContent, setError);
    }
  };

  const handleGameShare = () => {
    handleShare(gameContent, gameType, () => getGameTypeName(gameType));
  };

  if (!gameContent) {
    return (
      <div className="min-h-screen w-full bg-gradient-to-br from-purple-50 via-white to-pink-50 flex items-center justify-center">
        <Card className="p-8 max-w-md">
          <div className="text-center">
            <h3 className="text-xl font-bold mb-4">Đang tải game...</h3>
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto"></div>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {showSettings ? (
        <div className="p-4">
          <PresetGameHeader 
            showShare={false} 
            isGameCreated={false}
            onBack={onBack}
          />
          <GameSettings 
            initialSettings={settings}
            onStart={handleStartGame}
            onCancel={onBack}
            topic={initialTopic || ""}
          />
        </div>
      ) : generating ? (
        <GameLoading topic={initialTopic || ""} progress={generationProgress} />
      ) : loading ? (
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <div className="h-12 w-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-lg font-medium">Đang tạo trò chơi {getGameTypeName(gameType)}...</p>
            <p className="text-sm text-muted-foreground mt-2">Quá trình này có thể mất vài giây</p>
          </div>
        </div>
      ) : error ? (
        <GameErrorDisplay 
          error={error}
          onBack={onBack}
          onRetry={handleRetry}
        />
      ) : (
        <>
          <PresetGameHeader 
            onShare={handleGameShare}
            showShare={true}
            isGameCreated={!!gameContent}
            onBack={onBack}
          />
          <GameContentRenderer 
            gameType={gameType}
            gameContent={gameContent}
            onBack={onBack}
            initialTopic={initialTopic}
          />
          <ShareDialog 
            open={showShareDialog}
            onOpenChange={setShowShareDialog}
            shareUrl={shareUrl}
            copied={copied}
            onCopyLink={handleCopyLink}
          />
        </>
      )}
    </div>
  );
};

export default PresetGameManager;
