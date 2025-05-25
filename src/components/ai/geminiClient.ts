
/**
 * Gemini Client - Handles communication with Google's Gemini API
 */

import { GoogleGenerativeAI } from '@google/generative-ai';
import { GEMINI_MODELS } from '@/constants/api-constants';
import type { GameApiResponse, GeneratorSettings } from './types';

interface GeminiCallOptions {
  prompt: string;
  model?: string;
  temperature?: number;
  settings?: GeneratorSettings;
}

export const callGeminiAPI = async (options: GeminiCallOptions): Promise<GameApiResponse> => {
  const { prompt, model = GEMINI_MODELS.CUSTOM_GAME, temperature = 0.7, settings } = options;

  try {
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
    
    if (!apiKey) {
      throw new Error('Gemini API key not found');
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const geminiModel = genAI.getGenerativeModel({ model });

    const generationConfig = {
      temperature: settings?.temperature || temperature,
      topK: settings?.topK || 40,
      topP: settings?.topP || 0.95,
      maxOutputTokens: settings?.maxOutputTokens || 8192,
    };

    const result = await geminiModel.generateContent({
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      generationConfig,
    });

    const response = await result.response;
    const content = response.text();

    if (!content) {
      throw new Error('Empty response from Gemini API');
    }

    return {
      success: true,
      content,
      metrics: {
        tokensUsed: response.usageMetadata?.totalTokenCount || 0,
        responseTime: Date.now()
      }
    };

  } catch (error) {
    console.error('Gemini API Error:', error);
    
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    };
  }
};
