
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

**YÊU CẦU QUAN TRỌNG:**
- Trò chơi TOÀN MÀN HÌNH - không có text thừa, hướng dẫn dài dòng
- Khu vực game chiếm 100% viewport (100vw x 100vh)
- UI tối thiểu - chỉ có điểm số và controls cần thiết
- KHÔNG có hướng dẫn dài hoặc mô tả trong game
- Game bắt đầu ngay lập tức
- Ngôn ngữ: ${language === 'vi' ? 'Tiếng Việt' : 'English'}
- Độ khó: ${difficulty}

**THIẾT KẾ RESPONSIVE:**
- Sử dụng viewport units (100vw, 100vh) cho toàn màn hình
- Game area: width: 100vw, height: 100vh
- Loại bỏ tất cả margin, padding từ body và html
- UI elements như overlay, không phải section riêng

**CẤU TRÚC GAME:**
1. Khu vực game toàn màn hình (canvas hoặc div)
2. UI overlay tối thiểu (điểm số ở góc)
3. Controls touch/mouse
4. KHÔNG có màn hình hướng dẫn - controls phải trực quan
5. KHÔNG có text hoặc mô tả thừa

**ĐỊNH DẠNG CODE:**
- HTML hoàn chỉnh với DOCTYPE
- CSS: body { margin: 0; padding: 0; overflow: hidden; width: 100vw; height: 100vh; }
- Game area: { width: 100vw; height: 100vh; position: relative; }
- Tất cả JavaScript trong một thẻ script
- KHÔNG dependencies bên ngoài
- Bắt đầu bằng \`\`\`html và kết thúc bằng \`\`\`

**HỖ TRỢ TOUCH/MOUSE:**
- Hỗ trợ cả touch events và mouse events
- Touch targets tối thiểu 44px
- Controls responsive cho tất cả thiết bị

**MÃ JAVASCRIPT AN TOÀN:**
- Sử dụng let/const thay vì var
- Kiểm tra null/undefined trước khi sử dụng
- Wrap code trong DOMContentLoaded
- Xử lý lỗi cơ bản với try/catch
- KHÔNG sử dụng template literals phức tạp

**VÍ DỤ CẤU TRÚC:**
\`\`\`html
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Game Title</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { width: 100vw; height: 100vh; overflow: hidden; }
    #gameArea { width: 100vw; height: 100vh; position: relative; }
    .score { position: fixed; top: 20px; left: 20px; z-index: 100; }
  </style>
</head>
<body>
  <div id="gameArea">
    <div class="score">Score: <span id="scoreValue">0</span></div>
  </div>
  
  <script>
    document.addEventListener('DOMContentLoaded', function() {
      // Game logic here
    });
  </script>
</body>
</html>
\`\`\`

Tập trung tạo trải nghiệm game toàn màn hình hấp dẫn với UI tối thiểu!
`;

  return basePrompt;
};
