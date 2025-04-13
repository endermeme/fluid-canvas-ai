
import { MiniGame } from './types';
import { GameSettingsData } from '../types';
import { buildGeminiPrompt } from './promptBuilder';
import { logInfo, logError } from './apiUtils';
import { 
  GEMINI_MODELS, 
  API_VERSION, 
  getApiEndpoint,
  DEFAULT_GENERATION_SETTINGS
} from '@/constants/api-constants';

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
    logInfo('AIGameGenerator', `Initialized with model: ${GEMINI_MODELS.DEFAULT} on API version: ${API_VERSION}`);
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
      const htmlGame = await this.generateHtmlGame(topic);
      return htmlGame;
    } catch (error) {
      logError('AIGameGenerator', 'Error generating minigame', error);
      throw error;
    }
  }

  /**
   * Generate an HTML game
   * @param prompt User prompt for game generation
   * @returns Promise with generated game or null
   */
  private async generateHtmlGame(prompt: string): Promise<MiniGame | null> {
    try {
      logInfo('AIGameGenerator', 'Generating HTML game', { prompt });
      
      // Build a simplified prompt for HTML game generation
      const htmlPrompt = buildGeminiPrompt(prompt, this.useCanvas);
      
      // Log API request details for debugging
      console.log('User request prompt:', prompt);
      console.log('Using model:', GEMINI_MODELS.DEFAULT);
      console.log('API endpoint:', getApiEndpoint());
      
      // Create payload
      const payload = {
        contents: [{
          parts: [{text: htmlPrompt}]
        }],
        generationConfig: DEFAULT_GENERATION_SETTINGS
      };
      
      // Make API call
      const response = await fetch(getApiEndpoint(), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`API request failed: ${response.status} ${response.statusText} - ${errorText}`);
      }
      
      // Parse response
      const result = await response.json();
      const htmlContent = result?.candidates?.[0]?.content?.parts?.[0]?.text || '';
      
      if (!htmlContent) {
        throw new Error('No content returned from API');
      }
      
      // Extract a title from the HTML (first h1 or title tag)
      let gameTitle = prompt;
      const titleMatch = htmlContent.match(/<title>(.*?)<\/title>/i) || 
                        htmlContent.match(/<h1[^>]*>(.*?)<\/h1>/i);
      
      if (titleMatch && titleMatch[1]) {
        gameTitle = titleMatch[1].replace(/<[^>]*>/g, '').trim(); // Remove any HTML tags inside the title
      }
      
      // Create the game object
      const game: MiniGame = {
        title: gameTitle,
        content: htmlContent
      };
      
      logInfo('AIGameGenerator', 'HTML game generated successfully', {
        title: gameTitle,
        contentLength: htmlContent.length
      });
      
      return game;
    } catch (error) {
      logError('AIGameGenerator', 'Error generating HTML game', error);
      return null;
    }
  }
}

// Export MiniGame type
export type { MiniGame };
