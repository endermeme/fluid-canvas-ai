
export interface GameAdminSettings {
  id?: string;
  gameId: string;
  adminPassword: string;
  maxParticipants: number;
  requestPlayerInfo?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

/**
 * Lấy cài đặt admin cho một game cụ thể từ localStorage
 */
export const getGameAdminSettings = async (gameId: string): Promise<GameAdminSettings | null> => {
  if (!gameId) return null;
  
  try {
    const backupSettings = localStorage.getItem(`game_admin_${gameId}`);
    if (backupSettings) {
      try {
        const parsed = JSON.parse(backupSettings);
        return {
          gameId,
          adminPassword: parsed.adminPassword || '1234',
          maxParticipants: parsed.maxParticipants || 50,
          requestPlayerInfo: parsed.requestPlayerInfo === undefined ? true : parsed.requestPlayerInfo
        };
      } catch (e) {
        console.error("Error parsing backup settings:", e);
      }
    }
    
    return null;
  } catch (error) {
    console.error("Unexpected error in getGameAdminSettings:", error);
    return null;
  }
};

/**
 * Cập nhật cài đặt admin cho một game
 */
export const updateGameAdminSettings = async (
  settings: GameAdminSettings
): Promise<boolean> => {
  if (!settings.gameId) return false;
  
  try {
    // Lưu trong localStorage
    localStorage.setItem(`game_admin_${settings.gameId}`, JSON.stringify({
      adminPassword: settings.adminPassword,
      maxParticipants: settings.maxParticipants,
      requestPlayerInfo: settings.requestPlayerInfo
    }));
    
    return true;
  } catch (error) {
    console.error("Unexpected error in updateGameAdminSettings:", error);
    return false;
  }
};

/**
 * Xác thực mật khẩu admin
 */
export const verifyAdminPassword = async (
  gameId: string,
  password: string
): Promise<boolean> => {
  if (!gameId || !password) return false;
  
  try {
    const settings = await getGameAdminSettings(gameId);
    if (!settings) return false;
    
    return settings.adminPassword === password;
  } catch (error) {
    console.error("Error verifying admin password:", error);
    return false;
  }
};

/**
 * Kiểm tra xem game đã đạt đến số người tham gia tối đa chưa
 */
export const checkMaxParticipantsReached = async (
  gameId: string,
  currentCount: number
): Promise<boolean> => {
  if (!gameId) return false;
  
  try {
    const settings = await getGameAdminSettings(gameId);
    if (!settings || !settings.maxParticipants) return false;
    
    return currentCount >= settings.maxParticipants;
  } catch (error) {
    console.error("Error checking max participants:", error);
    return false;
  }
};

/**
 * Kiểm tra xem game có yêu cầu thông tin người chơi hay không
 */
export const checkPlayerInfoRequired = async (
  gameId: string
): Promise<boolean> => {
  if (!gameId) return true; // Mặc định là yêu cầu thông tin
  
  try {
    const settings = await getGameAdminSettings(gameId);
    if (!settings) return true;
    
    return settings.requestPlayerInfo !== false;
  } catch (error) {
    console.error("Error checking player info requirement:", error);
    return true;
  }
};

/**
 * Tạo cài đặt admin mặc định cho game mới
 */
export const createDefaultAdminSettings = async (
  gameId: string,
  customSettings?: Partial<GameAdminSettings>
): Promise<GameAdminSettings> => {
  const defaultSettings: GameAdminSettings = {
    gameId,
    adminPassword: customSettings?.adminPassword || '1234',
    maxParticipants: customSettings?.maxParticipants || 50,
    requestPlayerInfo: customSettings?.requestPlayerInfo !== false,
    createdAt: new Date(),
    updatedAt: new Date()
  };
  
  await updateGameAdminSettings(defaultSettings);
  return defaultSettings;
};

/**
 * Kiểm tra và tạo cài đặt admin nếu chưa có
 */
export const ensureAdminSettings = async (
  gameId: string,
  defaultPassword?: string
): Promise<GameAdminSettings> => {
  let settings = await getGameAdminSettings(gameId);
  
  if (!settings) {
    settings = await createDefaultAdminSettings(gameId, {
      adminPassword: defaultPassword || '1234'
    });
  }
  
  return settings;
};
