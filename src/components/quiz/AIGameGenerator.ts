
import { GoogleGenerativeAI } from '@google/generative-ai';
import { GameSettingsData } from './types';
import { MiniGame } from './generator/types';
import { createGeminiClient } from './generator/apiUtils';
import { tryGeminiGeneration } from './generator/geminiGenerator';
import { createFallbackGame } from './generator/fallbackGenerator';

// API key
const API_KEY = 'AIzaSyB-X13dE3qKEURW8DxLmK56Vx3lZ1c8IfA';

// Singleton instance
let instance: AIGameGenerator | null = null;

export class AIGameGenerator {
  private model: any;
  private modelName: string;
  private canvasMode: boolean = true;
  private initialized: boolean = false;

  constructor(apiKey: string = API_KEY, options?: { modelName?: string; canvasMode?: boolean }) {
    // Singleton pattern - return existing instance if available
    if (instance) {
      return instance;
    }
    
    this.initialize(apiKey, options);
    instance = this;
  }

  private initialize(apiKey: string, options?: { modelName?: string; canvasMode?: boolean }): void {
    if (this.initialized) return;
    
    console.log("🚀 AIGameGenerator: Initializing AI game generator");
    this.modelName = options?.modelName || 'gemini-2.0-flash';
    this.canvasMode = options?.canvasMode || true;
    
    console.log(`🚀 AIGameGenerator: Using model ${this.modelName}`);
    
    // Use API_KEY
    this.model = createGeminiClient(API_KEY);
    this.initialized = true;
  }

  setCanvasMode(enabled: boolean): void {
    this.canvasMode = enabled;
  }

  isCanvasModeEnabled(): boolean {
    return this.canvasMode;
  }

  async generateMiniGame(topic: string, settings?: GameSettingsData): Promise<MiniGame | null> {
    try {
      console.log(`🚀 AIGameGenerator: Starting game generation for topic: "${topic}"`);
      console.log(`🚀 AIGameGenerator: Settings:`, settings);
      
      const startTime = Date.now();
      
      // Generate with Gemini
      console.log(`🚀 AIGameGenerator: Starting game generation with ${this.modelName}...`);
      const geminiResult = await tryGeminiGeneration(this.model, topic, settings);
      
      const geminiTime = ((Date.now() - startTime) / 1000).toFixed(2);
      console.log(`🚀 AIGameGenerator: Gemini generation completed in ${geminiTime}s`);
      
      if (geminiResult && geminiResult.content) {
        console.log(`🚀 AIGameGenerator: Successfully generated game`);
        console.log(`🚀 AIGameGenerator: Code size: ${geminiResult.content.length.toLocaleString()} characters`);
        
        const totalTime = ((Date.now() - startTime) / 1000).toFixed(2);
        console.log(`🚀 AIGameGenerator: Total game generation time: ${totalTime}s`);
        
        return {
          title: geminiResult.title || topic,
          description: geminiResult.description || "",
          content: geminiResult.content
        };
      }
      
      console.log("⚠️ AIGameGenerator: Gemini generation failed, using fallback game");
      const fallbackGame = createFallbackGame(topic);
      return {
        title: topic,
        description: "",
        content: fallbackGame.content
      };
      
    } catch (error) {
      console.error("❌ AIGameGenerator: Error in generateMiniGame:", error);
      console.log("⚠️ AIGameGenerator: Creating fallback game due to error");
      const fallbackGame = createFallbackGame(topic);
      return {
        title: topic,
        description: "",
        content: fallbackGame.content
      };
    }
  }
  
  // Static method to get the instance
  static getInstance(apiKey: string = API_KEY, options?: { modelName?: string; canvasMode?: boolean }): AIGameGenerator {
    if (!instance) {
      instance = new AIGameGenerator(apiKey, options);
    }
    return instance;
  }
}

// Re-export types for convenience
export type { MiniGame };
