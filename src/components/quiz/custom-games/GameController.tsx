
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { MiniGame } from '../generator/types';
import { AIGameGenerator } from '../generator/AIGameGenerator';
import EnhancedGameView from './EnhancedGameView';
import CustomGameForm from './CustomGameForm';
import GameLoading from '../GameLoading';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { createGameSession } from '@/utils/gameParticipation';
import QuizContainer from '../QuizContainer';

interface GameControllerProps {
  initialTopic?: string;
  onGameGenerated?: (game: MiniGame) => void;
}

const GameController: React.FC<GameControllerProps> = ({ 
  initialTopic = "", 
  onGameGenerated 
}) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [currentGame, setCurrentGame] = useState<MiniGame | null>(null);
  const [currentTopic, setCurrentTopic] = useState<string>(initialTopic);
  const [showForm, setShowForm] = useState(!currentGame);
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const handleGameGeneration = async (content: string, game?: MiniGame) => {
    setCurrentTopic(content);
    setIsGenerating(true);
    
    if (game) {
      setCurrentGame(game);
      setShowForm(false);
      if (onGameGenerated) onGameGenerated(game);
      setIsGenerating(false);
      return;
    }
    
    try {
      const gameGenerator = new AIGameGenerator();
      const generatedGame = await gameGenerator.generateMiniGame(content);
      
      if (generatedGame) {
        setCurrentGame(generatedGame);
        setShowForm(false);
        if (onGameGenerated) onGameGenerated(generatedGame);
        toast({
          title: "Game Đã Sẵn Sàng",
          description: `Game "${generatedGame.title || content}" đã được tạo thành công.`,
        });
      } else {
        throw new Error("Không thể tạo game");
      }
    } catch (error) {
      console.error("Error generating game:", error);
      toast({
        title: "Lỗi Tạo Game",
        description: "Đã xảy ra lỗi khi tạo game. Vui lòng thử lại.",
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleNewGame = () => {
    setCurrentGame(null);
    setShowForm(true);
  };
  
  const handleShareGame = async () => {
    if (!currentGame) return;
    
    try {
      const gameSession = await createGameSession(
        currentGame.title || "Game Tương Tác",
        currentGame.content
      );
      
      navigate(`/game/${gameSession.id}`);
      toast({
        title: "Game đã được chia sẻ",
        description: "Bạn có thể gửi link cho người khác để họ tham gia.",
      });
    } catch (error) {
      console.error("Error sharing game:", error);
      toast({
        title: "Lỗi chia sẻ",
        description: "Đã xảy ra lỗi khi chia sẻ game.",
        variant: "destructive"
      });
    }
  };

  const handleBack = () => {
    navigate('/');
  };

  const getContainerTitle = () => {
    if (isGenerating) return `Đang tạo game: ${currentTopic}`;
    if (currentGame) return currentGame.title || "Game Tương Tác";
    return "Tạo Game Tùy Chỉnh";
  };

  const renderContent = () => {
    if (isGenerating) {
      return <GameLoading topic={currentTopic} />;
    }
    
    if (currentGame) {
      return (
        <EnhancedGameView 
          miniGame={{
            title: currentGame.title || "Game Tương Tác",
            content: currentGame.content || ""
          }} 
          onBack={handleBack}
          onNewGame={handleNewGame}
          onShare={handleShareGame}
        />
      );
    }
    
    if (showForm) {
      return (
        <CustomGameForm 
          onGenerate={(content, game) => handleGameGeneration(content, game)}
          onCancel={handleBack}
        />
      );
    }
    
    return null;
  };

  return (
    <QuizContainer
      title={getContainerTitle()}
      showBackButton={true}
      onBack={handleBack}
      showSettingsButton={false}
      showCreateButton={!isGenerating && !showForm}
      onCreate={handleNewGame}
      className="p-0 overflow-hidden"
    >
      <div className="h-full w-full overflow-hidden">
        {renderContent()}
      </div>
    </QuizContainer>
  );
};

export default GameController;
