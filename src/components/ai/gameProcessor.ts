
/**
 * Game Processor - Processes and enhances generated game content
 */

export const processGameCode = (content: string): { title: string; content: string } => {
  let processedContent = content;
  let title = 'Game Tương Tác';

  // Extract title from HTML if present
  const titleMatch = content.match(/<title>(.*?)<\/title>/i);
  if (titleMatch) {
    title = titleMatch[1];
  }

  // Clean up the content
  processedContent = cleanHtmlContent(processedContent);
  
  // Add responsive viewport if missing
  if (!processedContent.includes('viewport')) {
    processedContent = processedContent.replace(
      '<head>',
      '<head>\n<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">'
    );
  }

  // Add touch-action CSS for better mobile experience
  const touchCSS = `
    <style>
      * {
        touch-action: manipulation;
        -webkit-tap-highlight-color: transparent;
      }
      
      button, .clickable {
        min-width: 44px;
        min-height: 44px;
        cursor: pointer;
      }
      
      @media (hover: hover) and (pointer: fine) {
        button:hover, .clickable:hover {
          opacity: 0.8;
        }
      }
    </style>
  `;

  if (!processedContent.includes('touch-action')) {
    processedContent = processedContent.replace('</head>', `${touchCSS}\n</head>`);
  }

  return { title, content: processedContent };
};

export const createFallbackGameHtml = (topic: string, useCanvas: boolean = true): string => {
  const canvasElement = useCanvas ? '<canvas id="gameCanvas" width="400" height="300"></canvas>' : '<div id="gameArea"></div>';
  
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
    }
    
    body {
      font-family: Arial, sans-serif;
      max-width: 800px;
      margin: 0 auto;
      padding: 20px;
      text-align: center;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      min-height: 100vh;
    }
    
    .game-container {
      background: rgba(255, 255, 255, 0.1);
      border-radius: 20px;
      padding: 30px;
      backdrop-filter: blur(10px);
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
    }
    
    button {
      min-width: 44px;
      min-height: 44px;
      padding: 12px 24px;
      margin: 8px;
      font-size: 16px;
      border: none;
      border-radius: 10px;
      background: rgba(255, 255, 255, 0.2);
      color: white;
      cursor: pointer;
      transition: all 0.3s;
    }
    
    button:hover {
      background: rgba(255, 255, 255, 0.3);
      transform: translateY(-2px);
    }
    
    #gameArea, canvas {
      border: 2px solid rgba(255, 255, 255, 0.3);
      border-radius: 15px;
      margin: 20px auto;
      display: block;
      background: rgba(255, 255, 255, 0.1);
    }
    
    .score {
      font-size: 24px;
      font-weight: bold;
      margin: 20px 0;
    }
  </style>
</head>
<body>
  <div class="game-container">
    <h1>🎮 Game: ${topic}</h1>
    <div class="score">Điểm: <span id="score">0</span></div>
    
    ${canvasElement}
    
    <div>
      <button onclick="startGame()">🎯 Bắt đầu</button>
      <button onclick="resetGame()">🔄 Đặt lại</button>
    </div>
    
    <p style="margin-top: 20px; opacity: 0.8;">
      Game demo về "${topic}" - Nhấp để tương tác!
    </p>
  </div>

  <script>
    let score = 0;
    let gameActive = false;
    
    function updateScore(points) {
      score += points;
      document.getElementById('score').textContent = score;
    }
    
    function startGame() {
      gameActive = true;
      document.querySelector('button').textContent = '🎮 Đang chơi...';
      
      // Simple demo interaction
      setTimeout(() => {
        alert('🎉 Chúc mừng! Bạn đã hoàn thành game demo!');
        updateScore(100);
      }, 2000);
    }
    
    function resetGame() {
      score = 0;
      gameActive = false;
      document.getElementById('score').textContent = '0';
      document.querySelector('button').textContent = '🎯 Bắt đầu';
    }
  </script>
</body>
</html>
  `;
};

const cleanHtmlContent = (content: string): string => {
  // Remove any markdown code blocks
  content = content.replace(/```html\n?/g, '').replace(/```\n?/g, '');
  
  // Ensure proper HTML structure
  if (!content.includes('<!DOCTYPE html>')) {
    content = `<!DOCTYPE html>\n${content}`;
  }
  
  return content.trim();
};
