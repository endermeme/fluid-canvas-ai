
import { GameSettingsData } from '../types';

export interface MiniGame {
  title: string;
  description?: string;
  content: string;
  htmlContent?: string;
  cssContent?: string;
  jsContent?: string;
  isSeparatedFiles?: boolean;
  useCanvas?: boolean;
}

export interface GameGenerationOptions {
  topic: string;
  settings?: GameSettingsData;
}
