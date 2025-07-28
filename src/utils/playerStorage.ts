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
    const adjectives = ['Nhanh', 'Thông minh', 'Siêu', 'Pro', 'Giỏi', 'Xuất sắc', 'Khéo', 'Mạnh'];
    const nouns = ['Player', 'Gamer', 'Master', 'Champion', 'Hero', 'Star', 'Ninja', 'Wizard'];
    const randomNumber = Math.floor(Math.random() * 9999) + 1;
    
    const adjective = adjectives[Math.floor(Math.random() * adjectives.length)];
    const noun = nouns[Math.floor(Math.random() * nouns.length)];
    
    return `${adjective}${noun}${randomNumber}`;
  },

  // Check if player should bypass join form (already participated)
  shouldBypassJoinForm: (gameId: string, singleParticipationOnly: boolean = false): boolean => {
    const playerInfo = playerStorageUtils.getPlayerInfo(gameId);
    if (!playerInfo) return false;
    
    console.log('🔍 [DEBUG] shouldBypassJoinForm check:', { 
      gameId, 
      singleParticipationOnly, 
      hasJoined: playerInfo.hasJoined,
      hasCompleted: playerInfo.hasCompleted,
      playerName: playerInfo.playerName
    });
    
    // If single participation only and already completed, don't bypass (show restriction message)
    if (singleParticipationOnly && playerInfo.hasCompleted) {
      return false;
    }
    
    // If player has joined before, bypass form
    return Boolean(playerInfo.hasJoined);
  },

  // Get or generate player name for auto-join
  getOrGeneratePlayerName: (gameId: string): string => {
    const existingInfo = playerStorageUtils.getPlayerInfo(gameId);
    if (existingInfo?.playerName) {
      console.log('🔍 [DEBUG] Found existing player name:', existingInfo.playerName);
      return existingInfo.playerName;
    }
    
    const newName = playerStorageUtils.generatePlayerName();
    console.log('🔍 [DEBUG] Generated new player name:', newName);
    return newName;
  },

  // Get creator IP (simplified for now)
  getCreatorIp: (): string | null => {
    return localStorage.getItem('creator_ip') || null;
  },

  // Save creator IP
  saveCreatorIp: (ip: string): void => {
    localStorage.setItem('creator_ip', ip);
  },

  // Get player name for specific game
  getPlayerName: (gameId: string): string | null => {
    const playerInfo = playerStorageUtils.getPlayerInfo(gameId);
    return playerInfo?.playerName || null;
  },

  // Save player name for specific game
  savePlayerName: (gameId: string, playerName: string): void => {
    playerStorageUtils.savePlayerInfo(gameId, playerName);
  }
};