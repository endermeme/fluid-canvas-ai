/**
 * Game Processor - Xử lý và làm sạch code game trả về từ Gemini API
 * 
 * Module này cung cấp các hàm để xử lý, phân tích, sửa lỗi và làm sạch
 * mã HTML/JS/CSS trả về từ Gemini để đảm bảo game chạy ổn định
 */

import { logInfo, logWarning } from './apiUtils';

// Constants
const SOURCE = "GAME_PROCESSOR";

/**
 * Trích xuất tiêu đề từ HTML game
 */
export function extractGameTitle(html: string): string {
  // Thử lấy từ thẻ title
  const titleMatch = html.match(/<title>(.*?)<\/title>/is);
  if (titleMatch && titleMatch[1]) {
    return titleMatch[1].trim();
  }
  
  // Thử lấy từ thẻ h1
  const h1Match = html.match(/<h1[^>]*>(.*?)<\/h1>/is);
  if (h1Match && h1Match[1]) {
    // Loại bỏ các thẻ HTML lồng nhau nếu có
    return h1Match[1].replace(/<[^>]*>/g, '').trim();
  }
  
  // Fallback: lấy 50 ký tự đầu tiên sau thẻ body
  const bodyMatch = html.match(/<body[^>]*>([\s\S]*)/i);
  if (bodyMatch && bodyMatch[1]) {
    const text = bodyMatch[1].replace(/<[^>]*>/g, ' ').trim();
    const shortText = text.split(/\s+/).slice(0, 6).join(' ');
    return shortText || 'Interactive Game';
  }
  
  return 'Interactive Game';
}

/**
 * Làm sạch và sửa lỗi code HTML/JS/CSS
 */
export function processGameCode(content: string): { title: string, content: string } {
  logInfo(SOURCE, "Processing game code");
  
  // Loại bỏ markdown code blocks nếu có
  let cleanedContent = content.trim();
  const codeBlockRegex = /^```(?:html|javascript)?\s*([\s\S]*?)```$/;
  const codeBlockMatch = cleanedContent.match(codeBlockRegex);
  
  if (codeBlockMatch && codeBlockMatch[1]) {
    cleanedContent = codeBlockMatch[1].trim();
    logInfo(SOURCE, "Removed markdown code blocks");
  }
  
  // Đảm bảo có DOCTYPE và cấu trúc HTML đầy đủ
  if (!cleanedContent.toLowerCase().includes('<!doctype html>') && 
      !cleanedContent.toLowerCase().includes('<!DOCTYPE html>') &&
      !cleanedContent.toLowerCase().startsWith('<html')) {
    
    logWarning(SOURCE, "HTML lacks proper DOCTYPE, attempting to fix");
    
    // Tìm HTML đầy đủ trong văn bản
    const htmlPattern = /<html[\s\S]*?<\/html>/i;
    const htmlMatch = cleanedContent.match(htmlPattern);
    
    if (htmlMatch && htmlMatch[0]) {
      cleanedContent = `<!DOCTYPE html>\n${htmlMatch[0]}`;
      logInfo(SOURCE, "Added DOCTYPE to existing HTML");
    } else {
      // Không có thẻ HTML đầy đủ, bọc nội dung
      const title = cleanedContent.match(/<h1[^>]*>(.*?)<\/h1>/i)?.[1] || 'Interactive Game';
      
      cleanedContent = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  <style>
    body { margin: 0; padding: 20px; font-family: sans-serif; }
    .container { max-width: 800px; margin: 0 auto; }
  </style>
</head>
<body>
  <div class="container">
    ${cleanedContent}
  </div>
  <script>
    // Console error catching
    window.onerror = (msg, src, line, col, err) => {
      console.error('Game error:', msg, 'at', line, ':', col);
      return true;
    }
  </script>
</body>
</html>`;
      
      logInfo(SOURCE, "Wrapped content in complete HTML structure");
    }
  }
  
  // Sửa các lỗi JavaScript phổ biến
  
  // 1. Sửa template literals lỗi
  cleanedContent = fixTemplateLiterals(cleanedContent);
  
  // 2. Sửa các lỗi tham số hàm
  cleanedContent = fixFunctionParameters(cleanedContent);
  
  // 3. Thêm xử lý lỗi cho canvas
  cleanedContent = addCanvasErrorHandling(cleanedContent);
  
  // 4. Đảm bảo CSS trong thẻ style
  cleanedContent = ensureStyledCSS(cleanedContent);
  
  // 5. Thêm xử lý lỗi global
  cleanedContent = addGlobalErrorHandling(cleanedContent);
  
  // 6. Sửa các lỗi cú pháp JavaScript khác
  cleanedContent = fixCommonJSErrors(cleanedContent);
  
  // Trích xuất tiêu đề
  const title = extractGameTitle(cleanedContent);
  
  return {
    title,
    content: cleanedContent
  };
}

/**
 * Sửa các template literals lỗi
 */
function fixTemplateLiterals(code: string): string {
  return code.replace(
    /(\w+\.(?:style\.transform|innerHTML|textContent|innerText)\s*=\s*)(['"])?([^'"`;]*)\$\{([^}]+)\}([^'"`;]*)(['"])?;?/g, 
    (match, prefix, openQuote, before, expr, after, closeQuote) => {
      // Nếu đã có backticks thì giữ nguyên
      if (!openQuote && !closeQuote) return match;
      
      // Thay thế quotes bằng backticks
      return `${prefix}\`${before}\${${expr}}${after}\`;`;
    }
  );
}

/**
 * Sửa các lỗi tham số hàm
 */
function fixFunctionParameters(code: string): string {
  return code.replace(
    /function\s+(\w+)\s*\(\$(\d+)\)/g, 
    (match, funcName, paramNum) => {
      // Danh sách các tên tham số phổ biến theo tên hàm
      const paramNames: Record<string, string> = {
        'drawSegment': 'index',
        'getWinningSegment': 'finalAngle',
        'spinWheel': '',
        'drawWheel': '',
        'updateScore': 'points',
        'checkAnswer': 'selectedOption',
        'startGame': '',
        'endGame': '',
        'resetGame': '',
      };
      
      if (paramNames.hasOwnProperty(funcName)) {
        return `function ${funcName}(${paramNames[funcName]})`;
      }
      
      // Nếu không có trong danh sách, thay thế bằng param + số
      return `function ${funcName}(param${paramNum})`;
    }
  );
}

/**
 * Thêm xử lý lỗi cho canvas
 */
function addCanvasErrorHandling(code: string): string {
  // Nếu đã có xử lý lỗi thì không thêm
  if (code.includes('getContext') && !code.includes('if (!ctx)')) {
    return code.replace(
      /const\s+ctx\s*=\s*canvas\.getContext\(['"]2d['"]\);/g,
      "const ctx = canvas.getContext('2d');\n  if (!ctx) { console.error('Canvas context not available'); return; }"
    );
  }
  
  return code;
}

/**
 * Đảm bảo CSS nằm trong thẻ style
 */
function ensureStyledCSS(code: string): string {
  const cssBlockMatch = code.match(/\/\*\s*CSS\s*\*\/([\s\S]*?)\/\*\s*End CSS\s*\*\//i);
  
  if (cssBlockMatch && cssBlockMatch[1] && !cssBlockMatch[0].includes('<style>')) {
    const cssContent = cssBlockMatch[1].trim();
    return code.replace(
      cssBlockMatch[0],
      `<style>\n${cssContent}\n</style>`
    );
  }
  
  return code;
}

/**
 * Thêm xử lý lỗi global nếu chưa có
 */
function addGlobalErrorHandling(code: string): string {
  if (!code.includes('window.onerror')) {
    const errorHandlingScript = `
  <script>
    window.onerror = (message, source, lineno, colno, error) => {
      console.error('Game error:', { message, source, lineno, colno, stack: error?.stack });
      return true;
    };
  </script>`;
    
    if (code.includes('</body>')) {
      return code.replace('</body>', `${errorHandlingScript}\n</body>`);
    } else if (code.includes('</html>')) {
      return code.replace('</html>', `${errorHandlingScript}\n</html>`);
    }
  }
  
  return code;
}

/**
 * Sửa các lỗi cú pháp JavaScript phổ biến khác
 */
function fixCommonJSErrors(code: string): string {
  // Sửa lỗi dấu == thay vì === trong so sánh
  let fixed = code.replace(
    /if\s*\(\s*(\w+)\s*==\s*(null|undefined)\s*\)/g,
    'if ($1 === $2)'
  );
  
  // Sửa lỗi gọi addEventListener không có function
  fixed = fixed.replace(
    /addEventListener\((['"])(\w+)(['"])\s*,\s*(\w+)\s*\)/g,
    (match, q1, eventName, q3, funcName) => {
      // Kiểm tra xem funcName có phải là tên hàm hợp lệ không
      const validFuncRegex = new RegExp(`function\\s+${funcName}\\s*\\(`, 'g');
      if (fixed.match(validFuncRegex)) {
        // Nếu tìm thấy định nghĩa hàm, thêm dấu ngoặc đơn
        return `addEventListener(${q1}${eventName}${q3}, ${funcName})`;
      }
      return match; // Không thay đổi nếu không tìm thấy định nghĩa hàm
    }
  );
  
  // Sửa lỗi .length trên biến có thể null
  fixed = fixed.replace(
    /(\w+)\.length/g,
    (match, varName) => {
      // Thêm kiểm tra null/undefined nếu là biến đơn
      if (varName.match(/^[a-zA-Z_][a-zA-Z0-9_]*$/)) {
        return `(${varName} || []).length`;
      }
      return match;
    }
  );
  
  return fixed;
}

/**
 * Tạo HTML game đơn giản dự phòng (fallback)
 */
export function createFallbackGameHtml(topic: string, isCanvasGame: boolean = true): string {
  const gameTitle = `Game về ${topic}`;
  const gameType = isCanvasGame ? 'Canvas' : 'DOM';
  
  return `<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${gameTitle}</title>
  <style>
    body {
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      margin: 0;
      padding: 20px;
      background-color: #f5f5f5;
      color: #333;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      min-height: 100vh;
      text-align: center;
    }
    .container {
      max-width: 800px;
      background-color: white;
      border-radius: 12px;
      padding: 20px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.1);
    }
    h1 {
      color: #4F46E5;
      margin-bottom: 10px;
    }
    p {
      margin-bottom: 15px;
      line-height: 1.5;
    }
    .game-instructions {
      background-color: #EEF2FF;
      border-left: 4px solid #4F46E5;
      padding: 15px;
      margin: 20px 0;
    }
    button {
      background-color: #4F46E5;
      color: white;
      border: none;
      padding: 10px 20px;
      border-radius: 6px;
      cursor: pointer;
      font-size: 16px;
      transition: background-color 0.2s;
    }
    button:hover {
      background-color: #4338CA;
    }
    #gameCanvas {
      border: 2px solid #4F46E5;
      border-radius: 8px;
      background-color: white;
      margin: 20px 0;
      max-width: 100%;
    }
    #score {
      font-size: 24px;
      font-weight: bold;
      margin: 15px 0;
    }
  </style>
</head>
<body>
  <div class="container">
    <h1>${gameTitle}</h1>
    <p>Chào mừng bạn đến với trò chơi tương tác về ${topic}!</p>
    
    <div class="game-instructions">
      <h3>Hướng dẫn:</h3>
      <p>Đây là một trò chơi đơn giản sử dụng ${gameType}. Nhấn nút Bắt đầu để chơi!</p>
      ${isCanvasGame ? 
        '<p>Di chuyển chuột hoặc ngón tay trên màn hình để tương tác với game.</p>' : 
        '<p>Nhấn vào các phần tử trên màn hình để tương tác với game.</p>'}
    </div>
    
    ${isCanvasGame ? '<canvas id="gameCanvas" width="600" height="400"></canvas>' : 
      '<div id="gameArea" style="width: 600px; height: 400px; border: 2px solid #4F46E5; border-radius: 8px; margin: 20px 0;"></div>'}
    
    <div id="score">Điểm: 0</div>
    <button id="startBtn">Bắt đầu</button>
  </div>
  
  <script>
    // Các biến game
    let score = 0;
    let gameActive = false;
    const startBtn = document.getElementById('startBtn');
    const scoreElement = document.getElementById('score');
    ${isCanvasGame ? `
    // Khởi tạo canvas
    const canvas = document.getElementById('gameCanvas');
    const ctx = canvas.getContext('2d');
    
    // Đảm bảo canvas responsive
    function resizeCanvas() {
      const container = canvas.parentElement;
      const maxWidth = container.clientWidth - 40;
      
      if (maxWidth < 600) {
        canvas.width = maxWidth;
        canvas.height = maxWidth * 2/3;
      } else {
        canvas.width = 600;
        canvas.height = 400;
      }
      
      // Vẽ lại game khi resize
      if (gameActive) {
        drawGame();
      } else {
        drawWelcome();
      }
    }
    
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();
    
    // Vẽ màn hình chào mừng
    function drawWelcome() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      ctx.fillStyle = '#f5f5f5';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      ctx.font = '24px Arial';
      ctx.fillStyle = '#4F46E5';
      ctx.textAlign = 'center';
      ctx.fillText('${gameTitle}', canvas.width/2, canvas.height/2 - 30);
      
      ctx.font = '16px Arial';
      ctx.fillStyle = '#333';
      ctx.fillText('Nhấn Bắt đầu để chơi!', canvas.width/2, canvas.height/2 + 10);
    }
    
    // Vẽ game chính
    function drawGame() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Vẽ nền
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Vẽ tiêu đề
      ctx.font = '18px Arial';
      ctx.fillStyle = '#4F46E5';
      ctx.textAlign = 'start';
      ctx.fillText('${gameTitle}', 20, 30);
      
      // Vẽ điểm
      ctx.textAlign = 'end';
      ctx.fillText('Điểm: ' + score, canvas.width - 20, 30);
      
      // Vẽ hướng dẫn
      ctx.textAlign = 'center';
      ctx.fillStyle = '#333';
      ctx.fillText('Di chuyển chuột để chơi', canvas.width/2, canvas.height - 20);
      
      // Vẽ một hình tròn đơn giản
      ctx.beginPath();
      ctx.arc(canvas.width/2, canvas.height/2, 50, 0, Math.PI * 2);
      ctx.fillStyle = '#4F46E5';
      ctx.fill();
      ctx.closePath();
    }
    
    // Xử lý sự kiện chuột/cảm ứng
    canvas.addEventListener('mousemove', function(e) {
      if (!gameActive) return;
      
      const rect = canvas.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;
      
      // Vẽ lại game
      drawGame();
    });
    
    canvas.addEventListener('click', function(e) {
      if (!gameActive) return;
      
      score += 10;
      scoreElement.textContent = 'Điểm: ' + score;
      drawGame();
    });
    
    // Hiển thị màn hình chào mừng đầu tiên
    drawWelcome();` :
    `
    // Khởi tạo game area
    const gameArea = document.getElementById('gameArea');
    
    // Tạo các phần tử game
    function setupGameElements() {
      gameArea.innerHTML = '';
      
      // Tạo tiêu đề
      const title = document.createElement('div');
      title.textContent = '${gameTitle}';
      title.style.fontSize = '18px';
      title.style.color = '#4F46E5';
      title.style.marginBottom = '20px';
      title.style.textAlign = 'center';
      
      // Tạo 4 ô vuông để chơi
      const boxes = document.createElement('div');
      boxes.style.display = 'grid';
      boxes.style.gridTemplateColumns = 'repeat(2, 1fr)';
      boxes.style.gap = '10px';
      boxes.style.width = '80%';
      boxes.style.margin = '0 auto';
      
      for (let i = 0; i < 4; i++) {
        const box = document.createElement('div');
        box.className = 'game-box';
        box.style.backgroundColor = getRandomColor();
        box.style.width = '100%';
        box.style.height = '100px';
        box.style.borderRadius = '8px';
        box.style.cursor = 'pointer';
        
        box.addEventListener('click', function() {
          score += 5;
          scoreElement.textContent = 'Điểm: ' + score;
          this.style.backgroundColor = getRandomColor();
        });
        
        boxes.appendChild(box);
      }
      
      // Thêm vào game area
      gameArea.appendChild(title);
      gameArea.appendChild(boxes);
    }
    
    // Hàm lấy màu ngẫu nhiên
    function getRandomColor() {
      const colors = ['#4F46E5', '#EC4899', '#8B5CF6', '#10B981', '#F59E0B', '#EF4444'];
      return colors[Math.floor(Math.random() * colors.length)];
    }
    `}
    
    // Bắt đầu game
    startBtn.addEventListener('click', function() {
      gameActive = true;
      score = 0;
      scoreElement.textContent = 'Điểm: 0';
      startBtn.textContent = 'Chơi lại';
      
      ${isCanvasGame ? 'drawGame();' : 'setupGameElements();'}
    });
    
    // Xử lý error
    window.onerror = function(message, source, lineno, colno, error) {
      console.error('Game error:', message);
      return true;
    };
  </script>
</body>
</html>`;
}

export default {
  processGameCode,
  extractGameTitle,
  createFallbackGameHtml
}; 