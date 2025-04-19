
/**
 * Game related types
 */

/**
 * Base game settings
 */
export interface GameSettingsData {
  difficulty?: 'easy' | 'medium' | 'hard';
  questionCount?: number;
  timePerQuestion?: number;
  totalTime?: number;
  category?: string;
  prompt?: string;
  useCanvas?: boolean;
}

/**
 * Mini game interface
 */
export interface MiniGame {
  title: string;
  content: string;
  description?: string;
  isSeparatedFiles?: boolean;
}

/**
 * Game type definition
 */
export interface GameType {
  id: string;
  name: string;
  description: string;
  icon: string;
  defaultSettings: GameSettingsData;
  template?: string;
}

/**
 * Game API response
 */
export interface GameApiResponse {
  title?: string;
  content: string;
  description?: string;
}

/**
 * Stored game in history/database
 */
export interface StoredGame {
  id: string;
  title: string;
  description?: string;
  gameType?: string;
  content?: any;
  htmlContent: string;
  createdAt: number | Date;
  expiresAt: number | Date;
}

/**
 * Game participation types
 */
export interface GameParticipant {
  id: string;
  game_id: string;
  name: string;
  timestamp: string | number;
  ipAddress?: string;
  retryCount: number;
}

/**
 * Game session
 */
export interface GameSession {
  id: string;
  title: string;
  htmlContent?: string;
  participants: GameParticipant[];
  createdAt: number;
}
