
import { MiniGame } from './types';
import { GameSettingsData } from '../types';
import { logInfo, logError, logSuccess } from './apiUtils';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { processGeminiHtml } from './direct-html-parser';
import { buildGeminiPrompt } from './promptBuilder';

export class AIGameGenerator {
  private static instance: AIGameGenerator;
  private genAI: GoogleGenerativeAI;
  private model: any;
  private canvasMode: boolean = true;

  constructor() {
    this.genAI = new GoogleGenerativeAI('AIzaSyB-X13dE3qKEURW8DxLmK56Vx3lZ1c8IfA');
    this.model = this.genAI.getGenerativeModel({ model: "gemini-2.5-pro-preview-03-25" });
    logInfo('AIGameGenerator', 'Initialized with Gemini API');
  }

  public static getInstance(): AIGameGenerator {
    if (!AIGameGenerator.instance) {
      AIGameGenerator.instance = new AIGameGenerator();
    }
    return AIGameGenerator.instance;
  }

  public setCanvasMode(enabled: boolean): void {
    this.canvasMode = enabled;
    logInfo('AIGameGenerator', `Canvas mode ${enabled ? 'enabled' : 'disabled'}`);
  }

  public async generateMiniGame(topic: string, settings?: GameSettingsData): Promise<MiniGame | null> {
    try {
      logInfo('AIGameGenerator', `Generating game for topic: ${topic}`);
      
      // Include canvas mode in the prompt building
      const prompt = buildGeminiPrompt(topic, this.canvasMode);
      const result = await this.model.generateContent(prompt);
      const response = result.response.text();
      
      logInfo('Gemini', 'Successfully received response');
      
      // Process the HTML response directly
      const processedGame = processGeminiHtml(response);
      
      if (!processedGame || !processedGame.content) {
        throw new Error('Invalid game content received from Gemini');
      }
      
      logSuccess('AIGameGenerator', `Successfully generated game for: ${topic}`);
      
      return {
        title: processedGame.title || `Game about ${topic}`,
        description: processedGame.description || `Interactive game about ${topic}`,
        content: processedGame.content
      };
    } catch (error) {
      logError('AIGameGenerator', `Error generating game: ${error instanceof Error ? error.message : String(error)}`);
      return this.createErrorResponse(topic, String(error));
    }
  }
  
  private createErrorResponse(topic: string, errorMessage: string): MiniGame {
    const errorHtml = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Error: ${topic}</title>
  <style>
    body {
      font-family: system-ui, sans-serif;
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
    <p>Sorry, there was a problem creating your game about "${topic}"</p>
    <p>Error: ${errorMessage}</p>
    <p>Please try again or check the console for more details.</p>
  </div>
</body>
</html>`;
    
    return {
      title: `Error: ${topic}`,
      description: "Error generating content",
      content: errorHtml
    };
  }
}

export type { MiniGame };
