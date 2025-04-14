
import { v4 as uuidv4 } from 'uuid';

export interface StoredGame {
  id: string;
  title: string;
  description: string;
  htmlContent: string;
  createdAt: number;
  expiresAt: number;
}

// Get the base URL for shared games
const getBaseUrl = () => {
  const url = window.location.origin;
  return `${url}/quiz/shared`;
};

// Save game to localStorage with 48-hour expiration
export const saveGameForSharing = (title: string, description: string, htmlContent: string): string => {
  try {
    if (!htmlContent) {
      console.error("Cannot save empty game content");
      return "";
    }
    
    const id = uuidv4();
    const now = Date.now();
    const expiresAt = now + (48 * 60 * 60 * 1000); // 48 hours in milliseconds
    
    const game: StoredGame = {
      id,
      title: title || "Minigame Tương tác",
      description: description || "",
      htmlContent,
      createdAt: now,
      expiresAt
    };
    
    // Get existing games
    const gamesJson = localStorage.getItem('shared_games');
    let games: StoredGame[] = gamesJson ? JSON.parse(gamesJson) : [];
    
    // Remove expired games
    games = games.filter(game => game.expiresAt > now);
    
    // Check for duplicate content to prevent multiple entries of same game
    const existingGameIndex = games.findIndex(g => g.htmlContent === htmlContent);
    
    if (existingGameIndex >= 0) {
      // Return URL of existing game instead of creating a duplicate
      console.log("Game already exists, returning existing URL");
      return `${getBaseUrl()}/${games[existingGameIndex].id}`;
    }
    
    // Add new game
    games.push(game);
    
    // Save back to localStorage
    localStorage.setItem('shared_games', JSON.stringify(games));
    
    // Return the share URL
    return `${getBaseUrl()}/${id}`;
  } catch (error) {
    console.error("Error saving game:", error);
    return "";
  }
};

// Get a game by ID
export const getSharedGame = (id: string): StoredGame | null => {
  try {
    if (!id) return null;
    
    const gamesJson = localStorage.getItem('shared_games');
    if (!gamesJson) return null;
    
    const games: StoredGame[] = JSON.parse(gamesJson);
    const now = Date.now();
    
    // Find the game with matching ID and not expired
    const game = games.find(g => g.id === id && g.expiresAt > now);
    
    return game || null;
  } catch (error) {
    console.error("Error getting shared game:", error);
    return null;
  }
};

// Clean up expired games
export const cleanupExpiredGames = (): void => {
  try {
    const gamesJson = localStorage.getItem('shared_games');
    if (!gamesJson) return;
    
    const games: StoredGame[] = JSON.parse(gamesJson);
    const now = Date.now();
    
    // Filter out expired games
    const validGames = games.filter(game => game.expiresAt > now);
    
    if (validGames.length !== games.length) {
      localStorage.setItem('shared_games', JSON.stringify(validGames));
    }
  } catch (error) {
    console.error("Error cleaning up expired games:", error);
  }
};

// Get remaining time for a game in milliseconds
export const getRemainingTime = (game: StoredGame | number): number => {
  try {
    const now = Date.now();
    const expiresAt = typeof game === 'number' ? game : game.expiresAt;
    const remainingMs = expiresAt - now;
    
    return Math.max(0, remainingMs);
  } catch (error) {
    console.error("Error calculating remaining time:", error);
    return 0;
  }
};

// Function to format remaining time in hours and minutes
export const formatRemainingTime = (milliseconds: number): string => {
  if (milliseconds <= 0) return 'Đã hết hạn';
  
  const hours = Math.floor(milliseconds / (60 * 60 * 1000));
  const minutes = Math.floor((milliseconds % (60 * 60 * 1000)) / (60 * 1000));
  
  if (hours > 0) {
    return `${hours} giờ ${minutes} phút`;
  }
  return `${minutes} phút`;
};
