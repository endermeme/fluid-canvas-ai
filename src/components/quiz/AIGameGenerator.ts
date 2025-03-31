
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
        Tạo một minigame tương tác về chủ đề "${topic}" sử dụng HTML, CSS và JavaScript thuần.
        ${settingsPrompt}
        
        YÊU CẦU KỸ THUẬT QUAN TRỌNG:
        1. Trả lời của bạn PHẢI là một đối tượng JSON hợp lệ với đúng định dạng sau (không thêm/bớt trường nào):
        {
          "title": "Tên minigame",
          "description": "Mô tả ngắn về minigame",
          "instructionsHtml": "HTML hướng dẫn người chơi",
          "gameHtml": "Mã HTML của game",
          "gameScript": "Mã JavaScript của game",
          "cssStyles": "CSS cho game" 
        }
        
        2. KHÔNG bao gồm markdown, backticks (\`\`\`), hoặc bất kỳ định dạng nào khác.
        3. KHÔNG có khai báo thẻ như <html>, <head>, <body>, <script>, <style>. Chỉ bao gồm nội dung bên trong.
        4. Tất cả dấu nháy kép (") trong mã JavaScript và CSS phải được escape bằng dấu backslash (\\").
        5. Tất cả dấu nháy kép (") trong giá trị JSON phải được escape đúng cách.
        6. Sử dụng dấu nháy đơn (') trong mã HTML, CSS và JavaScript khi có thể.
        7. CSSStyles phải là một chuỗi duy nhất, không có ngắt dòng thô.
        
        THIẾT KẾ MINIGAME:
        - Giao diện đẹp với màu sắc tươi sáng, gradient, hiệu ứng trực quan
        - Tương tác tốt bằng chuột hoặc chạm
        - Hiển thị điểm số và/hoặc kết quả cuối cùng
        - Thiết kế responsive cho cả điện thoại và máy tính
        - Code đơn giản, rõ ràng và dễ hiểu
        
        ĐẢM BẢO KHÔNG CÓ LỖI CÚ PHÁP JSON VÀ HOÀN THÀNH TẤT CẢ CÁC TRƯỜNG.
      `;

      console.log("Sending request to Claude API");

      try {
        // Direct request with browser headers
        const response = await fetch('https://api.anthropic.com/v1/messages', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-api-key': this.apiKey,
            'anthropic-version': '2023-06-01',
            'anthropic-dangerous-direct-browser-access': 'true',
          },
          body: JSON.stringify({
            model: 'claude-3-sonnet-20240229',
            max_tokens: 4000,
            messages: [
              {
                role: 'user',
                content: prompt
              }
            ]
          })
        });
        
        if (!response.ok) {
          const errorData = await response.text();
          console.error("Claude API error response:", errorData);
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        console.log("Successfully received Claude API response");
        const data = await response.json();
        
        // Extract content from response
        let gameData;
        if (data.content && Array.isArray(data.content) && data.content.length > 0) {
          const contentItem = data.content.find(item => item.type === 'text');
          if (contentItem && contentItem.text) {
            gameData = contentItem.text;
          } else {
            throw new Error('Invalid Claude API response structure');
          }
        } else {
          throw new Error('Invalid Claude API response structure');
        }
        
        // Parse JSON with multiple fallback strategies
        let parsedData;
        try {
          console.log("Raw response:", gameData);
          
          // Clean up the response text to extract just the JSON
          let jsonText = gameData.trim();
            
          // Remove markdown code block indicators if present
          jsonText = jsonText.replace(/^```json\s*/gm, '').replace(/^```\s*/gm, '').replace(/```\s*$/gm, '').trim();
          
          // Find the outermost JSON object
          const jsonMatch = jsonText.match(/(\{[\s\S]*\})/);
          if (jsonMatch) {
            jsonText = jsonMatch[0];
          }
          
          // Fix common JSON issues
          const fixedJsonText = jsonText
            // Remove backticks if they exist
            .replace(/`/g, '')
            // Fix multiline strings 
            .replace(/\n/g, ' ')
            // Fix CSS properties with improper escaping
            .replace(/(\w+):\s*([^,}]+)/g, (match, prop, value) => {
              // Only process string values
              if (value.includes('"') && !value.includes('\\"')) {
                return `${prop}: "${value.replace(/"/g, '\\"').trim()}"`;
              }
              return match;
            });
          
          try {
            parsedData = JSON.parse(fixedJsonText);
            console.log("Successfully parsed JSON data");
          } catch (parseError) {
            console.error("JSON parse error:", parseError);
            
            // Handle CSS strings with template literals
            if (jsonText.includes('`')) {
              const cssMatch = jsonText.match(/"cssStyles"\s*:\s*`([^`]*)`/);
              if (cssMatch) {
                const cssContent = cssMatch[1];
                const modifiedJson = jsonText.replace(/"cssStyles"\s*:\s*`([^`]*)`/, `"cssStyles": "${cssContent.replace(/"/g, '\\"').replace(/\n/g, ' ')}"`);
                parsedData = JSON.parse(modifiedJson);
              }
            } else {
              throw parseError;
            }
          }
          
          // Validate the structure
          const requiredFields = ['title', 'description', 'gameHtml', 'gameScript', 'cssStyles'];
          for (const field of requiredFields) {
            if (!parsedData[field]) {
              throw new Error(`Thiếu trường dữ liệu bắt buộc: ${field}`);
            }
          }
          
          // Make sure instructionsHtml exists, even if empty
          if (!parsedData.instructionsHtml) {
            parsedData.instructionsHtml = '';
          }
          
        } catch (jsonError) {
          console.error("Error parsing JSON from Claude response:", jsonError);
          throw new Error('Không thể phân tích dữ liệu từ API Claude. Định dạng phản hồi không hợp lệ.');
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
      } catch (apiError) {
        console.error("Error with direct Claude API request:", apiError);
        throw apiError;
      }
    } catch (error: any) {
      console.error("Error generating mini game:", error);
      throw error;
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
    
    /* Game container */
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
    
    /* Game styles */
    ${css}
    
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
  <!-- Game instructions if provided -->
  ${instructions ? `<div class="game-container instructions-container">${instructions}</div>` : ''}
  
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
