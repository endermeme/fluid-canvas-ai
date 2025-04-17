
import { gameTypes } from "../gameTypes";

export interface MiniGame {
  title: string;
  description?: string;
  content?: string; // For backward compatibility
  
  // Separate files format
  htmlContent?: string;
  cssContent?: string;
  jsContent?: string;
  
  // Flag to indicate if using separate files
  isSeparatedFiles?: boolean;
  
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
