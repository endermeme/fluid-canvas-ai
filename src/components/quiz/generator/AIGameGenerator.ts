
import { GoogleGenerativeAI } from '@google/generative-ai';
import { GameSettingsData } from '../types';
import { getGameTypeByTopic } from '../gameTypes';
import { MiniGame, AIGameGeneratorOptions } from './types';
import { createGeminiClient, logError, logInfo, logWarning } from './apiUtils';
import { tryGeminiGeneration } from './geminiGenerator';
import { createFallbackGame } from './fallbackGenerator';

// API key
const API_KEY = 'AIzaSyB-X13dE3qKEURW8DxLmK56Vx3lZ1c8IfA';

export class AIGameGenerator {
  private model: any;
  private modelName: string;
  private canvasMode: boolean = true;

  constructor(apiKey: string = API_KEY, options?: { modelName?: string; canvasMode?: boolean }) {
    console.log("🚀 AIGameGenerator: Initializing AI game generator");
    this.modelName = options?.modelName || 'gemini-2.0-flash';
    this.canvasMode = options?.canvasMode !== undefined ? options.canvasMode : true;
    
    console.log(`🚀 AIGameGenerator: Using model ${this.modelName}`);
    console.log(`🚀 AIGameGenerator: Canvas mode: ${this.canvasMode ? 'ON' : 'OFF'}`);
    
    // Create Gemini client
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
      }
      
      // Generate with Gemini
      console.log(`🚀 AIGameGenerator: Starting game generation with ${this.modelName}...`);
      const geminiResult = await tryGeminiGeneration(this.model, topic, settings);
      
      const geminiTime = ((Date.now() - startTime) / 1000).toFixed(2);
      console.log(`🚀 AIGameGenerator: Gemini generation completed in ${geminiTime}s`);
      
      if (geminiResult && geminiResult.content) {
        console.log(`🚀 AIGameGenerator: Successfully generated game`);
        console.log(`🚀 AIGameGenerator: Content size: ${geminiResult.content.length.toLocaleString()} characters`);
        
        const totalTime = ((Date.now() - startTime) / 1000).toFixed(2);
        console.log(`🚀 AIGameGenerator: Total game generation time: ${totalTime}s`);
        
        return geminiResult;
      }
      
      console.log("⚠️ AIGameGenerator: Gemini generation failed, using fallback game");
      return createFallbackGame(topic);
      
    } catch (error) {
      console.error("❌ AIGameGenerator: Error in generateMiniGame:", error);
      console.log("⚠️ AIGameGenerator: Creating fallback game due to error");
      return createFallbackGame(topic);
    }
  }

  // Enhanced method to determine if a game likely needs images with expanded keywords
  private checkIfGameRequiresImages(topic: string): boolean {
    const imageRelatedKeywords = [
      // Original keywords
      'ảnh', 'hình', 'hình ảnh', 'picture', 'image', 'photo', 'pictionary', 
      'memory', 'card', 'trí nhớ', 'thẻ', 'matching', 'ghép hình', 'xếp hình',
      'puzzle', 'jigsaw', 'geography', 'địa lý', 'bản đồ', 'map', 'art', 'nghệ thuật',
      'drawing', 'vẽ', 'paint', 'visual', 'icon', 'biểu tượng', 'logo', 'nhận diện',
      'recognition', 'identify', 'spotting', 'observation', 'quan sát',
      
      // New expanded keywords for more precise detection
      'gallery', 'thư viện', 'bộ sưu tập', 'collection', 'portrait', 'chân dung',
      'landscape', 'phong cảnh', 'photo album', 'album ảnh', 'photography', 'nhiếp ảnh',
      'illustration', 'minh họa', 'graphics', 'đồ họa', 'design', 'thiết kế',
      'camera', 'máy ảnh', 'snapshot', 'ảnh chụp', 'gallery', 'triển lãm',
      'pixel', 'điểm ảnh', 'resolution', 'độ phân giải', 'color', 'màu sắc',
      'filter', 'bộ lọc', 'edit', 'chỉnh sửa', 'crop', 'cắt xén',
      'thumbnail', 'hình thu nhỏ', 'slideshow', 'trình chiếu', 'preview', 'xem trước',
      'view', 'xem', 'display', 'hiển thị', 'show', 'trình bày',
      'screen', 'màn hình', 'desktop', 'máy tính', 'monitor', 'màn hình',
      'scan', 'quét', 'capture', 'chụp', 'upload', 'tải lên',
      'download', 'tải về', 'share', 'chia sẻ', 'save', 'lưu',
      'print', 'in', 'zoom', 'phóng to', 'flip', 'lật',
      'rotate', 'xoay', 'adjust', 'điều chỉnh', 'enhance', 'tăng cường',
      'sight', 'thị giác', 'eyes', 'mắt', 'look', 'nhìn',
      'vision', 'tầm nhìn', 'scene', 'cảnh', 'sight', 'cảnh tượng',
      'appearance', 'vẻ ngoài', 'visible', 'có thể nhìn thấy', 'invisible', 'không thể nhìn thấy',
      'visible', 'hữu hình', 'invisible', 'vô hình', 'hidden', 'ẩn',
      'show', 'hiện', 'hide', 'ẩn', 'reveal', 'tiết lộ',
      'blur', 'mờ', 'sharp', 'sắc nét', 'focus', 'tập trung',
    ];

    const lowerTopic = topic.toLowerCase();
    
    // Enhanced detection logic: check if any of the keywords is in the topic
    const containsImageKeyword = imageRelatedKeywords.some(keyword => lowerTopic.includes(keyword));
    
    // Game type specific detection
    const isImageBasedGameType = lowerTopic.includes('pictionary') || 
                                 lowerTopic.includes('memory card') || 
                                 lowerTopic.includes('flashcard') || 
                                 lowerTopic.includes('puzzle') || 
                                 lowerTopic.includes('matching') ||
                                 lowerTopic.includes('xếp hình') ||
                                 lowerTopic.includes('ghép hình') ||
                                 lowerTopic.includes('thẻ nhớ') ||
                                 lowerTopic.includes('trí nhớ');
    
    return containsImageKeyword || isImageBasedGameType;
  }
}

// Re-export types for convenience
export type { MiniGame };
