import { MiniGame, PromptOptions, GeneratorSettings } from './types';

const cleanUpCode = (code: string): string => {
  if (!code) return '';

  let cleanedCode = code.replace(/```html|```/g, '').trim();

  cleanedCode = cleanedCode
    .replace(/(<[^\/!][^>]*>)(?!\s*[\r\n])/g, '$1\n')
    .replace(/(?<!\s*[\r\n])(<\/[^>]+>)/g, '\n$1')
    .replace(/(<(?:[^>]*\/>|!--.*?-->))(?!\s*[\r\n])/g, '$1\n')
    .replace(/(<!DOCTYPE[^>]*>)(?!\s*[\r\n])/gi, '$1\n')
    .replace(/(<(?:html|head|body|script|style)[^>]*>)/g, '\n$1\n')
    .replace(/(<\/(?:html|head|body|script|style)>)/g, '\n$1\n')
    .replace(/\n\s*\n\s*\n/g, '\n\n')
    .trim();

  return cleanedCode;
};

const extractTitle = (content: string): string | null => {
  const titleMatch = content.match(/<title>(.*?)<\/title>/i);
  return titleMatch ? titleMatch[1] : null;
};

export const generateGame = async (
  prompt: string,
  options: PromptOptions = { topic: prompt },
  settings: GeneratorSettings = {}
): Promise<MiniGame> => {
  let processedContent = cleanUpCode(prompt);
  const extractedTitle = extractTitle(processedContent);
  
  return {
    title: extractedTitle || `Game: ${prompt.substring(0, 40)}...`,
    content: processedContent,
    description: options.topic,
    category: options.category,
    difficulty: options.difficulty
  };
};

export const generateAlternativeGame = async (
  prompt: string, 
  options: PromptOptions = { topic: prompt }
): Promise<MiniGame> => {
  const fallbackContent = `
    <!DOCTYPE html>
    <html lang="vi">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
      <title>Game Demo: ${prompt}</title>
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
        <h1>Game Demo: ${prompt}</h1>
        
        <p>Đây là phiên bản demo của trò chơi dựa trên yêu cầu của bạn:</p>
        <p><em>"${prompt}"</em></p>
        
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
  
  return {
    title: `Alternative Game: ${prompt.substring(0, 30)}...`,
    content: fallbackContent,
    description: options.topic,
    category: options.category,
    difficulty: options.difficulty
  };
};
