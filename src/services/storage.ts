import { v4 as uuidv4 } from 'uuid';
import { MiniGame } from '../components/quiz/generator/types';

// Định nghĩa interfaces cho dữ liệu
export interface GameParticipant {
  id: string;
  name: string;
  ipAddress: string;
  timestamp: number;
  retryCount: number;
  deviceInfo?: {
    userAgent: string;
    platform: string;
    screenSize: string;
  };
}

export interface SharedGame {
  id: string;
  title: string;
  description: string;
  htmlContent: string;
  originalContent?: string;
  thumbnailUrl?: string;
  createdAt: number;
  updatedAt: number;
  viewCount: number;
  participants: GameParticipant[];
  creatorId?: string;
  creatorName?: string;
  isPublic: boolean;
  tags: string[];
  shareUrl: string;
  analytics: {
    lastViewed?: number;
    totalPlays: number;
    uniqueUsers: number;
    averagePlayTime?: number;
    popularityScore: number;
  };
}

export interface StorageStats {
  totalGames: number;
  totalParticipants: number;
  lastUpdated: number;
  popularGames: Array<{id: string, title: string, viewCount: number}>;
}

// Cấu trúc thông báo
export interface StorageNotification {
  id: string;
  type: 'info' | 'warning' | 'error' | 'success';
  title: string;
  message: string;
  createdAt: number;
  expiresAt: number;
  read: boolean;
  relatedGameId?: string;
}

// Khóa lưu trữ trong localStorage
const STORAGE_KEYS = {
  GAMES: 'vps_shared_games',
  STATS: 'vps_storage_stats',
  NOTIFICATIONS: 'vps_notifications'
};

// Tạo dữ liệu giả lập cho VPS storage
const STORAGE_PREFIX = 'https://ai-games-vn.com/share';

// Cập nhật thống kê storage
const updateStorageStats = () => {
  const games = getAllGames();
  const stats: StorageStats = {
    totalGames: games.length,
    totalParticipants: games.reduce((acc, game) => acc + game.participants.length, 0),
    lastUpdated: Date.now(),
    popularGames: games
      .sort((a, b) => b.viewCount - a.viewCount)
      .slice(0, 5)
      .map(game => ({
        id: game.id,
        title: game.title,
        viewCount: game.viewCount
      }))
  };
  
  localStorage.setItem(STORAGE_KEYS.STATS, JSON.stringify(stats));
  return stats;
};

// Lấy tất cả game đã chia sẻ
export const getAllGames = (): SharedGame[] => {
  const gamesJson = localStorage.getItem(STORAGE_KEYS.GAMES);
  return gamesJson ? JSON.parse(gamesJson) : [];
};

// Lấy game theo ID
export const getGameById = (id: string): SharedGame | null => {
  const games = getAllGames();
  const game = games.find(game => game.id === id);
  
  if (game) {
    // Tăng lượt xem và cập nhật thời gian xem cuối
    incrementViewCount(id);
  }
  
  return game || null;
};

// Tăng lượt xem game
export const incrementViewCount = (id: string): void => {
  const games = getAllGames();
  const gameIndex = games.findIndex(game => game.id === id);
  
  if (gameIndex !== -1) {
    games[gameIndex] = {
      ...games[gameIndex],
      viewCount: (games[gameIndex].viewCount || 0) + 1,
      analytics: {
        ...games[gameIndex].analytics,
        lastViewed: Date.now(),
        totalPlays: (games[gameIndex].analytics.totalPlays || 0) + 1
      }
    };
    
    localStorage.setItem(STORAGE_KEYS.GAMES, JSON.stringify(games));
    updateStorageStats();
  }
};

// Lưu trữ game mới
export const storeGame = (gameData: MiniGame, isPublic: boolean = true): SharedGame => {
  const games = getAllGames();
  const id = uuidv4();
  const now = Date.now();
  
  // Tạo thumbnail từ nội dung (có thể thay bằng URL thực tế)
  const thumbnailUrl = `${STORAGE_PREFIX}/thumbnails/${id}.jpg`;
  
  const newGame: SharedGame = {
    id,
    title: gameData.title || 'Untitled Game',
    description: gameData.description || '',
    htmlContent: gameData.content || '',
    originalContent: gameData.content || '',
    thumbnailUrl,
    createdAt: now,
    updatedAt: now,
    viewCount: 0,
    participants: [],
    isPublic,
    tags: extractTagsFromTitle(gameData.title || ''),
    shareUrl: `${STORAGE_PREFIX}/${id}`,
    analytics: {
      totalPlays: 0,
      uniqueUsers: 0,
      popularityScore: 0
    }
  };
  
  games.push(newGame);
  localStorage.setItem(STORAGE_KEYS.GAMES, JSON.stringify(games));
  
  // Cập nhật thống kê
  updateStorageStats();
  
  return newGame;
};

// Cập nhật game
export const updateGame = (id: string, updates: Partial<SharedGame>): SharedGame | null => {
  const games = getAllGames();
  const gameIndex = games.findIndex(game => game.id === id);
  
  if (gameIndex === -1) return null;
  
  // Cập nhật game với dữ liệu mới
  games[gameIndex] = {
    ...games[gameIndex],
    ...updates,
    updatedAt: Date.now()
  };
  
  localStorage.setItem(STORAGE_KEYS.GAMES, JSON.stringify(games));
  updateStorageStats();
  
  return games[gameIndex];
};

// Xóa game
export const deleteGame = (id: string): boolean => {
  const games = getAllGames();
  const filteredGames = games.filter(game => game.id !== id);
  
  if (filteredGames.length === games.length) {
    return false; // Không tìm thấy game để xóa
  }
  
  localStorage.setItem(STORAGE_KEYS.GAMES, JSON.stringify(filteredGames));
  updateStorageStats();
  
  return true;
};

// Thêm người tham gia mới vào game
export const addParticipant = (
  gameId: string, 
  name: string, 
  ipAddress: string, 
  deviceInfo?: GameParticipant['deviceInfo']
): { success: boolean; participant?: GameParticipant; message?: string } => {
  const games = getAllGames();
  const gameIndex = games.findIndex(game => game.id === gameId);
  
  if (gameIndex === -1) {
    return { success: false, message: "Game không tồn tại" };
  }
  
  const game = games[gameIndex];
  
  // Kiểm tra IP đã tham gia chưa
  const existingParticipant = game.participants.find(p => p.ipAddress === ipAddress);
  
  if (existingParticipant) {
    // Tăng số lần thử
    existingParticipant.retryCount += 1;
    
    // Cập nhật thông tin người tham gia
    games[gameIndex] = {
      ...game,
      participants: [
        ...game.participants.filter(p => p.id !== existingParticipant.id),
        existingParticipant
      ]
    };
    
    localStorage.setItem(STORAGE_KEYS.GAMES, JSON.stringify(games));
    
    return { 
      success: false, 
      message: "Bạn đã tham gia game này rồi",
      participant: existingParticipant
    };
  }
  
  // Thêm người tham gia mới
  const participant: GameParticipant = {
    id: uuidv4(),
    name,
    ipAddress,
    timestamp: Date.now(),
    retryCount: 0,
    deviceInfo
  };
  
  game.participants.push(participant);
  games[gameIndex] = {
    ...game,
    analytics: {
      ...game.analytics,
      uniqueUsers: game.participants.length + 1,
      totalPlays: (game.analytics.totalPlays || 0) + 1
    }
  };
  
  localStorage.setItem(STORAGE_KEYS.GAMES, JSON.stringify(games));
  updateStorageStats();
  
  return { success: true, participant };
};

// Lấy thống kê storage
export const getStorageStats = (): StorageStats => {
  const statsJson = localStorage.getItem(STORAGE_KEYS.STATS);
  const savedStats = statsJson ? JSON.parse(statsJson) : null;
  
  if (savedStats && (Date.now() - savedStats.lastUpdated < 3600000)) { // 1 giờ
    return savedStats;
  }
  
  return updateStorageStats();
};

// Lấy danh sách game với phân trang
export const getPaginatedGames = (
  page: number = 1, 
  limit: number = 10, 
  sortBy: 'newest' | 'popular' | 'views' = 'newest'
): { games: SharedGame[], total: number, pages: number } => {
  const allGames = getAllGames();
  
  // Sắp xếp
  let sortedGames = [...allGames];
  if (sortBy === 'newest') {
    sortedGames.sort((a, b) => b.createdAt - a.createdAt);
  } else if (sortBy === 'popular') {
    sortedGames.sort((a, b) => b.analytics.popularityScore - a.analytics.popularityScore);
  } else if (sortBy === 'views') {
    sortedGames.sort((a, b) => b.viewCount - a.viewCount);
  }
  
  // Phân trang
  const total = sortedGames.length;
  const pages = Math.ceil(total / limit);
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  const paginatedGames = sortedGames.slice(startIndex, endIndex);
  
  return { games: paginatedGames, total, pages };
};

// Xuất dữ liệu người tham gia ra CSV
export const exportParticipantsToCSV = (gameId: string): string => {
  const game = getGameById(gameId);
  
  if (!game) return '';
  
  const headers = ['Tên', 'IP', 'Thời gian tham gia', 'Số lần thử', 'Thiết bị'];
  const rows = game.participants.map(p => [
    p.name,
    maskIpAddress(p.ipAddress),
    new Date(p.timestamp).toLocaleString(),
    p.retryCount.toString(),
    p.deviceInfo?.platform || 'Unknown'
  ]);
  
  return [
    headers.join(','),
    ...rows.map(row => row.join(','))
  ].join('\n');
};

// Lấy IP ngẫu nhiên cho demo
export const getFakeIpAddress = (): string => {
  return `${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`;
};

// Ẩn một phần IP để bảo vệ quyền riêng tư
export const maskIpAddress = (ip: string): string => {
  const parts = ip.split('.');
  return `${parts[0]}.${parts[1]}.*.*`;
};

// Trích xuất tags từ title
const extractTagsFromTitle = (title: string): string[] => {
  // Lọc từ có nghĩa từ title
  const words = title.toLowerCase().split(/\s+/);
  const meaningfulWords = words.filter(word => 
    word.length > 3 && 
    !['game', 'play', 'with', 'about', 'trò', 'chơi', 'với', 'về'].includes(word)
  );
  
  // Giới hạn số lượng tags
  return Array.from(new Set(meaningfulWords)).slice(0, 5);
};

// Thêm thông báo mới
export const addNotification = (
  notification: Omit<StorageNotification, 'id' | 'createdAt' | 'read'>
): StorageNotification => {
  const notificationsJson = localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS);
  const notifications: StorageNotification[] = notificationsJson ? JSON.parse(notificationsJson) : [];
  
  // Loại bỏ thông báo hết hạn
  const validNotifications = notifications.filter(n => n.expiresAt > Date.now());
  
  // Tạo thông báo mới
  const newNotification: StorageNotification = {
    id: uuidv4(),
    createdAt: Date.now(),
    read: false,
    ...notification
  };
  
  // Thêm vào danh sách và lưu lại
  validNotifications.push(newNotification);
  localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(validNotifications));
  
  return newNotification;
};

// Lấy tất cả thông báo còn hạn
export const getNotifications = (): StorageNotification[] => {
  const notificationsJson = localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS);
  const notifications: StorageNotification[] = notificationsJson ? JSON.parse(notificationsJson) : [];
  
  // Lọc ra các thông báo còn hạn
  return notifications.filter(n => n.expiresAt > Date.now());
};

// Đánh dấu thông báo đã đọc
export const markNotificationAsRead = (notificationId: string): boolean => {
  const notifications = getNotifications();
  const notificationIndex = notifications.findIndex(n => n.id === notificationId);
  
  if (notificationIndex === -1) return false;
  
  notifications[notificationIndex].read = true;
  localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(notifications));
  
  return true;
};

// Đánh dấu tất cả thông báo đã đọc
export const markAllNotificationsAsRead = (): void => {
  const notifications = getNotifications();
  const updatedNotifications = notifications.map(n => ({ ...n, read: true }));
  localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(updatedNotifications));
};

// Tính toán thời gian còn lại để hiển thị
export const formatRemainingTime = (expiresAt: number): string => {
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

// Kiểm tra và tạo thông báo cho các game sắp hết hạn
export const checkGameExpirations = (): void => {
  const games = getAllGames();
  const now = Date.now();
  
  // Giả định mỗi game có thời hạn 30 ngày
  const expirationDays = 30;
  const expirationWarningDays = 7;
  
  games.forEach(game => {
    // Tính thời gian hết hạn (giả định từ ngày tạo + 30 ngày)
    const expirationDate = game.createdAt + (expirationDays * 24 * 60 * 60 * 1000);
    const warningDate = expirationDate - (expirationWarningDays * 24 * 60 * 60 * 1000);
    
    // Nếu đến ngày cảnh báo nhưng chưa hết hạn
    if (now >= warningDate && now < expirationDate) {
      // Kiểm tra xem đã có thông báo cho game này chưa
      const notifications = getNotifications();
      const hasWarning = notifications.some(n => 
        n.relatedGameId === game.id && n.type === 'warning' && n.title.includes('sắp hết hạn')
      );
      
      if (!hasWarning) {
        // Tạo thông báo mới
        addNotification({
          type: 'warning',
          title: 'Game sắp hết hạn',
          message: `Game "${game.title}" sẽ hết hạn trong ${formatRemainingTime(expirationDate)}. Hãy sao lưu nếu bạn muốn giữ lại.`,
          expiresAt: expirationDate,
          relatedGameId: game.id
        });
      }
    }
  });
};

// Gọi khởi tạo
export const initializeStorage = (): void => {
  const games = getAllGames();
  if (games.length === 0) {
    localStorage.setItem(STORAGE_KEYS.GAMES, JSON.stringify([]));
    updateStorageStats();
  }
  
  // Kiểm tra các game sắp hết hạn
  checkGameExpirations();
};

// Gọi khởi tạo
initializeStorage(); 