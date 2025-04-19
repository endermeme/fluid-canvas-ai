
import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import EnhancedGameView from '@/custom-games/components/EnhancedGameView';
import CustomGameSettings from '@/custom-games/components/CustomGameSettings';
import { AIGameGenerator } from '@/custom-games/generator/AIGameGenerator';
import { MiniGame, GameSettingsData } from '@/types/game';
import GameLoading from '@/preset-games/GameLoading';
import GameError from '@/preset-games/GameError';
import { ArrowLeft, History } from 'lucide-react';

const CustomGamesPage: React.FC = () => {
  const [miniGame, setMiniGame] = useState<MiniGame | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [topic, setTopic] = useState<string>('');
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  
  // Extract topic from URL if provided
  const searchParams = new URLSearchParams(location.search);
  const topicFromUrl = searchParams.get('topic');
  const autostart = searchParams.get('autostart') === 'true';
  
  const gameGenerator = AIGameGenerator.getInstance();
  
  // Auto-generate if topic is provided in URL
  React.useEffect(() => {
    if (topicFromUrl && autostart && !miniGame && !isGenerating) {
      setTopic(topicFromUrl);
      handleGenerateGame(topicFromUrl, true);
    }
  }, [topicFromUrl, autostart, miniGame, isGenerating]);

  const handleGenerateGame = async (promptText: string, useCanvas: boolean = true) => {
    if (!promptText.trim()) {
      toast({
        title: "Lỗi",
        description: "Vui lòng nhập yêu cầu cho trò chơi",
        variant: "destructive"
      });
      return;
    }

    setTopic(promptText);
    setIsGenerating(true);
    setErrorMessage(null);
    setMiniGame(null);
    
    try {
      // Default settings
      const settings: GameSettingsData = {
        difficulty: 'medium',
        questionCount: 10,
        timePerQuestion: 30,
        category: 'general',
        useCanvas
      };
      
      const game = await gameGenerator.generateMiniGame(promptText, settings);
      
      if (game) {
        setMiniGame(game);
        
        toast({
          title: "Trò chơi đã được tạo",
          description: "Trò chơi đã được tạo thành công",
        });
      } else {
        throw new Error("Không thể tạo game");
      }
    } catch (error) {
      console.error("Error generating game:", error);
      
      setErrorMessage('Có lỗi xảy ra khi tạo game. Vui lòng thử lại.');
      
      toast({
        title: "Lỗi tạo game",
        description: "Có lỗi xảy ra khi tạo game. Vui lòng thử lại.",
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleBack = () => {
    if (miniGame) {
      setMiniGame(null);
      setTopic('');
    } else {
      navigate('/');
    }
  };

  const viewGameHistory = () => {
    navigate('/game-history');
  };

  if (isGenerating) {
    return <GameLoading topic={topic} />;
  }

  if (errorMessage) {
    return (
      <GameError 
        errorMessage={errorMessage} 
        onRetry={() => handleGenerateGame(topic)} 
        topic={topic} 
      />
    );
  }

  return (
    <div className="h-full flex flex-col relative">
      <div className="absolute top-4 left-4 z-10">
        <Button 
          onClick={handleBack} 
          variant="ghost" 
          size="sm"
          className="flex items-center gap-1 bg-background/80 backdrop-blur-sm shadow-sm"
        >
          <ArrowLeft size={16} />
          <span>Quay lại</span>
        </Button>
      </div>
      
      {!miniGame && (
        <div className="absolute top-4 right-4 z-10">
          <Button 
            onClick={viewGameHistory}
            variant="outline" 
            size="sm"
            className="flex items-center gap-1.5 bg-background/80 backdrop-blur-sm shadow-sm"
          >
            <History size={16} />
            <span>Lịch sử game</span>
          </Button>
        </div>
      )}
      
      {miniGame ? (
        <EnhancedGameView 
          miniGame={miniGame} 
          onBack={handleBack}
        />
      ) : (
        <CustomGameSettings 
          onGenerate={handleGenerateGame}
          isGenerating={isGenerating}
        />
      )}
    </div>
  );
};

export default CustomGamesPage;
