import { supabase } from '@/integrations/supabase/client';

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
 * Lấy cài đặt admin cho một game cụ thể
 */
export const getGameAdminSettings = async (gameId: string): Promise<GameAdminSettings | null> => {
  if (!gameId) return null;
  
  try {
    // Thử lấy từ database trước
    const { data, error } = await supabase
      .from('game_admin_settings')
      .select('*')
      .eq('game_id', gameId)
      .single();
    
    if (error) {
      console.error("Error fetching admin settings from DB:", error);
      
      // Nếu không có trong DB, thử lấy từ localStorage
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
    }
    
    // Map kết quả từ DB về định dạng GameAdminSettings
    return {
      id: data.id,
      gameId: data.game_id,
      adminPassword: data.admin_password,
      maxParticipants: data.max_participants,
      requestPlayerInfo: data.request_player_info,
      createdAt: new Date(data.created_at),
      updatedAt: new Date(data.updated_at)
    };
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
    // Cập nhật trong database
    const { error } = await supabase
      .from('game_admin_settings')
      .upsert({
        game_id: settings.gameId,
        admin_password: settings.adminPassword,
        max_participants: settings.maxParticipants,
        request_player_info: settings.requestPlayerInfo,
        updated_at: new Date().toISOString()
      }, {
        onConflict: 'game_id'
      });
    
    if (error) {
      console.error("Error updating admin settings in DB:", error);
      
      // Cập nhật trong localStorage làm backup
      try {
        localStorage.setItem(`game_admin_${settings.gameId}`, JSON.stringify({
          adminPassword: settings.adminPassword,
          maxParticipants: settings.maxParticipants,
          requestPlayerInfo: settings.requestPlayerInfo
        }));
      } catch (e) {
        console.error("Error saving backup settings:", e);
      }
      
      return false;
    }
    
    // Cập nhật trong localStorage làm backup
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