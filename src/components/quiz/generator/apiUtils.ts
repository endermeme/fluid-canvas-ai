
import { GoogleGenerativeAI } from '@google/generative-ai';

// API key cứng
const API_KEY = 'AIzaSyB-X13dE3qKEURW8DxLmK56Vx3lZ1c8IfA';

// Gemini client creation
export const createGeminiClient = (apiKey: string = API_KEY) => {
  // Luôn sử dụng API_KEY cứng
  const genAI = new GoogleGenerativeAI(API_KEY);
  return genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
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
