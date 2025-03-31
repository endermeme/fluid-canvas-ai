
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
      // Check if API key is configured properly
      if (!this.apiKey || this.apiKey === 'replace-with-default-key' || this.apiKey === 'your-default-key') {
        throw new Error('API key not configured. Please configure your Claude API key first.');
      }

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
        Đảm bảo JSON được trả về là hợp lệ và có thể phân tích được.
      `;

      console.log("Sending request through proxy with key: " + this.apiKey.substring(0, 4) + "****");

      try {
        // Use our proxy endpoint with native fetch
        const response = await fetch('/api/claude-proxy', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            prompt,
            apiKey: this.apiKey
          })
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
        }

        console.log("Received response from proxy");
        const responseData = await response.json();
        
        if (responseData.error) {
          throw new Error(responseData.error);
        }

        // Extract content from response
        const gameData = responseData.content;
        console.log("Parsing response content:", typeof gameData, gameData?.slice(0, 100) + "...");
        
        // Try to parse the JSON response
        let parsedData;
        try {
          // Check if the response is already a parsed object
          if (typeof gameData === 'object' && gameData !== null) {
            parsedData = gameData;
          } else {
            // Handle the case where the API returned text instead of JSON
            // Try to extract JSON from text by finding outermost { and }
            const jsonMatch = gameData.match(/\{[\s\S]*\}/);
            if (jsonMatch) {
              parsedData = JSON.parse(jsonMatch[0]);
            } else {
              parsedData = JSON.parse(gameData);
            }
          }
          
          console.log("Successfully parsed game data");
        } catch (jsonError) {
          console.error("Error parsing JSON from Claude response:", jsonError);
          console.error("Raw response was:", gameData);
          throw new Error('Không thể phân tích dữ liệu từ API Claude. Định dạng phản hồi không hợp lệ.');
        }
        
        // Validate the required fields
        const requiredFields = ['title', 'description', 'gameHtml', 'gameScript', 'cssStyles'];
        for (const field of requiredFields) {
          if (!parsedData[field]) {
            throw new Error(`Thiếu trường dữ liệu bắt buộc: ${field}`);
          }
        }
        
        // Build a full HTML document from the parts
        const fullHtmlContent = this.buildFullHtmlDocument(
          parsedData.title,
          parsedData.gameHtml,
          parsedData.gameScript,
          parsedData.cssStyles,
          parsedData.instructionsHtml || ''
        );
        
        return {
          title: parsedData.title,
          description: parsedData.description,
          content: fullHtmlContent,
          instructionsHtml: parsedData.instructionsHtml || '',
          gameHtml: parsedData.gameHtml,
          gameScript: parsedData.gameScript,
          cssStyles: parsedData.cssStyles
        };
      } catch (fetchError) {
        console.error("Error fetching from Claude API:", fetchError);
        
        // Handle specific fetch errors
        if (fetchError.message.includes('404')) {
          throw new Error('Lỗi kết nối: CORS proxy không tìm thấy (404). Vui lòng thử lại sau.');
        } else if (fetchError.message.includes('429')) {
          throw new Error('Đã vượt quá giới hạn API. Vui lòng thử lại sau.');
        } else {
          throw new Error(`Lỗi kết nối tới Claude API: ${fetchError.message}`);
        }
      }
    } catch (error: any) {
      console.error("Error generating mini game:", error);
      
      // More specific error messages based on error type
      if (error.message.includes('404')) {
        throw new Error('CORS proxy không tìm thấy (404). Vui lòng thử proxy khác hoặc thử lại sau.');
      } else if (error.message.includes('CORS')) {
        throw new Error('Lỗi CORS: Không thể truy cập Claude API. Proxy CORS đang được sử dụng nhưng có thể bị giới hạn truy cập.');
      } else if (error.message.includes('API key')) {
        throw new Error('API key không hợp lệ. Vui lòng kiểm tra lại API key Claude của bạn.');
      } else if (error.message.includes('phân tích') || error.message.includes('parse')) {
        throw new Error('Không thể xử lý dữ liệu từ Claude API. Vui lòng thử lại với chủ đề khác.');
      } else {
        throw new Error(`Lỗi khi tạo minigame: ${error.message}`);
      }
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
