import { generateWithGemini, tryGeminiGeneration } from './geminiGenerator';
import { generateWithOpenAI, tryOpenAIGeneration } from './openaiGenerator';
import { MiniGame } from './types';
import { GameSettingsData } from '../types';
import { logInfo, logError } from './apiUtils';

const SOURCE = "AI_GAME_GENERATOR";

/**
 * Singleton class for generating games using AI models.
 * It abstracts the underlying API (Gemini or OpenAI) and provides
 * a consistent interface for generating games.
 */
export class AIGameGenerator {
  private static instance: AIGameGenerator;
  private useCanvas: boolean = false;

  private constructor() {
    // Private constructor to enforce singleton pattern
  }

  /**
   * Get the singleton instance of the AIGameGenerator.
   * @returns The singleton instance.
   */
  public static getInstance(): AIGameGenerator {
    if (!AIGameGenerator.instance) {
      AIGameGenerator.instance = new AIGameGenerator();
    }
    return AIGameGenerator.instance;
  }

  /**
   * Set whether to use canvas mode for HTML game generation.
   * @param useCanvas Whether to use canvas mode.
   */
  public setCanvasMode(useCanvas: boolean): void {
    logInfo(SOURCE, `Setting canvas mode to ${useCanvas}`);
    this.useCanvas = useCanvas;
    localStorage.setItem('canvas_mode', String(useCanvas));
  }

  /**
   * Generate a mini game using either Gemini or OpenAI.
   * @param topic The topic of the game.
   * @param settings Optional game settings.
   * @returns A promise that resolves with the generated mini game or null if generation fails.
   */
  public async generateMiniGame(topic: string, settings?: GameSettingsData): Promise<MiniGame | null> {
    const useOpenAI = localStorage.getItem('openai_api_key');

    if (useOpenAI) {
      logInfo(SOURCE, "Using OpenAI to generate game");
      try {
        return await tryOpenAIGeneration(topic, settings);
      } catch (error) {
        logError(SOURCE, "OpenAI generation failed, falling back to Gemini", error);
        return await tryGeminiGeneration(null, topic, settings);
      }
    } else {
      logInfo(SOURCE, "Using Gemini to generate game");
      return await tryGeminiGeneration(null, topic, settings);
    }
  }
}
