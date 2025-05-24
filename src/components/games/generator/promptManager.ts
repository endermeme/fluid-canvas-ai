/**
 * Prompt Manager - Quản lý các template và tạo prompt cho Gemini API
 * 
 * Module này cung cấp các template và hàm tạo prompt chuẩn hóa cho việc tạo game
 */

import { PromptOptions } from './types';

// Constants
const SOURCE = "PROMPT_MANAGER";

// HTML Format Instructions
export const HTML_FORMAT_INSTRUCTIONS = `
IMPORTANT FORMATTING RULES (FOLLOW THESE EXACTLY):
1. Your answer MUST be a COMPLETE, VALID HTML document with proper DOCTYPE declaration.
2. Place ALL JavaScript in a SINGLE <script> tag at the END of the body section.
3. Place ALL CSS in a SINGLE <style> tag in the head section.
4. Use modern JavaScript (ES6+) with proper syntax and error handling.
5. DO NOT use external dependencies or CDN links.
6. DO NOT use markdown code blocks (\`\`\` or ~~~) in your response.
7. Make the game FULLY INTERACTIVE and TOUCH-FRIENDLY for mobile devices.
8. Include clear instructions for players directly in the game UI.
9. Make the game centered and responsive for both desktop and mobile.
10. Include a title and game description in the HTML.

EXAMPLE CODE STRUCTURE:
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Your Game Title</title>
  <style>
    /* ALL CSS HERE */
  </style>
</head>
<body>
  <!-- Game HTML here -->
  
  <script>
    // ALL JavaScript code here
  </script>
</body>
</html>
`;

// Canvas Implementation Instructions
export const CANVAS_IMPLEMENTATION_INSTRUCTIONS = `
CANVAS IMPLEMENTATION RULES:
1. Use proper error handling for canvas operations:
   - Check if context is available after calling getContext
   - Include proper bounds checking in drawing functions
2. Add window resize handlers to keep canvas responsive
3. Use requestAnimationFrame for animations
4. Include touch events for mobile compatibility
5. Use proper scaling for high-DPI screens

EXAMPLE CANVAS INITIALIZATION:
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
if (!ctx) {
  console.error('Canvas rendering context not available');
  document.body.innerHTML = '<p>Your browser does not support canvas</p>';
  return;
}

// Set proper canvas dimensions
function resizeCanvas() {
  const container = canvas.parentElement;
  canvas.width = container.clientWidth;
  canvas.height = container.clientHeight;
  
  // Re-draw after resize
  drawGame();
}

window.addEventListener('resize', resizeCanvas);
resizeCanvas();
`;

// Error Handling Instructions
export const ERROR_HANDLING_INSTRUCTIONS = `
ERROR HANDLING REQUIREMENTS:
1. Add comprehensive error handling throughout the code
2. Include a global error handler with window.onerror
3. Always check for null/undefined before accessing properties
4. Handle all potential exceptions in event handlers
5. Provide fallback UI for any feature that might fail

EXAMPLE ERROR HANDLING:
window.onerror = function(message, source, lineno, colno, error) {
  console.error('Game error:', message, 'at line:', lineno);
  // Optionally show user-friendly error message
  const errorElement = document.getElementById('error-message');
  if (errorElement) {
    errorElement.textContent = 'Something went wrong. Please try refreshing the page.';
    errorElement.style.display = 'block';
  }
  return true; // Prevents default error handling
};
`;

// Hàm để làm phong phú chủ đề quá ngắn
function enrichTopic(topic: string): string {
  // Danh sách các từ khóa phổ biến và cách mở rộng
  const topicEnrichment: Record<string, string> = {
    'xếp hình': 'trò chơi xếp hình với các mảnh ghép có thể kéo thả để tạo thành một bức tranh hoàn chỉnh',
    'puzzle': 'trò chơi xếp hình puzzle với các mảnh ghép có thể kéo thả',
    'câu đố': 'trò chơi câu đố với nhiều câu hỏi hóc búa và gợi ý',
    'đố vui': 'trò chơi đố vui với nhiều câu hỏi thú vị và hài hước',
    'tetris': 'trò chơi xếp hình kiểu tetris với các khối rơi xuống',
    'flappy bird': 'trò chơi giống flappy bird với nhân vật bay qua các chướng ngại vật',
    'snake': 'trò chơi rắn săn mồi cổ điển',
    'quiz': 'trò chơi câu hỏi trắc nghiệm với nhiều chủ đề khác nhau',
    'memory': 'trò chơi lật thẻ tìm cặp giống nhau để luyện trí nhớ',
    'sudoku': 'trò chơi sudoku với các ô số cần điền để hoàn thành lưới',
    'hangman': 'trò chơi đoán từ kiểu hangman với hình vẽ người treo cổ',
    'tic tac toe': 'trò chơi cờ caro (tic tac toe) với bảng 3x3',
    'đua xe': 'trò chơi đua xe với nhiều chướng ngại vật và cấp độ',
    'bắn súng': 'trò chơi bắn súng với nhiều kẻ địch và vũ khí',
    'nhảy cao': 'trò chơi nhảy qua các chướng ngại vật để đạt điểm cao',
    'lật thẻ': 'trò chơi lật thẻ tìm cặp giống nhau để luyện trí nhớ',
  };
  
  // Kiểm tra nếu topic quá ngắn hoặc là từ khóa có sẵn
  if (topic.length < 10 || Object.keys(topicEnrichment).some(key => topic.toLowerCase().includes(key.toLowerCase()))) {
    // Tìm từ khóa khớp
    for (const [key, expansion] of Object.entries(topicEnrichment)) {
      if (topic.toLowerCase().includes(key.toLowerCase())) {
        return expansion;
      }
    }
    
    // Nếu topic quá ngắn và không tìm thấy từ khóa khớp
    if (topic.length < 10) {
      return `trò chơi tương tác đơn giản về ${topic} với giao diện thân thiện và dễ sử dụng`;
    }
  }
  
  // Trả về topic gốc nếu đã đủ chi tiết
  return topic;
}

/**
 * Tạo prompt để sinh game theo chủ đề
 */
export function createGamePrompt(options: PromptOptions): string {
  const {
    topic,
    useCanvas = true,
    language = 'en',
    difficulty = 'medium',
    category = 'general'
  } = options;
  
  // Làm phong phú chủ đề nếu quá ngắn
  const enrichedTopic = enrichTopic(topic);
  
  // Lựa chọn ngôn ngữ
  const languageText = language === 'en' ? 'English' : 'Vietnamese';
  
  // Tạo prompt chính
  let prompt = `Create an interactive HTML5 mini-game about "${enrichedTopic}" for educational purposes.

${HTML_FORMAT_INSTRUCTIONS}

Game Requirements:
- Difficulty level: ${difficulty}
- Category: ${category}
- Main language: ${languageText}
- Use ${useCanvas ? 'HTML5 Canvas' : 'DOM manipulation'} for the game
- Make the game educational and fun
- Include clear instructions for players
- Add scoring and progress tracking
- Design the game to be visually appealing with good colors
- Make it responsive for both desktop and mobile devices
- Include a title screen and game over screen
- Add sound effects if possible (using Audio API)
- Implement touch controls for mobile devices
${useCanvas ? CANVAS_IMPLEMENTATION_INSTRUCTIONS : ''}
${ERROR_HANDLING_INSTRUCTIONS}

Game Suggestions for "${enrichedTopic}":
- A puzzle game where players drag and drop pieces to complete an image
- A memory game where players match pairs of cards
- A quiz game with multiple-choice questions
- A simple arcade game with scoring system
- A word search or crossword puzzle game
- A sorting or categorization game

IMPORTANT: Return ONLY the complete HTML document. Do not include any explanation, commentary, or markdown syntax around your code.
`;

  return prompt;
}

export default {
  createGamePrompt,
  HTML_FORMAT_INSTRUCTIONS,
  CANVAS_IMPLEMENTATION_INSTRUCTIONS,
  ERROR_HANDLING_INSTRUCTIONS
}; 