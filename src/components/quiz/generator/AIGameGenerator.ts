
import { MiniGame } from './types';
import { GameSettingsData } from '../types';
import { logInfo, logError } from './apiUtils';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { DEFAULT_GENERATION_SETTINGS } from '@/constants/api-constants';

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
      
      const prompt = `Tạo một minigame tương tác về chủ đề "${topic}" với cấu trúc:
      1. HTML: Chứa cấu trúc game và các thành phần UI
      2. CSS: Style cho giao diện đẹp và responsive
      3. JavaScript: Logic game và tương tác
      
      Trả về định dạng:
      \`\`\`html
      <!-- HTML content -->
      \`\`\`
      
      \`\`\`css
      /* CSS styles */
      \`\`\`
      
      \`\`\`js
      // Game logic
      \`\`\``;
      
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
      let cssContent = '';
      let jsContent = '';
      
      // Extract HTML, CSS, JS from markdown code blocks
      const htmlMatch = rawText.match(/```html\n([\s\S]*?)```/);
      const cssMatch = rawText.match(/```css\n([\s\S]*?)```/);
      const jsMatch = rawText.match(/```js(?:cript)?\n([\s\S]*?)```/);
      
      if (htmlMatch && htmlMatch[1]) {
        htmlContent = htmlMatch[1].trim();
      }
      
      if (cssMatch && cssMatch[1]) {
        cssContent = cssMatch[1].trim();
      }
      
      if (jsMatch && jsMatch[1]) {
        jsContent = jsMatch[1].trim();
      }

      // Create complete HTML document
      const fullHtml = `<!DOCTYPE html>
<html lang="vi">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Minigame: ${topic}</title>
    <style>
        * { box-sizing: border-box; }
        body { font-family: system-ui, sans-serif; margin: 0; padding: 20px; }
        .game-container { max-width: 800px; margin: 0 auto; }
        ${cssContent}
    </style>
</head>
<body>
    <div class="game-container">
        ${htmlContent}
    </div>
    <script>
        ${jsContent}
    </script>
</body>
</html>`;

      console.log("Final processed HTML:", fullHtml.substring(0, 200) + "...");

      return {
        title: `Minigame: ${topic}`,
        content: fullHtml,
        htmlContent,
        cssContent,
        jsContent,
        isSeparatedFiles: true
      };
    } catch (error) {
      logError('AIGameGenerator', 'Error parsing minigame response', error);
      return null;
    }
  }
}

export type { MiniGame };
