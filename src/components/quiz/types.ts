
export type GameType = {
  id: string;
  name: string;
  description: string;
  icon: string;
  defaultSettings: GameSettingsData;
};

export interface GameSettingsData {
  difficulty: 'easy' | 'medium' | 'hard';
  questionCount: number;
  timePerQuestion: number;
  category: 'general' | 'history' | 'science' | 'geography' | 'arts' | 'sports' | 'math';
  totalTime?: number;
  bonusTime?: number;
  useTimer?: boolean;
  prompt?: string; // Add prompt field to settings
  
  // Quiz game settings
  showExplanation?: boolean;
  shuffleQuestions?: boolean;
  shuffleOptions?: boolean;
  
  // Flashcard settings
  autoFlip?: boolean;
  shuffleCards?: boolean;
  allowHints?: boolean;
  showProgress?: boolean;
  
  // Unjumble/Ordering settings
  showHints?: boolean;
  progressiveHints?: boolean;
  
  // Sentence completion settings
  caseSensitive?: boolean;
  allowSynonyms?: boolean;
  
  // Math generator settings
  allowCalculator?: boolean;
  roundingPrecision?: number;
  showSteps?: boolean;
  
  // Progressive scoring
  progressiveScoring?: boolean;
  
  // Riddle settings
  hintCount?: number;
  hintPenalty?: number;
  allowSkip?: boolean;
  
  // Matching settings
  shuffleItems?: boolean;
  allowPartialMatching?: boolean;
  bonusTimePerMatch?: number;
  
  // Pictionary settings
  allowMultipleAttempts?: boolean;
  autoAdvance?: boolean;
  
  // Word search settings
  gridSize?: number;
  allowDiagonalWords?: boolean;
  showWordList?: boolean;
  bonusTimePerWord?: number;
  
  // Categorizing settings
  categoryCount?: number;
  itemsPerCategory?: number;
  allowMultipleCategories?: boolean;
  showCategoryHints?: boolean;
}

export type GamePlayStats = {
  played: number;
  completed: number;
  highScore?: number;
  lastPlayed?: string;
};
