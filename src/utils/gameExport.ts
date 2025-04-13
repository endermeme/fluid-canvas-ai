
import { v4 as uuidv4 } from 'uuid';
import { GameSession, createGameSession, getGameSession, getGameSessions } from './gameParticipation';
import { saveGameToServer, saveGameWithFallback } from './serverStorage';

/**
 * Interface for game data stored in localStorage
 */
export interface StoredGame {
  id: string;
  title: string;
  description: string;
  htmlContent: string;
  createdAt: number;
  expiresAt: number;
  viewCount: number;
}

/**
 * Calculate remaining time for game expiration in human-readable format
 * @param expiresAt Expiration timestamp
 * @returns Formatted time string
 */
export const getRemainingTime = (expiresAt: number): string => {
  const now = Date.now();
  const remainingMs = expiresAt - now;
  
  if (remainingMs <= 0) return 'Đã hết hạn';
  
  const days = Math.floor(remainingMs / (24 * 60 * 60 * 1000));
  const hours = Math.floor((remainingMs % (24 * 60 * 60 * 1000)) / (60 * 60 * 1000));
  const minutes = Math.floor((remainingMs % (60 * 60 * 1000)) / (60 * 1000));
  
  if (days > 0) {
    return `${days} ngày ${hours} giờ`;
  } else if (hours > 0) {
    return `${hours} giờ ${minutes} phút`;
  } else {
    return `${minutes} phút`;
  }
};

/**
 * Saves a game for sharing and returns the URL
 * @param title Game title
 * @param description Game description
 * @param htmlContent HTML content of the game
 * @returns Promise that resolves to the URL for accessing the shared game
 */
export const saveGameForSharing = async (
  title: string,
  description: string,
  htmlContent: string
): Promise<string> => {
  try {
    // Thử lưu vào VPS trước
    const serverResult = await saveGameWithFallback(title, description, htmlContent);
    
    // Trả về URL có thể truy cập game
    return serverResult.shareUrl;
  } catch (error) {
    console.error("Error saving game:", error);
    
    // Fallback to local storage only if everything else fails
    const gameSession = createGameSession(title, htmlContent);
    
    // Cũng lưu vào shared_games để tương thích ngược
    const storedGame: StoredGame = {
      id: gameSession.id,
      title: gameSession.title,
      description,
      htmlContent: gameSession.content,
      createdAt: gameSession.createdAt,
      expiresAt: gameSession.expiresAt,
      viewCount: 0
    };
    
    // Lưu trong localStorage
    const gamesJSON = localStorage.getItem('shared_games');
    const games = gamesJSON ? JSON.parse(gamesJSON) : [];
    games.push(storedGame);
    localStorage.setItem('shared_games', JSON.stringify(games));
    
    // Trả về URL có thể truy cập game
    return `${window.location.origin}/game/${gameSession.id}`;
  }
};

/**
 * Gets a shared game by ID
 * @param id Game ID
 * @returns Game data or null if not found
 */
export const getSharedGame = (id: string): StoredGame | null => {
  // Lưu ý: Hàm này vẫn giữ nguyên để tương thích ngược
  // Trong thực tế, ta nên sử dụng getGameFromServer từ serverStorage.ts
  
  // Đầu tiên thử lấy từ gameSessions (triển khai gần đây hơn)
  const gameSession = getGameSession(id);
  if (gameSession) {
    return {
      id: gameSession.id,
      title: gameSession.title,
      description: '',
      htmlContent: gameSession.content,
      createdAt: gameSession.createdAt,
      expiresAt: gameSession.expiresAt,
      viewCount: 0
    };
  }
  
  // Nếu không, thử lấy từ shared_games
  const gamesJSON = localStorage.getItem('shared_games');
  if (!gamesJSON) return null;
  
  const games: StoredGame[] = JSON.parse(gamesJSON);
  const game = games.find(g => g.id === id);
  
  if (!game) return null;
  
  // Kiểm tra xem đã hết hạn chưa
  if (game.expiresAt < Date.now()) {
    // Xóa game đã hết hạn
    const updatedGames = games.filter(g => g.id !== id);
    localStorage.setItem('shared_games', JSON.stringify(updatedGames));
    return null;
  }
  
  // Tăng số lượt xem
  game.viewCount = (game.viewCount || 0) + 1;
  localStorage.setItem('shared_games', JSON.stringify(games));
  
  return game;
};

/**
 * Cleans up expired games from localStorage
 */
export const cleanupExpiredGames = (): void => {
  // Dọn dẹp gameSessions
  getGameSessions(); // Điều này đã thực hiện dọn dẹp nội bộ
  
  // Dọn dẹp shared_games
  const gamesJSON = localStorage.getItem('shared_games');
  if (!gamesJSON) return;
  
  const games: StoredGame[] = JSON.parse(gamesJSON);
  const now = Date.now();
  const validGames = games.filter(game => game.expiresAt > now);
  
  if (validGames.length !== games.length) {
    localStorage.setItem('shared_games', JSON.stringify(validGames));
  }
};
