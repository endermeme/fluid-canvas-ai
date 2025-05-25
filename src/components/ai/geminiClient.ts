import { GoogleGenerativeAI } from '@google-ai/generative-ai';
import { GameApiResponse, GeneratorSettings } from './types';

const MODEL_NAME = 'gemini-1.5-pro-001';

const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY || "");

const model = genAI.getModel({
  model: MODEL_NAME,
  generationConfig: {
    temperature: 0.6,
    topK: 20,
    topP: 0.95,
    maxOutputTokens: 4096,
  },
});

export const generateWithGemini = async (
  prompt: string,
  settings: GeneratorSettings = {}
): Promise<GameApiResponse> => {
  const startTime = Date.now();
  
  try {
    const generationConfig = {
      temperature: settings.temperature || 0.6,
      topK: settings.topK || 20,
      topP: settings.topP || 0.95,
      maxOutputTokens: settings.maxOutputTokens || 4096,
    };

    const model = genAI.getModel({
      model: MODEL_NAME,
      generationConfig,
    });
    
    const response = await model.generateContent(prompt);
    const responseTime = Date.now() - startTime;
    
    if (!response.response) {
      throw new Error('No response received from Gemini');
    }

    const content = response.response.text();
    
    return {
      success: true,
      content,
      metrics: {
        tokensUsed: 0, // Note: Usage metadata không khả dụng trong phiên bản hiện tại
        responseTime
      }
    };
  } catch (error) {
    console.error('Gemini generation error:', error);
    const responseTime = Date.now() - startTime;
    
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
      metrics: {
        tokensUsed: 0,
        responseTime
      }
    };
  }
};

export const countTokens = async (text: string): Promise<number> => {
  try {
    const model = genAI.getModel({ model: MODEL_NAME });
    const { totalTokens } = await model.countTokens(text);
    return totalTokens;
  } catch (error) {
    console.error("Error counting tokens:", error);
    return 0;
  }
};
