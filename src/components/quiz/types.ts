// Các loại game và cài đặt

export type Difficulty = 'easy' | 'medium' | 'hard';
export type Category = 'general' | 'history' | 'science' | 'math' | 'geography' | 'arts' | 'custom';
export type Language = 'en' | 'vi';
export type TimerMode = 'normal' | 'progressive' | 'rush' | 'relaxed';
export type GridSize = '3x4' | '4x4' | '4x5' | '5x6';
export type FlipSpeed = 'slow' | 'normal' | 'fast';

export interface GameSettingsData {
  difficulty?: Difficulty;
  questionCount?: number;
  timePerQuestion?: number;
  totalTime?: number;
  bonusTime?: number;
  useTimer?: boolean;
  
  // Enhanced Timer System
  timerMode?: TimerMode;
  performanceBonus?: boolean;
  timePenalty?: boolean;
  speedBonus?: boolean;
  // Quiz-specific settings
  showExplanation?: boolean;
  shuffleQuestions?: boolean;
  shuffleOptions?: boolean;
  allowSkip?: boolean;
  
  // Memory game settings
  gridSize?: GridSize;
  allowHints?: boolean;
  progressiveHints?: boolean;
  
  // Flashcards settings
  autoFlip?: boolean;
  shuffleCards?: boolean;
  flipSpeed?: FlipSpeed;
  showProgress?: boolean;
  
  // Word Search settings
  allowDiagonalWords?: boolean;
  showWordList?: boolean;
  bonusTimePerWord?: number;
  
  // Matching game settings
  allowPartialMatching?: boolean;
  bonusTimePerMatch?: number;
  
  // Ordering game settings
  allowMultipleAttempts?: boolean;
  caseSensitive?: boolean;
  
  // True/False settings
  progressiveScoring?: boolean;
  confidenceMode?: boolean;
  category?: Category;
  language?: Language;
  prompt?: string;
  
  // Legacy fields (keeping for compatibility)
  allowSynonyms?: boolean;
  allowCalculator?: boolean;
  roundingPrecision?: number;
  showSteps?: boolean;
  hintCount?: number;
  hintPenalty?: number;
  shuffleItems?: boolean;
  autoAdvance?: boolean;
  categoryCount?: number;
  itemsPerCategory?: number;
  allowMultipleCategories?: boolean;
  showCategoryHints?: boolean;
  useCanvas?: boolean;
  debugMode?: boolean;
}

export interface GameType {
  id: string;
  name: string;
  description: string;
  icon: string;
  defaultSettings: GameSettingsData;
}

// Cấu trúc game và câu hỏi
export interface GameQuestion {
  question: string;
  options?: string[];
  correctAnswer?: string | number;
  explanation?: string;
  imageUrl?: string;
  id?: string;
  category?: string;
  tags?: string[];
  difficulty?: Difficulty;
}

export interface Game {
  id: string;
  title: string;
  type: string;
  questions: GameQuestion[];
  settings: GameSettingsData;
  created: Date;
  lastPlayed?: Date;
  playCount?: number;
  score?: number;
  isPublic?: boolean;
}
