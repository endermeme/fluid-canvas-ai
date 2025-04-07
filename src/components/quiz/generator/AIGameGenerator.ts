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
  private modelName: string;
  private canvasMode: boolean = false;

  constructor(apiKey: string, options?: { modelName?: string; canvasMode?: boolean }) {
    console.log("🚀 AIGameGenerator: Khởi tạo bộ tạo game AI");
    this.modelName = options?.modelName || 'gemini-2.0-flash';
    
    // If there's no OpenAI key, automatically enable canvas mode
    const storedOpenAIKey = getOpenAIKey();
    this.canvasMode = options?.canvasMode || !storedOpenAIKey ? true : false;
    
    console.log(`🚀 AIGameGenerator: Sử dụng mô hình ${this.modelName}`);
    console.log(`🚀 AIGameGenerator: Chế độ canvas: ${this.canvasMode ? 'BẬT' : 'TẮT'}`);
    
    this.model = createGeminiClient(apiKey);
    this.openAIKey = storedOpenAIKey;
    
    if (this.openAIKey) {
      console.log("🚀 AIGameGenerator: Có sẵn OpenAI key cho cải thiện game");
    } else {
      console.log("🚀 AIGameGenerator: Không có OpenAI key, sẽ chỉ sử dụng Gemini với chế độ Canvas");
    }
  }

  setOpenAIKey(key: string): boolean {
    // Allow empty key to disable OpenAI enhancement
    const success = saveOpenAIKey(key);
    if (success) {
      console.log("🚀 AIGameGenerator: Đã lưu OpenAI key mới");
      this.openAIKey = key;
      
      // If the key is empty, automatically enable canvas mode
      if (!key) {
        this.canvasMode = true;
        console.log("🚀 AIGameGenerator: Đã bật tự động chế độ Canvas do không có OpenAI key");
      }
    } else {
      console.log("🚀 AIGameGenerator: Không thể lưu OpenAI key");
    }
    return success;
  }

  setCanvasMode(enabled: boolean): void {
    this.canvasMode = enabled;
    console.log(`🚀 AIGameGenerator: Chế độ canvas đã ${enabled ? 'BẬT' : 'TẮT'}`);
  }

  hasOpenAIKey(): boolean {
    return this.openAIKey !== null && this.openAIKey !== '';
  }

  isCanvasModeEnabled(): boolean {
    return this.canvasMode;
  }

  async generateMiniGame(topic: string, settings?: GameSettingsData): Promise<MiniGame | null> {
    try {
      console.log(`🚀 AIGameGenerator: Bắt đầu tạo game cho chủ đề: "${topic}"`);
      console.log(`🚀 AIGameGenerator: Cài đặt:`, settings);
      console.log(`🚀 AIGameGenerator: Chế độ canvas: ${this.canvasMode ? 'BẬT' : 'TẮT'}`);
      
      const gameType = getGameTypeByTopic(topic);
      if (gameType) {
        console.log(`🚀 AIGameGenerator: Đã xác định loại game: ${gameType.name}`);
      }
      
      const startTime = Date.now();
      
      // Try first with Gemini
      console.log(`🚀 AIGameGenerator: Bắt đầu tạo game với ${this.modelName}...`);
      const geminiResult = await tryGeminiGeneration(this.model, topic, settings);
      
      const geminiTime = ((Date.now() - startTime) / 1000).toFixed(2);
      console.log(`🚀 AIGameGenerator: Tạo với Gemini hoàn tất sau ${geminiTime}s`);
      
      if (geminiResult) {
        console.log(`🚀 AIGameGenerator: Đã tạo thành công game với Gemini: "${geminiResult.title}"`);
        console.log(`🚀 AIGameGenerator: Kích thước mã: ${geminiResult.content.length.toLocaleString()} ký tự`);
        
        // If OpenAI key is available, enhance the game
        if (this.hasOpenAIKey()) {
          console.log("🚀 AIGameGenerator: Có OpenAI key, đang cải thiện game...");
          const enhanceStartTime = Date.now();
          
          const enhancedGame = await enhanceWithOpenAI(
            this.openAIKey, 
            geminiResult, 
            topic, 
            this.canvasMode
          );
          
          const enhanceTime = ((Date.now() - enhanceStartTime) / 1000).toFixed(2);
          console.log(`🚀 AIGameGenerator: Quá trình cải thiện OpenAI hoàn tất sau ${enhanceTime}s`);
          
          // Only use the enhanced game if enhancing was successful
          if (enhancedGame && enhancedGame.content && enhancedGame.content.length > 100) {
            console.log("🚀 AIGameGenerator: Đã cải thiện thành công game với OpenAI");
            console.log(`🚀 AIGameGenerator: Kích thước mã gốc vs mới: ${geminiResult.content.length.toLocaleString()} → ${enhancedGame.content.length.toLocaleString()} ký tự`);
            
            const totalTime = ((Date.now() - startTime) / 1000).toFixed(2);
            console.log(`🚀 AIGameGenerator: Tổng thời gian tạo game: ${totalTime}s`);
            
            return enhancedGame;
          } else {
            console.log("🚀 AIGameGenerator: Cải thiện OpenAI thất bại hoặc trả về nội dung không hợp lệ, sử dụng kết quả Gemini");
            return geminiResult;
          }
        }
        
        const totalTime = ((Date.now() - startTime) / 1000).toFixed(2);
        console.log(`🚀 AIGameGenerator: Tổng thời gian tạo game: ${totalTime}s`);
        
        return geminiResult;
      }
      
      console.log("⚠️ AIGameGenerator: Tạo với Gemini thất bại, sử dụng game dự phòng");
      return createFallbackGame(topic);
      
    } catch (error) {
      console.error("❌ AIGameGenerator: Lỗi trong generateMiniGame:", error);
      console.log("⚠️ AIGameGenerator: Đang tạo game dự phòng do gặp lỗi");
      return createFallbackGame(topic);
    }
  }
}

// Re-export types for convenience
export type { MiniGame };
