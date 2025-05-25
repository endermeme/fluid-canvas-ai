
export interface GameSettingsData {
  difficulty: 'easy' | 'medium' | 'hard';
  language: 'vi' | 'en';
  useCanvas?: boolean;
  category?: string;
  questionCount?: number;
  timePerQuestion?: number;
  useTimer?: boolean;
}

export interface MiniGameData {
  title: string;
  content: string;
  description?: string;
  category?: string;
  difficulty?: string;
}
