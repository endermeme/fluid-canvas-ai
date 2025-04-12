
export interface GameSettingsData {
  difficulty: 'easy' | 'medium' | 'hard';
  questionCount: number;
  timePerQuestion: number;
  category: string;
  prompt?: string;
  requestMetadata?: {
    requestId: string;
    timestamp: string;
    contentLength: number;
    source: string;
  };
}

export interface GameType {
  id: string;
  name: string;
  description: string;
  icon: string;
  defaultSettings: GameSettingsData;
  examples: string[];
}
