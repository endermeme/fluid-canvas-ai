
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
}

export type GamePlayStats = {
  played: number;
  completed: number;
  highScore?: number;
  lastPlayed?: string;
};
