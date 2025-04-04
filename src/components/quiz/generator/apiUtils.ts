
import { GoogleGenerativeAI } from '@google/generative-ai';

export const createGeminiClient = (apiKey: string) => {
  const genAI = new GoogleGenerativeAI(apiKey);
  return genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
};

// OpenAI storage utils
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
