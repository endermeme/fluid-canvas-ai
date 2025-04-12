import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import QuizContainer from '@/components/quiz/QuizContainer';
import { AIGameGenerator } from '@/components/quiz/generator/AIGameGenerator';
import GameLoading from '@/components/quiz/GameLoading';
import CustomGameSettings from '@/components/quiz/custom-games/CustomGameSettings';
import EnhancedGameView from '@/components/quiz/custom-games/EnhancedGameView';
import { GameSettingsData } from '@/components/quiz/types';

const API_KEY = 'AIzaSyB-X13dE3qKEURW8DxLmK56Vx3lZ1c8IfA';

const Quiz = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [gameContent, setGameContent] = useState<string | null>(null);
  const [gameTitle, setGameTitle] = useState('Game Tương Tác');
  const [prompt, setPrompt] = useState('');
  const [miniGame, setMiniGame] = useState<{ title: string, content: string } | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();
  
  // Initialize game generator
  const gameGenerator = AIGameGenerator.getInstance(API_KEY);

  const handleGenerate = async (promptText: string, settings: GameSettingsData) => {
    if (!promptText.trim()) {
      toast({
        title: "Lỗi",
        description: "Vui lòng nhập yêu cầu cho trò chơi",
        variant: "destructive"
      });
      return;
    }

    setPrompt(promptText);
    setGameTitle(`Game: ${promptText.substring(0, 40)}${promptText.length > 40 ? '...' : ''}`);
    setIsGenerating(true);
    setGameContent(null);
    setMiniGame(null);
    
    try {
      const game = await gameGenerator.generateMiniGame(promptText, settings);
      
      if (game && game.content) {
        setGameContent(game.content);
        setGameTitle(game.title || `Game: ${promptText.substring(0, 40)}...`);
        setMiniGame({
          title: game.title || `Game: ${promptText.substring(0, 40)}...`,
          content: game.content
        });
        
        toast({
          title: "Trò chơi đã được tạo",
          description: "Trò chơi đã được tạo thành công với AI",
        });
      } else {
        throw new Error("Không thể tạo trò chơi");
      }
    } catch (error) {
      console.error("Lỗi khi tạo trò chơi:", error);
      toast({
        title: "Lỗi tạo trò chơi",
        description: "Có lỗi xảy ra khi tạo trò chơi. Vui lòng thử lại.",
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleReset = () => {
    setGameContent(null);
    setGameTitle('Game Tương Tác');
    setPrompt('');
    setMiniGame(null);
  };

  const handleShare = () => {
    // Basic implementation of sharing functionality
    try {
      if (gameContent) {
        const shareUrl = window.location.origin + '/quiz?shared=true';
        navigator.clipboard.writeText(shareUrl);
        
        toast({
          title: "Đã sao chép liên kết",
          description: "Liên kết đã được sao chép vào clipboard.",
        });
      }
    } catch (error) {
      console.error("Lỗi khi chia sẻ:", error);
    }
  };

  const renderContent = () => {
    if (isGenerating) {
      return <GameLoading topic={prompt} />;
    }
    
    if (miniGame) {
      return (
        <EnhancedGameView 
          miniGame={miniGame}
          extraButton={
            <Button 
              size="sm" 
              variant="outline"
              onClick={handleShare}
              className="text-xs h-8"
            >
              Chia sẻ
            </Button>
          }
        />
      );
    }
    
    return (
      <CustomGameSettings 
        onGenerate={handleGenerate}
        isGenerating={isGenerating}
      />
    );
  };

  return (
    <div className="h-screen w-full bg-gradient-to-b from-background to-background/95">
      <QuizContainer
        title={miniGame ? miniGame.title : "Tạo Game Tùy Chỉnh với AI"}
        showBackButton={true}
        showRefreshButton={false}
        showHomeButton={true}
        onBack={() => miniGame ? handleReset() : navigate('/')}
        footerContent={miniGame ? (
          <div className="flex justify-between items-center w-full px-4 py-2">
            <Button 
              variant="outline" 
              onClick={handleReset}
              className="border-primary/20"
            >
              Tạo game mới
            </Button>
          </div>
        ) : null}
      >
        {renderContent()}
      </QuizContainer>
    </div>
  );
};

export default Quiz;
