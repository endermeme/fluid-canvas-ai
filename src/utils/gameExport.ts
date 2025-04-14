
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

// Calculate remaining time for a game
export const getRemainingTime = (expiresAt: number): string => {
  try {
    const now = Date.now();
    const remainingMs = expiresAt - now;
    
    if (remainingMs <= 0) return 'Đã hết hạn';
    
    const hours = Math.floor(remainingMs / (60 * 60 * 1000));
    const minutes = Math.floor((remainingMs % (60 * 60 * 1000)) / (60 * 1000));
    
    return `${hours} giờ ${minutes} phút`;
  } catch (error) {
    console.error("Error calculating remaining time:", error);
    return "Không xác định";
  }
};
