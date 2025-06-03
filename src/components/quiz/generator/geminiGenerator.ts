import { GameSettingsData } from '../types';
import { getGameTypeByTopic } from '../gameTypes';
import { 
  logInfo, logError, logWarning, logSuccess, 
  measureExecutionTime
} from './apiUtils';
import { 
  GEMINI_MODELS, 
  API_VERSION, 
  getApiEndpoint,
  DEFAULT_GENERATION_SETTINGS 
} from '@/constants/api-constants';
import { createGameGenerationPrompt } from './geminiPrompt';
import type { MiniGame, GameApiResponse } from './types';

const SOURCE = "GEMINI";

// Export the MiniGame type for use in other files
export type { MiniGame } from './types';

// Tạo lớp AIGameGenerator để giữ tương thích với code cũ
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
    // Sử dụng biến canvasMode từ instance
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
  
  logInfo(SOURCE, `Starting game generation for "${topic}"`, {
    model: GEMINI_MODELS.CUSTOM_GAME,
    apiVersion: API_VERSION,
    type: gameType?.name || "Not specified",
    settings: settings || {},
    canvasMode: useCanvas ? "enabled" : "disabled"
  });

  // Tạo prompt với template cải tiến từ geminiPrompt.ts
  const prompt = createGameGenerationPrompt({
    topic,
    useCanvas,
    language: settings?.language || 'en',
    difficulty: settings?.difficulty || 'medium',
    category: settings?.category || 'general'
  });

  try {
    logInfo(SOURCE, `Sending request to Gemini API`);
    
    const startTime = Date.now();
    
    // Đơn giản hóa payload API request
    const payload = {
      contents: [{
        role: "user",
        parts: [{text: prompt}]
      }],
      generationConfig: {
        ...DEFAULT_GENERATION_SETTINGS,
        temperature: 0.7
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
      throw new Error('No content returned from API');
    }
    
    const duration = measureExecutionTime(startTime);
    logSuccess(SOURCE, `Response received in ${duration.seconds}s`);
    
    // Tạo phiên bản gỡ lỗi để xem code gốc
    logInfo(SOURCE, `Generated Game Code (Original):`, text.substring(0, 500) + '...');
    
    // Xử lý code để extract thông tin và clean
    const { title, content } = processGameCode(text);
    
    // Tạo đối tượng game
    const game: MiniGame = {
      title: title || topic,
      content: content,
      useCanvas: useCanvas
    };
    
    logSuccess(SOURCE, "Game generated successfully", {
      title: game.title,
      contentLength: game.content.length,
      hasDocType: game.content.includes('<!DOCTYPE')
    });
    
    return game;
  } catch (error) {
    logError(SOURCE, "Error generating with Gemini", error);
    throw error;
  }
};

/**
 * Xử lý mã code trả về từ Gemini - đơn giản hóa tối đa
 */
const processGameCode = (text: string): { title: string, content: string } => {
  // Loại bỏ cú pháp markdown đơn giản
  let cleanedContent = text.trim();
  let title = 'Interactive Game';
  
  // 1. Xử lý markdown code blocks - chỉ lấy nội dung HTML trong block
  const codeBlockRegex = /```(?:html|javascript)?\s*([\s\S]*?)```/g;
  const allMatches = [...cleanedContent.matchAll(codeBlockRegex)];
  
  if (allMatches.length > 0) {
    // Tìm block chứa HTML đầy đủ (ưu tiên có DOCTYPE hoặc thẻ html)
    const htmlBlockMatch = allMatches.find(match => 
      match[1] && (
        match[1].includes('<!DOCTYPE html>') || 
        match[1].includes('<html')
      )
    );
    
    if (htmlBlockMatch && htmlBlockMatch[1]) {
      cleanedContent = htmlBlockMatch[1].trim();
    } else {
      // Nếu không tìm thấy block HTML hoàn chỉnh, dùng block đầu tiên
      cleanedContent = allMatches[0][1].trim();
    }
  } else {
    // Không tìm thấy code block, giữ nguyên nội dung nhưng xóa các dấu markdown
    cleanedContent = cleanedContent.replace(/```html|```javascript|```/g, '').trim();
  }

  // 2. Trích xuất tiêu đề từ HTML nếu có
  const titleMatch = cleanedContent.match(/<title[^>]*>(.*?)<\/title>/i);
  if (titleMatch && titleMatch[1]) {
    title = titleMatch[1].trim();
  } else {
    // Thử tìm trong H1
    const h1Match = cleanedContent.match(/<h1[^>]*>(.*?)<\/h1>/i);
    if (h1Match && h1Match[1]) {
      title = h1Match[1].trim().replace(/<[^>]+>/g, ''); // Loại bỏ các thẻ HTML trong tiêu đề
    }
  }
  
  return { 
    title, 
    content: cleanedContent 
  };
};

export const tryGeminiGeneration = async (
  model: any,
  topic: string, 
  settings?: GameSettingsData,
  retryCount = 0
): Promise<MiniGame | null> => {
  const maxRetries = 3;
  
  if (retryCount >= maxRetries) {
    logWarning(SOURCE, `Reached maximum retries (${maxRetries})`);
    return null;
  }
  
  try {
    return await generateWithGemini(topic, settings);
  } catch (error) {
    logError(SOURCE, `Attempt ${retryCount + 1} failed`, error);
    
    const waitTime = (retryCount + 1) * 1500;
    await new Promise(resolve => setTimeout(resolve, waitTime));
    
    return tryGeminiGeneration(null, topic, settings, retryCount + 1);
  }
};
