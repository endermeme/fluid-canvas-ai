/**
 * Hướng dẫn cập nhật file AIGameGenerator.ts
 * 
 * File này chỉ để minh họa những phần cần sửa trong file AIGameGenerator.ts thật
 */

import { GoogleGenerativeAI } from '@google/generative-ai';
// Import parser HTML trực tiếp mới
import { processGeminiHtml } from './direct-html-parser';
// Giữ lại import parser cũ để backwards compatibility nếu cần
import { parseGeminiResponse } from './responseParser';

import { MiniGame, GameSettingsData } from './types';

class AIGameGenerator {
  private genAI: GoogleGenerativeAI;
  private model: any;
  
  constructor() {
    this.genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');
    this.model = this.genAI.getGenerativeModel({ model: "gemini-2.5-pro-preview-03-25" });
  }
  
  async generateMiniGame(topic: string, settings?: GameSettingsData): Promise<MiniGame | null> {
    try {
      console.log(`Generating mini-game for topic: ${topic}`);
      
      // Phần tạo prompt và gọi API Gemini giữ nguyên
      const prompt = this.createPrompt(topic, settings);
      
      const result = await this.model.generateContent(prompt);
      const geminiResponse = result.response.text();
      
      console.log(`Received response from Gemini API`);
      
      // THAY ĐỔI Ở ĐÂY: 
      // Sử dụng parser mới để xử lý trực tiếp mà không tách file
      // Thay vì dùng:
      // const miniGame = parseGeminiResponse(geminiResponse, topic);
      
      // Sử dụng:
      const miniGame = processGeminiHtml(geminiResponse);
      
      // Đảm bảo title hợp lệ
      if (!miniGame.title || miniGame.title === 'Generated Game') {
        miniGame.title = topic;
      }
      
      // Đảm bảo description hợp lệ
      if (!miniGame.description) {
        miniGame.description = `Interactive game about ${topic}`;
      }
      
      console.log(`Successfully parsed and processed game content`);
      return miniGame;
    } catch (error) {
      console.error(`Error generating mini-game:`, error);
      return this.createErrorResponse(topic, `Error generating game about "${topic}"`);
    }
  }
  
  /**
   * Tạo prompt cho API Gemini - giữ nguyên phần này
   */
  private createPrompt(topic: string, settings?: GameSettingsData): string {
    // Giữ nguyên phần tạo prompt
    return `Create an interactive HTML5 game about ${topic}...`;
  }
  
  /**
   * Tạo response lỗi
   */
  private createErrorResponse(topic: string, errorMessage: string): MiniGame {
    const errorHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Error: ${topic}</title>
        <style>
          body {
            font-family: sans-serif;
            max-width: 600px;
            margin: 50px auto;
            padding: 20px;
            text-align: center;
            color: #333;
          }
          .error-container {
            background-color: #fee2e2;
            border: 1px solid #ef4444;
            border-radius: 8px;
            padding: 20px;
          }
          h1 { color: #b91c1c; }
        </style>
      </head>
      <body>
        <div class="error-container">
          <h1>Error Generating Game</h1>
          <p>${errorMessage}</p>
          <p>Please try again or check the console for more details.</p>
        </div>
      </body>
      </html>
    `;
    
    return {
      title: `Error: ${topic}`,
      description: "Error generating content",
      content: errorHtml,
      isSeparatedFiles: false
    };
  }
}

/**
 * HƯỚNG DẪN TÍCH HỢP
 * 
 * 1. Tạo file direct-html-parser.ts dựa trên code mẫu đã cung cấp
 * 
 * 2. Import processGeminiHtml từ file direct-html-parser.ts
 * 
 * 3. Thay đổi phương thức generateMiniGame để sử dụng processGeminiHtml
 *    thay vì parseGeminiResponse
 * 
 * 4. Đảm bảo các trường trong MiniGame (title, description, v.v.) được gán đúng
 * 
 * 5. Có thể giữ lại parseGeminiResponse như một fallback nếu cần
 */

export default AIGameGenerator; 