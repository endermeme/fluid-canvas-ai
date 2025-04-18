import { gameTypes } from "../gameTypes";

export interface MiniGame {
  title: string;
  description?: string;
  content?: string; // For backward compatibility
  
  // Separate files format
  htmlContent?: string;
  cssContent?: string;
  jsContent?: string;
  
  // Flag to indicate if using separated files
  isSeparatedFiles?: boolean;
  
  // JSON structure for game definition
  gameStructure?: {
    html: string;
    css: string;
    javascript: string;
    meta?: {
      title?: string;
      description?: string;
      viewport?: string;
    }
  };
  
  items?: any[];
  useCanvas?: boolean;
  gameType?: keyof typeof gameTypes;
}

export interface GameApiResponse {
  title: string;
  content: string;
  description?: string;
}

export interface APISettings {
  apiKey: string;
  model: string;
  temperature: number;
  maxTokens: number;
}

export interface GameGenerationOptions {
  useCanvas?: boolean;
  difficulty?: string;
  language?: string;
  timeLimit?: number;
  category?: string;
}
