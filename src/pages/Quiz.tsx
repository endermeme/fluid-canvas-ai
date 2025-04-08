
import React, { useState, useRef, useEffect } from 'react';
import { useCanvasState } from '@/hooks/useCanvasState';
import { useToast } from '@/hooks/use-toast';
import { useLocation } from 'react-router-dom';
import { animateContentHighlight } from '@/lib/animations';
import { Button } from '@/components/ui/button';
import { MiniGame } from '@/components/quiz/generator/AIGameGenerator';
import GameView from '@/components/quiz/GameView';
import CustomGameForm from '@/components/quiz/preset-games/CustomGameForm';
import GameLoading from '@/components/quiz/GameLoading';

const Quiz = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [showForm, setShowForm] = useState(true);
  const [currentGame, setCurrentGame] = useState<MiniGame | null>(null);
  const [currentTopic, setCurrentTopic] = useState('');
  
  const { toast } = useToast();
  const location = useLocation();
  const mainContentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    document.title = 'Minigame Tương Tác';
    // Always enable canvas mode
    localStorage.setItem('canvas_mode', 'true');
    
    // Parse URL parameters for direct game creation
    const queryParams = new URLSearchParams(location.search);
    const topicParam = queryParams.get('topic');
    const autoStart = queryParams.get('autostart');
    
    if (topicParam) {
      setCurrentTopic(topicParam);
      
      // If autostart is set, generate the quiz automatically
      if (autoStart === 'true') {
        // Will be handled by QuizGenerator
      }
    }
  }, [location.search]);

  useEffect(() => {
    // Apply animations on mount
    if (mainContentRef.current) {
      animateContentHighlight(mainContentRef.current);
    }
  }, []);

  const handleGameGeneration = (content: string, game: MiniGame) => {
    setCurrentTopic(content);
    setCurrentGame(game);
    setShowForm(false);
  };

  const handleCancelCustomGame = () => {
    setShowForm(false);
  };

  const handleNewGame = () => {
    setCurrentGame(null);
    setShowForm(true);
  };

  return (
    <div className="min-h-screen flex flex-col w-full bg-gradient-to-b from-background to-background/95 overflow-hidden">
      <div className="flex-1 flex overflow-hidden">
        <div className="flex-1 overflow-hidden p-0 relative">
          <div ref={mainContentRef} className="h-full w-full relative">
            {isGenerating ? (
              <GameLoading topic={currentTopic} />
            ) : currentGame ? (
              <div className="w-full h-full">
                <GameView miniGame={currentGame} />
                <div className="absolute bottom-4 left-4 z-50">
                  <Button 
                    onClick={handleNewGame} 
                    variant="secondary"
                    className="bg-primary/10"
                  >
                    Tạo Game Mới
                  </Button>
                </div>
              </div>
            ) : showForm ? (
              <CustomGameForm 
                gameType="quiz" 
                onGenerate={handleGameGeneration}
                onCancel={handleCancelCustomGame}
              />
            ) : (
              <div className="flex flex-col items-center justify-center h-full">
                <Button 
                  onClick={() => setShowForm(true)}
                  className="bg-gradient-to-r from-primary to-primary/80 text-white px-6 py-3 rounded-lg shadow-md hover:shadow-lg"
                >
                  Tạo Game Mới
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Quiz;
