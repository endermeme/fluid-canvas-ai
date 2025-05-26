
import { MiniGame, PromptOptions, GeneratorSettings } from './types';
import { generateWithGemini } from './geminiClient';
import { createGamePrompt, createCustomGamePrompt } from './promptManager';
import { processGameCode, createFallbackGameHtml } from './gameProcessor';

const MAX_RETRIES = 2;
const RETRY_DELAY = 1000;

export const generateGame = async (
  prompt: string,
  options: PromptOptions = { topic: prompt },
  settings: GeneratorSettings = {}
): Promise<MiniGame> => {
  console.log('🎮 Bắt đầu tạo game với prompt:', prompt);
  
  // Tạo prompt phù hợp
  const gamePrompt = options.topic === prompt 
    ? createGamePrompt(options) 
    : createCustomGamePrompt(prompt);
  
  console.log('📝 Prompt đã tạo, đang gọi Gemini API...');
  
  // Thử gọi API với retry
  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      console.log(`🔄 Lần thử ${attempt}/${MAX_RETRIES}`);
      
      const response = await generateWithGemini(gamePrompt, {
        temperature: 0.7,
        topK: 30,
        topP: 0.9,
        maxOutputTokens: 8192,
        ...settings
      });
      
      if (response.success && response.content) {
        console.log('✅ Nhận được phản hồi từ Gemini, đang xử lý...');
        
        // Xử lý và làm sạch content
        const { title, content } = processGameCode(response.content);
        
        console.log('🎯 Game đã được tạo thành công:', title);
        
        return {
          title: title || `Game: ${options.topic || prompt}`,
          content: content,
          description: options.topic || prompt,
          category: options.category || 'custom',
          difficulty: options.difficulty || 'medium'
        };
      } else {
        console.warn(`❌ Lần thử ${attempt} thất bại:`, response.error);
        
        if (attempt < MAX_RETRIES) {
          console.log(`⏳ Đợi ${RETRY_DELAY}ms trước khi thử lại...`);
          await new Promise(resolve => setTimeout(resolve, RETRY_DELAY));
        }
      }
    } catch (error) {
      console.error(`💥 Lỗi trong lần thử ${attempt}:`, error);
      
      if (attempt < MAX_RETRIES) {
        await new Promise(resolve => setTimeout(resolve, RETRY_DELAY));
      }
    }
  }
  
  // Nếu tất cả lần thử đều thất bại, tạo game fallback
  console.log('🔧 Tạo game fallback...');
  return generateFallbackGame(options.topic || prompt, options);
};

export const generateFallbackGame = async (
  topic: string, 
  options: PromptOptions = { topic }
): Promise<MiniGame> => {
  console.log('🛠️ Tạo game fallback cho:', topic);
  
  const fallbackContent = createFallbackGameHtml(topic, options.useCanvas);
  
  return {
    title: `Game Demo: ${topic}`,
    content: fallbackContent,
    description: `Game demo về "${topic}" - Được tạo tự động`,
    category: options.category || 'demo',
    difficulty: options.difficulty || 'easy'
  };
};

// Class-based API để tương thích với code cũ
export class GameGenerator {
  static async generate(prompt: string, options?: PromptOptions): Promise<MiniGame> {
    return generateGame(prompt, options);
  }
}

export class AIGameGenerator {
  private static instance: AIGameGenerator;
  private canvasMode: boolean = false;

  static getInstance(): AIGameGenerator {
    if (!AIGameGenerator.instance) {
      AIGameGenerator.instance = new AIGameGenerator();
    }
    return AIGameGenerator.instance;
  }

  setCanvasMode(enabled: boolean): void {
    this.canvasMode = enabled;
    console.log('🎨 Canvas mode:', enabled ? 'enabled' : 'disabled');
  }

  async generateMiniGame(prompt: string, settings?: GeneratorSettings): Promise<MiniGame> {
    const options: PromptOptions = {
      topic: prompt,
      useCanvas: this.canvasMode,
      language: 'vi',
      difficulty: 'medium',
      category: 'custom'
    };
    
    return generateGame(prompt, options, settings);
  }
}

export const generateGameFromTopic = async (topic: string, settings?: GeneratorSettings): Promise<MiniGame> => {
  const options: PromptOptions = {
    topic,
    useCanvas: true,
    language: 'vi',
    difficulty: 'medium',
    category: 'educational'
  };
  
  return generateGame(topic, options, settings);
};

// Alternative game generator
export const generateAlternativeGame = async (
  prompt: string, 
  options: PromptOptions = { topic: prompt }
): Promise<MiniGame> => {
  return generateFallbackGame(prompt, options);
};

export default { 
  generateGame, 
  generateFallbackGame, 
  GameGenerator, 
  AIGameGenerator, 
  generateGameFromTopic,
  generateAlternativeGame 
};
