
export interface GameSettingsData {
  difficulty?: 'easy' | 'medium' | 'hard';
  questionCount?: number;
  timePerQuestion?: number;
  category: string;
  prompt?: string;
  useCanvas?: boolean;
  totalTime?: number;
  bonusTime?: number;
  useTimer?: boolean;
  showExplanation?: boolean;
  shuffleQuestions?: boolean;
  shuffleOptions?: boolean;
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
  allowPartialMatching?: boolean;
  bonusTimePerMatch?: number;
  autoAdvance?: boolean;
  gridSize?: number;
  allowDiagonalWords?: boolean;
  showWordList?: boolean;
  bonusTimePerWord?: number;
  categoryCount?: number;
  itemsPerCategory?: number;
  allowMultipleCategories?: boolean;
  showCategoryHints?: boolean;
  allowMultipleAttempts?: boolean;
  language?: string; // Add the missing language property
  requestMetadata?: {
    requestId?: string;
    timestamp?: string;
    contentLength?: number;
    source?: string;
    useCanvas?: boolean;
  };
}

export interface GameType {
  id: string;
  name: string;
  description: string;
  icon: string;
  defaultSettings: GameSettingsData;
  examples?: string[];
}
