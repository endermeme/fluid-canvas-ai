
import { MiniGame } from './types';
import { GameSettingsData } from '../types';
import { logInfo, logError } from './apiUtils';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { parseGeminiResponse } from './responseParser';
import { DEFAULT_GENERATION_SETTINGS } from '@/constants/api-constants';

export class AIGameGenerator {
  private static instance: AIGameGenerator;
  private genAI: GoogleGenerativeAI;
  private model: any;
  private canvasMode: boolean = true;

  constructor() {
    this.genAI = new GoogleGenerativeAI('AIzaSyB-X13dE3qKEURW8DxLmK56Vx3lZ1c8IfA');
    this.model = this.genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
    logInfo('AIGameGenerator', `Initialized with model: gemini-2.0-flash`);
  }

  public static getInstance(): AIGameGenerator {
    if (!AIGameGenerator.instance) {
      AIGameGenerator.instance = new AIGameGenerator();
    }
    return AIGameGenerator.instance;
  }

  public setCanvasMode(mode: boolean): void {
    this.canvasMode = mode;
    logInfo('AIGameGenerator', `Canvas mode set to: ${mode}`);
  }

  public async generateMiniGame(topic: string, settings?: GameSettingsData): Promise<MiniGame | null> {
    try {
      logInfo('AIGameGenerator', 'Starting game generation', { topic, settings });
      
      const prompt = `Tạo một minigame tương tác về chủ đề "${topic}" với cấu trúc HTML, CSS và JavaScript. 
      Yêu cầu:
      
      1. HTML phải có cấu trúc rõ ràng và các thành phần UI được đặt tên class hợp lý
      2. CSS phải responsive và có animation đẹp mắt
      3. JavaScript phải xử lý tương tác người dùng mượt mà
      ${this.canvasMode ? '\n4. Sử dụng Canvas HTML5 để tạo đồ họa đẹp mắt và tương tác.' : ''}
      
      Trả về mã nguồn theo định dạng sau (không bao gồm backticks và tên ngôn ngữ):
      
      ```html
      <!-- Code HTML ở đây, không bao gồm thẻ DOCTYPE và html -->
      ```
      
      ```css
      /* Code CSS ở đây, không bao gồm thẻ style */
      ```
      
      ```javascript
      // Code JavaScript ở đây, không bao gồm thẻ script
      ````;
      
      console.log("Sending prompt to Gemini:", prompt);
      
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      console.log("Raw response from Gemini:", text.substring(0, 200) + "...");
      
      // Use the parseGeminiResponse function to handle the response
      return parseGeminiResponse(text, topic);
    } catch (error) {
      logError('AIGameGenerator', 'Error generating minigame', error);
      return null;
    }
  }
}

