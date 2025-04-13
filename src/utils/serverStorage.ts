
import axios from 'axios';
import { StoredGame } from './gameExport';
import { v4 as uuidv4 } from 'uuid';

// Cấu hình server
const SERVER_URL = 'https://ai-games-vn.com/api'; // URL của VPS Ubuntu
const API_ENDPOINTS = {
  GAMES: '/games',
  GAME: '/games/:id',
  PARTICIPANTS: '/games/:id/participants',
  STATS: '/stats',
};

// Interface cho response từ server
export interface ServerResponse<T> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
  timestamp?: number;
}

// Interface cho dữ liệu người dùng
export interface UserSession {
  id: string;
  deviceId: string;
  ipAddress: string;
  userAgent: string;
  lastActive: number;
}

// Lấy hoặc tạo deviceId cho người dùng
const getDeviceId = (): string => {
  let deviceId = localStorage.getItem('device_id');
  if (!deviceId) {
    deviceId = uuidv4();
    localStorage.setItem('device_id', deviceId);
  }
  return deviceId;
};

// Lưu game mới lên server
export const saveGameToServer = async (
  title: string,
  description: string,
  htmlContent: string
): Promise<ServerResponse<{ gameId: string, shareUrl: string }>> => {
  try {
    const deviceId = getDeviceId();
    
    const response = await axios.post(`${SERVER_URL}${API_ENDPOINTS.GAMES}`, {
      title,
      description,
      htmlContent,
      deviceId,
      createdAt: Date.now(),
    });
    
    // Lưu ID của game vào localStorage để truy cập nhanh
    const gameIds = JSON.parse(localStorage.getItem('created_game_ids') || '[]');
    gameIds.push(response.data.data.gameId);
    localStorage.setItem('created_game_ids', JSON.stringify(gameIds));
    
    return response.data;
  } catch (error) {
    console.error('Error saving game to server:', error);
    return {
      success: false,
      message: 'Không thể lưu game lên server',
      error: error instanceof Error ? error.message : String(error),
      timestamp: Date.now()
    };
  }
};

// Lấy game từ server theo ID
export const getGameFromServer = async (id: string): Promise<ServerResponse<StoredGame>> => {
  try {
    // Tăng số lượt xem khi lấy game
    const deviceId = getDeviceId();
    
    const response = await axios.get(
      `${SERVER_URL}${API_ENDPOINTS.GAME.replace(':id', id)}`,
      { params: { deviceId } }
    );
    
    return response.data;
  } catch (error) {
    console.error('Error getting game from server:', error);
    return {
      success: false,
      message: 'Không thể lấy game từ server',
      error: error instanceof Error ? error.message : String(error),
      timestamp: Date.now()
    };
  }
};

// Lấy danh sách game từ server
export const getGamesFromServer = async (
  page: number = 1,
  limit: number = 10,
  sortBy: string = 'newest'
): Promise<ServerResponse<{ games: StoredGame[], total: number, pages: number }>> => {
  try {
    const deviceId = getDeviceId();
    
    const response = await axios.get(`${SERVER_URL}${API_ENDPOINTS.GAMES}`, {
      params: { page, limit, sortBy, deviceId }
    });
    
    return response.data;
  } catch (error) {
    console.error('Error getting games from server:', error);
    return {
      success: false,
      message: 'Không thể lấy danh sách game từ server',
      error: error instanceof Error ? error.message : String(error),
      timestamp: Date.now()
    };
  }
};

// Thêm người tham gia mới vào game
export const addParticipantToGame = async (
  gameId: string,
  name: string
): Promise<ServerResponse<any>> => {
  try {
    const deviceId = getDeviceId();
    
    const response = await axios.post(
      `${SERVER_URL}${API_ENDPOINTS.PARTICIPANTS.replace(':id', gameId)}`,
      {
        name,
        deviceId,
        timestamp: Date.now(),
        userAgent: navigator.userAgent
      }
    );
    
    return response.data;
  } catch (error) {
    console.error('Error adding participant to game:', error);
    return {
      success: false,
      message: 'Không thể thêm người tham gia vào game',
      error: error instanceof Error ? error.message : String(error),
      timestamp: Date.now()
    };
  }
};

// Xóa game trên server
export const deleteGameFromServer = async (gameId: string): Promise<ServerResponse<any>> => {
  try {
    const deviceId = getDeviceId();
    
    const response = await axios.delete(
      `${SERVER_URL}${API_ENDPOINTS.GAME.replace(':id', gameId)}`,
      {
        data: { deviceId }  // Để xác thực quyền xóa
      }
    );
    
    // Nếu xóa thành công, cũng xóa khỏi danh sách local
    if (response.data.success) {
      const gameIds = JSON.parse(localStorage.getItem('created_game_ids') || '[]');
      const updatedIds = gameIds.filter((id: string) => id !== gameId);
      localStorage.setItem('created_game_ids', JSON.stringify(updatedIds));
    }
    
    return response.data;
  } catch (error) {
    console.error('Error deleting game from server:', error);
    return {
      success: false,
      message: 'Không thể xóa game khỏi server',
      error: error instanceof Error ? error.message : String(error),
      timestamp: Date.now()
    };
  }
};

// Lấy thống kê từ server
export const getServerStats = async (): Promise<ServerResponse<any>> => {
  try {
    const deviceId = getDeviceId();
    
    const response = await axios.get(`${SERVER_URL}${API_ENDPOINTS.STATS}`, {
      params: { deviceId }
    });
    
    return response.data;
  } catch (error) {
    console.error('Error getting server stats:', error);
    return {
      success: false,
      message: 'Không thể lấy thống kê từ server',
      error: error instanceof Error ? error.message : String(error),
      timestamp: Date.now()
    };
  }
};

// Kiểm tra trạng thái server
export const checkServerStatus = async (): Promise<boolean> => {
  try {
    const response = await axios.get(`${SERVER_URL}/health`);
    return response.data.status === 'ok';
  } catch (error) {
    console.error('Server health check failed:', error);
    return false;
  }
};

// Fallback logic để sử dụng localStorage khi server không khả dụng
export const saveGameWithFallback = async (
  title: string,
  description: string,
  htmlContent: string
): Promise<{ gameId: string, shareUrl: string, savedToServer: boolean }> => {
  try {
    // Thử lưu lên server trước
    const serverResponse = await saveGameToServer(title, description, htmlContent);
    
    if (serverResponse.success && serverResponse.data) {
      return {
        ...serverResponse.data,
        savedToServer: true
      };
    }
    
    // Nếu không thành công, sử dụng localStorage
    throw new Error('Server storage failed');
  } catch (error) {
    console.warn('Falling back to local storage:', error);
    
    // Sử dụng function từ gameExport.ts để lưu vào localStorage
    const gameId = uuidv4();
    const now = Date.now();
    const expiresAt = now + (30 * 24 * 60 * 60 * 1000); // 30 ngày
    
    const game: StoredGame = {
      id: gameId,
      title,
      description,
      htmlContent,
      createdAt: now,
      expiresAt,
      viewCount: 0
    };
    
    // Lưu vào localStorage
    const gamesJSON = localStorage.getItem('shared_games');
    const games = gamesJSON ? JSON.parse(gamesJSON) : [];
    games.push(game);
    localStorage.setItem('shared_games', JSON.stringify(games));
    
    return {
      gameId,
      shareUrl: `${window.location.origin}/share/${gameId}`,
      savedToServer: false
    };
  }
};
