
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { MiniGame } from '../generator/AIGameGenerator';
import GameView from '../GameView';
import CustomGameForm from './CustomGameForm';
import GameLoading from '../GameLoading';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Home, RefreshCw, Share2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { createGameSession } from '@/utils/gameParticipation';

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

  return (
    <div className="h-full flex flex-col">
      <div className="flex-grow overflow-auto">
        {isGenerating ? (
          <GameLoading topic={currentTopic} />
        ) : currentGame ? (
          <div className="relative h-full">
            <GameView 
              miniGame={currentGame} 
              onBack={handleBack}
              extraButton={
                <Button 
                  size="sm" 
                  variant="secondary"
                  className="ml-2 bg-background/80 backdrop-blur-sm border border-primary/20 shadow-md" 
                  onClick={handleShareGame}
                >
                  <Share2 size={14} className="mr-1" />
                  Chia Sẻ & Theo Dõi
                </Button>
              }
            />
          </div>
        ) : showForm ? (
          <div className="relative">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => navigate('/')} 
              className="absolute top-4 left-4 z-10 flex items-center gap-1 bg-background/80 hover:bg-background/90 backdrop-blur-sm shadow-sm"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Quay lại</span>
            </Button>
            
            <CustomGameForm 
              gameType="custom" 
              onGenerate={(content, game) => {
                setIsGenerating(true);
                setTimeout(() => handleGameGeneration(content, game), 500);
              }}
              onCancel={() => navigate('/')}
            />
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default GameController;
