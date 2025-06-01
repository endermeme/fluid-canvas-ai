
import { GameSettingsData } from '../types';
import { getGameTypeByTopic } from '../gameTypes';
import { 
  logError, logWarning, logSuccess, 
  measureExecutionTime, createAPIError, categorizeError,
  ERROR_CODES, APIError, SOURCE
} from './apiUtils';
import { 
  GEMINI_MODELS, 
  getApiEndpoint,
  DEFAULT_GENERATION_SETTINGS 
} from '@/constants/api-constants';
import { createGameGenerationPrompt } from './geminiPrompt';
import { parseAPIResponse } from './responseParser';
import { processGameCode } from './gameCodeProcessor';
import type { MiniGame } from './types';

// Request timeout: 3 phút (180 giây)
const REQUEST_TIMEOUT = 180000;

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
    const useCanvasMode = settings?.useCanvas !== undefined ? settings.useCanvas : this.canvasMode;
    const updatedSettings = {
      ...settings,
      useCanvas: useCanvasMode
    };
    
    return generateWithGemini(topic, updatedSettings);
  }
}

export const generateWithGemini = async (
  topic: string, 
  settings?: GameSettingsData
): Promise<MiniGame | null> => {
  const gameType = getGameTypeByTopic(topic);
  const useCanvas = settings?.useCanvas !== undefined ? settings.useCanvas : true;
  
  console.log(`🎮 Generating game: "${topic}" (Canvas: ${useCanvas ? 'Yes' : 'No'})`);

  const prompt = createGameGenerationPrompt({
    topic,
    useCanvas,
    language: settings?.language || 'en',
    difficulty: settings?.difficulty || 'medium',
    category: settings?.category || 'general'
  });

  try {
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
        maxOutputTokens: 4096
      }
    };
    
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT);
    
    const response = await fetch(getApiEndpoint(), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
      signal: controller.signal
    });
    
    clearTimeout(timeoutId);
    
    if (!response.ok) {
      const errorText = await response.text();
      const errorCode = response.status === 429 ? ERROR_CODES.API_QUOTA_EXCEEDED : ERROR_CODES.API_REQUEST_FAILED;
      throw createAPIError(
        errorCode,
        `API request failed: ${response.status} ${response.statusText} - ${errorText}`,
        { status: response.status, topic, model: GEMINI_MODELS.CUSTOM_GAME }
      );
    }
    
    const result = await response.json();
    
    // Parse response và handle cả truncated content
    const { text, hasWarning, warningMessage } = parseAPIResponse(result);
    
    const duration = measureExecutionTime(startTime);
    
    if (hasWarning && warningMessage) {
      logWarning(SOURCE, warningMessage, { duration: duration.seconds });
    } else {
      logSuccess(SOURCE, `Game generated`, { duration: duration.seconds });
    }
    
    // Process game code
    const { title, content } = processGameCode(text);
    
    // Create game object
    const game: MiniGame = {
      title: title || topic,
      content: content,
      useCanvas: useCanvas
    };
    
    console.log(`✅ Game ready: "${game.title}" (${game.content.length} chars)`);
    
    return game;
  } catch (error) {
    const errorCode = categorizeError(error);
    
    if (error instanceof APIError) {
      logError(SOURCE, "API Error occurred", error);
      throw error;
    } else {
      const structuredError = createAPIError(
        errorCode,
        error.message || "Unknown error occurred",
        { topic, useCanvas, originalError: error.name }
      );
      logError(SOURCE, "Error generating game", structuredError);
      throw structuredError;
    }
  }
};

export const tryGeminiGeneration = async (
  model: any,
  topic: string, 
  settings?: GameSettingsData,
  retryCount = 0
): Promise<MiniGame | null> => {
  return await generateWithGemini(topic, settings);
};
