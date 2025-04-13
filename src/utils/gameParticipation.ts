
import { v4 as uuidv4 } from 'uuid';

/**
 * Interface for game session data
 */
export interface GameSession {
  id: string;
  title: string;
  content: string;
  createdAt: number;
  expiresAt: number;
}

/**
 * Creates a new game session with the provided content
 * @param title Game title
 * @param content HTML content for the game
 * @returns Game session object
 */
export const createGameSession = (title: string, content: string): GameSession => {
  const id = uuidv4();
  const createdAt = Date.now();
  // Game sessions expire after 48 hours
  const expiresAt = createdAt + (48 * 60 * 60 * 1000);
  
  const gameSession: GameSession = {
    id,
    title,
    content,
    createdAt,
    expiresAt
  };
  
  // Store game session in localStorage
  const gameSessionsJSON = localStorage.getItem('gameSessions');
  const gameSessions = gameSessionsJSON ? JSON.parse(gameSessionsJSON) : [];
  gameSessions.push(gameSession);
  localStorage.setItem('gameSessions', JSON.stringify(gameSessions));
  
  return gameSession;
};

/**
 * Gets a game session by ID
 * @param id Game session ID
 * @returns Game session object or null if not found
 */
export const getGameSession = (id: string): GameSession | null => {
  const gameSessionsJSON = localStorage.getItem('gameSessions');
  if (!gameSessionsJSON) return null;
  
  const gameSessions: GameSession[] = JSON.parse(gameSessionsJSON);
  const gameSession = gameSessions.find(session => session.id === id);
  
  if (!gameSession) return null;
  
  // Check if game session has expired
  if (gameSession.expiresAt < Date.now()) {
    return null;
  }
  
  return gameSession;
};

/**
 * Gets all game sessions
 * @returns Array of game sessions
 */
export const getGameSessions = (): GameSession[] => {
  const gameSessionsJSON = localStorage.getItem('gameSessions');
  if (!gameSessionsJSON) return [];
  
  const gameSessions: GameSession[] = JSON.parse(gameSessionsJSON);
  
  // Remove expired game sessions
  const validSessions = gameSessions.filter(session => session.expiresAt > Date.now());
  
  if (validSessions.length !== gameSessions.length) {
    localStorage.setItem('gameSessions', JSON.stringify(validSessions));
  }
  
  return validSessions;
};

/**
 * Deletes a game session by ID
 * @param id Game session ID
 * @returns true if successful, false otherwise
 */
export const deleteGameSession = (id: string): boolean => {
  const gameSessionsJSON = localStorage.getItem('gameSessions');
  if (!gameSessionsJSON) return false;
  
  const gameSessions: GameSession[] = JSON.parse(gameSessionsJSON);
  const newSessions = gameSessions.filter(session => session.id !== id);
  
  if (newSessions.length === gameSessions.length) {
    return false;
  }
  
  localStorage.setItem('gameSessions', JSON.stringify(newSessions));
  return true;
};
