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

// Legacy functions for backward compatibility
export const maskIpAddress = (ip: string) => {
  if (!ip || ip === 'N/A') return 'N/A';
  const parts = ip.split('.');
  if (parts.length === 4) {
    return `${parts[0]}.${parts[1]}.xxx.xxx`;
  }
  return ip.substring(0, Math.max(0, ip.length - 4)) + 'xxxx';
};

export const getAllGameSessions = async () => {
  console.warn('Using legacy getAllGameSessions - should use specific custom/preset APIs');
  return [];
};

export const getGameSession = async (gameId: string) => {
  console.warn('Using legacy getGameSession - should use specific custom/preset APIs');
  return null;
};

export const exportParticipantsToCSV = async (gameId: string) => {
  console.warn('Using legacy exportParticipantsToCSV - should use specific custom/preset APIs');
  return '';
};