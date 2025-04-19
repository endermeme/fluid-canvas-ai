
import { GoogleGenerativeAI } from '@google/generative-ai';
import { MiniGame, GameSettingsData } from './types';
import { parseGeminiResponse } from './responseParser';
import { tryGeminiGeneration } from './geminiGenerator';
import { GEMINI_API_KEY, GEMINI_MODELS } from '@/constants/api-constants';

/**
 * Lớp sinh trò chơi dùng AI
 * Được cải tiến để sử dụng mô hình Singleton
 */
export class AIGameGenerator {
  private static instance: AIGameGenerator;
  private genAI: GoogleGenerativeAI;
  private model: any;
  private canvasMode: boolean = true;
  
  /**
   * Phương thức tạo instance duy nhất của lớp
   */
  public static getInstance(): AIGameGenerator {
    if (!AIGameGenerator.instance) {
      AIGameGenerator.instance = new AIGameGenerator();
    }
    return AIGameGenerator.instance;
  }
  
  /**
   * Constructor - chỉ được gọi từ bên trong
   */
  private constructor() {
    this.genAI = new GoogleGenerativeAI(GEMINI_API_KEY || '');
    this.model = this.genAI.getGenerativeModel({ model: GEMINI_MODELS.CUSTOM_GAME });
    console.log(`AIGameGenerator initialized with model: ${GEMINI_MODELS.CUSTOM_GAME}`);
  }
  
  /**
   * Chế độ canvas (sử dụng canvas để tạo game)
   */
  setCanvasMode(enabled: boolean): void {
    this.canvasMode = enabled;
    console.log(`Canvas mode set to: ${enabled}`);
  }
  
  /**
   * Tạo minigame từ chủ đề và cấu hình
   */
  async generateMiniGame(topic: string, settings?: GameSettingsData): Promise<MiniGame | null> {
    try {
      console.log(`Generating mini-game for topic: ${topic}`);
      console.log(`Using canvas mode: ${this.canvasMode}`);
      
      // Sử dụng trực tiếp tryGeminiGeneration từ geminiGenerator.ts
      const game = await tryGeminiGeneration(
        this.model, 
        topic, 
        {
          ...settings,
          useCanvas: this.canvasMode
        }
      );
      
      return game;
    } catch (error) {
      console.error(`Error generating mini-game:`, error);
      return this.createErrorResponse(topic, `Error generating game about "${topic}"`);
    }
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

// Export interface MiniGame từ file này để tương thích với code cũ
export { MiniGame } from './types';

// Duy trì khả năng tương thích với API cũ
export default AIGameGenerator;
