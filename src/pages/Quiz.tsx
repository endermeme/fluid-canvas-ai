
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import QuizContainer from '@/components/quiz/QuizContainer';
import GameLoading from '@/components/quiz/GameLoading';
import CustomGameSettings from '@/components/quiz/custom-games/CustomGameSettings';
import EnhancedGameView from '@/components/quiz/custom-games/EnhancedGameView';

const Quiz = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [gameContent, setGameContent] = useState<string | null>(null);
  const [gameTitle, setGameTitle] = useState('Game Tương Tác');
  const [prompt, setPrompt] = useState('');
  const [miniGame, setMiniGame] = useState<{ title: string, content: string } | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const handleGenerate = async (promptText: string) => {
    if (!promptText.trim()) {
      toast({
        title: "Lỗi",
        description: "Vui lòng nhập yêu cầu cho trò chơi",
        variant: "destructive"
      });
      return;
    }

    setPrompt(promptText);
    setGameTitle(`Game: ${promptText.substring(0, 40)}${promptText.length > 40 ? '...' : ''}`);
    setIsGenerating(true);
    setGameContent(null);
    setMiniGame(null);
    
    // Simulate API call with setTimeout
    setTimeout(() => {
      // Create a placeholder HTML game
      const placeholderHTML = `
        <!DOCTYPE html>
        <html>
        <head>
          <title>Game Demo</title>
          <style>
            body { 
              font-family: system-ui, -apple-system, BlinkMacSystemFont, sans-serif;
              max-width: 800px;
              margin: 0 auto;
              padding: 20px;
              text-align: center;
              background-color: #f9fafb;
              color: #111827;
            }
            .container {
              background-color: white;
              border-radius: 8px;
              padding: 20px;
              box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            }
            h1 { color: #4f46e5; }
            button {
              background-color: #4f46e5;
              color: white;
              border: none;
              padding: 10px 20px;
              border-radius: 4px;
              cursor: pointer;
              font-size: 16px;
              margin: 10px 5px;
            }
            button:hover { background-color: #4338ca; }
            .game-content {
              margin-top: 20px;
              min-height: 200px;
              display: flex;
              flex-direction: column;
              align-items: center;
              justify-content: center;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <h1>Demo Game: ${promptText}</h1>
            <p>This is a demonstration of the game interface without the AI generation.</p>
            <div class="game-content">
              <p>Your game would appear here based on your prompt:</p>
              <p><em>"${promptText}"</em></p>
              <p>Score: <span id="score">0</span></p>
              <button onclick="increaseScore()">Play</button>
              <button onclick="resetScore()">Reset</button>
            </div>
          </div>
          <script>
            let score = 0;
            const scoreElement = document.getElementById('score');
            
            function increaseScore() {
              score += 10;
              scoreElement.textContent = score;
            }
            
            function resetScore() {
              score = 0;
              scoreElement.textContent = score;
            }
          </script>
        </body>
        </html>
      `;

      setGameContent(placeholderHTML);
      setGameTitle(`Game: ${promptText.substring(0, 40)}...`);
      setMiniGame({
        title: `Game: ${promptText.substring(0, 40)}...`,
        content: placeholderHTML
      });
      
      toast({
        title: "Trò chơi đã được tạo",
        description: "Trò chơi mẫu đã được tạo thành công",
      });
      
      setIsGenerating(false);
    }, 1500); // Simulate loading for 1.5 seconds
  };

  const handleReset = () => {
    setGameContent(null);
    setGameTitle('Game Tương Tác');
    setPrompt('');
    setMiniGame(null);
  };

  const handleShare = () => {
    try {
      if (gameContent) {
        const shareUrl = window.location.origin + '/quiz?shared=true';
        navigator.clipboard.writeText(shareUrl);
        
        toast({
          title: "Đã sao chép liên kết",
          description: "Liên kết đã được sao chép vào clipboard.",
        });
      }
    } catch (error) {
      console.error("Lỗi khi chia sẻ:", error);
    }
  };

  const renderContent = () => {
    if (isGenerating) {
      return <GameLoading topic={prompt} />;
    }
    
    if (miniGame) {
      return (
        <EnhancedGameView 
          miniGame={miniGame}
          extraButton={
            <Button 
              size="sm" 
              variant="outline"
              onClick={handleShare}
              className="text-xs h-8"
            >
              Chia sẻ
            </Button>
          }
        />
      );
    }
    
    return (
      <CustomGameSettings 
        onGenerate={handleGenerate}
        isGenerating={isGenerating}
      />
    );
  };

  return (
    <div className="h-screen w-full bg-gradient-to-b from-background to-background/95">
      <QuizContainer
        title={miniGame ? miniGame.title : "Tạo Game Tùy Chỉnh"}
        showBackButton={true}
        showRefreshButton={false}
        showHomeButton={true}
        onBack={() => miniGame ? handleReset() : navigate('/')}
        footerContent={miniGame ? (
          <div className="flex justify-between items-center w-full px-4 py-2">
            <Button 
              variant="outline" 
              onClick={handleReset}
              className="border-primary/20"
            >
              Tạo game mới
            </Button>
          </div>
        ) : null}
      >
        {renderContent()}
      </QuizContainer>
    </div>
  );
};

export default Quiz;
