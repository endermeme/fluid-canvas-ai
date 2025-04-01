
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
  private openAIKey: string | null = null;

  constructor(apiKey: string) {
    this.genAI = new GoogleGenerativeAI(apiKey);
    this.model = this.genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
    // Try to load OpenAI key from localStorage if available
    this.openAIKey = localStorage.getItem('openai_api_key');
  }

  // Method to set OpenAI API key
  setOpenAIKey(key: string) {
    if (key && key.trim() !== '') {
      this.openAIKey = key;
      localStorage.setItem('openai_api_key', key);
      return true;
    }
    return false;
  }

  // Check if OpenAI key is configured
  hasOpenAIKey(): boolean {
    return this.openAIKey !== null && this.openAIKey !== '';
  }

  async generateMiniGame(topic: string, settings?: GameSettingsData): Promise<MiniGame | null> {
    try {
      // Step 1: Generate base game with Gemini
      const geminiResult = await this.generateWithGemini(topic, settings);
      
      // Step 2: If OpenAI key is available, enhance the code
      if (this.hasOpenAIKey() && geminiResult) {
        return await this.enhanceWithOpenAI(geminiResult, topic);
      }
      
      // If no OpenAI key, return the Gemini result
      return geminiResult;
    } catch (error) {
      console.error("Error generating mini game:", error);
      return null;
    }
  }
  
  private async generateWithGemini(topic: string, settings?: GameSettingsData): Promise<MiniGame | null> {
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
      
      3. CẤU TRÚC CODE:
         - Tổ chức code rõ ràng, chia thành các hàm/module riêng biệt
         - Sử dụng biến và hàm có tên mô tả rõ ràng
         - Thêm comment giải thích cho các phần code phức tạp
         - Xử lý đầy đủ các trường hợp lỗi người dùng
         - Đảm bảo code được tối ưu và không có bug
      
      4. TÍNH NĂNG GAME:
         - Hiển thị điểm số rõ ràng
         - Có thông báo kết quả sau mỗi câu trả lời hoặc hành động
         - Có hệ thống tính giờ nếu phù hợp với loại game
         - Hiển thị màn hình kết quả cuối game với tổng điểm và đánh giá
         - Có nút chơi lại để bắt đầu game mới
      
      5. KỸ THUẬT:
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

    try {
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
      console.error("Error generating with Gemini:", error);
      return null;
    }
  }
  
  private async enhanceWithOpenAI(geminiGame: MiniGame, topic: string): Promise<MiniGame | null> {
    if (!this.openAIKey) return geminiGame;
    
    try {
      const prompt = `
      You are a master web developer specializing in creating bug-free, interactive web games.
      
      I'm going to provide you with HTML, CSS, and JavaScript code for a mini-game on the topic of "${topic}".
      Your task is to improve this code by:
      
      1. Fixing any bugs or errors
      2. Improving functionality and user experience
      3. Optimizing code performance
      4. Ensuring all features work as intended
      5. Adding helpful comments
      6. Ensuring the game is responsive
      
      IMPORTANT: Do NOT change the fundamental game concept. Only improve what's already there.
      
      Please return the improved code in the exact same JSON format:
      
      {
        "title": "${geminiGame.title}",
        "description": "${geminiGame.description}",
        "instructionsHtml": "improved HTML instructions",
        "gameHtml": "improved HTML code",
        "gameScript": "improved JavaScript code",
        "cssStyles": "improved CSS code"
      }
      
      Here is the current code:
      
      --- HTML ---
      ${geminiGame.gameHtml}
      
      --- CSS ---
      ${geminiGame.cssStyles}
      
      --- JavaScript ---
      ${geminiGame.gameScript}
      
      --- Instructions ---
      ${geminiGame.instructionsHtml}
      `;

      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.openAIKey}`
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: [{ role: 'user', content: prompt }],
          temperature: 0.5,
          max_tokens: 4000
        })
      });

      if (!response.ok) {
        const errorData = await response.text();
        console.error("OpenAI API error:", errorData);
        return geminiGame; // Return original game if enhancement fails
      }

      const data = await response.json();
      
      if (data.choices && data.choices[0] && data.choices[0].message) {
        const content = data.choices[0].message.content;
        try {
          // Find and parse the JSON in the response
          const jsonMatch = content.match(/{[\s\S]*}/);
          if (jsonMatch) {
            const openAIResult = JSON.parse(jsonMatch[0]);
            
            // Build a new full HTML document with the enhanced code
            const fullHtmlContent = this.buildFullHtmlDocument(
              openAIResult.title || geminiGame.title,
              openAIResult.gameHtml,
              openAIResult.gameScript,
              openAIResult.cssStyles,
              openAIResult.instructionsHtml
            );
            
            return {
              title: openAIResult.title || geminiGame.title,
              description: openAIResult.description || geminiGame.description,
              content: fullHtmlContent,
              instructionsHtml: openAIResult.instructionsHtml,
              gameHtml: openAIResult.gameHtml,
              gameScript: openAIResult.gameScript,
              cssStyles: openAIResult.cssStyles
            };
          }
        } catch (error) {
          console.error("Error parsing OpenAI response:", error);
        }
      }
      
      // Return the original game if parsing fails
      return geminiGame;
    } catch (error) {
      console.error("Error enhancing with OpenAI:", error);
      return geminiGame; // Return original game if enhancement fails
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
