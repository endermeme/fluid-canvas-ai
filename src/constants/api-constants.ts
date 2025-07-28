
/**
 * API Constants for the application
 * Centralized location for all API keys and model configurations
 */

// Google Gemini API Key (public API key)
export const GEMINI_API_KEY = 'AIzaSyB-X13dE3qKEURW8DxLmK56Vx3lZ1c8IfA';

// Gemini Model configurations - cập nhật sang flash model
export const GEMINI_MODELS = {
  CUSTOM_GAME: "gemini-2.0-flash",
  PRESET_GAME: "gemini-2.0-flash"
};

// OpenRouter API configurations
export const OPENROUTER_CONFIG = {
  BASE_URL: "https://openrouter.ai/api/v1/chat/completions",
  MODEL: "moonshotai/kimi-k2"
};

// API Version
const API_VERSION = "v1beta";

// API Base URL
const API_BASE_URL = "https://generativelanguage.googleapis.com";

// Full API Endpoint
export const getApiEndpoint = (model = GEMINI_MODELS.CUSTOM_GAME) => 
  `${API_BASE_URL}/${API_VERSION}/models/${model}:generateContent?key=${GEMINI_API_KEY}`;

// OpenRouter API Endpoint
export const getOpenRouterEndpoint = () => OPENROUTER_CONFIG.BASE_URL;

// AI Generation Settings - đơn giản hóa
export const DEFAULT_GENERATION_SETTINGS = {
  temperature: 0.3
  // Không cần thêm các thông số phức tạp khác
};
