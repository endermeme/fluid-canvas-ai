import { GameSettingsData } from '../shared/types';

/**
 * Interface cho response từ API game
 */
export interface GameApiResponse {
  success: boolean;
  content?: string;
  error?: string;
}

/**
 * Interface cho mini game
 */
export interface MiniGame {
  title: string;
  content: string;
  useCanvas?: boolean;
}

/**
 * Options cho việc tạo prompt
 */
export interface PromptOptions {
  topic: string;
  useCanvas?: boolean;
  language?: string;
  difficulty?: 'easy' | 'medium' | 'hard';
  category?: string;
}

export interface GeneratorSettings {
  temperature?: number;
  topK?: number;
  topP?: number;
  candidateCount?: number;
  maxOutputTokens?: number;
}
