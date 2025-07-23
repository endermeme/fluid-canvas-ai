

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
  password?: string;
  maxParticipants?: number;
  showLeaderboard?: boolean;
  requireRegistration?: boolean;
  customDuration?: number;
}

export interface GameParticipant {
  id: string;
  name: string;
  ipAddress?: string;
  timestamp: number | string;
  gameId: string;
  retryCount: number;
  score?: number;
}

export interface GameSession {
  id: string;
  title: string;
  gameType?: string;
  content?: any;
  htmlContent?: string;
  description?: string;
  expiresAt?: Date | number;
  createdAt: number;
  participants: GameParticipant[];
}

// Interface cho dữ liệu từ Supabase
export interface SupabaseGameParticipant {
  id: string;
  name: string;
  ip_address?: string;
  timestamp: string;
  game_id: string;
  retry_count: number;
  score?: number;  // Thêm trường score vào đây
}

