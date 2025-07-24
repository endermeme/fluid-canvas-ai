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
  allowDiagonalWords?: boolean;
  showWordList?: boolean;
  bonusTimePerWord?: number;
  categoryCount?: number;
  itemsPerCategory?: number;
  allowMultipleCategories?: boolean;
  showCategoryHints?: boolean;
  useCanvas?: boolean;
  debugMode?: boolean;
  // Advanced scoring settings
  negativeMarking?: boolean;
  timeBonus?: boolean;
  maxAttempts?: number;
  wrongPenalty?: number;
  repetitionMode?: 'normal' | 'spaced' | 'adaptive';
  confidenceLevel?: boolean;
  autoFlipTime?: number;
  bonusTime?: number;
  comboBonus?: boolean;
  mistakePenalty?: number;
  shufflePairs?: boolean;
  allowPartialMatch?: boolean;
  bonusTimePerMatchAdvanced?: number;
  partialCredit?: boolean;
  hintLimit?: number;
  shuffleSentences?: boolean;
  gridSize?: 'small' | 'medium' | 'large';
  timePerQuestionAdvanced?: number;
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
