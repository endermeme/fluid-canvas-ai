import { v4 as uuidv4 } from 'uuid';

/**
 * Cấu trúc dữ liệu của một phiên chơi game
 */
export interface GameSession {
  id: string;
  title: string;
  content: string;
  createdAt: number;
  expireAt: number; // Thời điểm hết hạn (tính bằng timestamp)
  visits: number;
  players: GamePlayer[];
}

/**
 * Thông tin người chơi game
 */
export interface GamePlayer {
  id: string;
  name: string;
  joinedAt: number;
  deviceInfo?: {
    userAgent: string;
    platform: string;
    screenSize: string;
  };
}

// Khóa lưu trữ trong localStorage
const STORAGE_KEY = 'game_sessions';

// Thời gian hết hạn mặc định: 48 giờ (tính bằng mili giây)
const DEFAULT_EXPIRATION = 48 * 60 * 60 * 1000;

/**
 * Lấy tất cả phiên game từ localStorage
 */
export const getAllGameSessions = (): GameSession[] => {
  const sessionsJson = localStorage.getItem(STORAGE_KEY);
  const sessions = sessionsJson ? JSON.parse(sessionsJson) : [];
  return sessions;
};

/**
 * Lưu tất cả phiên game vào localStorage
 */
const saveGameSessions = (sessions: GameSession[]): void => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(sessions));
};

/**
 * Tạo một phiên chơi game mới
 * @param title Tiêu đề game
 * @param content Nội dung HTML của game
 * @param expireHours Thời gian hết hạn tính bằng giờ (mặc định 48 giờ)
 * @returns Thông tin phiên game đã tạo
 */
export const createGameSession = (
  title: string,
  content: string,
  expireHours: number = 48
): GameSession => {
  // Tạo ID ngẫu nhiên cho phiên game
  const sessionId = uuidv4();
  const now = Date.now();
  
  // Tạo đối tượng phiên game mới
  const gameSession: GameSession = {
    id: sessionId,
    title: title || 'Game tương tác',
    content,
    createdAt: now,
    expireAt: now + (expireHours * 60 * 60 * 1000),
    visits: 0,
    players: []
  };
  
  // Lấy danh sách phiên game hiện có
  const gameSessions = getAllGameSessions();
  
  // Thêm phiên game mới
  gameSessions.push(gameSession);
  
  // Lưu lại vào localStorage
  saveGameSessions(gameSessions);
  
  console.log(`[GameSession] Created: ${title} (ID: ${sessionId})`);
  
  return gameSession;
};

/**
 * Lấy thông tin phiên game theo ID
 * @param id ID của phiên game cần lấy
 * @returns Thông tin phiên game hoặc null nếu không tìm thấy
 */
export const getGameSession = (id: string): GameSession | null => {
  const gameSessions = getAllGameSessions();
  const gameSession = gameSessions.find(session => session.id === id);
  
  // Nếu tìm thấy, tăng số lượt truy cập
  if (gameSession) {
    gameSession.visits += 1;
    saveGameSessions(gameSessions);
  }
  
  return gameSession || null;
};

/**
 * Thêm người chơi vào phiên game
 * @param sessionId ID của phiên game
 * @param playerName Tên người chơi
 * @returns Thông tin người chơi đã thêm hoặc null nếu không thêm được
 */
export const addPlayerToSession = (
  sessionId: string,
  playerName: string
): GamePlayer | null => {
  const gameSessions = getAllGameSessions();
  const sessionIndex = gameSessions.findIndex(session => session.id === sessionId);
  
  if (sessionIndex === -1) return null;
  
  const gameSession = gameSessions[sessionIndex];
  
  // Kiểm tra thời hạn
  if (gameSession.expireAt < Date.now()) {
    console.warn(`[GameSession] Session expired: ${sessionId}`);
    return null;
  }
  
  // Tạo thông tin người chơi
  const player: GamePlayer = {
    id: uuidv4(),
    name: playerName,
    joinedAt: Date.now(),
    deviceInfo: {
      userAgent: navigator.userAgent,
      platform: navigator.platform,
      screenSize: `${window.screen.width}x${window.screen.height}`
    }
  };
  
  // Thêm người chơi vào phiên game
  gameSession.players.push(player);
  gameSessions[sessionIndex] = gameSession;
  saveGameSessions(gameSessions);
  
  return player;
};

/**
 * Xóa phiên game theo ID
 * @param id ID của phiên game cần xóa
 * @returns true nếu xóa thành công, false nếu không tìm thấy
 */
export const deleteGameSession = (id: string): boolean => {
  const gameSessions = getAllGameSessions();
  const filteredSessions = gameSessions.filter(session => session.id !== id);
  
  if (filteredSessions.length === gameSessions.length) {
    return false; // Không tìm thấy phiên game để xóa
  }
  
  saveGameSessions(filteredSessions);
  return true;
};

/**
 * Dọn dẹp các phiên game đã hết hạn
 * @returns Số lượng phiên game đã xóa
 */
export const cleanupExpiredSessions = (): number => {
  const gameSessions = getAllGameSessions();
  const now = Date.now();
  
  const validSessions = gameSessions.filter(session => session.expireAt > now);
  const removedCount = gameSessions.length - validSessions.length;
  
  if (removedCount > 0) {
    saveGameSessions(validSessions);
    console.log(`[GameSession] Cleaned up ${removedCount} expired sessions`);
  }
  
  return removedCount;
};

/**
 * Tính thời gian còn lại của phiên game
 * @param expireAt Thời điểm hết hạn
 * @returns Chuỗi mô tả thời gian còn lại
 */
export const getRemainingTime = (expireAt: number): string => {
  const now = Date.now();
  const remaining = expireAt - now;
  
  if (remaining <= 0) return "Đã hết hạn";
  
  const hours = Math.floor(remaining / (60 * 60 * 1000));
  const minutes = Math.floor((remaining % (60 * 60 * 1000)) / (60 * 1000));
  
  if (hours > 0) {
    return `${hours} giờ ${minutes} phút`;
  } else {
    return `${minutes} phút`;
  }
}; 