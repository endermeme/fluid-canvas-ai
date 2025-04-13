
/**
 * API Constants for the application
 * Centralized location for all API keys and model configurations
 */

// Google Gemini API Key
export const GEMINI_API_KEY = 'AIzaSyB-X13dE3qKEURW8DxLmK56Vx3lZ1c8IfA';

// Gemini Model configurations
export const GEMINI_MODELS = {
  DEFAULT: "gemini-2.0-flash",
  PRO: "gemini-2.0-flash",
  VISION: "gemini-2.0-flash"
};

// API Version
export const API_VERSION = "v1beta";

// API Base URL
export const API_BASE_URL = "https://generativelanguage.googleapis.com";

// AI Generation Settings
export const DEFAULT_GENERATION_SETTINGS = {
  temperature: 0.8,
  topK: 40,
  topP: 0.95,
  maxOutputTokens: 8192,
};

// Request timeout in milliseconds
export const REQUEST_TIMEOUT = 60000; // 60 seconds

// Maximum retry attempts for API calls
export const MAX_RETRY_ATTEMPTS = 3;
