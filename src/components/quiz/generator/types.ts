
export interface MiniGame {
  title: string;
  description: string;
  content: string;
}

export interface GameGenerationOptions {
  useCanvas?: boolean;
  category?: string;
  difficulty?: 'easy' | 'medium' | 'hard';
  timeLimit?: number;
}
