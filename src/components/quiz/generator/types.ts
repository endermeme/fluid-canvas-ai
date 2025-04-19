
export interface MiniGame {
  title: string;
  content: string;
  description?: string;
  useCanvas?: boolean;
  isSeparatedFiles?: boolean;
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

export interface GameSettingsData {
  difficulty?: 'easy' | 'medium' | 'hard';
  questionCount?: number;
  timePerQuestion?: number;
  category?: string;
  useCanvas?: boolean;
  language?: string;
}
