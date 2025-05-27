
// API Constants for Gemini AI
export const GEMINI_API_KEY = 'AIzaSyA7wP0XfY-JJBhZJMy2Kt1z9IQ6b3vEo5c';

export const GEMINI_MODELS = {
  PRESET_GAME: 'gemini-2.0-flash',
  CUSTOM_GAME: 'gemini-2.0-flash'
};

export const getApiEndpoint = (model: string) => {
  return `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${GEMINI_API_KEY}`;
};

export const DEFAULT_GENERATION_SETTINGS = {
  temperature: 0.7,
  topK: 40,
  topP: 0.95,
  maxOutputTokens: 8192
};
