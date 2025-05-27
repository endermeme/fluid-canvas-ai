
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { GameContainer } from '@/components/ui/game';
import GameLoading from '@/components/quiz/GameLoading';
import CustomGameForm from '@/components/custom/CustomGameForm';
import EnhancedGameView from '@/components/custom/EnhancedGameView';
import { AIGameGenerator } from '@/components/ai/game-generator';
import type { MiniGame } from '@/components/quiz/generator/types';

const Quiz = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [gameContent, setGameContent] = useState<string | null>(null);
  const [gameTitle, setGameTitle] = useState('Game Tương Tác');
  const [prompt, setPrompt] = useState('');
  const [miniGame, setMiniGame] = useState<MiniGame | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const handleGenerate = async (promptText: string, settings?: any) => {
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
      console.log('🎮 Bắt đầu tạo game với prompt:', promptText);
      console.log('🎮 Settings:', settings);
      
      const generator = AIGameGenerator.getInstance();
      if (settings?.useCanvas !== undefined) {
        generator.setCanvasMode(settings.useCanvas);
      }
      
      const game = await generator.generateMiniGame(promptText, {
        difficulty: settings?.difficulty || 'medium',
        category: settings?.category || 'general',
        useCanvas: settings?.useCanvas !== undefined ? settings.useCanvas : true
      });
      
      if (game && game.content) {
        console.log('🎮 Game được tạo thành công:', {
          title: game.title,
          contentLength: game.content.length,
          hasHTML: game.content.includes('<html')
        });
        
        setGameContent(game.content);
        setGameTitle(game.title || `Game: ${promptText.substring(0, 40)}...`);
        setMiniGame({
          title: game.title || `Game: ${promptText.substring(0, 40)}...`,
          content: game.content || ''
        });
        
        toast({
          title: "Trò chơi đã được tạo",
          description: "Trò chơi đã được tạo thành công với HTML, CSS và JavaScript",
        });
      } else {
        throw new Error("Không thể tạo game - response không hợp lệ");
      }
    } catch (error) {
      console.error("🎮 Lỗi tạo game:", error);
      
      toast({
        title: "Lỗi tạo game",
        description: "Có lỗi xảy ra khi tạo game. Vui lòng thử lại.",
        variant: "destructive"
      });
      
      // Tạo fallback game đơn giản
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
          
          body {
            margin: 0;
            padding: 20px;
            font-family: 'Segoe UI', sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
          }
          
          .container {
            background: white;
            border-radius: 12px;
            padding: 30px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.2);
            text-align: center;
            max-width: 500px;
            width: 100%;
          }
          
          button {
            min-width: 44px;
            min-height: 44px;
            padding: 12px 24px;
            margin: 8px;
            font-size: 16px;
            border: none;
            border-radius: 8px;
            background: #4f46e5;
            color: white;
            cursor: pointer;
            transition: all 0.2s;
          }
          
          button:hover {
            background: #4338ca;
            transform: translateY(-2px);
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
          
          .game-object:active {
            transform: scale(0.95);
          }
          
          .score {
            font-size: 24px;
            font-weight: bold;
            margin: 20px 0;
            color: #4f46e5;
          }
          
          #gameArea {
            position: relative;
            width: 100%;
            height: 300px;
            border: 2px dashed #e5e7eb;
            border-radius: 8px;
            margin: 20px 0;
            overflow: hidden;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <h1>🎮 Game Demo</h1>
          <p><strong>Chủ đề:</strong> ${promptText}</p>
          
          <div class="score">Điểm: <span id="score">0</span></div>
          
          <div id="gameArea">
            <div style="display: flex; align-items: center; justify-content: center; height: 100%; color: #9ca3af;">
              Nhấn "Bắt đầu chơi" để bắt đầu!
            </div>
          </div>
          
          <div>
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
            
            gameArea.innerHTML = '<div style="display: flex; align-items: center; justify-content: center; height: 100%; color: #9ca3af;">Nhấn "Bắt đầu chơi" để bắt đầu!</div>';
          }
          
          function createGameObject() {
            if (!gameRunning) return;
            
            if (gameObjects.length === 0) {
              gameArea.innerHTML = '';
            }
            
            const areaRect = gameArea.getBoundingClientRect();
            const maxX = gameArea.clientWidth - 60;
            const maxY = gameArea.clientHeight - 60;
            
            const element = document.createElement('div');
            element.classList.add('game-object');
            
            const x = Math.floor(Math.random() * Math.max(0, maxX));
            const y = Math.floor(Math.random() * Math.max(0, maxY));
            
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
    
    if (miniGame && miniGame.content) {
      return (
        <EnhancedGameView 
          miniGame={{
            title: miniGame.title,
            content: miniGame.content
          }}
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
