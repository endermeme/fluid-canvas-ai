
import { generateWithGemini, tryGeminiGeneration } from './geminiGenerator';
import { generateWithOpenAI, tryOpenAIGeneration } from './openaiGenerator';
import { MiniGame } from './types';
import { GameSettingsData } from '../types';
import { logInfo, logError, logWarning } from './apiUtils';

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
    // Load canvas mode from localStorage if available
    const savedCanvasMode = localStorage.getItem('canvas_mode');
    if (savedCanvasMode !== null) {
      this.useCanvas = savedCanvasMode === 'true';
    }
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
   * Get current canvas mode setting
   * @returns Current canvas mode state
   */
  public getCanvasMode(): boolean {
    return this.useCanvas;
  }

  /**
   * Check if OpenAI API key is available and valid
   * @returns Boolean indicating if API key is available
   */
  public hasValidApiKey(): boolean {
    // Check environment variable first, then fallback to localStorage
    const envKey = import.meta.env.VITE_OPENAI_API_KEY;
    const localKey = localStorage.getItem('openai_api_key') || (window as any).OPENAI_API_KEY;
    
    // Use env key if available, otherwise use local storage
    const key = envKey || localKey;
    
    return !!key && typeof key === 'string' && key.startsWith('sk-');
  }

  /**
   * Get the OpenAI API key from env or localStorage
   * @returns The API key or null if not found
   */
  public getApiKey(): string | null {
    // Check environment variable first, then fallback to localStorage
    const envKey = import.meta.env.VITE_OPENAI_API_KEY;
    if (envKey) return envKey;
    
    return localStorage.getItem('openai_api_key') || (window as any).OPENAI_API_KEY || null;
  }

  /**
   * Generate a mini game using either Gemini or OpenAI.
   * @param topic The topic of the game.
   * @param settings Optional game settings.
   * @returns A promise that resolves with the generated mini game or null if generation fails.
   */
  public async generateMiniGame(topic: string, settings?: GameSettingsData): Promise<MiniGame | null> {
    // Add useCanvas to settings if not present
    const enhancedSettings: GameSettingsData = {
      ...settings,
      requestMetadata: {
        ...settings?.requestMetadata,
        useCanvas: this.useCanvas
      }
    };
    
    // Check for OpenAI API key
    if (this.hasValidApiKey()) {
      logInfo(SOURCE, "Using OpenAI to generate game");
      try {
        return await tryOpenAIGeneration(topic, enhancedSettings);
      } catch (error: any) {
        // If it's an API key error, don't fall back to Gemini, but propagate the error
        if (error.message && (
            error.message.includes('API Key') || 
            error.message.includes('authentication') ||
            error.message.includes('Unauthorized')
        )) {
          logError(SOURCE, "OpenAI authentication failed", error);
          throw error;
        }
        
        logWarning(SOURCE, "OpenAI generation failed, falling back to Gemini", error);
        return await tryGeminiGeneration(null, topic, enhancedSettings);
      }
    } else {
      logInfo(SOURCE, "Using Gemini to generate game (no OpenAI API key found)");
      return await tryGeminiGeneration(null, topic, enhancedSettings);
    }
  }
}
