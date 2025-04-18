
// Game storage types
export interface StoredGame {
  id: string;
  title: string;
  description?: string; // Changed from required to optional
  gameType?: string;
  content?: any;
  htmlContent: string;
  createdAt: number | Date;
  expiresAt: number | Date;
}

// Game participation types
export interface GameParticipant {
  id: string;
  game_id: string;
  name: string;
  timestamp: string | number;
  ipAddress?: string;
  retryCount: number;
}

export interface GameSession {
  id: string;
  title: string;
  htmlContent?: string;
  participants: GameParticipant[];
  createdAt: number;
}
