
import { GameSettingsData, GameType } from "../types";

export interface MiniGame {
  title: string;
  description?: string;
  
  // Combined format (for backward compatibility)
  content?: string;
  
  // Separate files format
  htmlContent?: string;
  cssContent?: string;
  jsContent?: string;
  
  // Flag to indicate if using separate files
  isSeparatedFiles?: boolean;
  
  items?: any[];
  useCanvas?: boolean;
  gameType?: GameType;
}

export interface GameApiResponse {
  title: string;
  content: string;
  description?: string;
  
  // New fields for separated content
  htmlContent?: string;
  cssContent?: string;
  jsContent?: string;
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
