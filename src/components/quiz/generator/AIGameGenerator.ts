import { GoogleGenerativeAI } from '@google/generative-ai';
import { GameSettingsData } from '../types';
import { getGameTypeByTopic } from '../gameTypes';
import { MiniGame, AIGameGeneratorOptions } from './types';
import { createGeminiClient, getOpenAIKey, saveOpenAIKey, validateOpenAIKey, logError, logInfo, logWarning } from './apiUtils';
import { tryGeminiGeneration } from './geminiGenerator';
import { enhanceWithOpenAI } from './openaiGenerator';
import { createFallbackGame } from './fallbackGenerator';

export class AIGameGenerator {
  private model: any;
  private openAIKey: string | null = null;
  private modelName: string;
  private canvasMode: boolean = false;

  constructor(apiKey: string, options?: { modelName?: string; canvasMode?: boolean }) {
    console.log("🚀 AIGameGenerator: Initializing AI game generator");
    this.modelName = options?.modelName || 'gemini-2.5-pro-preview-03-25';
    
    // If there's no OpenAI key, automatically enable canvas mode
    const storedOpenAIKey = getOpenAIKey();
    this.canvasMode = options?.canvasMode || !storedOpenAIKey ? true : false;
    
    console.log(`🚀 AIGameGenerator: Using model ${this.modelName}`);
    console.log(`🚀 AIGameGenerator: Canvas mode: ${this.canvasMode ? 'ON' : 'OFF'}`);
    
    this.model = createGeminiClient(apiKey);
    this.openAIKey = storedOpenAIKey;
    
    if (this.openAIKey) {
      console.log("🚀 AIGameGenerator: OpenAI key available for game enhancement");
    } else {
      console.log("🚀 AIGameGenerator: No OpenAI key, will only use Gemini with Canvas mode");
    }
  }

  setOpenAIKey(key: string): boolean {
    if (!key.trim()) {
      // Allow empty key to disable OpenAI enhancement
      console.log("🚀 AIGameGenerator: Removed OpenAI key");
      localStorage.removeItem('openai_api_key');
      this.openAIKey = null;
      this.canvasMode = true;
      return true;
    }
    
    // Validate key format
    if (!validateOpenAIKey(key)) {
      console.log("🚀 AIGameGenerator: Invalid API key");
      return false;
    }
    
    // Save valid key
    const success = saveOpenAIKey(key);
    if (success) {
      console.log("🚀 AIGameGenerator: Saved new OpenAI key");
      this.openAIKey = key;
      
      // If the key is empty, automatically enable canvas mode
      if (!key) {
        this.canvasMode = true;
        console.log("🚀 AIGameGenerator: Automatically enabled Canvas mode due to no OpenAI key");
      }
    } else {
      console.log("🚀 AIGameGenerator: Could not save OpenAI key");
    }
    return success;
  }

  setCanvasMode(enabled: boolean): void {
    this.canvasMode = enabled;
    console.log(`🚀 AIGameGenerator: Canvas mode ${enabled ? 'ENABLED' : 'DISABLED'}`);
  }

  hasOpenAIKey(): boolean {
    return this.openAIKey !== null && this.openAIKey !== '';
  }

  isCanvasModeEnabled(): boolean {
    return this.canvasMode;
  }

  async generateMiniGame(topic: string, settings?: GameSettingsData): Promise<MiniGame | null> {
    try {
      console.log(`🚀 AIGameGenerator: Starting game generation for topic: "${topic}"`);
      console.log(`🚀 AIGameGenerator: Settings:`, settings);
      console.log(`🚀 AIGameGenerator: Canvas mode: ${this.canvasMode ? 'ON' : 'OFF'}`);
      
      const gameType = getGameTypeByTopic(topic);
      if (gameType) {
        console.log(`🚀 AIGameGenerator: Determined game type: ${gameType.name}`);
      }
      
      const startTime = Date.now();
      
      // Try first with Gemini
      console.log(`🚀 AIGameGenerator: Starting game generation with ${this.modelName}...`);
      const geminiResult = await tryGeminiGeneration(this.model, topic, settings);
      
      const geminiTime = ((Date.now() - startTime) / 1000).toFixed(2);
      console.log(`🚀 AIGameGenerator: Gemini generation completed in ${geminiTime}s`);
      
      if (geminiResult && geminiResult.content) {
        // Simplify game response - only keep the HTML content
        console.log(`🚀 AIGameGenerator: Successfully generated game`);
        console.log(`🚀 AIGameGenerator: Code size: ${geminiResult.content.length.toLocaleString()} characters`);
        
        // If OpenAI key is available, enhance the game
        if (this.hasOpenAIKey()) {
          console.log("🚀 AIGameGenerator: OpenAI key available, enhancing game...");
          const enhanceStartTime = Date.now();
          
          const enhancedGame = await enhanceWithOpenAI(
            this.openAIKey, 
            geminiResult, 
            topic, 
            this.canvasMode
          );
          
          const enhanceTime = ((Date.now() - enhanceStartTime) / 1000).toFixed(2);
          console.log(`🚀 AIGameGenerator: OpenAI enhancement completed in ${enhanceTime}s`);
          
          // Only use the enhanced game if enhancing was successful
          if (enhancedGame && enhancedGame.content && enhancedGame.content.length > 100) {
            console.log("🚀 AIGameGenerator: Successfully enhanced game with OpenAI");
            console.log(`🚀 AIGameGenerator: Original vs new code size: ${geminiResult.content.length.toLocaleString()} → ${enhancedGame.content.length.toLocaleString()} characters`);
            
            const totalTime = ((Date.now() - startTime) / 1000).toFixed(2);
            console.log(`🚀 AIGameGenerator: Total game generation time: ${totalTime}s`);
            
            return {
              content: enhancedGame.content
            };
          } else {
            console.log("🚀 AIGameGenerator: OpenAI enhancement failed or returned invalid content, using Gemini result");
            return {
              content: geminiResult.content
            };
          }
        }
        
        const totalTime = ((Date.now() - startTime) / 1000).toFixed(2);
        console.log(`🚀 AIGameGenerator: Total game generation time: ${totalTime}s`);
        
        return {
          content: geminiResult.content
        };
      }
      
      console.log("⚠️ AIGameGenerator: Gemini generation failed, using fallback game");
      const fallbackGame = createFallbackGame(topic);
      return {
        content: fallbackGame.content
      };
      
    } catch (error) {
      console.error("❌ AIGameGenerator: Error in generateMiniGame:", error);
      console.log("⚠️ AIGameGenerator: Creating fallback game due to error");
      const fallbackGame = createFallbackGame(topic);
      return {
        content: fallbackGame.content
      };
    }
  }
}

// Re-export types for convenience
export type { MiniGame };
