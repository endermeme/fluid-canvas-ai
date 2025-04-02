
import { v4 as uuidv4 } from 'uuid';

export interface StoredGame {
  id: string;
  title: string;
  description: string;
  htmlContent: string;
  createdAt: number;
  expiresAt: number;
  isShared: boolean;
}

// Get the base URL for shared games
const getBaseUrl = () => {
  const url = window.location.origin;
  return `${url}/quiz/shared`;
};

// Save game to localStorage with 48-hour expiration for sharing and 10-day history
export const saveGameForSharing = (title: string, description: string, htmlContent: string): string => {
  const id = uuidv4();
  const now = Date.now();
  const shareExpiresAt = now + (48 * 60 * 60 * 1000); // 48 hours for sharing
  
  const game: StoredGame = {
    id,
    title,
    description,
    htmlContent,
    createdAt: now,
    expiresAt: shareExpiresAt,
    isShared: true
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
  
  // Also save to history
  saveToHistory(game);
  
  // Return the share URL
  return `${getBaseUrl()}/${id}`;
};

// Save game to history (without sharing)
export const saveGameToHistory = (title: string, description: string, htmlContent: string): void => {
  const id = uuidv4();
  const now = Date.now();
  const historyExpiresAt = now + (10 * 24 * 60 * 60 * 1000); // 10 days for history
  
  const game: StoredGame = {
    id,
    title,
    description,
    htmlContent,
    createdAt: now,
    expiresAt: historyExpiresAt,
    isShared: false
  };
  
  saveToHistory(game);
};

// Private helper to save to history
const saveToHistory = (game: StoredGame): void => {
  // Get existing history
  const historyJson = localStorage.getItem('game_history');
  let history: StoredGame[] = historyJson ? JSON.parse(historyJson) : [];
  
  // Filter out expired entries (older than 10 days)
  const now = Date.now();
  const tenDaysAgo = now - (10 * 24 * 60 * 60 * 1000);
  history = history.filter(item => item.createdAt >= tenDaysAgo);
  
  // Add new game to history
  history.unshift(game); // Add to the beginning (newest first)
  
  // Limit to reasonable number of entries
  const MAX_HISTORY = 100;
  if (history.length > MAX_HISTORY) {
    history = history.slice(0, MAX_HISTORY);
  }
  
  // Save back to localStorage
  localStorage.setItem('game_history', JSON.stringify(history));
};

// Get a game by ID (either shared or from history)
export const getSharedGame = (id: string): StoredGame | null => {
  const now = Date.now();
  
  // Check shared games first
  const gamesJson = localStorage.getItem('shared_games');
  if (gamesJson) {
    const games: StoredGame[] = JSON.parse(gamesJson);
    const game = games.find(g => g.id === id && g.expiresAt > now);
    if (game) return game;
  }
  
  // If not found in shared, check history
  const historyJson = localStorage.getItem('game_history');
  if (historyJson) {
    const history: StoredGame[] = JSON.parse(historyJson);
    const game = history.find(g => g.id === id && g.expiresAt > now);
    return game || null;
  }
  
  return null;
};

// Get all history items
export const getGameHistory = (): StoredGame[] => {
  const historyJson = localStorage.getItem('game_history');
  if (!historyJson) return [];
  
  const history: StoredGame[] = JSON.parse(historyJson);
  const now = Date.now();
  
  // Filter out any expired items
  return history.filter(game => game.expiresAt > now);
};

// Clean up expired games (both shared and history)
export const cleanupExpiredGames = (): void => {
  const now = Date.now();
  
  // Clean up shared games
  const gamesJson = localStorage.getItem('shared_games');
  if (gamesJson) {
    const games: StoredGame[] = JSON.parse(gamesJson);
    const validGames = games.filter(game => game.expiresAt > now);
    
    if (validGames.length !== games.length) {
      localStorage.setItem('shared_games', JSON.stringify(validGames));
    }
  }
  
  // Clean up game history
  const historyJson = localStorage.getItem('game_history');
  if (historyJson) {
    const history: StoredGame[] = JSON.parse(historyJson);
    const validHistory = history.filter(game => game.expiresAt > now);
    
    if (validHistory.length !== history.length) {
      localStorage.setItem('game_history', JSON.stringify(validHistory));
    }
  }
};

// Get remaining time for a game in hours and minutes
export const getRemainingTime = (expiresAt: number): string => {
  const now = Date.now();
  const remainingMs = expiresAt - now;
  
  if (remainingMs <= 0) return 'Đã hết hạn';
  
  const hours = Math.floor(remainingMs / (60 * 60 * 1000));
  const minutes = Math.floor((remainingMs % (60 * 60 * 1000)) / (60 * 1000));
  
  if (hours > 24) {
    const days = Math.floor(hours / 24);
    const remainingHours = hours % 24;
    return `${days} ngày ${remainingHours} giờ`;
  }
  
  return `${hours} giờ ${minutes} phút`;
};

// Share an existing game from history
export const shareGameFromHistory = (id: string): string | null => {
  // Get the game from history
  const historyJson = localStorage.getItem('game_history');
  if (!historyJson) return null;
  
  const history: StoredGame[] = JSON.parse(historyJson);
  const game = history.find(g => g.id === id);
  
  if (!game) return null;
  
  // Update the game to be shared with 48-hour expiration
  const now = Date.now();
  const shareExpiresAt = now + (48 * 60 * 60 * 1000);
  
  const sharedGame: StoredGame = {
    ...game,
    expiresAt: shareExpiresAt,
    isShared: true
  };
  
  // Get existing shared games
  const gamesJson = localStorage.getItem('shared_games');
  let games: StoredGame[] = gamesJson ? JSON.parse(gamesJson) : [];
  
  // Remove expired games
  games = games.filter(g => g.expiresAt > now);
  
  // Add this game
  games.push(sharedGame);
  
  // Save back to localStorage
  localStorage.setItem('shared_games', JSON.stringify(games));
  
  // Update the game in history
  const updatedHistory = history.map(g => 
    g.id === id ? { ...g, isShared: true } : g
  );
  localStorage.setItem('game_history', JSON.stringify(updatedHistory));
  
  // Return the share URL
  return `${getBaseUrl()}/${id}`;
};

