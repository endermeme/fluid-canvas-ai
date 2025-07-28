// Shared types for game components
export interface GameParticipant {
  id: string;
  name: string;
  joined_at: string | Date;
  gameId: string;
  retryCount: number;
  score?: number;
}