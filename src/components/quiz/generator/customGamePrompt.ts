export interface GamePromptOptions {
  topic: string;
  useCanvas?: boolean;
  language?: string;
  difficulty?: string;
  category?: string;
}

export const generateCustomGamePrompt = (options: GamePromptOptions): string => {
  const { 
    topic, 
    language = 'vi',
    difficulty = 'medium',
    category = 'general'
  } = options;

  const basePrompt = `
Tạo một trò chơi HTML5 đơn giản về chủ đề: "${topic}"

**YÊU CẦU GAME:**
- Trò chơi TOÀN MÀN HÌNH - chiếm 100% viewport
- Game bắt đầu ngay lập tức - KHÔNG có menu hoặc hướng dẫn
- UI tối thiểu - chỉ điểm số ở góc màn hình
- Giả lập chế độ CANVAS - sử dụng div elements thay vì canvas thực
- Controls đơn giản: Click/Touch hoặc phím mũi tên
- Ngôn ngữ: ${language === 'vi' ? 'Tiếng Việt' : 'English'}

**CẤU TRÚC HTML BẮT BUỘC:**
\`\`\`html
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Game</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    html, body { 
      width: 100vw; 
      height: 100vh; 
      overflow: hidden; 
      background: #000;
      font-family: Arial, sans-serif;
    }
    #gameArea { 
      width: 100vw; 
      height: 100vh; 
      position: relative;
      background: linear-gradient(45deg, #1a1a1a, #333);
    }
    .score { 
      position: fixed; 
      top: 20px; 
      left: 20px; 
      color: white; 
      font-size: 24px;
      z-index: 100;
    }
  </style>
</head>
<body>
  <div id="gameArea">
    <div class="score">Score: <span id="score">0</span></div>
  </div>
  
  <script>
    let score = 0;
    const scoreElement = document.getElementById('score');
    
    // Game logic here - keep it simple
    document.addEventListener('DOMContentLoaded', function() {
      // Start game immediately
    });
  </script>
</body>
</html>
\`\`\`

**QUY TẮC CODE:**
1. KHÔNG sử dụng Canvas thật - thay bằng div elements
2. KHÔNG có menu, popup, alert hoặc confirm
3. Game elements là div với position: absolute
4. Animation bằng CSS transform và JavaScript
5. Touch events cho mobile: touchstart, touchmove
6. Keyboard events cho desktop: keydown, keyup
7. KHÔNG có dependencies bên ngoài
8. Code JavaScript đơn giản - KHÔNG dùng class ES6
9. Sử dụng setInterval hoặc requestAnimationFrame
10. Game loop đơn giản với collision detection cơ bản

**GIẢ LẬP CANVAS:**
- Tạo "sprites" bằng div elements
- Di chuyển bằng style.left và style.top
- Collision detection bằng getBoundingClientRect()
- Animation bằng CSS transitions hoặc JavaScript

**VÍ DỤ GAME ELEMENT:**
\`\`\`javascript
function createGameObject(x, y, width, height, color) {
  const obj = document.createElement('div');
  obj.style.position = 'absolute';
  obj.style.left = x + 'px';
  obj.style.top = y + 'px';
  obj.style.width = width + 'px';
  obj.style.height = height + 'px';
  obj.style.backgroundColor = color;
  obj.style.borderRadius = '5px';
  document.getElementById('gameArea').appendChild(obj);
  return obj;
}
\`\`\`

**CONTROLS:**
- Desktop: Arrow keys hoặc WASD
- Mobile: Touch events (swipe hoặc tap)
- Responsive cho tất cả thiết bị

Tạo game đơn giản, vui nhộn và hoạt động ngay lập tức!
`;

  return basePrompt;
};
