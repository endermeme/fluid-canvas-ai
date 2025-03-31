
import axios from 'axios';
import { GameSettingsData } from './types';

export interface MiniGame {
  title: string;
  description: string;
  content: string;
  instructionsHtml: string;
  gameHtml: string;
  gameScript: string;
  cssStyles: string;
}

export class AIGameGenerator {
  private apiKey: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  async generateMiniGame(topic: string, settings?: GameSettingsData): Promise<MiniGame | null> {
    try {
      const settingsPrompt = settings ? `
        Hãy tạo với các cài đặt sau:
        - Độ khó: ${settings.difficulty}
        - Số lượng câu hỏi/thử thách: ${settings.questionCount}
        - Thời gian cho mỗi câu hỏi/thử thách: ${settings.timePerQuestion} giây
        - Thể loại: ${settings.category}
      ` : '';

      const prompt = `
        Tạo một minigame tương tác trực quan, đầy màu sắc về chủ đề "${topic}" bằng HTML, CSS và JavaScript.
        ${settingsPrompt}
        
        Minigame cần phải có:
        1. Giao diện với nhiều màu sắc tươi sáng, gradient, hiệu ứng trực quan
        2. Màu nền đặc biệt hoặc gradient thay vì màu trắng đơn điệu
        3. Tương tác tốt bằng chuột hoặc chạm
        4. Phản hồi trực quan khi người chơi tương tác
        5. Hiệu ứng chuyển động, hoạt ảnh đơn giản
        6. Hiển thị điểm số hoặc kết quả cuối cùng với hiệu ứng nổi bật
        7. Kiểu dáng hiện đại với viền bo tròn, bóng đổ, và các phần tử trong suốt
        8. Bố cục tối ưu cho cả điện thoại và máy tính
        
        Trả về định dạng JSON với các trường sau:
        {
          "title": "Tên minigame",
          "description": "Mô tả ngắn gọn về minigame",
          "instructionsHtml": "Để trống",
          "gameHtml": "Mã HTML của game",
          "gameScript": "Mã JavaScript của game (không bao gồm thẻ script)",
          "cssStyles": "CSS cho game (không bao gồm thẻ style) - hãy tạo nhiều màu sắc và hiệu ứng đẹp mắt"
        }
        
        Không trả lời bất kỳ điều gì khác ngoài đối tượng JSON.
      `;

      const response = await axios.post(
        'https://api.anthropic.com/v1/messages',
        {
          model: 'claude-3-sonnet-20240229',
          max_tokens: 4000,
          messages: [
            {
              role: 'user',
              content: prompt
            }
          ],
          response_format: { type: "json_object" }
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'x-api-key': this.apiKey,
            'anthropic-version': '2023-06-01'
          }
        }
      );

      const gameData = response.data.content[0].text;
      
      try {
        const parsedData = JSON.parse(gameData);
        
        // Build a full HTML document from the parts
        const fullHtmlContent = this.buildFullHtmlDocument(
          parsedData.title,
          parsedData.gameHtml,
          parsedData.gameScript,
          parsedData.cssStyles,
          parsedData.instructionsHtml
        );
        
        return {
          title: parsedData.title,
          description: parsedData.description,
          content: fullHtmlContent,
          instructionsHtml: parsedData.instructionsHtml,
          gameHtml: parsedData.gameHtml,
          gameScript: parsedData.gameScript,
          cssStyles: parsedData.cssStyles
        };
      } catch (jsonError) {
        console.error("Error parsing JSON from Claude response:", jsonError);
        console.log("Attempted to parse:", gameData);
        return null;
      }
    } catch (error) {
      console.error("Error generating mini game:", error);
      return null;
    }
  }
  
  private buildFullHtmlDocument(title: string, html: string, script: string, css: string, instructions: string): string {
    return `
<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  <style>
    /* Base Styles */
    body {
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      margin: 0;
      padding: 0;
      min-height: 100vh;
      background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
    }
    
    /* Modern UI Elements */
    .game-container {
      width: 100%;
      max-width: 800px;
      background: rgba(255, 255, 255, 0.8);
      backdrop-filter: blur(10px);
      border-radius: 16px;
      padding: 20px;
      box-shadow: 0 8px 32px rgba(31, 38, 135, 0.2);
      border: 1px solid rgba(255, 255, 255, 0.18);
      margin: 20px;
    }
    
    button {
      background: linear-gradient(90deg, #4776E6 0%, #8E54E9 100%);
      border: none;
      color: white;
      padding: 10px 20px;
      border-radius: 8px;
      font-weight: bold;
      cursor: pointer;
      transition: all 0.3s ease;
      box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
    }
    
    button:hover {
      transform: translateY(-3px);
      box-shadow: 0 7px 20px rgba(0, 0, 0, 0.3);
    }
    
    button:active {
      transform: translateY(1px);
    }
    
    input, select {
      padding: 10px;
      border-radius: 8px;
      border: 1px solid rgba(0, 0, 0, 0.1);
      background: rgba(255, 255, 255, 0.7);
      box-shadow: inset 0 2px 6px rgba(0, 0, 0, 0.05);
    }
    
    /* Game instructions - hidden by default */
    .game-instructions {
      display: none;
    }
    
    /* Custom game styles */
    ${css}
    
    /* Animation keyframes */
    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(20px); }
      to { opacity: 1; transform: translateY(0); }
    }
    
    @keyframes pulse {
      0% { transform: scale(1); }
      50% { transform: scale(1.05); }
      100% { transform: scale(1); }
    }
    
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
    
    /* Apply animations to common elements */
    .game-title {
      animation: fadeIn 0.6s ease-out;
    }
    
    .score-display {
      animation: pulse 2s infinite;
    }
    
    .loading {
      animation: spin 1s linear infinite;
    }

    /* Responsive adjustments */
    @media (max-width: 768px) {
      .game-container {
        margin: 10px;
        padding: 15px;
      }
    }
  </style>
</head>
<body>
  <!-- Game content -->
  <div class="game-container">
    ${html}
  </div>

  <script>
    // Game logic
    ${script}
  </script>
</body>
</html>
    `;
  }
}
