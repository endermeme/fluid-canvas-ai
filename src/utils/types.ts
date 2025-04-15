
// Game storage types
export interface StoredGame {
  id: string;
  title: string;
  description: string;
  htmlContent: string;
  createdAt: number;
  expiresAt: number;
}

// Game participation types
export interface GameParticipant {
  id: string;
  game_id: string;
  name: string;
  timestamp: string;
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
