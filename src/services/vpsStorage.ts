import { v4 as uuidv4 } from 'uuid';
import { SharedGame } from './storage';

const VPS_URL = 'https://ai-games-vn.com/api';

// Mô phỏng quá trình lưu trữ trên VPS
export interface VpsStorageResponse {
  success: boolean;
  message: string;
  data?: any;
  error?: string;
  serverTime?: number;
}

// Mô phỏng độ trễ mạng
const simulateNetworkDelay = async (minMs = 200, maxMs = 800): Promise<void> => {
  const delay = Math.floor(Math.random() * (maxMs - minMs + 1)) + minMs;
  return new Promise(resolve => setTimeout(resolve, delay));
};

// Mô phỏng lưu trữ file lên VPS
export const uploadGameToVps = async (
  htmlContent: string, 
  metadata: { title: string, description?: string }
): Promise<VpsStorageResponse> => {
  try {
    // Mô phỏng request lên server
    console.log(`%c VPS STORAGE %c Uploading game: ${metadata.title}`, 
      'background: #0366d6; color: white; padding: 2px 6px; border-radius: 4px; font-weight: bold;', '');
    
    // Mô phỏng độ trễ mạng
    await simulateNetworkDelay();
    
    // Mô phỏng phản hồi từ server
    const gameId = uuidv4();
    const serverResponse: VpsStorageResponse = {
      success: true,
      message: "Lưu trữ game thành công",
      data: {
        gameId,
        fileUrl: `${VPS_URL}/games/${gameId}/index.html`,
        shareUrl: `https://ai-games-vn.com/share/${gameId}`,
        createdAt: Date.now()
      },
      serverTime: Date.now()
    };
    
    // Log kết quả
    console.log(`%c VPS STORAGE %c Upload successful`, 
      'background: #2ea44f; color: white; padding: 2px 6px; border-radius: 4px; font-weight: bold;', '',
      serverResponse.data);
    
    return serverResponse;
  } catch (error) {
    console.error(`%c VPS STORAGE %c Upload failed`, 
      'background: #d73a49; color: white; padding: 2px 6px; border-radius: 4px; font-weight: bold;', '',
      error);
    
    return {
      success: false,
      message: "Lỗi khi lưu trữ game",
      error: error instanceof Error ? error.message : String(error),
      serverTime: Date.now()
    };
  }
};

// Mô phỏng tạo thumbnail cho game
export const generateThumbnail = async (htmlContent: string, gameId: string): Promise<string> => {
  console.log(`%c VPS STORAGE %c Generating thumbnail`, 
    'background: #0366d6; color: white; padding: 2px 6px; border-radius: 4px; font-weight: bold;', '');
  
  // Mô phỏng tạo thumbnail
  await simulateNetworkDelay(800, 1500);
  
  // Trả về URL thumbnail giả định
  return `${VPS_URL}/thumbnails/${gameId}.jpg`;
};

// Mô phỏng tạo và lấy link rút gọn
export const getShortenedUrl = async (originalUrl: string): Promise<string> => {
  await simulateNetworkDelay(100, 300);
  
  // Tạo mã rút gọn 6 ký tự
  const shortCode = Math.random().toString(36).substring(2, 8);
  return `https://agi.vn/${shortCode}`;
};

// Mô phỏng tải game từ VPS
export const loadGameFromVps = async (gameId: string): Promise<VpsStorageResponse> => {
  console.log(`%c VPS STORAGE %c Loading game: ${gameId}`, 
    'background: #0366d6; color: white; padding: 2px 6px; border-radius: 4px; font-weight: bold;', '');
  
  await simulateNetworkDelay();
  
  // Mô phỏng việc tải game từ localStorage như một trường hợp fallback
  const storedGamesJson = localStorage.getItem('vps_shared_games');
  const storedGames: SharedGame[] = storedGamesJson ? JSON.parse(storedGamesJson) : [];
  const game = storedGames.find(g => g.id === gameId);
  
  if (game) {
    return {
      success: true,
      message: "Tải game thành công",
      data: {
        game,
        loadedFromVps: true,
        accessTime: Date.now()
      },
      serverTime: Date.now()
    };
  }
  
  return {
    success: false,
    message: "Không tìm thấy game",
    error: "Game không tồn tại hoặc đã bị xóa",
    serverTime: Date.now()
  };
};

// Mô phỏng xóa game trên VPS
export const deleteGameFromVps = async (gameId: string): Promise<VpsStorageResponse> => {
  console.log(`%c VPS STORAGE %c Deleting game: ${gameId}`, 
    'background: #d73a49; color: white; padding: 2px 6px; border-radius: 4px; font-weight: bold;', '');
  
  await simulateNetworkDelay();
  
  return {
    success: true,
    message: "Xóa game thành công",
    data: {
      gameId,
      deletedAt: Date.now()
    },
    serverTime: Date.now()
  };
};

// Mô phỏng kiểm tra tình trạng VPS
export const checkVpsStatus = async (): Promise<{
  online: boolean;
  diskSpace: { total: number; used: number; free: number };
  memoryUsage: { total: number; used: number; free: number };
  serverLoad: number[];
}> => {
  await simulateNetworkDelay(100, 400);
  
  return {
    online: true,
    diskSpace: {
      total: 50 * 1024, // 50GB in MB
      used: Math.floor(Math.random() * 20) * 1024, // 0-20GB in MB
      free: 30 * 1024 // 30GB in MB
    },
    memoryUsage: {
      total: 8 * 1024, // 8GB in MB
      used: Math.floor(Math.random() * 4) * 1024, // 0-4GB in MB
      free: 4 * 1024 // 4GB in MB
    },
    serverLoad: [
      Math.random() * 2, // 1 minute load
      Math.random() * 1.5, // 5 minute load
      Math.random() * 1 // 15 minute load
    ]
  };
}; 