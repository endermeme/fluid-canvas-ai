// Custom Game Types
export interface CustomShareSettings {
  password?: string;
  maxParticipants?: number;
  showLeaderboard?: boolean;
  requireRegistration?: boolean;
  customDuration?: number;
  singleParticipationOnly?: boolean;
}

export interface CustomStoredGame {
  id: string;
  title: string;
  content?: any;
  htmlContent: string;
  description?: string;
  expiresAt: Date | number;
  createdAt: Date | number;
  settings?: CustomShareSettings;
  creator_ip?: string;
  account_id?: string;
}

export interface CustomGameParticipant {
  id: string;
  name: string;
  ipAddress?: string;
  timestamp: number | string;
  gameId: string;
  retryCount: number;
  score?: number;
}