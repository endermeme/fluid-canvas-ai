
import { GameSettingsData } from '../types';

export interface MiniGame {
  title?: string;
  content?: string;
}

export interface GameApiResponse {
  success: boolean;
  game?: MiniGame;
  error?: string;
}

export interface PromptOptions {
  topic: string;
  language?: string;
  category?: string;
}

export interface GeneratorSettings {
  temperature?: number;
}
