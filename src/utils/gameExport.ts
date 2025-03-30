
import { v4 as uuidv4 } from 'uuid';
import { useToast } from '@/hooks/use-toast';

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
  // Use dynamic base URL detection for Vercel deployment
  const url = window.location.origin;
  
  // For local development
  if (url.includes('localhost') || url.includes('127.0.0.1')) {
    return `${url}/quiz/shared`;
  }
  
  // For Vercel or other production deployments
  return `${url}/quiz/shared`;
};

// Save game to localStorage with 48-hour expiration
export const saveGameForSharing = (title: string, description: string, htmlContent: string): string => {
  const id = uuidv4();
  const now = Date.now();
  const expiresAt = now + (48 * 60 * 60 * 1000); // 48 hours in milliseconds
  
  const game: StoredGame = {
    id,
    title,
    description,
    htmlContent,
    createdAt: now,
    expiresAt
  };
  
  try {
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
    console.error('Error saving game to localStorage:', error);
    return `${getBaseUrl()}/${id}?error=storage`;
  }
};

// Get a game by ID
export const getSharedGame = (id: string): StoredGame | null => {
  try {
    const gamesJson = localStorage.getItem('shared_games');
    if (!gamesJson) return null;
    
    const games: StoredGame[] = JSON.parse(gamesJson);
    const now = Date.now();
    
    // Find the game with matching ID and not expired
    const game = games.find(g => g.id === id && g.expiresAt > now);
    
    return game || null;
  } catch (error) {
    console.error('Error retrieving game from localStorage:', error);
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
    console.error('Error cleaning up expired games:', error);
  }
};

// Get remaining time for a game in hours and minutes
export const getRemainingTime = (expiresAt: number): string => {
  const now = Date.now();
  const remainingMs = expiresAt - now;
  
  if (remainingMs <= 0) return 'Đã hết hạn';
  
  const hours = Math.floor(remainingMs / (60 * 60 * 1000));
  const minutes = Math.floor((remainingMs % (60 * 60 * 1000)) / (60 * 1000));
  
  return `${hours} giờ ${minutes} phút`;
};

// Check if localStorage is available
export const isStorageAvailable = (): boolean => {
  try {
    const testKey = '__storage_test__';
    localStorage.setItem(testKey, testKey);
    localStorage.removeItem(testKey);
    return true;
  } catch (e) {
    return false;
  }
};
