
// API Configuration
export const API_VERSION = 'v1beta';
export const BASE_URL = 'https://generativelanguage.googleapis.com';

// Gemini Models - Cập nhật model mới
export const GEMINI_MODELS = {
  CUSTOM_GAME: 'gemini-2.0-flash-exp', // Cập nhật lên model mới nhất
  CONTENT_GENERATION: 'gemini-2.0-flash-exp',
  TEXT_ONLY: 'gemini-2.0-flash-exp'
};

// API Endpoints
export const getApiEndpoint = (model: string = GEMINI_MODELS.CUSTOM_GAME): string => {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY || 'AIzaSyB-X13dE3qKEURW8DxLmK56Vx3lZ1c8IfA';
  return `${BASE_URL}/${API_VERSION}/models/${model}:generateContent?key=${apiKey}`;
};

// Default Generation Settings
export const DEFAULT_GENERATION_SETTINGS = {
  temperature: 0.7,
  topK: 40,
  topP: 0.95,
  maxOutputTokens: 8192,
  candidateCount: 1
};

// Request timeout (30 seconds)
export const REQUEST_TIMEOUT = 30000;

// Rate limiting
export const RATE_LIMIT = {
  maxRequestsPerMinute: 60,
  maxRequestsPerHour: 1000
};
