
import { MiniGame } from './types';
import { GameSettingsData } from '../types';
import { logInfo, logError } from './apiUtils';

/**
 * API client for generating minigames with AI
 */
export class AIGameGenerator {
  private static instance: AIGameGenerator;
  private useCanvas: boolean = false;

  /**
   * Create a new AIGameGenerator
   */
  constructor() {
    logInfo('AIGameGenerator', 'Initialized AIGameGenerator');
  }

  /**
   * Get the singleton instance of AIGameGenerator
   * @returns AIGameGenerator instance
   */
  public static getInstance(): AIGameGenerator {
    if (!AIGameGenerator.instance) {
      AIGameGenerator.instance = new AIGameGenerator();
    }
    return AIGameGenerator.instance;
  }

  /**
   * Set canvas mode for HTML game generation
   * @param useCanvas Whether to use canvas mode
   */
  public setCanvasMode(useCanvas: boolean): void {
    this.useCanvas = useCanvas;
    logInfo('AIGameGenerator', `Canvas mode ${useCanvas ? 'enabled' : 'disabled'}`);
  }

  /**
   * Generate a minigame based on a topic
   * @param topic Topic to generate game for
   * @param settings Optional game settings
   * @returns Promise with generated game or null
   */
  public async generateMiniGame(topic: string, settings?: GameSettingsData): Promise<MiniGame | null> {
    try {
      // Create a simple placeholder game since Gemini functionality is removed
      const placeholderGame: MiniGame = {
        title: `Game: ${topic}`,
        content: this.createPlaceholderGame(topic),
        htmlContent: `<div id="game-container"><h1>Game: ${topic}</h1><p>This is a placeholder game.</p></div>`,
        cssContent: `body { font-family: system-ui, sans-serif; } #game-container { max-width: 800px; margin: 0 auto; text-align: center; }`,
        jsContent: `console.log('Placeholder game loaded');`,
        isSeparatedFiles: true
      };
      
      return placeholderGame;
    } catch (error) {
      logError('AIGameGenerator', 'Error generating minigame', error);
      throw error;
    }
  }

  private createPlaceholderGame(topic: string): string {
    return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Game: ${topic}</title>
      <style>
        body {
          font-family: system-ui, -apple-system, BlinkMacSystemFont, sans-serif;
          max-width: 800px;
          margin: 50px auto;
          padding: 20px;
          text-align: center;
          color: #333;
        }
        .game-container {
          background-color: #f8fafc;
          border-radius: 12px;
          padding: 32px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }
        h1 { color: #4f46e5; margin-bottom: 16px; }
        button {
          background-color: #4f46e5;
          color: white;
          border: none;
          padding: 10px 20px;
          border-radius: 6px;
          cursor: pointer;
          font-size: 16px;
          margin: 10px 5px;
        }
        button:hover { background-color: #4338ca; }
      </style>
    </head>
    <body>
      <div class="game-container">
        <h1>Game: ${topic}</h1>
        <p>This is a placeholder game since the AI game generation has been removed.</p>
        <button onclick="alert('Game functionality removed')">Play</button>
      </div>
      <script>
        console.log('Placeholder game loaded');
      </script>
    </body>
    </html>
    `;
  }
}

// Export MiniGame type
export type { MiniGame };
