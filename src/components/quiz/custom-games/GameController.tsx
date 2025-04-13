
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { MiniGame } from '../generator/AIGameGenerator';
import EnhancedGameView from './EnhancedGameView';
import CustomGameForm from '../preset-games/CustomGameForm';  // Update the import path
import GameLoading from '../GameLoading';
import { useNavigate } from 'react-router-dom';
import { Share2, PlusCircle, Gamepad2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { createGameSession } from '@/services/gameParticipation';
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
  
  const handleGameGeneration = (content: string, game?: MiniGame) => {
    setCurrentTopic(content);
    
    if (game) {
      // Force HTML content for testing if needed
      // Uncomment the next line for testing HTML game container
      // game.content = `<html><body><h1>Test HTML Game</h1><script>document.write('Dynamic content!')</script></body></html>`;
      
      setCurrentGame(game);
      setShowForm(false);
      
      if (onGameGenerated) {
        onGameGenerated(game);
      }
      
      toast({
        title: "Minigame Đã Sẵn Sàng",
        description: `Minigame "${game.title || content}" đã được tạo thành công.`,
      });
    }
    
    setIsGenerating(false);
  };

  const handleBack = () => {
    if (currentGame) {
      setCurrentGame(null);
      setShowForm(true);
    } else {
      navigate('/');
    }
  };

  const handleNewGame = () => {
    setCurrentGame(null);
    setShowForm(true);
  };
  
  const handleShareGame = () => {
    if (!currentGame) return;
    
    // Create a shareable game session
    const gameSession = createGameSession(
      currentGame.title || "Minigame tương tác",
      currentGame.content
    );
    
    // Navigate to the share page
    navigate(`/game/${gameSession.id}`);
    
    toast({
      title: "Game đã được chia sẻ",
      description: "Bạn có thể gửi link cho người khác để họ tham gia.",
    });
  };

  // Determine container title based on state
  const getContainerTitle = () => {
    if (isGenerating) {
      return `Đang tạo game: ${currentTopic}`;
    }
    if (currentGame) {
      return currentGame.title || "Minigame Tương Tác";
    }
    return "Tạo Game Tùy Chỉnh";
  };

  const extraButton = currentGame ? (
    <Button 
      size="sm" 
      variant="secondary"
      className="ml-2 bg-background/80 backdrop-blur-sm border border-primary/20 shadow-md" 
      onClick={handleShareGame}
    >
      <Share2 size={14} className="mr-1" />
      Chia Sẻ & Theo Dõi
    </Button>
  ) : null;

  // Render footer actions based on state
  const footerActions = currentGame ? (
    <div className="flex justify-between items-center">
      <Button 
        onClick={handleNewGame} 
        variant="secondary"
        className="bg-primary/10 flex items-center"
      >
        <PlusCircle className="h-4 w-4 mr-2" />
        Tạo Game Mới
      </Button>
      
      <Button 
        variant="default" 
        className="bg-gradient-to-r from-primary to-primary/80"
        onClick={handleShareGame}
      >
        <Share2 size={14} className="mr-1" />
        Chia Sẻ Game
      </Button>
    </div>
  ) : null;

  // Main content based on state
  const renderContent = () => {
    if (isGenerating) {
      return <GameLoading topic={currentTopic} />;
    } 
    
    if (currentGame) {
      return (
        <EnhancedGameView 
          miniGame={{
            title: currentGame.title || "Minigame Tương Tác",
            content: currentGame.content || ""
          }} 
          onBack={handleBack}
          onNewGame={handleNewGame}
          extraButton={extraButton}
        />
      );
    } 
    
    if (showForm) {
      return (
        <CustomGameForm 
          gameType="custom" 
          onGenerate={(content, game) => {
            setIsGenerating(true);
            setTimeout(() => handleGameGeneration(content, game), 500);
          }}
          onCancel={() => navigate('/')}
        />
      );
    }
    
    return (
      <div className="flex flex-col items-center justify-center h-full p-6">
        <p>Không có nội dung trò chơi. Vui lòng tạo mới.</p>
        <Button 
          onClick={handleNewGame} 
          className="mt-4 flex items-center gap-2"
        >
          <PlusCircle className="h-5 w-5" />
          Tạo Game Mới
        </Button>
      </div>
    );
  };

  return (
    <QuizContainer
      title={getContainerTitle()}
      showBackButton={true}
      onBack={handleBack}
      showSettingsButton={currentGame !== null}
      showCreateButton={!isGenerating && !showForm}
      onCreate={handleNewGame}
      footerContent={footerActions}
    >
      <div className="h-full w-full">
        {renderContent()}
      </div>
    </QuizContainer>
  );
};

export default GameController;
