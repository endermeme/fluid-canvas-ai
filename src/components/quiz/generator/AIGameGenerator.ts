
import { GoogleGenerativeAI } from '@google/generative-ai';
import { GameSettingsData } from '../types';
import { getGameTypeByTopic } from '../gameTypes';
import { MiniGame, AIGameGeneratorOptions } from './types';
import { createGeminiClient, logError, logInfo, logWarning } from './apiUtils';
import { tryGeminiGeneration } from './geminiGenerator';
import { createFallbackGame } from './fallbackGenerator';

// Sử dụng API key cứng
const API_KEY = 'AIzaSyB-X13dE3qKEURW8DxLmK56Vx3lZ1c8IfA';

export class AIGameGenerator {
  private model: any;
  private modelName: string;
  private canvasMode: boolean = false;

  constructor(apiKey: string = API_KEY, options?: { modelName?: string; canvasMode?: boolean }) {
    console.log("🚀 AIGameGenerator: Initializing AI game generator");
    this.modelName = options?.modelName || 'gemini-2.5-pro-preview-03-25';
    this.canvasMode = options?.canvasMode || false;
    
    console.log(`🚀 AIGameGenerator: Using model ${this.modelName}`);
    console.log(`🚀 AIGameGenerator: Canvas mode: ${this.canvasMode ? 'ON' : 'OFF'}`);
    
    // Luôn sử dụng API_KEY cứng thay vì tham số apiKey
    this.model = createGeminiClient(API_KEY);
  }

  setCanvasMode(enabled: boolean): void {
    this.canvasMode = enabled;
    console.log(`🚀 AIGameGenerator: Canvas mode ${enabled ? 'ENABLED' : 'DISABLED'}`);
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
      
      // Check if the game requires images
      const requiresImages = this.checkIfGameRequiresImages(topic);
      if (requiresImages) {
        console.log(`🚀 AIGameGenerator: This game likely requires images. Ensuring image support.`);
        // We'll handle this in the Gemini prompting
      }
      
      // Generate with Gemini
      console.log(`🚀 AIGameGenerator: Starting game generation with ${this.modelName}...`);
      const geminiResult = await tryGeminiGeneration(this.model, topic, settings, requiresImages);
      
      const geminiTime = ((Date.now() - startTime) / 1000).toFixed(2);
      console.log(`🚀 AIGameGenerator: Gemini generation completed in ${geminiTime}s`);
      
      if (geminiResult && geminiResult.content) {
        console.log(`🚀 AIGameGenerator: Successfully generated game`);
        console.log(`🚀 AIGameGenerator: Code size: ${geminiResult.content.length.toLocaleString()} characters`);
        
        const totalTime = ((Date.now() - startTime) / 1000).toFixed(2);
        console.log(`🚀 AIGameGenerator: Total game generation time: ${totalTime}s`);
        
        return {
          title: topic,
          description: "",
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

  // Helper method to determine if a game likely needs images
  private checkIfGameRequiresImages(topic: string): boolean {
    const imageRelatedKeywords = [
      'ảnh', 'hình', 'hình ảnh', 'picture', 'image', 'photo', 'pictionary', 
      'memory', 'card', 'trí nhớ', 'thẻ', 'matching', 'ghép hình', 'xếp hình',
      'puzzle', 'jigsaw', 'geography', 'địa lý', 'bản đồ', 'map', 'art', 'nghệ thuật',
      'drawing', 'vẽ', 'paint', 'visual', 'icon', 'biểu tượng', 'logo', 'nhận diện',
      'recognition', 'identify', 'spotting', 'observation', 'quan sát'
    ];

    const lowerTopic = topic.toLowerCase();
    return imageRelatedKeywords.some(keyword => lowerTopic.includes(keyword));
  }
}

// Re-export types for convenience
export type { MiniGame };
