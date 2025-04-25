
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
    
    // Lấy IP người tạo nếu có thể (dùng cho RLS policy)
    let creatorIp = null;
    try {
      const { data: ipData } = await fetch('https://api.ipify.org?format=json')
        .then(res => res.json());
      creatorIp = ipData?.ip;
    } catch (e) {
      console.log("Không thể lấy địa chỉ IP:", e);
    }
    
    // Tạo nội dung game với dữ liệu được mã hóa để dễ khôi phục
    const encodedContent = encodeURIComponent(JSON.stringify({
      title: gameData.title,
      type: gameData.gameType,
      content: gameData.content
    }));
    
    const enhancedHtmlContent = `<div data-game-type="${gameData.gameType}" data-game-content="${encodedContent}">${gameData.content}</div>`;
    
    // Lưu vào bảng games với nội dung HTML và metadata đầy đủ
    const { data: gameEntry, error: gameError } = await supabase
      .from('games')
      .insert([{
        title: gameData.title,
        html_content: enhancedHtmlContent,
        game_type: 'custom',
        description: gameData.description || 'Game tương tác tùy chỉnh',
        is_preset: false,
        content_type: 'html',
        creator_ip: creatorIp,
        is_published: true
      }])
      .select()
      .single();

    if (gameError) {
      console.error("Lỗi khi lưu game vào bảng games:", gameError);
      throw gameError;
    }

    console.log("Game đã được lưu vào games với ID:", gameEntry.id);

    // Lưu dữ liệu game bổ sung vào bảng custom_games
    const { data: customGame, error: customError } = await supabase
      .from('custom_games')
      .insert([{
        game_id: gameEntry.id,
        game_data: {
          title: gameData.title,
          content: gameData.content,
          type: gameData.gameType,
          version: '1.0',
          createdAt: new Date().toISOString()
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
      
      // Nếu lỗi khi lưu custom_games, thử xóa game đã tạo để tránh dữ liệu rác
      try {
        await supabase.from('games').delete().eq('id', gameEntry.id);
      } catch (deleteErr) {
        console.error("Lỗi khi xóa game sau khi lưu custom_games thất bại:", deleteErr);
      }
      
      throw customError;
    }

    console.log("Dữ liệu game tùy chỉnh đã được lưu:", customGame);
    
    // Trả về ID của game đã lưu để tạo URL chia sẻ
    return { 
      id: gameEntry.id,
      title: gameData.title,
      gameUrl: `${window.location.origin}/game/${gameEntry.id}`
    };
  } catch (error) {
    console.error('Error saving custom game:', error);
    throw error;
  }
};

export const getCustomGame = async (gameId: string) => {
  try {
    console.log("Đang lấy game theo ID:", gameId);
    
    // Get complete game data from both tables
    const { data: game, error: gameError } = await supabase
      .from('games')
      .select(`
        *,
        custom_games (
          game_data,
          settings
        )
      `)
      .eq('id', gameId)
      .single();

    if (gameError) {
      console.error("Không tìm thấy game với ID:", gameId, gameError);
      throw gameError;
    }
    
    console.log("Đã tìm thấy game:", game);
    
    // Kiểm tra xem game đã hết hạn chưa
    const expireDate = new Date(game.expires_at);
    if (expireDate < new Date()) {
      console.error("Game đã hết hạn:", expireDate);
      throw new Error("Game đã hết hạn");
    }
    
    return game;
  } catch (error) {
    console.error('Error fetching custom game:', error);
    throw error;
  }
};

export const updateCustomGame = async (gameId: string, gameData: Partial<CustomGameData>) => {
  try {
    // Cập nhật nội dung HTML với dữ liệu được mã hóa
    const encodedContent = gameData.content ? encodeURIComponent(JSON.stringify({
      title: gameData.title,
      type: gameData.gameType,
      content: gameData.content
    })) : null;
    
    const enhancedHtmlContent = gameData.content ? 
      `<div data-game-type="${gameData.gameType}" data-game-content="${encodedContent}">${gameData.content}</div>` : 
      undefined;
    
    // Update games table with basic game info
    const { data: gameUpdate, error: gameError } = await supabase
      .from('games')
      .update({
        title: gameData.title,
        html_content: enhancedHtmlContent,
        description: gameData.description,
        updated_at: new Date().toISOString()
      })
      .eq('id', gameId)
      .select()
      .single();

    if (gameError) throw gameError;

    // Update custom_games table with game-specific data
    const { data: customUpdate, error: customError } = await supabase
      .from('custom_games')
      .update({
        game_data: {
          title: gameData.title,
          content: gameData.content,
          type: gameData.gameType,
          updatedAt: new Date().toISOString()
        },
        settings: gameData.settings
      })
      .eq('game_id', gameId)
      .select()
      .single();

    if (customError) throw customError;
    
    return { ...gameUpdate, customData: customUpdate };
  } catch (error) {
    console.error('Error updating custom game:', error);
    throw error;
  }
};

export const deleteCustomGame = async (gameId: string) => {
  try {
    // Delete from games table will cascade to custom_games due to foreign key
    const { error } = await supabase
      .from('games')
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
      .from('games')
      .select(`
        *,
        custom_games (
          game_data,
          settings
        )
      `)
      .eq('game_type', 'custom')
      .order('created_at', { ascending: false });

    if (error) throw error;
    console.log("Danh sách game tùy chỉnh:", data?.length || 0, "games");
    return data;
  } catch (error) {
    console.error('Error listing custom games:', error);
    throw error;
  }
};

export const recordGameParticipant = async (gameId: string, name: string) => {
  try {
    // Lấy IP người chơi nếu có thể
    let ipAddress = null;
    try {
      const { data: ipData } = await fetch('https://api.ipify.org?format=json')
        .then(res => res.json());
      ipAddress = ipData?.ip;
    } catch (e) {
      console.log("Không thể lấy địa chỉ IP:", e);
    }
    
    const { data, error } = await supabase
      .from('game_participants')
      .insert({
        game_id: gameId,
        name,
        ip_address: ipAddress
      })
      .select()
      .single();
      
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error recording game participant:', error);
    // Không báo lỗi ra ngoài để không ảnh hưởng trải nghiệm người dùng
    return null;
  }
};

export const getGameParticipants = async (gameId: string) => {
  try {
    const { data, error } = await supabase
      .from('game_participants')
      .select('*')
      .eq('game_id', gameId)
      .order('timestamp', { ascending: false });
      
    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error getting game participants:', error);
    return [];
  }
};
