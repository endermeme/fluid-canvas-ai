
import { MiniGame } from './types';
import { GameSettingsData } from '../types';
import { logInfo, logError } from './apiUtils';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { DEFAULT_GENERATION_SETTINGS } from '@/constants/api-constants';

/**
 * API client for generating minigames with AI
 */
export class AIGameGenerator {
  private static instance: AIGameGenerator;
  private genAI: GoogleGenerativeAI;
  private model: any;

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

  public async generateMiniGame(topic: string, settings?: GameSettingsData): Promise<MiniGame | null> {
    try {
      logInfo('AIGameGenerator', 'Starting game generation', { topic, settings });
      
      const prompt = `Tạo một minigame tương tác về chủ đề "${topic}" với HTML, CSS và JavaScript đầy đủ. Game phải có giao diện đẹp, responsive và tương tác tốt với người dùng.`;
      
      console.log("Sending prompt to Gemini:", prompt);
      
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      console.log("Raw response from Gemini:", text.substring(0, 200) + "...");
      
      return this.parseMiniGameResponse(text, topic);
    } catch (error) {
      logError('AIGameGenerator', 'Error generating minigame', error);
      return null;
    }
  }

  private parseMiniGameResponse(rawText: string, topic: string): MiniGame | null {
    try {
      let htmlContent = '';
      
      // Try to extract HTML from markdown code block
      const htmlMatch = rawText.match(/```html([\s\S]*?)```/);
      
      if (htmlMatch && htmlMatch[1]) {
        htmlContent = htmlMatch[1].trim();
      } else if (!rawText.includes('```')) {
        htmlContent = rawText.trim();
      }
      
      if (!htmlContent) {
        logError('AIGameGenerator', 'No valid HTML content found');
        return null;
      }

      // Add default CSS if not present
      if (!htmlContent.includes('<style>')) {
        htmlContent = htmlContent.replace('</head>', `
  <style>
    * { box-sizing: border-box; }
    body { font-family: system-ui, sans-serif; margin: 0; padding: 20px; }
    .game-container { max-width: 800px; margin: 0 auto; }
  </style>
</head>`);
      }

      // Add viewport meta if not present
      if (!htmlContent.includes('viewport')) {
        htmlContent = htmlContent.replace('<head>', `<head>
  <meta name="viewport" content="width=device-width, initial-scale=1.0">`);
      }

      // Ensure DOCTYPE and basic HTML structure
      if (!htmlContent.includes('<!DOCTYPE')) {
        htmlContent = `<!DOCTYPE html>
<html lang="vi">
<head>
    <meta charset="UTF-8">
    <title>Minigame: ${topic}</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
        * { box-sizing: border-box; }
        body { font-family: system-ui, sans-serif; margin: 0; padding: 20px; }
        .game-container { max-width: 800px; margin: 0 auto; }
    </style>
</head>
<body>
    <div class="game-container">
        ${htmlContent}
    </div>
</body>
</html>`;
      }

      console.log("Final processed HTML:", htmlContent.substring(0, 200) + "...");

      return {
        title: `Minigame: ${topic}`,
        content: htmlContent
      };
    } catch (error) {
      logError('AIGameGenerator', 'Error parsing minigame response', error);
      return null;
    }
  }
}

export type { MiniGame };
