
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { MiniGame } from '../generator/AIGameGenerator';
import GameView from '../GameView';
import CustomGameForm from './CustomGameForm';
import GameLoading from '../GameLoading';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Home, RefreshCw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

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
  
  const handleReloadPage = () => {
    window.location.reload();
  };

  return (
    <div className="h-full flex flex-col">
      <div className="flex-grow overflow-auto">
        {isGenerating ? (
          <GameLoading topic={currentTopic} />
        ) : currentGame ? (
          <div className="relative h-full">
            <GameView miniGame={currentGame} onBack={handleBack} />
            <div className="absolute bottom-24 left-4 z-50">
              <Button 
                onClick={handleNewGame} 
                variant="secondary"
                className="bg-primary/10"
              >
                Trò Chơi Mới
              </Button>
            </div>
          </div>
        ) : showForm ? (
          <CustomGameForm 
            gameType="custom" 
            onGenerate={(content, game) => {
              setIsGenerating(true);
              setTimeout(() => handleGameGeneration(content, game), 500);
            }}
            onCancel={() => navigate('/')}
          />
        ) : null}
      </div>
    </div>
  );
};

export default GameController;
