
import { supabase } from "@/integrations/supabase/client";

export interface CustomGameData {
  title: string;
  content: string; 
  gameType: string;
  description?: string;
  settings?: any;
}

export const saveCustomGame = async (gameData: CustomGameData) => {
  try {
    console.log("Đang lưu game tùy chỉnh:", gameData);
    
    // Save directly to custom_games table
    const { data: customGame, error: customError } = await supabase
      .from('custom_games')
      .insert([{
        title: gameData.title,
        html_content: gameData.content,
        description: gameData.description || 'Game tương tác tùy chỉnh',
        game_data: {
          title: gameData.title,
          content: gameData.content,
          type: gameData.gameType,
          version: '1.0'
        },
        settings: gameData.settings || {
          allowSharing: true,
          showTimer: true,
          timeLimit: null
        }
      }])
      .select()
      .single();

    if (customError) {
      console.error("Lỗi khi lưu custom_games:", customError);
      throw customError;
    }

    console.log("Dữ liệu game tùy chỉnh đã được lưu:", customGame);
    return customGame;
  } catch (error) {
    console.error('Error saving custom game:', error);
    throw error;
  }
};

export const getCustomGame = async (gameId: string) => {
  try {
    console.log("Đang lấy game theo ID:", gameId);
    
    // Get game data from custom_games table
    const { data: game, error: gameError } = await supabase
      .from('custom_games')
      .select('*')
      .eq('id', gameId)
      .single();

    if (gameError) {
      console.error("Không tìm thấy game với ID:", gameId, gameError);
      throw gameError;
    }
    
    console.log("Đã tìm thấy game:", game);
    return game;
  } catch (error) {
    console.error('Error fetching custom game:', error);
    throw error;
  }
};

export const updateCustomGame = async (gameId: string, gameData: Partial<CustomGameData>) => {
  try {
    // Update custom_games table
    const { data: customUpdate, error: customError } = await supabase
      .from('custom_games')
      .update({
        title: gameData.title,
        html_content: gameData.content,
        description: gameData.description,
        game_data: {
          title: gameData.title,
          content: gameData.content,
          type: gameData.gameType,
          updatedAt: new Date().toISOString()
        },
        settings: gameData.settings,
        updated_at: new Date().toISOString()
      })
      .eq('id', gameId)
      .select()
      .single();

    if (customError) throw customError;
    
    return customUpdate;
  } catch (error) {
    console.error('Error updating custom game:', error);
    throw error;
  }
};

export const deleteCustomGame = async (gameId: string) => {
  try {
    // Delete from custom_games table
    const { error } = await supabase
      .from('custom_games')
      .delete()
      .eq('id', gameId);

    if (error) throw error;
    
    console.log("Game đã được xóa:", gameId);
  } catch (error) {
    console.error('Error deleting custom game:', error);
    throw error;
  }
};

export const listCustomGames = async () => {
  try {
    const { data, error } = await supabase
      .from('custom_games')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    console.log("Danh sách game tùy chỉnh:", data?.length || 0, "games");
    return data;
  } catch (error) {
    console.error('Error listing custom games:', error);
    throw error;
  }
};
