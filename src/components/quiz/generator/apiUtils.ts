
import { GoogleGenerativeAI } from '@google/generative-ai';

// Gemini client creation
export const createGeminiClient = (apiKey: string) => {
  const genAI = new GoogleGenerativeAI(apiKey);
  return genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
};

// OpenAI API key utils
export const getOpenAIKey = (): string | null => {
  return localStorage.getItem('openai_api_key');
};

export const saveOpenAIKey = (key: string): boolean => {
  if (key && key.trim() !== '') {
    localStorage.setItem('openai_api_key', key);
    return true;
  }
  return false;
};

// Validate OpenAI API key format
export const validateOpenAIKey = (key: string): boolean => {
  if (!key || key.trim() === '') return false;
  
  // Accept both "sk-" and "sk-proj-" formats, also accept raw keys for testing
  const isStandardFormat = (key.startsWith('sk-') && key.length > 20) || 
                          (key.startsWith('sk-proj-') && key.length > 30);
  
  console.log(`🔑 Key validation: Format check ${isStandardFormat ? 'passed' : 'failed'} for key: ${key.substring(0, 5)}...${key.substring(key.length - 4)}`);
  
  return isStandardFormat;
};

// Common logging utilities
export const logInfo = (source: string, message: string) => {
  console.log(`${source}: ${message}`);
};

export const logError = (source: string, message: string, error?: any) => {
  console.error(`❌ ${source}: ${message}`, error);
};

export const logWarning = (source: string, message: string) => {
  console.log(`⚠️ ${source}: ${message}`);
};

export const measureExecutionTime = (startTime: number): string => {
  return ((Date.now() - startTime) / 1000).toFixed(2);
};
