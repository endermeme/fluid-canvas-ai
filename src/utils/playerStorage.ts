// Utility functions for managing player data in localStorage

export interface PlayerInfo {
  playerName: string;
  timestamp: number;
  hasJoined?: boolean;
  hasCompleted?: boolean;
  gameType?: string;
  joinedAt?: number;
  completedAt?: number;
  score?: number;
}

const PLAYER_KEY_PREFIX = 'game_player_info_';

export const playerStorageUtils = {
  // Save player info for a specific game
  savePlayerInfo: (gameId: string, playerName: string, additionalData?: Partial<PlayerInfo>): void => {
    const existingInfo = playerStorageUtils.getPlayerInfo(gameId);
    const playerInfo: PlayerInfo = {
      ...existingInfo,
      playerName,
      timestamp: Date.now(),
      ...additionalData
    };
    
    localStorage.setItem(`${PLAYER_KEY_PREFIX}${gameId}`, JSON.stringify(playerInfo));
  },

  // Get player info for a specific game
  getPlayerInfo: (gameId: string): PlayerInfo | null => {
    try {
      const stored = localStorage.getItem(`${PLAYER_KEY_PREFIX}${gameId}`);
      if (!stored) return null;
      
      const playerInfo: PlayerInfo = JSON.parse(stored);
      
      // Check if data is recent (within 7 days)
      const sevenDaysAgo = Date.now() - (7 * 24 * 60 * 60 * 1000);
      if (playerInfo.timestamp < sevenDaysAgo) {
        localStorage.removeItem(`${PLAYER_KEY_PREFIX}${gameId}`);
        return null;
      }
      
      return playerInfo;
    } catch (error) {
      console.error('Error getting player info from localStorage:', error);
      return null;
    }
  },

  // Clear player info for a specific game
  clearPlayerInfo: (gameId: string): void => {
    localStorage.removeItem(`${PLAYER_KEY_PREFIX}${gameId}`);
  },

  // Check if player has already joined the game
  hasPlayerJoined: (gameId: string): boolean => {
    const playerInfo = playerStorageUtils.getPlayerInfo(gameId);
    return Boolean(playerInfo?.hasJoined);
  },

  // Check if player has completed the game
  hasPlayerCompleted: (gameId: string): boolean => {
    const playerInfo = playerStorageUtils.getPlayerInfo(gameId);
    return Boolean(playerInfo?.hasCompleted);
  },

  // Mark player as joined
  markPlayerAsJoined: (gameId: string, playerName: string, gameType: string): void => {
    playerStorageUtils.savePlayerInfo(gameId, playerName, {
      hasJoined: true,
      joinedAt: Date.now(),
      gameType
    });
  },

  // Mark player as completed
  markPlayerAsCompleted: (gameId: string, score?: number): void => {
    const existingInfo = playerStorageUtils.getPlayerInfo(gameId);
    if (existingInfo) {
      playerStorageUtils.savePlayerInfo(gameId, existingInfo.playerName, {
        hasCompleted: true,
        completedAt: Date.now(),
        score
      });
    }
  },

  // Check if player can participate (for single participation games)
  canPlayerParticipate: (gameId: string, singleParticipationOnly: boolean): boolean => {
    if (!singleParticipationOnly) return true;
    
    const playerInfo = playerStorageUtils.getPlayerInfo(gameId);
    return !playerInfo?.hasCompleted;
  },

  // Generate a random player name
  generatePlayerName: (): string => {
    const adjectives = ['Nhanh', 'Thông minh', 'Siêu', 'Pro', 'Giỏi', 'Xuất sắc'];
    const nouns = ['Player', 'Gamer', 'Master', 'Champion', 'Hero', 'Star'];
    const randomNumber = Math.floor(Math.random() * 1000);
    
    const adjective = adjectives[Math.floor(Math.random() * adjectives.length)];
    const noun = nouns[Math.floor(Math.random() * nouns.length)];
    
    return `${adjective}${noun}${randomNumber}`;
  }
};