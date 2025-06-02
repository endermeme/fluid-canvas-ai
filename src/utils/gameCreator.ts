import { supabase } from '@/integrations/supabase/client';
import { v4 as uuidv4 } from 'uuid';
import { saveGameForSharing } from './gameExport';

export interface GameCreationOptions {
  title: string;
  htmlContent: string;
  description?: string;
  expiryDays?: number;
  adminPassword?: string;
  maxParticipants?: number;
  requestPlayerInfo?: boolean;
}

export const createAndShareGame = async (options: GameCreationOptions) => {
  try {
    const gameId = uuidv4();
    
    // Tính thời gian hết hạn (mặc định 30 ngày)
    const expiryDays = options.expiryDays || 30;
    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + expiryDays);
    
    // Kiểm tra xem có sử dụng tính năng admin không
    const adminEnabled = !!(options.adminPassword || options.maxParticipants || options.requestPlayerInfo === true);
    
    // Lưu game vào Supabase
    const { data, error } = await supabase
      .from('games')
      .insert([
        {
          id: gameId,
          title: options.title,
          html_content: options.htmlContent,
          description: options.description || `Game ${options.title}`,
          game_type: 'custom',
          is_preset: false,
          is_published: true,
          admin_enabled: adminEnabled,
          created_at: new Date().toISOString(),
          expires_at: expiryDate.toISOString()
        }
      ])
      .select();
    
    if (error) {
      throw error;
    }
    
    // Lưu cài đặt admin vào database nếu có
    if (adminEnabled) {
      // Lưu vào database
      const { error: adminError } = await supabase
        .from('game_admin_settings')
        .insert([
          {
            game_id: gameId,
            admin_password: options.adminPassword || '1234',
            max_participants: options.maxParticipants || 50,
            request_player_info: options.requestPlayerInfo === undefined ? true : options.requestPlayerInfo
          }
        ]);
      
      if (adminError) {
        console.error("Error saving admin settings:", adminError);
      }
      
      // Lưu backup vào localStorage
      const adminConfig = {
        adminPassword: options.adminPassword || '1234',
        maxParticipants: options.maxParticipants || 50,
        requestPlayerInfo: options.requestPlayerInfo
      };
      
      localStorage.setItem(`game_admin_${gameId}`, JSON.stringify(adminConfig));
    }
    
    // Lưu game vào localStorage để backup
    const sharedUrl = await saveGameForSharing({
      id: gameId,
      title: options.title,
      gameType: 'custom',
      content: null,
      htmlContent: options.htmlContent,
      description: options.description,
      createdAt: new Date(),
      expiresAt: expiryDate
    });
    
    return {
      gameId,
      sharedUrl
    };
  } catch (error) {
    console.error("Error creating game:", error);
    throw new Error("Không thể tạo game");
  }
}; 