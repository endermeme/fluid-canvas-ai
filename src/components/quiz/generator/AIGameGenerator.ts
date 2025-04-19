
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
    logInfo('AIGameGenerator', `Initialized with model: ${GEMINI_MODELS.CUSTOM_GAME} on API version: ${API_VERSION}`);
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

  private sanitizeHtmlContent(htmlContent: string): string {
    // Remove any markdown code blocks
    let sanitizedContent = htmlContent.replace(/```html|```/g, '');
    
    // Ensure complete HTML structure
    if (!sanitizedContent.includes('<!DOCTYPE html>')) {
      sanitizedContent = `<!DOCTYPE html><html><head><meta charset="UTF-8"><title>Interactive Game</title></head><body>${sanitizedContent}</body></html>`;
    }
    
    // Basic HTML cleaning
    sanitizedContent = sanitizedContent.replace(/\s+/g, ' ').trim();
    
    return sanitizedContent;
  }

  /**
   * Generate an HTML game
   * @param prompt User prompt for game generation
   * @returns Promise with generated game or null
   */
  private async generateHtmlGame(prompt: string): Promise<MiniGame | null> {
    try {
      logInfo('AIGameGenerator', 'Generating HTML game', { prompt });
      
      const htmlPrompt = buildGeminiPrompt(prompt, true);
      
      const payload = {
        contents: [{
          parts: [{text: htmlPrompt}]
        }],
        generationConfig: {
          ...DEFAULT_GENERATION_SETTINGS,
          maxOutputTokens: 16384  // Increased token limit
        }
      };
      
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
      
      const result = await response.json();
      const htmlContent = result?.candidates?.[0]?.content?.parts?.[0]?.text || '';
      
      if (!htmlContent) {
        throw new Error('No content returned from API');
      }
      
      // Sanitize and clean HTML content
      const cleanedHtmlContent = this.sanitizeHtmlContent(htmlContent);
      
      // Log the full HTML to console
      console.log('%c 📄 Full HTML Content:', 'font-weight: bold; color: #6f42c1;');
      console.log(cleanedHtmlContent);
      
      // Extract game title
      let gameTitle = prompt;
      const titleMatch = cleanedHtmlContent.match(/<title>(.*?)<\/title>/i) || 
                        cleanedHtmlContent.match(/<h1[^>]*>(.*?)<\/h1>/i);
      
      if (titleMatch && titleMatch[1]) {
        gameTitle = titleMatch[1].replace(/<[^>]*>/g, '').trim();
      }
      
      const game: MiniGame = {
        title: gameTitle,
        content: cleanedHtmlContent
      };
      
      logInfo('AIGameGenerator', 'HTML game generated successfully', {
        title: gameTitle,
        contentLength: cleanedHtmlContent.length
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
