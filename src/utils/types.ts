// Legacy types for backward compatibility
export interface GameSession {
  id: string;
  name: string;
  title: string;
  timestamp: string;
  createdAt: number;
  participants: any[];
}

export interface GameParticipant {
  id: string;
  name: string;
  ipAddress?: string;
  timestamp: number | string;
  gameId: string;
  retryCount: number;
  score?: number;
}

// Additional legacy types
export interface LegacyGame {
  id: string;
  title: string;
  type: string;
  createdAt: string;
  participants: GameParticipant[];
}