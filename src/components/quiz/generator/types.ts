
export interface MiniGame {
  title: string;
  content: string;
  description?: string;
  useCanvas?: boolean;
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
