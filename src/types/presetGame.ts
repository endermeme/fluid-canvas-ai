// Preset Game Types  
export interface PresetShareSettings {
  password?: string;
  maxParticipants?: number;
  showLeaderboard?: boolean;
  requireRegistration?: boolean;
  customDuration?: number;
  singleParticipationOnly?: boolean;
}

export interface PresetStoredGame {
  id: string;
  title: string;
  gameType: string;
  content?: any;
  data?: any;
  description?: string;
  expiresAt: Date | number;
  createdAt: Date | number;
  settings?: PresetShareSettings;
  creator_ip?: string;
  account_id?: string;
}

export interface PresetGameParticipant {
  id: string;
  name: string;
  ipAddress?: string;
  timestamp: number | string;
  gameId: string;
  retryCount: number;
  score?: number;
}