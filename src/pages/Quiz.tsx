
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { GameContainer } from '@/components/ui/game';
import GameLoading from '@/components/quiz/GameLoading';
import CustomGameForm from '@/components/custom/CustomGameForm';
import EnhancedGameView from '@/components/custom/EnhancedGameView';
import { tryGeminiGeneration } from '@/components/quiz/generator/geminiGenerator';

const Quiz = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [gameContent, setGameContent] = useState<string | null>(null);
  const [gameTitle, setGameTitle] = useState('Game Tương Tác');
  const [prompt, setPrompt] = useState('');
  const [miniGame, setMiniGame] = useState<{ title: string, content: string } | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const handleGenerate = async (promptText: string, game?: any) => {
    if (game) {
      setGameContent(game.content);
      setGameTitle(game.title || `Game: ${promptText.substring(0, 40)}...`);
      setMiniGame({
        title: game.title || `Game: ${promptText.substring(0, 40)}...`,
        content: game.content
      });
      return;
    }
    
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
      const game = await tryGeminiGeneration(null, promptText, { 
        useCanvas: true, 
        category: 'general' 
      });
      
      if (game) {
        setGameContent(game.content);
        setGameTitle(game.title || `Game: ${promptText.substring(0, 40)}...`);
        setMiniGame({
          title: game.title || `Game: ${promptText.substring(0, 40)}...`,
          content: game.content
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
        content: fallbackHTML
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
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
        <title>Game Demo: ${promptText}</title>
        <style>
          * {
            touch-action: manipulation;
            -webkit-tap-highlight-color: transparent;
          }
          
          button {
            min-width: 44px;
            min-height: 44px;
            padding: 12px 24px;
            margin: 8px;
            font-size: 16px;
          }
          
          .game-object {
            width: 60px;
            height: 60px;
            background-color: #4f46e5;
            border-radius: 50%;
            position: absolute;
            cursor: pointer;
            transition: all 0.2s;
            -webkit-tap-highlight-color: transparent;
          }
          
          @media (hover: hover) and (pointer: fine) {
            .game-object:hover {
              transform: scale(1.1);
            }
          }
          
          .game-object:active {
            transform: scale(0.95);
          }
          
          .no-select {
            user-select: none;
            -webkit-user-select: none;
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
          
          function addGameObjectEvents(element) {
            const isTouchDevice = 'ontouchstart' in window;
            
            if (isTouchDevice) {
              element.addEventListener('touchstart', function(e) {
                e.preventDefault();
                increaseScore(element);
              });
            }
            
            element.addEventListener('click', function(e) {
              increaseScore(element);
            });
          }
          
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
            
            addGameObjectEvents(element);
            
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
        <EnhancedGameView 
          miniGame={miniGame}
          onBack={handleReset}
          hideHeader={true}
        />
      );
    }
    
    return (
      <CustomGameForm 
        onGenerate={handleGenerate}
        onCancel={() => navigate('/')}
      />
    );
  };

  return (
    <GameContainer 
      title={gameTitle}
      showBackButton={true}
      onBack={() => navigate('/')}
      showSettingsButton={false}
      showCreateButton={!!miniGame}
      onCreate={handleReset}
      isCreatingGame={!miniGame && !isGenerating}
    >
      {renderContent()}
    </GameContainer>
  );
};

export default Quiz;
