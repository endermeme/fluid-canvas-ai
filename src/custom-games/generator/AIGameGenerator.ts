
/**
 * AI Game Generator Singleton
 */
import { callGeminiAPI, getTextFromGeminiResponse } from '../../core/utils/api';
import { GEMINI_MODELS } from '../../core/utils/constants';
import { GameSettingsData, MiniGame } from '../../types/game';
import { parseGeminiResponse } from './responseParser';
import { generateGamePrompt } from './promptTemplates';
import { createFallbackGame } from './fallbackGames';

export class AIGameGenerator {
  private static instance: AIGameGenerator;
  private modelName: string;
  private canvasMode: boolean;

  private constructor(modelName: string = GEMINI_MODELS.CUSTOM_GAME) {
    this.modelName = modelName;
    this.canvasMode = false;
    console.log(`AIGameGenerator initialized with model: ${this.modelName}`);
  }

  public static getInstance(): AIGameGenerator {
    if (!AIGameGenerator.instance) {
      AIGameGenerator.instance = new AIGameGenerator();
    }
    return AIGameGenerator.instance;
  }

  public setModel(modelName: string): void {
    this.modelName = modelName;
    console.log(`AIGameGenerator model updated to: ${this.modelName}`);
  }

  public setCanvasMode(enabled: boolean): void {
    this.canvasMode = enabled;
  }

  public async generateMiniGame(topic: string, settings: GameSettingsData): Promise<MiniGame | null> {
    try {
      console.log(`Generating minigame for topic: "${topic}" with model: ${this.modelName}`);
      
      // Create prompt based on settings
      const prompt = generateGamePrompt(topic, settings, this.canvasMode);
      
      // Call Gemini API
      const response = await callGeminiAPI(prompt, this.modelName);
      const text = getTextFromGeminiResponse(response);
      
      if (!text) {
        console.error('Empty response from Gemini');
        throw new Error('Empty response from Gemini AI');
      }
      
      // Parse response into MiniGame
      const miniGame = parseGeminiResponse(text);
      
      if (miniGame) {
        console.log(`Successfully generated minigame: ${miniGame.title}`);
        return miniGame;
      } else {
        throw new Error('Failed to parse Gemini response');
      }
    } catch (error) {
      console.error('Error generating minigame:', error);
      
      // Create fallback game on error
      console.log('Creating fallback game due to error');
      return createFallbackGame(topic);
    }
  }
}
