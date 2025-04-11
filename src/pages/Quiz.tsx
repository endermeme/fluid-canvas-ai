
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
import { RefreshCw } from 'lucide-react';
import QuizContainer from '@/components/quiz/QuizContainer';

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

  // Content to render
  const renderContent = () => {
    if (isGenerating) {
      return <GameLoading topic={currentTopic} />;
    }
    
    if (currentGame) {
      return (
        <EnhancedGameView 
          miniGame={currentGame} 
          onBack={handleBackToHome}
          onNewGame={handleNewGame}
        />
      );
    }
    
    if (showForm) {
      return (
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
      );
    }
    
    return (
      <div className="flex flex-col items-center justify-center h-full p-6">
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
    );
  };

  // Determine title based on current state
  const getContainerTitle = () => {
    if (isGenerating) {
      return `Đang tạo game: ${currentTopic}`;
    }
    if (currentGame) {
      return currentGame.title || "Trò Chơi Tương Tác";
    }
    return "Tạo Trò Chơi Mới";
  };

  return (
    <div className="min-h-screen flex flex-col w-full bg-gradient-to-b from-background to-background/95 overflow-hidden">
      <div className="flex-1 flex overflow-hidden">
        <div ref={mainContentRef} className="flex-1 overflow-hidden p-4 relative">
          <QuizContainer 
            title={getContainerTitle()}
            showBackButton={true}
            showHomeButton={!isGenerating && !currentGame}
            showRefreshButton={!isGenerating && !currentGame}
            onBack={currentGame ? handleNewGame : handleBackToHome}
            onRefresh={handleReload}
            footerContent={currentGame ? (
              <div className="flex justify-between items-center">
                <Button 
                  onClick={handleNewGame} 
                  variant="secondary"
                  className="bg-primary/10"
                >
                  Trò Chơi Mới
                </Button>
              </div>
            ) : null}
          >
            {renderContent()}
          </QuizContainer>
        </div>
      </div>
    </div>
  );
};

export default Quiz;
