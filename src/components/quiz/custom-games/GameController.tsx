
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { MiniGame } from '../generator/AIGameGenerator';
import GameView from '../GameView';
import CustomGameForm from './CustomGameForm';
import GameLoading from '../GameLoading';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Home } from 'lucide-react';

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
  
  const handleGameGeneration = (content: string, game?: MiniGame) => {
    setCurrentTopic(content);
    
    if (game) {
      setCurrentGame(game);
      setShowForm(false);
      
      if (onGameGenerated) {
        onGameGenerated(game);
      }
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

  return (
    <div className="h-full flex flex-col">
      <div className="border-b p-4 bg-background/80 backdrop-blur-sm flex justify-between items-center">
        <Button variant="ghost" size="sm" onClick={handleBack}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          {currentGame ? 'Back to Form' : 'Back to Home'}
        </Button>
        
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={() => navigate('/')}>
            <Home className="h-4 w-4 mr-2" />
            Home
          </Button>
        </div>
      </div>
      
      <div className="flex-grow overflow-auto">
        {isGenerating ? (
          <GameLoading topic={currentTopic} />
        ) : currentGame ? (
          <div className="relative h-full">
            <GameView miniGame={currentGame} />
            <div className="absolute bottom-4 left-4 z-50">
              <Button 
                onClick={handleNewGame} 
                variant="secondary"
                className="bg-primary/10"
              >
                New Game
              </Button>
            </div>
          </div>
        ) : showForm ? (
          <CustomGameForm 
            gameType="custom" 
            onGenerate={handleGameGeneration}
            onCancel={() => navigate('/')}
          />
        ) : null}
      </div>
    </div>
  );
};

export default GameController;
