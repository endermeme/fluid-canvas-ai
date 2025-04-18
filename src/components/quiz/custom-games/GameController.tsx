
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { MiniGame } from '../generator/types';
import { AIGameGenerator } from '../generator/AIGameGenerator';
import EnhancedGameView from './EnhancedGameView';
import CustomGameForm from './CustomGameForm';
import GameLoading from '../GameLoading';
import { useNavigate } from 'react-router-dom';
import { Share2, PlusCircle } from 'lucide-react';
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
    
    if (game) {
      setCurrentGame(game);
      setShowForm(false);
      
      if (onGameGenerated) {
        onGameGenerated(game);
      }
      
      toast({
        title: "Minigame Đã Sẵn Sàng",
        description: `Minigame "${game.title || content}" đã được tạo thành công.`,
      });
      
      setIsGenerating(false);
      return;
    }
    
    try {
      // Use AIGameGenerator to generate a new game
      const gameGenerator = new AIGameGenerator();
      const generatedGame = await gameGenerator.generateGame(content);
      
      if (generatedGame) {
        setCurrentGame(generatedGame);
        setShowForm(false);
        
        if (onGameGenerated) {
          onGameGenerated(generatedGame);
        }
        
        toast({
          title: "Minigame Đã Sẵn Sàng",
          description: `Minigame "${generatedGame.title || content}" đã được tạo thành công.`,
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
  
  const handleShareGame = async () => {
    if (!currentGame) return;
    
    try {
      const gameSession = await createGameSession(
        currentGame.title || "Minigame tương tác",
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

  const getContainerTitle = () => {
    if (isGenerating) {
      return `Đang tạo game: ${currentTopic}`;
    }
    if (currentGame) {
      return currentGame.title || "Minigame Tương Tác";
    }
    return "Tạo Game Tùy Chỉnh";
  };

  const renderContent = () => {
    if (isGenerating) {
      return <GameLoading topic={currentTopic} />;
    } 
    
    if (currentGame) {
      return (
        <div className="w-full h-full">
          <EnhancedGameView 
            miniGame={{
              title: currentGame.title || "Minigame Tương Tác",
              content: currentGame.content || ""
            }} 
            onBack={handleBack}
            onNewGame={handleNewGame}
            onShare={handleShareGame}
          />
        </div>
      );
    } 
    
    if (showForm) {
      return (
        <CustomGameForm 
          onGenerate={(content, game) => {
            setIsGenerating(true);
            handleGameGeneration(content, game);
          }}
          onCancel={() => navigate('/')}
        />
      );
    }
    
    return (
      <div className="flex flex-col items-center justify-center h-full p-6 bg-gradient-to-b from-background to-background/80">
        <div className="p-6 bg-background/90 rounded-xl shadow-lg border border-primary/10 max-w-md w-full">
          <p className="text-center mb-4">Không có nội dung trò chơi. Vui lòng tạo mới.</p>
          <Button 
            onClick={handleNewGame} 
            className="w-full"
          >
            <PlusCircle className="mr-2 h-4 w-4" />
            Tạo Game Mới
          </Button>
        </div>
      </div>
    );
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
