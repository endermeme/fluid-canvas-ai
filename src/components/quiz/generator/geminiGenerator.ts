
import { GameSettingsData } from '../types';
import { getGameTypeByTopic } from '../gameTypes';
import { measureExecutionTime } from './apiUtils';
import { 
  GEMINI_MODELS, 
  API_VERSION, 
  getApiEndpoint,
  DEFAULT_GENERATION_SETTINGS 
} from '@/constants/api-constants';
import { buildGeminiPrompt } from './promptBuilder';
import { generateCustomGamePrompt } from './customGamePrompt';
import type { MiniGame, GameApiResponse } from './types';

const SOURCE = "GEMINI";

export type { MiniGame } from './types';

export class AIGameGenerator {
  private static instance: AIGameGenerator | null = null;
  private canvasMode: boolean = true;

  private constructor() {}

  public static getInstance(): AIGameGenerator {
    if (!AIGameGenerator.instance) {
      AIGameGenerator.instance = new AIGameGenerator();
    }
    return AIGameGenerator.instance;
  }

  public setCanvasMode(mode: boolean): void {
    this.canvasMode = mode;
  }

  public async generateMiniGame(topic: string, settings?: GameSettingsData): Promise<MiniGame | null> {
    const useCanvasMode = settings?.useCanvas !== undefined ? settings.useCanvas : this.canvasMode;
    const updatedSettings = {
      ...settings,
      useCanvas: useCanvasMode
    };
    
    return tryGeminiGeneration(null, topic, updatedSettings);
  }
}

export const generateWithGemini = async (
  topic: string, 
  settings?: GameSettingsData
): Promise<MiniGame | null> => {
  const gameType = getGameTypeByTopic(topic);
  const useCanvas = settings?.useCanvas !== undefined ? settings.useCanvas : true;
  
  console.log(`%c🎮 Bắt đầu tạo game: "${topic}" %c(${useCanvas ? 'sử dụng Canvas' : 'không sử dụng Canvas'})`,
    'font-weight: bold; color: #4C75F2;', 'font-weight: normal; color: #718096;');

  // Tạo prompt cải tiến
  const promptOptions = {
    topic,
    useCanvas,
    language: settings?.language || 'vi',
    difficulty: settings?.difficulty || 'medium',
    category: settings?.category || 'general'
  };

  const prompt = generateCustomGamePrompt(promptOptions);

  try {
    console.log('🌐 Đang gọi API Gemini...');
    
    const startTime = Date.now();
    
    const payload = {
      contents: [{
        parts: [{text: prompt}]
      }],
      generationConfig: {
        ...DEFAULT_GENERATION_SETTINGS,
        temperature: 0.7,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 8192
      }
    };
    
    const response = await fetch(getApiEndpoint(), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload)
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`API request failed: ${response.status} ${response.statusText} - ${errorText}`);
    }
    
    const result = await response.json();
    const text = result?.candidates?.[0]?.content?.parts?.[0]?.text || '';
    
    if (!text) {
      throw new Error('Không nhận được nội dung từ API');
    }
    
    const duration = measureExecutionTime(startTime);
    console.log(`%c✅ Nhận phản hồi sau ${duration.seconds}s`, 'color: #10B981; font-weight: bold;');

    // Create game object directly from API response
    const game: MiniGame = {
      title: topic,
      content: text,
      useCanvas: useCanvas
    };
    
    console.log('%c🎯 Game đã được tạo thành công', 'color: #10B981; font-weight: bold;');
    
    return game;
  } catch (error) {
    console.error('🔴 Lỗi khi tạo game với Gemini:', error);
    throw error;
  }
};

// Hàm thử lại khi gặp lỗi
export const tryGeminiGeneration = async (
  model: any,
  topic: string, 
  settings?: GameSettingsData,
  retryCount = 0
): Promise<MiniGame | null> => {
  const maxRetries = 2;
  
  if (retryCount >= maxRetries) {
    console.warn(`⚠️ Đã đạt đến số lần thử lại tối đa (${maxRetries})`);
    return null;
  }
  
  try {
    return await generateWithGemini(topic, settings);
  } catch (error) {
    console.error(`❌ Lần thử ${retryCount + 1} thất bại:`, error);
    
    const waitTime = (retryCount + 1) * 1500;
    await new Promise(resolve => setTimeout(resolve, waitTime));
    
    return tryGeminiGeneration(null, topic, settings, retryCount + 1);
  }
};
