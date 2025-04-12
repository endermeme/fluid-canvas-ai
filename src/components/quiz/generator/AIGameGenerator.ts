import {
  GoogleGenerativeAI,
  GoogleGenerativeAIResponseError,
  HarmBlockThreshold,
  HarmCategory,
} from '@google/generative-ai';
import { GameSettingsData } from '../types';
import { getGameTypeByTopic } from '../gameTypes';
import { MiniGame, AIGameGeneratorOptions } from './types';
import { 
  createGeminiClient, 
  logInfo, 
  logError, 
  logWarning, 
  logSuccess, 
  measureExecutionTime 
} from './apiUtils';
import { tryGeminiGeneration } from './geminiGenerator';
import { createFallbackGame } from './fallbackGenerator';

// Sử dụng API key cứng
const API_KEY = 'AIzaSyB-X13dE3qKEURW8DxLmK56Vx3lZ1c8IfA';
const SOURCE = "AI_GENERATOR";

// Singleton instance
let instance: AIGameGenerator | null = null;

const MODEL_NAME = "gemini-1.5-pro";
const MAX_RETRIES = 3;
const RETRY_DELAY = 1500;

const REQUIRES_IMAGES_KEYWORDS = [
  'memory card',
  'memory match',
  'memory game',
  'matching pairs',
  'find the pair',
  'match the cards',
  'matching game',
  'picture matching',
  'image pairing',
];

export class AIGameGenerator {
  private genAI: GoogleGenerativeAI;
  private model: any;
  private modelName: string;
  private canvasMode: boolean = true;
  private initialized: boolean = false;
  private apiKey: string;

  constructor(apiKey: string = API_KEY, options?: { modelName?: string; canvasMode?: boolean }) {
    // Singleton pattern - return existing instance if available
    if (instance) {
      return instance;
    }
    
    this.apiKey = apiKey;
    this.initialize(options);
    instance = this;
  }

  private initialize(options?: { modelName?: string; canvasMode?: boolean }): void {
    if (this.initialized) return;
    
    logInfo(SOURCE, "Initializing AI game generator");
    this.modelName = options?.modelName || 'gemini-2.0-flash';
    this.canvasMode = options?.canvasMode || true;
    
    logInfo(SOURCE, `Using model ${this.modelName}`);
    logInfo(SOURCE, `Canvas mode: ${this.canvasMode ? 'ON' : 'OFF'}`);
    
    try {
      this.genAI = new GoogleGenerativeAI(this.apiKey);
      this.model = this.genAI.getGenerativeModel({
        model: MODEL_NAME,
        safetySettings: [
          {
            category: HarmCategory.HARM_CATEGORY_HARASSMENT,
            threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
          },
          {
            category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
            threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
          },
          {
            category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
            threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
          },
          {
            category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
            threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
          },
        ],
        generationConfig: {
          temperature: 0.9,
          topK: 1,
          topP: 1,
          maxOutputTokens: 8192,
        },
      });
      this.initialized = true;
      
      console.log(
        `%c 🤖 AI GENERATOR INITIALIZED %c ${MODEL_NAME}`,
        'background: #4285f4; color: white; padding: 2px 6px; border-radius: 4px; font-weight: bold;',
        'font-weight: bold; color: #4285f4;'
      );
      console.log('%c 📚 Model', 'font-weight: bold; color: #4285f4;', MODEL_NAME);
      console.log('%c ⚙️ Config', 'font-weight: bold; color: #4285f4;', {
        temperature: 0.9,
        topK: 1,
        topP: 1,
        maxOutputTokens: 8192,
        maxRetries: MAX_RETRIES,
        retryDelay: `${RETRY_DELAY}ms`
      });
    } catch (error) {
      console.group(
        '%c ❌ AI GENERATOR INITIALIZATION ERROR',
        'background: #d73a49; color: white; padding: 2px 6px; border-radius: 4px; font-weight: bold;'
      );
      console.error('%c 🚨 Error Details', 'font-weight: bold; color: #d73a49;', error);
      console.error('%c 🔍 Stack Trace', 'font-weight: bold; color: #d73a49;', error instanceof Error ? error.stack : 'No stack trace available');
      console.groupEnd();
      
      this.initialized = false;
      throw new Error("Failed to initialize AI Generator");
    }
  }

  setCanvasMode(enabled: boolean): void {
    this.canvasMode = enabled;
    logInfo(SOURCE, `Canvas mode ${enabled ? 'ENABLED' : 'DISABLED'}`);
  }

  isCanvasModeEnabled(): boolean {
    return this.canvasMode;
  }

  async generateMiniGame(topic: string, settings?: GameSettingsData): Promise<MiniGame | null> {
    // Create a unique ID for this generation request to track it in logs
    const requestId = Date.now().toString(36) + Math.random().toString(36).substring(2, 5);
    
    try {
      // Group all logs for this request
      console.groupCollapsed(
        `%c ${SOURCE} REQUEST ${requestId} %c ${topic.substring(0, 50)}${topic.length > 50 ? '...' : ''}`,
        'background: #0366d6; color: white; padding: 2px 6px; border-radius: 4px; font-weight: bold;',
        'font-weight: bold;'
      );
      
      logInfo(SOURCE, `Starting game generation for topic: "${topic}"`);
      logInfo(SOURCE, `Settings:`, settings);
      logInfo(SOURCE, `Canvas mode: ${this.canvasMode ? 'ON' : 'OFF'}`);
      
      const gameType = getGameTypeByTopic(topic);
      if (gameType) {
        logInfo(SOURCE, `Determined game type: ${gameType.name}`);
      }
      
      const startTime = Date.now();
      
      // Check if the game requires images with an expanded set of keywords
      const requiresImages = this.checkIfGameRequiresImages(topic);
      if (requiresImages) {
        logInfo(SOURCE, `This game likely requires images. Ensuring image support.`);
      }
      
      // Generate with Gemini
      logInfo(SOURCE, `Starting game generation with ${this.modelName}...`);
      
      // Sửa: Bỏ tham số requiresImages không cần thiết và không đúng kiểu 
      const geminiResult = await tryGeminiGeneration(this.model, topic, settings);
      
      const duration = measureExecutionTime(startTime);
      logSuccess(SOURCE, `Gemini generation completed in ${duration.seconds}s (${duration.ms}ms)`);
      
      if (geminiResult && geminiResult.content) {
        logSuccess(SOURCE, `Successfully generated game`);
        logInfo(SOURCE, `Code size: ${geminiResult.content.length.toLocaleString()} characters`);
        
        // Close the group before returning
        console.groupEnd();
        
        return {
          title: topic,
          description: "",
          content: geminiResult.content
        };
      }
      
      logWarning(SOURCE, "Gemini generation failed, using fallback game");
      const fallbackGame = createFallbackGame(topic);
      
      // Close the group before returning
      console.groupEnd();
      
      return {
        title: topic,
        description: "",
        content: fallbackGame.content
      };
      
    } catch (error) {
      logError(SOURCE, "Error in generateMiniGame", error);
      logWarning(SOURCE, "Creating fallback game due to error");
      
      // Close any open group
      try { console.groupEnd(); } catch (e) {}
      
      const fallbackGame = createFallbackGame(topic);
      return {
        title: topic,
        description: "",
        content: fallbackGame.content
      };
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
    
    const result = containsImageKeyword || isImageBasedGameType;
    
    // Log keyword matches for debugging
    if (result) {
      const matchedKeywords = imageRelatedKeywords.filter(keyword => lowerTopic.includes(keyword));
      logInfo(SOURCE, `Image detection: ${result ? 'YES' : 'NO'}`, { 
        matchedKeywords: matchedKeywords.length > 0 ? matchedKeywords : 'game type based detection'
      });
    }
    
    return result;
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
