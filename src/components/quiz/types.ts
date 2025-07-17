// Các loại game và cài đặt

export type Difficulty = 'easy' | 'medium' | 'hard';
export type Category = 'general' | 'history' | 'science' | 'math' | 'geography' | 'arts' | 'custom';
export type Language = 'en' | 'vi';

export interface GameSettingsData {
  difficulty?: Difficulty;
  questionCount?: number;
  cardCount?: number; // For flashcards
  pairCount?: number; // For matching
  timePerQuestion?: number;
  timeLimit?: number; // For matching, memory, etc.
  totalTime?: number;
  bonusTime?: number;
  bonusTimePerMatch?: number; // For matching
  useTimer?: boolean;
  showExplanation?: boolean;
  shuffleQuestions?: boolean;
  shuffleOptions?: boolean;
  category?: Category;
  language?: Language;
  prompt?: string;
  autoFlip?: boolean;
  shuffleCards?: boolean;
  allowHints?: boolean;
  showProgress?: boolean;
  showHints?: boolean;
  progressiveHints?: boolean;
  caseSensitive?: boolean;
  allowSynonyms?: boolean;
  progressiveScoring?: boolean;
  allowCalculator?: boolean;
  roundingPrecision?: number;
  showSteps?: boolean;
  hintCount?: number;
  hintPenalty?: number;
  allowSkip?: boolean;
  shuffleItems?: boolean;
  allowPartialMatching?: boolean; // For matching
  allowMultipleAttempts?: boolean;
  autoAdvance?: boolean;
  gridSize?: number;
  allowDiagonalWords?: boolean;
  showWordList?: boolean;
  bonusTimePerWord?: number;
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
