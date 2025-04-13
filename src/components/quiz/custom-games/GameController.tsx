
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { MiniGame } from '../generator/types';
import CustomGameForm from './CustomGameForm';
import GameLoading from '../GameLoading';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { createGameSession } from '@/utils/gameParticipation';
import QuizContainer from '../QuizContainer';
import SimpleGameView from './SimpleGameView';
import { PlusCircle, Share2 } from 'lucide-react';

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
  const [showForm, setShowForm] = useState(!currentGame);
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const handleGameGeneration = (content: string, game?: MiniGame) => {
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
    
    const gameSession = createGameSession(
      currentGame.title || "Minigame tương tác",
      currentGame.content
    );
    
    navigate(`/game/${gameSession.id}`);
    
    toast({
      title: "Game đã được chia sẻ",
      description: "Bạn có thể gửi link cho người khác để họ tham gia.",
    });
  };

  const renderContent = () => {
    if (isGenerating) {
      return <GameLoading topic={initialTopic} />;
    } 
    
    if (currentGame) {
      return (
        <div className="w-full h-full flex flex-col">
          <div className="flex justify-end p-2 bg-background/80 border-b border-primary/10">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleNewGame}
              className="mr-2"
            >
              <PlusCircle className="h-4 w-4 mr-1.5" />
              Trò Chơi Mới
            </Button>
            
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleShareGame}
            >
              <Share2 className="h-4 w-4 mr-1.5" />
              Chia Sẻ
            </Button>
          </div>
          
          <SimpleGameView 
            gameHtml={currentGame.content} 
            gameTitle={currentGame.title || "Minigame"} 
          />
        </div>
      );
    } 
    
    if (showForm) {
      return (
        <CustomGameForm 
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
      title={currentGame ? (currentGame.title || "Minigame Tương Tác") : "Tạo Game Tùy Chỉnh"}
      showBackButton={true}
      onBack={handleBack}
    >
      <div className="h-full w-full overflow-hidden">
        {renderContent()}
      </div>
    </QuizContainer>
  );
};

export default GameController;
