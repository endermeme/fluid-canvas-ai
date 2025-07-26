// Utility functions for managing player data in localStorage

export interface PlayerInfo {
  playerName: string;
  timestamp: number;
}

const PLAYER_KEY_PREFIX = 'game_player_info_';

export const playerStorageUtils = {
  // Save player info for a specific game
  savePlayerInfo: (gameId: string, playerName: string): void => {
    const playerInfo: PlayerInfo = {
      playerName,
      timestamp: Date.now()
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