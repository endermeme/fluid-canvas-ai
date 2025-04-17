import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import QuizContainer from '@/components/quiz/QuizContainer';
import GameLoading from '@/components/quiz/GameLoading';
import CustomGameSettings from '@/components/quiz/custom-games/CustomGameSettings';
import EnhancedGameView from '@/components/quiz/custom-games/EnhancedGameView';
import { AIGameGenerator } from '@/components/quiz/generator/AIGameGenerator';

const Quiz = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [gameContent, setGameContent] = useState<string | null>(null);
  const [gameTitle, setGameTitle] = useState('Game Tương Tác');
  const [prompt, setPrompt] = useState('');
  const [miniGame, setMiniGame] = useState<{ title: string, content: string, htmlContent: string, cssContent: string, jsContent: string, isSeparatedFiles: boolean } | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const gameGenerator = AIGameGenerator.getInstance();
  
  const handleGenerate = async (promptText: string, useCanvas: boolean = true) => {
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
    
    try {
      gameGenerator.setCanvasMode(useCanvas);
      
      const game = await gameGenerator.generateMiniGame(promptText);
      
      if (game) {
        setGameContent(game.content);
        setGameTitle(game.title || `Game: ${promptText.substring(0, 40)}...`);
        setMiniGame({
          title: game.title || `Game: ${promptText.substring(0, 40)}...`,
          content: game.content,
          htmlContent: game.htmlContent,
          cssContent: game.cssContent,
          jsContent: game.jsContent,
          isSeparatedFiles: game.isSeparatedFiles
        });
        
        toast({
          title: "Trò chơi đã được tạo",
          description: "Trò chơi đã được tạo thành công với HTML, CSS và JavaScript",
        });
      } else {
        throw new Error("Không thể tạo game");
      }
    } catch (error) {
      console.error("Error generating game:", error);
      
      toast({
        title: "Lỗi tạo game",
        description: "Có lỗi xảy ra khi tạo game. Vui lòng thử lại.",
        variant: "destructive"
      });
      
      const fallbackHTML = generateFallbackGame(promptText);
      setGameContent(fallbackHTML);
      setGameTitle(`Game: ${promptText.substring(0, 40)}...`);
      setMiniGame({
        title: `Game: ${promptText.substring(0, 40)}...`,
        content: fallbackHTML,
        htmlContent: fallbackHTML,
        cssContent: '',
        jsContent: '',
        isSeparatedFiles: false
      });
    } finally {
      setIsGenerating(false);
    }
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

  const generateFallbackGame = (promptText: string): string => {
    return `
      <!DOCTYPE html>
      <html lang="vi">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Game Demo: ${promptText}</title>
        <style>
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
            font-family: system-ui, -apple-system, BlinkMacSystemFont, sans-serif;
          }
          
          body {
            background-color: #f8f9fa;
            color: #111827;
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 100vh;
            padding: 20px;
          }
          
          .container {
            background-color: white;
            border-radius: 12px;
            padding: 32px;
            box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12);
            width: 100%;
            max-width: 800px;
            text-align: center;
          }
          
          h1 {
            color: #4f46e5;
            margin-bottom: 16px;
            font-size: 24px;
          }
          
          .game-content {
            margin-top: 32px;
            border: 1px solid #e5e7eb;
            padding: 24px;
            border-radius: 8px;
            background-color: #f3f4f6;
            min-height: 300px;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            position: relative;
          }
          
          button {
            background-color: #4f46e5;
            color: white;
            border: none;
            padding: 10px 20px;
            border-radius: 6px;
            cursor: pointer;
            font-size: 16px;
            margin: 10px 5px;
            transition: all 0.2s;
          }
          
          button:hover {
            background-color: #4338ca;
            transform: translateY(-2px);
          }
          
          .score {
            font-size: 24px;
            font-weight: bold;
            margin: 20px 0;
            color: #4f46e5;
          }
          
          .game-object {
            width: 50px;
            height: 50px;
            background-color: #4f46e5;
            border-radius: 50%;
            position: absolute;
            cursor: pointer;
            transition: all 0.2s;
          }
          
          .game-object:hover {
            transform: scale(1.1);
          }
          
          .message {
            margin-top: 20px;
            padding: 10px;
            border-radius: 6px;
            font-style: italic;
            background-color: #e0f2fe;
            color: #075985;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <h1>Game Demo: ${promptText}</h1>
          
          <p>Đây là phiên bản demo của trò chơi dựa trên yêu cầu của bạn:</p>
          <p><em>"${promptText}"</em></p>
          
          <div class="score">Điểm: <span id="score">0</span></div>
          
          <div class="game-content" id="gameArea">
            <div class="message">Nhấp vào các đối tượng để tăng điểm</div>
          </div>
          
          <div style="margin-top: 24px">
            <button id="playButton">Bắt đầu chơi</button>
            <button id="resetButton">Đặt lại</button>
          </div>
        </div>
        
        <script>
          let score = 0;
          let gameRunning = false;
          let gameObjects = [];
          let gameArea;
          let scoreElement;
          let gameTimer;
          
          document.addEventListener('DOMContentLoaded', function() {
            gameArea = document.getElementById('gameArea');
            scoreElement = document.getElementById('score');
            
            document.getElementById('playButton').addEventListener('click', startGame);
            document.getElementById('resetButton').addEventListener('click', resetGame);
          });
          
          function startGame() {
            if (gameRunning) return;
            
            resetGame();
            gameRunning = true;
            document.getElementById('playButton').textContent = 'Đang chơi...';
            
            gameTimer = setInterval(createGameObject, 1500);
            createGameObject();
          }
          
          function resetGame() {
            gameRunning = false;
            score = 0;
            scoreElement.textContent = score;
            document.getElementById('playButton').textContent = 'Bắt đầu chơi';
            
            clearInterval(gameTimer);
            gameObjects.forEach(obj => obj.element.remove());
            gameObjects = [];
          }
          
          function createGameObject() {
            if (!gameRunning) return;
            
            const areaRect = gameArea.getBoundingClientRect();
            const maxX = areaRect.width - 50;
            const maxY = areaRect.height - 50;
            
            const element = document.createElement('div');
            element.classList.add('game-object');
            
            const x = Math.floor(Math.random() * maxX);
            const y = Math.floor(Math.random() * maxY);
            
            const colors = ['#4f46e5', '#06b6d4', '#ec4899', '#f97316', '#84cc16'];
            const color = colors[Math.floor(Math.random() * colors.length)];
            
            element.style.left = x + 'px';
            element.style.top = y + 'px';
            element.style.backgroundColor = color;
            
            element.addEventListener('click', function() {
              increaseScore(element);
            });
            
            gameArea.appendChild(element);
            
            const gameObject = {
              element: element,
              createdAt: Date.now()
            };
            gameObjects.push(gameObject);
            
            setTimeout(() => {
              if (gameObjects.includes(gameObject)) {
                element.remove();
                gameObjects = gameObjects.filter(obj => obj !== gameObject);
              }
            }, 3000);
          }
          
          function increaseScore(element) {
            score += 10;
            scoreElement.textContent = score;
            
            element.style.transform = 'scale(1.5)';
            element.style.opacity = '0';
            
            setTimeout(() => {
              element.remove();
              gameObjects = gameObjects.filter(obj => obj.element !== element);
            }, 300);
          }
        </script>
      </body>
      </html>
    `;
  };

  const renderContent = () => {
    if (isGenerating) {
      return <GameLoading topic={prompt} />;
    }
    
    if (miniGame) {
      return (
        <div className="w-full h-full">
          <EnhancedGameView 
            miniGame={{
              title: miniGame.title,
              content: miniGame.content,
              htmlContent: miniGame.htmlContent,
              cssContent: miniGame.cssContent,
              jsContent: miniGame.jsContent,
              isSeparatedFiles: miniGame.isSeparatedFiles
            }}
            onBack={handleReset}
            extraButton={
              <Button 
                size="sm" 
                variant="outline"
                onClick={handleShare}
                className="text-xs h-7"
              >
                Chia sẻ
              </Button>
            }
          />
        </div>
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
    <div className="h-screen w-full bg-gradient-to-b from-background to-background/95 overflow-hidden">
      <QuizContainer
        title={miniGame ? miniGame.title : "Tạo Game T��y Chỉnh"}
        showBackButton={true}
        showRefreshButton={false}
        showHomeButton={true}
        onBack={() => miniGame ? handleReset() : navigate('/')}
        className="p-0 overflow-hidden"
      >
        <div className="w-full h-full overflow-hidden">
          {renderContent()}
        </div>
      </QuizContainer>
    </div>
  );
};

export default Quiz;
