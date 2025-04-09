
import { GoogleGenerativeAI } from '@google/generative-ai';

// API key
const API_KEY = 'AIzaSyB-X13dE3qKEURW8DxLmK56Vx3lZ1c8IfA';

// Initialize Gemini client
export const createGeminiClient = () => {
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
  
  return model;
};

// Default Gemini model instance for reuse
export const defaultGeminiModel = createGeminiClient();
