
import { GameSettingsData } from '../types';
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

// Đơn giản hóa AIGameGenerator - chỉ giữ tính năng cơ bản
export class AIGameGenerator {
  private static instance: AIGameGenerator | null = null;

  private constructor() {}

  public static getInstance(): AIGameGenerator {
    if (!AIGameGenerator.instance) {
      AIGameGenerator.instance = new AIGameGenerator();
    }
    return AIGameGenerator.instance;
  }

  public async generateMiniGame(topic: string, settings?: GameSettingsData): Promise<MiniGame | null> {
    return tryGeminiGeneration(null, topic, settings);
  }
}

// Hàm chính để tạo game với Gemini - đơn giản hóa
export const generateWithGemini = async (
  topic: string, 
  settings?: GameSettingsData
): Promise<MiniGame | null> => {
  logInfo(SOURCE, `Starting game generation for "${topic}"`, {
    model: GEMINI_MODELS.CUSTOM_GAME,
    apiVersion: API_VERSION,
    settings: settings || {}
  });

  // Tạo prompt đơn giản
  const prompt = createGameGenerationPrompt({ topic });

  try {
    logInfo(SOURCE, `Sending request to Gemini API`);
    
    const startTime = Date.now();
    
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
    
    // Xử lý code để extract thông tin và clean
    const { title, content } = processGameCode(text);
    
    // Tạo đối tượng game
    const game: MiniGame = {
      title: title || topic,
      content: content
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

// Xử lý mã code trả về từ Gemini - giữ nguyên logic này
const processGameCode = (text: string): { title: string, content: string } => {
  let cleanedContent = text.trim();
  let title = 'Interactive Game';
  
  // Xử lý markdown code blocks
  const codeBlockRegex = /```(?:html|javascript)?\s*([\s\S]*?)```/g;
  const allMatches = [...cleanedContent.matchAll(codeBlockRegex)];
  
  if (allMatches.length > 0) {
    const htmlBlockMatch = allMatches.find(match => 
      match[1] && (
        match[1].includes('<!DOCTYPE html>') || 
        match[1].includes('<html')
      )
    );
    
    if (htmlBlockMatch && htmlBlockMatch[1]) {
      cleanedContent = htmlBlockMatch[1].trim();
    } else {
      cleanedContent = allMatches[0][1].trim();
    }
  } else {
    cleanedContent = cleanedContent.replace(/```html|```javascript|```/g, '').trim();
  }

  // Trích xuất tiêu đề từ HTML
  const titleMatch = cleanedContent.match(/<title[^>]*>(.*?)<\/title>/i);
  if (titleMatch && titleMatch[1]) {
    title = titleMatch[1].trim();
  } else {
    const h1Match = cleanedContent.match(/<h1[^>]*>(.*?)<\/h1>/i);
    if (h1Match && h1Match[1]) {
      title = h1Match[1].trim().replace(/<[^>]+>/g, '');
    }
  }
  
  return { 
    title, 
    content: cleanedContent 
  };
};

// Đơn giản hóa tryGeminiGeneration
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
