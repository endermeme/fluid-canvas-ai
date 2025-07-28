// Legacy types for backward compatibility
export interface GameParticipant {
  id: string;
  name: string;
  ipAddress?: string;
  timestamp: number | string;
  gameId: string;
  retryCount: number;
  score?: number;
}

// Legacy utils - to be removed
export const addParticipant = async (gameId: string, playerName: string) => {
  console.warn('Using legacy gameParticipation - should migrate to specific custom/preset utils');
  // This is a placeholder - components should migrate to specific participation utils
};

export const updateParticipantActivity = async (gameId: string, playerName: string) => {
  console.warn('Using legacy gameParticipation - should migrate to specific custom/preset utils');
  // This is a placeholder - components should migrate to specific participation utils
};