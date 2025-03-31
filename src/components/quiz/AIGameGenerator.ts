
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
        Hãy tạo một minigame tương tác học tập về chủ đề "${topic}" bằng HTML, CSS và JavaScript thuần.
        ${settingsPrompt}
        
        Yêu cầu:
        1. Giao diện có màu sắc tươi sáng, gradient, hiệu ứng trực quan
        2. Tương tác tốt bằng chuột hoặc chạm
        3. Hiển thị điểm số và/hoặc kết quả cuối cùng
        4. Bố cục responsive cho cả điện thoại và máy tính
        5. Code rõ ràng, dễ hiểu với chức năng game đơn giản
        
        HƯỚNG DẪN KỸ THUẬT QUAN TRỌNG:
        - Chỉ trả về JSON hợp lệ, không có markdown, không có mở đầu hoặc kết thúc
        - KHÔNG sử dụng dấu backtick (\`) trong JSON của bạn
        - KHÔNG sử dụng cú pháp markdown như \`\`\`json ... \`\`\`
        - Bất kỳ dấu nháy kép (") trong CSS, HTML, hoặc JavaScript PHẢI được escape bằng dấu backslash (\\")
        - Sử dụng dấu nháy đơn (') thay vì dấu nháy kép trong code CSS, HTML và JavaScript khi có thể
        - String CSS phải được định dạng với đúng cú pháp, không có kí tự ngắt dòng thô
        - Tất cả các thuộc tính phải chính xác như mẫu dưới đây
        
        CẤU TRÚC JSON BẮT BUỘC (không thêm/bớt trường nào):
        {
          "title": "Tên minigame",
          "description": "Mô tả ngắn về minigame",
          "instructionsHtml": "HTML hướng dẫn chơi game (có thể để trống)",
          "gameHtml": "Mã HTML của game (không bao gồm thẻ html, head, body)",
          "gameScript": "Mã JavaScript của game (không bao gồm thẻ script)",
          "cssStyles": "CSS cho game (không bao gồm thẻ style)"
        }
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
        
        // Safely extract and parse the JSON
        let parsedData;
        try {
          // First try to handle if it's already a parsed object
          if (typeof gameData === 'object' && gameData !== null) {
            parsedData = gameData;
          } else {
            // Clean up the response text to extract just the JSON
            let jsonText = gameData.trim();
            
            // Remove markdown code block indicators if present
            jsonText = jsonText.replace(/^```json\s*/gm, '').replace(/^```\s*/gm, '').replace(/```\s*$/gm, '').trim();
            
            // Find the outermost JSON object
            const jsonMatch = jsonText.match(/(\{[\s\S]*\})/);
            if (jsonMatch) {
              jsonText = jsonMatch[0];
            }
            
            // Create a safe version of the JSON content by properly handling multiline strings and backticks
            jsonText = jsonText
              .replace(/`([\s\S]*?)`/g, function(_, p1) {
                return JSON.stringify(p1).slice(1, -1);
              })
              // Fix CSS multiline strings by removing newlines
              .replace(/("cssStyles"\s*:\s*")([^"]*)(")/gs, function(_, start, cssContent, end) {
                const fixedCss = cssContent
                  .replace(/\n/g, ' ')
                  .replace(/\s+/g, ' ')
                  .replace(/\\"/g, "'")  // Replace escaped quotes with single quotes in CSS
                  .trim();
                return start + fixedCss + end;
              });

            try {
              // First attempt to parse
              parsedData = JSON.parse(jsonText);
            } catch (parseError) {
              console.error("First JSON parse attempt failed:", parseError);
              console.error("Raw response was:", gameData);
              
              // If parsing fails due to issues with CSS multi-line strings or escaping
              // Try a more aggressive approach
              const getBetweenBraces = (str: string) => {
                const start = str.indexOf('{');
                let open = 0;
                let end = start;
                
                for (let i = start; i < str.length; i++) {
                  if (str[i] === '{') open++;
                  if (str[i] === '}') open--;
                  
                  if (open === 0) {
                    end = i + 1;
                    break;
                  }
                }
                
                return str.substring(start, end);
              };
              
              // Extract the outermost JSON object more aggressively
              const jsonObject = getBetweenBraces(jsonText);
              
              // Try to manually reconstruct the JSON
              try {
                // Create a structured object manually
                const titleMatch = /\"title\":\s*\"([^\"]+)\"/i.exec(jsonObject);
                const descriptionMatch = /\"description\":\s*\"([^\"]+)\"/i.exec(jsonObject);
                const instructionsHtmlMatch = /\"instructionsHtml\":\s*\"(.*?)\"/is.exec(jsonObject);
                const gameHtmlMatch = /\"gameHtml\":\s*\"(.*?)\",\s*\"gameScript\"/is.exec(jsonObject);
                const gameScriptMatch = /\"gameScript\":\s*\"(.*?)\",\s*\"cssStyles\"/is.exec(jsonObject);
                const cssStylesMatch = /\"cssStyles\":\s*\"(.*?)\"\s*\}/is.exec(jsonObject);
                
                if (titleMatch && descriptionMatch && gameHtmlMatch && gameScriptMatch && cssStylesMatch) {
                  parsedData = {
                    title: titleMatch[1],
                    description: descriptionMatch[1],
                    instructionsHtml: instructionsHtmlMatch ? instructionsHtmlMatch[1] : "",
                    gameHtml: gameHtmlMatch[1].replace(/\\n/g, '\n').replace(/\\"/g, '"'),
                    gameScript: gameScriptMatch[1].replace(/\\n/g, '\n').replace(/\\"/g, '"'),
                    cssStyles: cssStylesMatch[1].replace(/\\n/g, '\n').replace(/\\"/g, '"')
                  };
                } else {
                  throw new Error("Couldn't extract all required fields from JSON");
                }
              } catch (manualParseError) {
                console.error("Manual JSON extraction failed:", manualParseError);
                
                // Last resort approach - try fixing common JSON issues
                jsonText = jsonText
                  // Replace escaped backticks with actual backticks
                  .replace(/\\`/g, '`')
                  // Fix unclosed quotes
                  .replace(/([^\\])"([^"]*)\n/g, '$1"$2\\n"')
                  // Clean up extra backticks
                  .replace(/`/g, '')
                  // Remove or fix invalid control characters
                  .replace(/[\x00-\x1F\x7F]/g, ' ');
                
                parsedData = JSON.parse(jsonText);
              }
            }
          }
          
          console.log("Successfully parsed game data");
          
          // Validate the structure
          const requiredFields = ['title', 'description', 'gameHtml', 'gameScript', 'cssStyles'];
          for (const field of requiredFields) {
            if (!parsedData[field]) {
              console.error(`Missing required field: ${field}`);
              throw new Error(`Thiếu trường dữ liệu bắt buộc: ${field}`);
            }
          }
          
        } catch (jsonError) {
          console.error("Error parsing JSON from Claude response:", jsonError);
          console.error("Raw response was:", gameData);
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
        
        // Handle specific API errors
        if (apiError.message.includes('401')) {
          throw new Error('API key không hợp lệ hoặc đã hết hạn. Vui lòng kiểm tra lại API key.');
        } else if (apiError.message.includes('429')) {
          throw new Error('Đã vượt quá giới hạn API. Vui lòng thử lại sau.');
        } else if (apiError.message.includes('CORS') || apiError.message.includes('NetworkError')) {
          throw new Error('CORS error: Claude API không cho phép truy cập trực tiếp từ trình duyệt. Vui lòng kiểm tra cài đặt API của bạn.');
        } else {
          throw new Error(`Lỗi kết nối tới Claude API: ${apiError.message}`);
        }
      }
    } catch (error: any) {
      console.error("Error generating mini game:", error);
      
      // More specific error messages based on error type
      if (error.message.includes('API key')) {
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
