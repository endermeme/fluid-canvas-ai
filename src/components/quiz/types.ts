
export interface GameSettingsData {
  difficulty: 'easy' | 'medium' | 'hard';
  questionCount: number;
  timePerQuestion: number;
  category: string;
}

export interface GameType {
  id: string;
  name: string;
  description?: string;
  icon: string;
  defaultSettings: GameSettingsData;
  template?: string; // Add template property for predefined games
}
