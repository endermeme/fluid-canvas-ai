import { GameSettingsData } from '../shared/types';

export interface MiniGame {
  title?: string;
  content?: string;
  useCanvas?: boolean;
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
}

export interface GeneratorSettings {
  temperature?: number;
  topK?: number;
  topP?: number;
  candidateCount?: number;
  maxOutputTokens?: number;
}
