
import { GoogleGenerativeAI } from '@google/generative-ai';

// API key
const API_KEY = 'AIzaSyB-X13dE3qKEURW8DxLmK56Vx3lZ1c8IfA';

// Gemini client creation
export const createGeminiClient = (apiKey: string = API_KEY) => {
  try {
    const genAI = new GoogleGenerativeAI(API_KEY);
    const model = genAI.getGenerativeModel({ 
      model: "gemini-2.0-flash",
      generationConfig: {
        temperature: 0.7,
        topP: 0.8,
        topK: 40,
        maxOutputTokens: 8192,
      }
    });
    
    logInfo("Gemini", `Client created successfully with model: gemini-2.0-flash`);
    return model;
  } catch (error) {
    logError("Gemini", "Failed to create client", error);
    throw error;
  }
};

// Common logging utilities
export const logInfo = (source: string, message: string) => {
  console.log(`🔷 ${source}: ${message}`);
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
