
import { GameSettingsData } from '../types';

export interface MiniGame {
  title: string;
  description?: string;
  content: string;
  htmlContent: string;  // HTML content of the game
  cssContent: string;   // CSS content of the game
  jsContent: string;    // JavaScript content of the game
  isSeparatedFiles: boolean;
  useCanvas?: boolean;
}

export interface GameGenerationOptions {
  topic: string;
  settings?: GameSettingsData;
}
