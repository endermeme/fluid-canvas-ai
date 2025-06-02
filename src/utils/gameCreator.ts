
import { supabase } from '@/integrations/supabase/client';
import { v4 as uuidv4 } from 'uuid';
import { saveGameForSharing } from './gameExport';
import { createDefaultAdminSettings } from './gameAdmin';

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
          created_at: new Date().toISOString(),
          expires_at: expiryDate.toISOString()
        }
      ])
      .select();
    
    if (error) {
      throw error;
    }
    
    // Tạo cài đặt admin cho game này
    await createDefaultAdminSettings(gameId, {
      adminPassword: options.adminPassword || '1234',
      maxParticipants: options.maxParticipants || 50,
      requestPlayerInfo: options.requestPlayerInfo !== false
    });
    
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
