
/**
 * Interface for generated mini-games
 */
export interface MiniGame {
  title: string;
  description?: string;
  content: string;
}

/**
 * Interface for game generation options
 */
export interface GameGenerationOptions {
  difficulty?: 'easy' | 'medium' | 'hard';
  language?: string;
  ageGroup?: string;
  timeLimit?: number;
}
