
export interface GameSettingsData {
  difficulty: 'easy' | 'medium' | 'hard';
  questionCount: number;
  timePerQuestion: number;
  category: 'general' | 'history' | 'science' | 'geography' | 'arts' | 'sports' | 'math';
  layout?: 'horizontal' | 'vertical' | 'grid'; // Added layout property as optional
}

export interface GameType {
  id: string;
  name: string;
  description: string;
  icon: string;
  defaultSettings: GameSettingsData;
}
