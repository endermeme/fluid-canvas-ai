
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { MiniGame } from '../generator/types';
import EnhancedGameView from './EnhancedGameView';
import CustomGameForm from './CustomGameForm';
import GameLoading from '../GameLoading';
import { useNavigate, useLocation } from 'react-router-dom';
import { Share2, PlusCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { createGameSession } from '@/utils/gameParticipation';
import QuizContainer from '../QuizContainer';
import { tryGeminiGeneration } from '../generator/geminiGenerator';

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
  const [currentTopic, setCurrentTopic] = useState<string>(initialTopic || "vòng quay may mắn");
  const [showForm, setShowForm] = useState(!currentGame);
  const navigate = useNavigate();
  const { toast } = useToast();
  const location = useLocation();
  
  // Auto-generate wheel game when page loads
  useEffect(() => {
    // Only auto-generate on the custom-game route
    if (location.pathname === '/custom-game' && !currentGame && !isGenerating) {
      handleGameGeneration("vòng quay may mắn");
    }
  }, [location.pathname]);
  
  const handleGameGeneration = async (content: string, game?: MiniGame) => {
    setCurrentTopic(content);
    setIsGenerating(true);
    
    try {
      // If a game object was directly provided, use it
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
      
      // Special handling for wheel game
      if (content.toLowerCase().includes('vòng quay')) {
        try {
          // Load the wheel game HTML
          const wheelGameHTML = await fetch('/vong-quay/index.html')
            .then(response => {
              if (!response.ok) {
                throw new Error(`Failed to load wheel game template: ${response.status}`);
              }
              return response.text();
            });
          
          // Load the CSS and JS for the wheel game
          const wheelGameCSS = await fetch('/vong-quay/style.css').then(r => r.text());
          const wheelGameJS = await fetch('/vong-quay/script.js').then(r => r.text()).catch(() => '');
          
          // Combine into a single HTML document
          const combinedHTML = `
<!DOCTYPE html>
<html lang="vi">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Vòng Quay May Mắn</title>
    <style>
    ${wheelGameCSS}
    </style>
</head>
<body>
    <div class="wheel-container">
        <div class="pointer">▼</div>
        <div class="wheel">
        </div>

        <button id="spin-btn">Quay!</button>
        <div id="result"></div>
    </div>

    <script>
    ${wheelGameJS}
    </script>
</body>
</html>
          `;
          
          const wheelGame: MiniGame = {
            title: "Vòng Quay May Mắn",
            content: combinedHTML,
            useCanvas: false
          };
          
          setCurrentGame(wheelGame);
          setShowForm(false);
          
          if (onGameGenerated) {
            onGameGenerated(wheelGame);
          }
          
          toast({
            title: "Vòng Quay May Mắn",
            description: "Vòng quay may mắn đã sẵn sàng!",
          });
          
        } catch (error) {
          console.error("Error loading wheel game:", error);
          // Fallback to AI generation if wheel game template fails
          generateWithAI(content);
        }
      } else {
        // For other topics, generate using Gemini
        generateWithAI(content);
      }
    } catch (error) {
      console.error("Error in game generation:", error);
      toast({
        title: "Lỗi tạo game",
        description: "Có lỗi xảy ra khi tạo game. Vui lòng thử lại.",
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
  };
  
  const generateWithAI = async (content: string) => {
    try {
      const game = await tryGeminiGeneration(null, content, { 
        category: 'custom' 
      });
      
      if (game) {
        setCurrentGame(game);
        setShowForm(false);
        
        if (onGameGenerated) {
          onGameGenerated(game);
        }
        
        toast({
          title: "Minigame Đã Sẵn Sàng",
          description: `Minigame đã được tạo thành công.`,
        });
      } else {
        throw new Error("Không thể tạo game");
      }
    } catch (error) {
      console.error("Error generating game with AI:", error);
      toast({
        title: "Lỗi tạo game",
        description: "Có lỗi xảy ra khi tạo game. Vui lòng thử lại.",
        variant: "destructive"
      });
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
            setTimeout(() => handleGameGeneration(content, game), 500);
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
