
import React, { useState, useRef, useEffect } from 'react';
import { useCanvasState } from '@/hooks/useCanvasState';
import { useToast } from '@/hooks/use-toast';
import { useLocation, useNavigate } from 'react-router-dom';
import { animateContentHighlight } from '@/lib/animations';
import { Button } from '@/components/ui/button';
import { MiniGame } from '@/components/quiz/generator/AIGameGenerator';
import EnhancedGameView from '@/components/quiz/custom-games/EnhancedGameView';
import CustomGameForm from '@/components/quiz/custom-games/CustomGameForm';
import GameLoading from '@/components/quiz/GameLoading';
import { Home, RefreshCw } from 'lucide-react';

const Quiz = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [showForm, setShowForm] = useState(true);
  const [currentGame, setCurrentGame] = useState<MiniGame | null>(null);
  const [currentTopic, setCurrentTopic] = useState('');
  
  const { toast } = useToast();
  const location = useLocation();
  const navigate = useNavigate();
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
        // Will be handled by CustomGameForm
        setCurrentTopic(topicParam);
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
    console.log("Game generated:", game.title);
    setCurrentTopic(content);
    setCurrentGame(game);
    setShowForm(false);
    setIsGenerating(false);
    
    toast({
      title: "Trò Chơi Đã Sẵn Sàng",
      description: `Trò chơi "${game.title || content}" đã được tạo thành công.`,
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
  
  // Function to reload page
  const handleReload = () => {
    window.location.reload();
  };

  return (
    <div className="min-h-screen flex flex-col w-full bg-gradient-to-b from-background to-background/95 overflow-hidden">
      <div className="flex-1 flex overflow-hidden">
        <div className="flex-1 overflow-hidden p-0 relative">
          {!isGenerating && !currentGame && (
            <div className="absolute top-4 left-4 z-50 flex space-x-2">
              <Button 
                size="sm" 
                variant="ghost" 
                className="bg-primary/5"
                onClick={handleBackToHome}
              >
                <Home className="h-4 w-4 mr-1" />
                Trang Chủ
              </Button>
              
              <Button 
                size="sm" 
                variant="ghost" 
                className="bg-primary/5"
                onClick={handleReload}
              >
                <RefreshCw className="h-4 w-4 mr-1" />
                Tải Lại
              </Button>
            </div>
          )}
          
          <div ref={mainContentRef} className="h-full w-full relative">
            {isGenerating ? (
              <GameLoading topic={currentTopic} />
            ) : currentGame ? (
              <div className="w-full h-full">
                <EnhancedGameView 
                  miniGame={currentGame} 
                  onBack={handleBackToHome}
                  onNewGame={handleNewGame}
                />
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
                gameType="quiz" 
                onGenerate={(content, game) => {
                  if (game) {
                    // Force HTML content for testing if needed
                    // Uncomment the next line for testing HTML game container
                    // game.content = `<html><body><h1>Test Game</h1><script>console.log('Game loaded!');</script></body></html>`;
                    
                    setIsGenerating(true);
                    // Small delay to show the loading screen
                    setTimeout(() => handleGameGeneration(content, game), 800);
                  }
                }}
                onCancel={handleCancelCustomGame}
              />
            ) : (
              <div className="flex flex-col items-center justify-center h-full">
                <Button 
                  onClick={() => setShowForm(true)}
                  className="bg-gradient-to-r from-primary to-primary/80 text-white px-6 py-3 rounded-lg shadow-md hover:shadow-lg"
                >
                  Tạo Trò Chơi Mới
                </Button>
                <Button 
                  onClick={handleBackToHome}
                  variant="outline"
                  className="mt-4"
                >
                  Về Trang Chủ
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
