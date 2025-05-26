
/**
 * Game Processor - Xử lý và nâng cao nội dung game được tạo
 */

export const processGameCode = (content: string): { title: string; content: string } => {
  let processedContent = content;
  let title = 'Game Tương Tác';

  // Trích xuất title từ HTML
  const titleMatch = content.match(/<title>(.*?)<\/title>/i);
  if (titleMatch) {
    title = titleMatch[1];
  }

  // Làm sạch nội dung
  processedContent = cleanHtmlContent(processedContent);
  
  // Thêm responsive viewport nếu thiếu
  if (!processedContent.includes('viewport')) {
    processedContent = processedContent.replace(
      '<head>',
      '<head>\n    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">'
    );
  }

  // Thêm CSS tối ưu cho mobile
  const mobileCSS = `
    <style>
      /* Mobile optimizations */
      * {
        touch-action: manipulation;
        -webkit-tap-highlight-color: transparent;
        box-sizing: border-box;
      }
      
      body {
        margin: 0;
        padding: 0;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        user-select: none;
        -webkit-user-select: none;
        overflow-x: hidden;
      }
      
      button, .clickable, .interactive {
        min-width: 44px;
        min-height: 44px;
        cursor: pointer;
        border: none;
        outline: none;
        transition: all 0.2s ease;
      }
      
      @media (hover: hover) and (pointer: fine) {
        button:hover, .clickable:hover, .interactive:hover {
          opacity: 0.8;
          transform: scale(1.05);
        }
      }
      
      button:active, .clickable:active, .interactive:active {
        transform: scale(0.95);
      }
      
      /* Canvas optimizations */
      canvas {
        display: block;
        margin: 0 auto;
        max-width: 100%;
        height: auto;
        image-rendering: pixelated;
        image-rendering: -moz-crisp-edges;
        image-rendering: crisp-edges;
      }
      
      /* Game UI optimizations */
      .game-ui {
        position: relative;
        max-width: 100vw;
        overflow: hidden;
      }
      
      .score-display {
        font-size: clamp(16px, 4vw, 24px);
        font-weight: bold;
        text-align: center;
        margin: 10px 0;
      }
      
      .game-controls {
        display: flex;
        gap: 10px;
        justify-content: center;
        flex-wrap: wrap;
        margin: 15px 0;
      }
      
      /* Loading animation */
      .loading {
        display: flex;
        justify-content: center;
        align-items: center;
        min-height: 200px;
      }
      
      .loading::after {
        content: '';
        width: 40px;
        height: 40px;
        border: 4px solid #f3f3f3;
        border-top: 4px solid #3498db;
        border-radius: 50%;
        animation: spin 1s linear infinite;
      }
      
      @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
      
      /* Responsive text */
      h1, h2, h3 {
        font-size: clamp(18px, 5vw, 32px);
        text-align: center;
        margin: 15px 0;
      }
      
      p, span {
        font-size: clamp(14px, 3vw, 18px);
        line-height: 1.4;
      }
    </style>
  `;

  if (!processedContent.includes('touch-action')) {
    processedContent = processedContent.replace('</head>', `${mobileCSS}\n</head>`);
  }

  // Thêm JavaScript utilities
  const jsUtilities = `
    <script>
      // Game utilities
      const GameUtils = {
        // Kiểm tra touch device
        isTouchDevice: () => 'ontouchstart' in window || navigator.maxTouchPoints > 0,
        
        // Vibration feedback cho mobile
        vibrate: (pattern = 50) => {
          if (navigator.vibrate) {
            navigator.vibrate(pattern);
          }
        },
        
        // Full screen toggle
        toggleFullscreen: () => {
          if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen().catch(console.warn);
          } else {
            document.exitFullscreen().catch(console.warn);
          }
        },
        
        // Sound với fallback
        playSound: (frequency = 440, duration = 200, type = 'sine') => {
          try {
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);
            
            oscillator.frequency.value = frequency;
            oscillator.type = type;
            
            gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration / 1000);
            
            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + duration / 1000);
          } catch (e) {
            console.warn('Audio not supported');
          }
        },
        
        // Animation helper
        animate: (element, keyframes, options = { duration: 300 }) => {
          if (element && element.animate) {
            return element.animate(keyframes, options);
          }
        },
        
        // Storage helpers
        saveScore: (key, score) => {
          try {
            localStorage.setItem(\`game_\${key}\`, JSON.stringify(score));
          } catch (e) {
            console.warn('Storage not available');
          }
        },
        
        loadScore: (key) => {
          try {
            const stored = localStorage.getItem(\`game_\${key}\`);
            return stored ? JSON.parse(stored) : 0;
          } catch (e) {
            return 0;
          }
        }
      };
      
      // Event delegation for touch
      document.addEventListener('DOMContentLoaded', () => {
        if (GameUtils.isTouchDevice()) {
          document.body.addEventListener('touchstart', (e) => {
            if (e.target.matches('button, .clickable, .interactive')) {
              e.target.style.transform = 'scale(0.95)';
            }
          });
          
          document.body.addEventListener('touchend', (e) => {
            if (e.target.matches('button, .clickable, .interactive')) {
              e.target.style.transform = '';
            }
          });
        }
      });
    </script>
  `;

  if (!processedContent.includes('GameUtils')) {
    processedContent = processedContent.replace('</body>', `${jsUtilities}\n</body>`);
  }

  return { title, content: processedContent };
};

export const createFallbackGameHtml = (topic: string, useCanvas: boolean = true): string => {
  const canvasElement = useCanvas 
    ? '<canvas id="gameCanvas" width="400" height="300" class="game-canvas"></canvas>' 
    : '<div id="gameArea" class="game-area"></div>';
  
  return `
<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
  <title>Game: ${topic}</title>
  <style>
    * {
      touch-action: manipulation;
      -webkit-tap-highlight-color: transparent;
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }
    
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      max-width: 100vw;
      min-height: 100vh;
      padding: 20px;
      text-align: center;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
    }
    
    .game-container {
      background: rgba(255, 255, 255, 0.1);
      border-radius: 20px;
      padding: 30px;
      backdrop-filter: blur(10px);
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
      max-width: 600px;
      width: 100%;
    }
    
    h1 {
      font-size: clamp(24px, 6vw, 36px);
      margin-bottom: 20px;
      text-shadow: 0 2px 4px rgba(0,0,0,0.3);
    }
    
    .score {
      font-size: clamp(18px, 4vw, 24px);
      font-weight: bold;
      margin: 20px 0;
      padding: 10px;
      background: rgba(255, 255, 255, 0.2);
      border-radius: 10px;
    }
    
    button {
      min-width: 120px;
      min-height: 44px;
      padding: 12px 24px;
      margin: 8px;
      font-size: 16px;
      font-weight: bold;
      border: none;
      border-radius: 10px;
      background: rgba(255, 255, 255, 0.2);
      color: white;
      cursor: pointer;
      transition: all 0.3s ease;
      border: 2px solid rgba(255, 255, 255, 0.3);
    }
    
    button:hover {
      background: rgba(255, 255, 255, 0.3);
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(0,0,0,0.2);
    }
    
    button:active {
      transform: translateY(0);
    }
    
    button:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
    
    .game-canvas, .game-area {
      border: 2px solid rgba(255, 255, 255, 0.3);
      border-radius: 15px;
      margin: 20px auto;
      display: block;
      background: rgba(255, 255, 255, 0.1);
      max-width: 100%;
    }
    
    .game-area {
      width: 400px;
      height: 300px;
      position: relative;
      overflow: hidden;
    }
    
    .game-object {
      width: 50px;
      height: 50px;
      background: #ff6b6b;
      border-radius: 50%;
      position: absolute;
      cursor: pointer;
      transition: all 0.2s ease;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: bold;
      color: white;
      text-shadow: 0 1px 2px rgba(0,0,0,0.5);
    }
    
    .game-object:hover {
      transform: scale(1.1);
    }
    
    .game-object:active {
      transform: scale(0.9);
    }
    
    .instructions {
      margin: 20px 0;
      padding: 15px;
      background: rgba(255, 255, 255, 0.1);
      border-radius: 10px;
      font-size: 14px;
      line-height: 1.4;
    }
    
    .game-over {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.8);
      display: none;
      align-items: center;
      justify-content: center;
      z-index: 1000;
    }
    
    .game-over-content {
      background: rgba(255, 255, 255, 0.95);
      color: #333;
      padding: 30px;
      border-radius: 20px;
      text-align: center;
      max-width: 300px;
    }
    
    @keyframes bounce {
      0%, 20%, 60%, 100% { transform: translateY(0); }
      40% { transform: translateY(-20px); }
      80% { transform: translateY(-10px); }
    }
    
    .animate-bounce {
      animation: bounce 1s ease-in-out;
    }
  </style>
</head>
<body>
  <div class="game-container">
    <h1>🎮 Game: ${topic}</h1>
    
    <div class="instructions">
      <strong>Hướng dẫn:</strong> Nhấp vào các đối tượng xuất hiện để ghi điểm. 
      Game sẽ kết thúc sau 30 giây!
    </div>
    
    <div class="score">
      Điểm: <span id="score">0</span> | 
      Thời gian: <span id="timer">30</span>s
    </div>
    
    ${canvasElement}
    
    <div class="game-controls">
      <button id="startButton">🎯 Bắt đầu</button>
      <button id="pauseButton" disabled>⏸️ Tạm dừng</button>
      <button id="resetButton">🔄 Đặt lại</button>
    </div>
  </div>
  
  <div class="game-over" id="gameOver">
    <div class="game-over-content">
      <h2>🎉 Game Over!</h2>
      <p>Điểm của bạn: <span id="finalScore">0</span></p>
      <button onclick="resetGame()">Chơi lại</button>
    </div>
  </div>

  <script>
    let score = 0;
    let gameRunning = false;
    let gamePaused = false;
    let gameObjects = [];
    let gameArea;
    let gameTimer = 30;
    let timerInterval;
    let spawnInterval;
    
    const elements = {
      score: document.getElementById('score'),
      timer: document.getElementById('timer'),
      gameArea: document.getElementById('gameArea'),
      canvas: document.getElementById('gameCanvas'),
      startButton: document.getElementById('startButton'),
      pauseButton: document.getElementById('pauseButton'),
      resetButton: document.getElementById('resetButton'),
      gameOver: document.getElementById('gameOver'),
      finalScore: document.getElementById('finalScore')
    };
    
    function playSound(frequency = 800, duration = 100) {
      try {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.frequency.value = frequency;
        oscillator.type = 'square';
        
        gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration / 1000);
        
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + duration / 1000);
      } catch (e) {
        console.log('Audio not supported');
      }
    }
    
    function vibrate(pattern = 50) {
      if (navigator.vibrate) {
        navigator.vibrate(pattern);
      }
    }
    
    function updateScore(points) {
      score += points;
      elements.score.textContent = score;
      elements.score.classList.add('animate-bounce');
      setTimeout(() => elements.score.classList.remove('animate-bounce'), 1000);
    }
    
    function updateTimer() {
      elements.timer.textContent = gameTimer;
      if (gameTimer <= 5) {
        elements.timer.style.color = '#ff6b6b';
      }
    }
    
    function startGame() {
      if (gameRunning) return;
      
      gameRunning = true;
      gamePaused = false;
      gameTimer = 30;
      score = 0;
      
      elements.score.textContent = '0';
      elements.timer.style.color = 'white';
      elements.startButton.disabled = true;
      elements.pauseButton.disabled = false;
      elements.startButton.textContent = '🎮 Đang chơi...';
      
      // Timer countdown
      timerInterval = setInterval(() => {
        if (!gamePaused) {
          gameTimer--;
          updateTimer();
          
          if (gameTimer <= 0) {
            endGame();
          }
        }
      }, 1000);
      
      // Spawn objects
      spawnInterval = setInterval(() => {
        if (!gamePaused && gameRunning) {
          createGameObject();
        }
      }, 1000);
      
      playSound(600, 200);
    }
    
    function pauseGame() {
      gamePaused = !gamePaused;
      elements.pauseButton.textContent = gamePaused ? '▶️ Tiếp tục' : '⏸️ Tạm dừng';
      playSound(500, 100);
    }
    
    function endGame() {
      gameRunning = false;
      gamePaused = false;
      
      clearInterval(timerInterval);
      clearInterval(spawnInterval);
      
      gameObjects.forEach(obj => obj.element.remove());
      gameObjects = [];
      
      elements.finalScore.textContent = score;
      elements.gameOver.style.display = 'flex';
      
      elements.startButton.disabled = false;
      elements.pauseButton.disabled = true;
      elements.startButton.textContent = '🎯 Bắt đầu';
      elements.pauseButton.textContent = '⏸️ Tạm dừng';
      
      playSound(400, 500);
      vibrate([100, 50, 100]);
    }
    
    function resetGame() {
      gameRunning = false;
      gamePaused = false;
      score = 0;
      gameTimer = 30;
      
      clearInterval(timerInterval);
      clearInterval(spawnInterval);
      
      gameObjects.forEach(obj => obj.element.remove());
      gameObjects = [];
      
      elements.score.textContent = '0';
      elements.timer.textContent = '30';
      elements.timer.style.color = 'white';
      elements.gameOver.style.display = 'none';
      
      elements.startButton.disabled = false;
      elements.pauseButton.disabled = true;
      elements.startButton.textContent = '🎯 Bắt đầu';
      elements.pauseButton.textContent = '⏸️ Tạm dừng';
      
      playSound(700, 150);
    }
    
    function createGameObject() {
      if (!gameRunning || gamePaused) return;
      
      const container = elements.gameArea || elements.canvas?.parentElement;
      if (!container) return;
      
      const containerRect = container.getBoundingClientRect();
      const maxX = (elements.gameArea?.offsetWidth || 350) - 60;
      const maxY = (elements.gameArea?.offsetHeight || 250) - 60;
      
      const element = document.createElement('div');
      element.classList.add('game-object');
      
      const x = Math.random() * maxX;
      const y = Math.random() * maxY;
      
      const colors = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#ffeaa7', '#dda0dd'];
      const color = colors[Math.floor(Math.random() * colors.length)];
      const points = Math.floor(Math.random() * 3) + 1;
      
      element.style.left = x + 'px';
      element.style.top = y + 'px';
      element.style.backgroundColor = color;
      element.textContent = points;
      
      // Event listeners
      const handleClick = (e) => {
        e.preventDefault();
        if (gameRunning && !gamePaused) {
          updateScore(points * 10);
          playSound(800 + points * 200, 100);
          vibrate(30);
          
          element.style.transform = 'scale(1.5)';
          element.style.opacity = '0';
          
          setTimeout(() => {
            element.remove();
            gameObjects = gameObjects.filter(obj => obj.element !== element);
          }, 200);
        }
      };
      
      element.addEventListener('click', handleClick);
      element.addEventListener('touchstart', handleClick);
      
      container.appendChild(element);
      
      const gameObject = {
        element: element,
        createdAt: Date.now(),
        points: points
      };
      gameObjects.push(gameObject);
      
      // Auto remove after 3 seconds
      setTimeout(() => {
        if (gameObjects.includes(gameObject)) {
          element.remove();
          gameObjects = gameObjects.filter(obj => obj !== gameObject);
        }
      }, 3000);
    }
    
    // Event listeners
    elements.startButton.addEventListener('click', startGame);
    elements.pauseButton.addEventListener('click', pauseGame);
    elements.resetButton.addEventListener('click', resetGame);
    
    // Keyboard controls
    document.addEventListener('keydown', (e) => {
      switch(e.code) {
        case 'Space':
          e.preventDefault();
          if (!gameRunning) startGame();
          else pauseGame();
          break;
        case 'KeyR':
          resetGame();
          break;
      }
    });
    
    console.log('Game demo initialized for: ${topic}');
  </script>
</body>
</html>
  `;
};

const cleanHtmlContent = (content: string): string => {
  // Loại bỏ markdown code blocks
  content = content.replace(/```html\n?/g, '').replace(/```\n?/g, '');
  
  // Đảm bảo cấu trúc HTML đúng
  if (!content.includes('<!DOCTYPE html>')) {
    content = `<!DOCTYPE html>\n${content}`;
  }
  
  // Format lại code cho dễ đọc
  content = content
    .replace(/></g, '>\n<')
    .replace(/\n\s*\n\s*\n/g, '\n\n')
    .trim();
  
  return content;
};
