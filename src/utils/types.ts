
// Định nghĩa các kiểu dữ liệu chung cho toàn bộ ứng dụng
export interface StoredGame {
  id: string;
  title: string;
  gameType: string;
  content?: any;
  htmlContent: string;
  description?: string;
  expiresAt: Date | number;
  createdAt: Date | number;
}

export interface GameParticipant {
  id: string;
  name: string;
  ipAddress?: string;
  timestamp: number | string;
  gameId: string;
  retryCount: number;
}
