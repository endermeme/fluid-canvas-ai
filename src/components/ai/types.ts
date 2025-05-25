
/**
 * Type definitions for AI game generation system
 */

export interface MiniGame {
  title: string;
  content: string;
  description?: string;
  category?: string;
  difficulty?: 'easy' | 'medium' | 'hard';
}

export interface PromptOptions {
  topic: string;
  useCanvas?: boolean;
  language?: 'vi' | 'en';
  difficulty?: 'easy' | 'medium' | 'hard';
  category?: string;
}

export interface GeneratorSettings {
  temperature?: number;
  topK?: number;
  topP?: number;
  maxOutputTokens?: number;
}

export interface GameApiResponse {
  success: boolean;
  content?: string;
  error?: string;
  metrics?: {
    tokensUsed: number;
    responseTime: number;
  };
}

export interface GameGenerationOptions {
  useCanvas?: boolean;
  category?: string;
  settings?: GeneratorSettings;
}

export interface GamePromptData {
  topic: string;
  options: GameGenerationOptions;
}
