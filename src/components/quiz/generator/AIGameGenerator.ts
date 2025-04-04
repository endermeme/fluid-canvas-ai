
import { GoogleGenerativeAI } from '@google/generative-ai';
import { GameSettingsData } from '../types';
import { getGameTypeByTopic } from '../gameTypes';
import { MiniGame, AIGameGeneratorOptions } from './types';
import { createGeminiClient, getOpenAIKey, saveOpenAIKey } from './apiUtils';
import { tryGeminiGeneration } from './geminiGenerator';
import { enhanceWithOpenAI } from './openaiGenerator';
import { createFallbackGame } from './fallbackGenerator';

export class AIGameGenerator {
  private model: any;
  private openAIKey: string | null = null;

  constructor(apiKey: string, options?: { modelName?: string }) {
    this.model = createGeminiClient(apiKey);
    this.openAIKey = getOpenAIKey();
  }

  setOpenAIKey(key: string): boolean {
    return saveOpenAIKey(key);
  }

  hasOpenAIKey(): boolean {
    return this.openAIKey !== null && this.openAIKey !== '';
  }

  async generateMiniGame(topic: string, settings?: GameSettingsData): Promise<MiniGame | null> {
    try {
      console.log(`Starting game generation for topic: "${topic}" with settings:`, settings);
      
      // Try first with Gemini
      const geminiResult = await tryGeminiGeneration(this.model, topic, settings);
      
      if (geminiResult) {
        console.log("Successfully generated game with Gemini");
        
        // If OpenAI key is available, enhance the game
        if (this.hasOpenAIKey()) {
          console.log("OpenAI key available, enhancing game...");
          const enhancedGame = await enhanceWithOpenAI(this.openAIKey, geminiResult, topic);
          
          // Only use the enhanced game if enhancing was successful
          if (enhancedGame && enhancedGame.content && enhancedGame.content.length > 100) {
            console.log("Successfully enhanced game with OpenAI");
            return enhancedGame;
          } else {
            console.log("OpenAI enhancement failed or returned invalid content, using Gemini result");
            return geminiResult;
          }
        }
        
        return geminiResult;
      }
      
      console.log("Gemini generation failed, creating fallback game");
      return createFallbackGame(topic);
      
    } catch (error) {
      console.error("Error in generateMiniGame:", error);
      return createFallbackGame(topic);
    }
  }
}

// Re-export types for convenience
export { MiniGame };
