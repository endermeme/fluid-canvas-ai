
import React, { useState, useRef, useEffect } from 'react';
import { useCanvasState } from '@/hooks/useCanvasState';
import { useToast } from '@/hooks/use-toast';
import { useLocation, useNavigate } from 'react-router-dom';
import { animateContentHighlight } from '@/lib/animations';
import { Button } from '@/components/ui/button';
import { MiniGame } from '@/components/quiz/generator/AIGameGenerator';
import GameView from '@/components/quiz/GameView';
import CustomGameForm from '@/components/quiz/custom-games/CustomGameForm';
import GameLoading from '@/components/quiz/GameLoading';

// Game play count storage key
const GAME_PLAY_COUNT_KEY = 'lovable_game_play_count';

const Quiz = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [showForm, setShowForm] = useState(true);
  const [currentGame, setCurrentGame] = useState<MiniGame | null>(null);
  const [currentTopic, setCurrentTopic] = useState('');
  const [gamePlayCount, setGamePlayCount] = useState<number>(0);
  
  const { toast } = useToast();
  const location = useLocation();
  const navigate = useNavigate();
  const mainContentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    document.title = 'Interactive Game';
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
        // Will be handled by CustomGameForm
        setCurrentTopic(topicParam);
      }
    }
    
    // Load game play count
    try {
      const savedCount = localStorage.getItem(GAME_PLAY_COUNT_KEY);
      if (savedCount) {
        setGamePlayCount(parseInt(savedCount, 10));
      }
    } catch (err) {
      console.error("Error loading game count:", err);
    }
  }, [location.search]);

  useEffect(() => {
    // Apply animations on mount
    if (mainContentRef.current) {
      animateContentHighlight(mainContentRef.current);
    }
  }, []);

  const handleGameGeneration = (content: string, game: MiniGame) => {
    console.log("Game generated:", game.title);
    setCurrentTopic(content);
    setCurrentGame(game);
    setShowForm(false);
    setIsGenerating(false);
    
    // Increment game play count
    try {
      const newCount = gamePlayCount + 1;
      localStorage.setItem(GAME_PLAY_COUNT_KEY, newCount.toString());
      setGamePlayCount(newCount);
      console.log(`Game play count updated: ${newCount}`);
    } catch (err) {
      console.error("Error updating game count:", err);
    }
    
    toast({
      title: "Game Ready",
      description: `The game "${game.title || content}" has been created successfully.`,
    });
  };

  const handleCancelCustomGame = () => {
    // Simply navigate to home page when cancel is clicked
    navigate('/');
  };

  const handleNewGame = () => {
    setCurrentGame(null);
    setShowForm(true);
  };

  // Function to go back to home
  const handleBackToHome = () => {
    navigate('/');
  };

  return (
    <div className="min-h-screen flex flex-col w-full bg-gradient-to-b from-background to-background/95 overflow-hidden">
      <div className="flex-1 flex overflow-hidden">
        <div className="flex-1 overflow-hidden p-0 relative">
          {gamePlayCount > 0 && (
            <div className="absolute top-4 right-4 bg-primary/10 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-medium z-50">
              Games played: {gamePlayCount}
            </div>
          )}
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
                    New Game
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
                  Create New Game
                </Button>
                <Button 
                  onClick={handleBackToHome}
                  variant="outline"
                  className="mt-4"
                >
                  Return to Homepage
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
