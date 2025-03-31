
import { GoogleGenerativeAI } from '@google/generative-ai';
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
  private genAI: GoogleGenerativeAI;
  private model: any;

  constructor(apiKey: string) {
    this.genAI = new GoogleGenerativeAI(apiKey);
    this.model = this.genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
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
        Tạo một minigame tương tác HTML/CSS/JS hoàn chỉnh về chủ đề "${topic}".
        ${settingsPrompt}
        
        HƯỚNG DẪN CHI TIẾT:
        1. CODE PHẢI HOÀN CHỈNH:
           - Viết đầy đủ HTML, CSS và JavaScript để game hoạt động độc lập
           - JavaScript phải có đầy đủ xử lý sự kiện và logic game
           - CSS phải đầy đủ để tạo giao diện trực quan, đẹp mắt
        
        2. GIAO DIỆN:
           - Sử dụng nhiều màu sắc tươi sáng, gradient cho nền và các phần tử
           - Tạo hiệu ứng hover, active cho các thành phần tương tác
           - Thêm animation cho các chuyển động và hiệu ứng
           - Tất cả các phần tử phải được style đẹp mắt, không để mặc định
           - Giao diện phải responsive (hoạt động tốt trên điện thoại và máy tính)
        
        3. TÍNH NĂNG GAME:
           - Hiển thị điểm số rõ ràng
           - Có thông báo kết quả sau mỗi câu trả lời hoặc hành động
           - Có hệ thống tính giờ nếu phù hợp với loại game
           - Hiển thị màn hình kết quả cuối game với tổng điểm và đánh giá
           - Có nút chơi lại để bắt đầu game mới
        
        4. KỸ THUẬT:
           - Tất cả các biến và hàm JavaScript phải được đặt tên có ý nghĩa
           - Code phải được comment để giải thích các phần phức tạp
           - Sử dụng CSS modern (flexbox/grid) cho bố cục
           - Xử lý các trường hợp lỗi (input không hợp lệ, v.v.)
           - Code phải hoạt động hoàn toàn với sandbox="allow-scripts allow-same-origin"
           - KHÔNG ĐƯỢC sử dụng bất kỳ thư viện ngoài (như jQuery, Bootstrap)
        
        Trả về một đối tượng JSON với cấu trúc chính xác như sau:
        {
          "title": "Tên minigame",
          "description": "Mô tả ngắn gọn về minigame",
          "instructionsHtml": "Hướng dẫn HTML cho người chơi",
          "gameHtml": "Mã HTML đầy đủ của game (không bao gồm thẻ html/head/body)",
          "gameScript": "Mã JavaScript đầy đủ của game (không bao gồm thẻ script)",
          "cssStyles": "CSS đầy đủ cho game (không bao gồm thẻ style)"
        }
        
        QUAN TRỌNG: Trả về JSON thuần túy, không có văn bản giải thích hoặc trình bày thêm.
        Đảm bảo JSON được định dạng đúng và có thể phân tích bằng JSON.parse().
      `;

      const result = await this.model.generateContent(prompt);
      const response = result.response;
      const text = response.text();
      
      // Extract the JSON object from the response
      const jsonMatch = text.match(/{[\s\S]*}/);
      if (jsonMatch) {
        const jsonStr = jsonMatch[0];
        let gameData;
        
        try {
          gameData = JSON.parse(jsonStr);
          
          // Build a full HTML document from the parts
          const fullHtmlContent = this.buildFullHtmlDocument(
            gameData.title,
            gameData.gameHtml,
            gameData.gameScript,
            gameData.cssStyles,
            gameData.instructionsHtml
          );
          
          return {
            title: gameData.title,
            description: gameData.description,
            content: fullHtmlContent,
            instructionsHtml: gameData.instructionsHtml,
            gameHtml: gameData.gameHtml,
            gameScript: gameData.gameScript,
            cssStyles: gameData.cssStyles
          };
        } catch (jsonError) {
          console.error("Error parsing JSON from Gemini response:", jsonError);
          console.log("Attempted to parse:", jsonStr);
          return null;
        }
      }
      
      return null;
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
    /* Reset CSS */
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    
    /* Base Styles */
    body {
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      min-height: 100vh;
      background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      padding: 20px;
    }
    
    /* Game Container */
    .game-container {
      width: 100%;
      max-width: 800px;
      background: rgba(255, 255, 255, 0.9);
      backdrop-filter: blur(10px);
      border-radius: 16px;
      padding: 20px;
      box-shadow: 0 8px 32px rgba(31, 38, 135, 0.2);
      border: 1px solid rgba(255, 255, 255, 0.18);
      margin: 0 auto;
      overflow: hidden;
    }
    
    /* Common UI Elements */
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
    
    /* Animation Effects */
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
    
    /* Apply animations */
    .animate-fade-in {
      animation: fadeIn 0.6s ease-out;
    }
    
    .animate-pulse {
      animation: pulse 2s infinite;
    }
    
    .animate-spin {
      animation: spin 1s linear infinite;
    }

    /* Responsive Adjustments */
    @media (max-width: 768px) {
      .game-container {
        margin: 0;
        padding: 15px;
        max-width: 100%;
      }
    }
    
    /* Custom Game Styles */
    ${css}
  </style>
</head>
<body>
  <!-- Game container -->
  <div class="game-container animate-fade-in">
    ${html}
  </div>

  <script>
    // Game initialization and logic
    document.addEventListener('DOMContentLoaded', function() {
      // Game code
      ${script}
    });
  </script>
</body>
</html>
    `;
  }
}
