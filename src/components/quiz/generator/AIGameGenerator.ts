
import { GoogleGenerativeAI } from '@google/generative-ai';
import { MiniGame } from './types';
import { GameSettingsData } from '../types';
import { generateWithGemini, tryGeminiGeneration } from './geminiGenerator';
import { logInfo, logError } from './apiUtils';
import { GEMINI_API_KEY, GEMINI_MODELS, API_VERSION, API_BASE_URL } from '@/constants/api-constants';

/**
 * API client for generating minigames with AI
 */
export class AIGameGenerator {
  private static instance: AIGameGenerator;
  private genAI: GoogleGenerativeAI;
  private model: any;
  private useCanvas: boolean = false;

  /**
   * Create a new AIGameGenerator
   * @param apiKey Google API key for Gemini
   */
  constructor(apiKey: string = GEMINI_API_KEY) {
    // Initialize GoogleGenerativeAI with only the API key
    this.genAI = new GoogleGenerativeAI(apiKey);
    
    // Configure the model with the correct API version and base URL
    this.model = this.genAI.getGenerativeModel({ 
      model: GEMINI_MODELS.DEFAULT,
      apiVersion: API_VERSION,
      generationConfig: {
        apiEndpoint: API_BASE_URL
      }
    });
    
    logInfo('AIGameGenerator', `Initialized with model: ${GEMINI_MODELS.DEFAULT} on API version: ${API_VERSION}`);
  }

  /**
   * Get the singleton instance of AIGameGenerator
   * @param apiKey Google API key for Gemini
   * @returns AIGameGenerator instance
   */
  public static getInstance(apiKey: string = GEMINI_API_KEY): AIGameGenerator {
    if (!AIGameGenerator.instance) {
      AIGameGenerator.instance = new AIGameGenerator(apiKey);
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
      // Get custom HTML/JS/CSS game content
      const htmlGame = await this.generateCustomHtmlGame(topic, settings);
      
      if (htmlGame) {
        return htmlGame;
      }
      
      // If no custom game, try normal minigame generation
      return await tryGeminiGeneration(this.model, topic, settings);
    } catch (error) {
      logError('AIGameGenerator', 'Error generating minigame', error);
      throw error;
    }
  }

  /**
   * Generate a custom HTML game with JavaScript and CSS
   * @param prompt User prompt for game generation
   * @param settings Optional game settings
   * @returns Promise with generated game or null
   */
  private async generateCustomHtmlGame(prompt: string, settings?: GameSettingsData): Promise<MiniGame | null> {
    try {
      logInfo('AIGameGenerator', 'Generating custom HTML game', { prompt });
      
      // Build a prompt specifically for HTML/CSS/JS game generation
      const htmlPrompt = `
Create an interactive HTML game based on this prompt: "${prompt}"

Your response must be valid, self-contained HTML that includes CSS and JavaScript.
Include all required styles and scripts inline in the HTML.
Make sure the game is completely playable and visually appealing.
Use modern CSS and JavaScript features.
Make sure to handle errors gracefully.
Make the game responsive for different screen sizes.
Do not reference external files or CDNs.

IMPORTANT REQUIREMENTS:
1. The entire game must be contained within a single HTML file.
2. Add comments explaining any complex parts of your code.
3. Include a title and simple instructions for the game.
4. Include scoring or progress tracking if applicable.
5. Make sure all variables are properly scoped to avoid global conflicts.
6. Handle edge cases and errors gracefully.
7. Your HTML file should start with <!DOCTYPE html> and be fully functional.
8. Add fallbacks for unsupported features.

RESPOND ONLY WITH THE HTML CODE. NO EXPLANATIONS OR MARKDOWN FORMATTING.
`;

      // Generate the game content with Gemini
      const result = await this.model.generateContent(htmlPrompt);
      const response = await result.response;
      const htmlContent = response.text();
      
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
      
      logInfo('AIGameGenerator', 'Custom HTML game generated successfully', {
        title: gameTitle,
        contentLength: htmlContent.length
      });
      
      return game;
    } catch (error) {
      logError('AIGameGenerator', 'Error generating custom HTML game', error);
      return null;
    }
  }
}

// Export MiniGame type
export type { MiniGame };
