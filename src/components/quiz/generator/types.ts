
import { GameSettingsData } from '../types';

export interface MiniGame {
  title?: string;
  content?: string;
  useCanvas?: boolean;
  adminPassword?: string;
  maxParticipants?: number;
}

export interface GameApiResponse {
  success: boolean;
  game?: MiniGame;
  error?: string;
}

export interface PromptOptions {
  topic: string;
  useCanvas?: boolean;
  language?: string;
  difficulty?: string;
  category?: string;
  adminPassword?: string;
  maxParticipants?: number;
}

export interface GeneratorSettings {
  temperature?: number;
}
