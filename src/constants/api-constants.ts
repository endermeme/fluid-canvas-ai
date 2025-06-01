
/**
 * API Constants for the application
 * Centralized location for all API keys and model configurations
 */

// Google Gemini API Key (public API key)
export const GEMINI_API_KEY = 'AIzaSyB-X13dE3qKEURW8DxLmK56Vx3lZ1c8IfA';

// Gemini Model configurations
export const GEMINI_MODELS = {
  CUSTOM_GAME: "gemini-2.5-pro-preview-05-06",
  PRESET_GAME: "gemini-2.5-pro-preview-05-06"
};

// API Version
export const API_VERSION = "v1beta";

// API Base URL
export const API_BASE_URL = "https://generativelanguage.googleapis.com";

// Full API Endpoint
export const getApiEndpoint = (model = GEMINI_MODELS.CUSTOM_GAME) => 
  `${API_BASE_URL}/${API_VERSION}/models/${model}:generateContent?key=${GEMINI_API_KEY}`;

// AI Generation Settings
export const DEFAULT_GENERATION_SETTINGS = {
  temperature: 0.7,
  topK: 30,
  topP: 0.8,
  maxOutputTokens: 8192,
};

// Request timeout in milliseconds
export const REQUEST_TIMEOUT = 60000; // 60 seconds

// Maximum retry attempts for API calls
export const MAX_RETRY_ATTEMPTS = 3;
