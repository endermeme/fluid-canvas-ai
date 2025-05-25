
export interface GameSettingsData {
  difficulty: 'easy' | 'medium' | 'hard';
  language?: 'vi' | 'en';
  useCanvas?: boolean;
  category?: string;
}

export interface MiniGameData {
  title: string;
  content: string;
  description?: string;
  category?: string;
  difficulty?: string;
}
