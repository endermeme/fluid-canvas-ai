
export interface GameSettingsData {
  difficulty: 'easy' | 'medium' | 'hard';
  questionCount: number;
  timePerQuestion: number;
  totalTime?: number; // Total game time in seconds
  timeLimit?: number; // Alternative time limit format for some games
  bonusTimePerCorrect?: number; // Additional time gained per correct answer
  category: 'general' | 'history' | 'science' | 'geography' | 'arts' | 'sports' | 'math';
}

export interface GameType {
  id: string;
  name: string;
  description: string;
  icon: string;
  defaultSettings: GameSettingsData;
}
