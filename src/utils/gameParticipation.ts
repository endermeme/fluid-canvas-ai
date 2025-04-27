
// Tệp mới để quản lý người tham gia game
import { supabase } from '@/integrations/supabase/client';

export interface GameParticipant {
  id: string;
  name: string;
  ipAddress?: string;
  timestamp: number | string;
  gameId: string;
  retryCount: number;
}

export interface ParticipantResponse {
  success: boolean;
  message?: string;
  participant?: GameParticipant;
}

export const getFakeIpAddress = (): string => {
  // Tạo "fake IP" cho mục đích demo
  const segments = [];
  for (let i = 0; i < 4; i++) {
    segments.push(Math.floor(Math.random() * 256));
  }
  return segments.join('.');
};

// Thêm người tham gia mới vào game
export const addParticipant = async (
  gameId: string,
  name: string,
  ipAddress: string
): Promise<ParticipantResponse> => {
  if (!gameId || !name) {
    return {
      success: false,
      message: "Thiếu thông tin game hoặc người tham gia"
    };
  }

  try {
    // Kiểm tra xem IP này đã tham gia game này chưa
    const { data: existingParticipants, error: checkError } = await supabase
      .from('game_participants')
      .select('*')
      .eq('game_id', gameId)
      .eq('ip_address', ipAddress);

    if (checkError) {
      console.error("Error checking existing participants:", checkError);
      return {
        success: false,
        message: "Không thể kiểm tra thông tin tham gia trước đó"
      };
    }

    if (existingParticipants && existingParticipants.length > 0) {
      // IP đã tham gia, cập nhật thông tin
      const participant = existingParticipants[0];
      const retryCount = (participant.retry_count || 0) + 1;
      
      const { data: updatedParticipant, error: updateError } = await supabase
        .from('game_participants')
        .update({
          name,
          retry_count: retryCount,
          timestamp: new Date().toISOString()
        })
        .eq('id', participant.id)
        .select()
        .single();

      if (updateError) {
        console.error("Error updating participant:", updateError);
        return {
          success: false,
          message: "Không thể cập nhật thông tin tham gia"
        };
      }

      return {
        success: true,
        participant: {
          id: updatedParticipant.id,
          name: updatedParticipant.name,
          ipAddress: updatedParticipant.ip_address,
          timestamp: updatedParticipant.timestamp,
          gameId: updatedParticipant.game_id,
          retryCount: updatedParticipant.retry_count
        }
      };
    }

    // Thêm người tham gia mới
    const { data: newParticipant, error: insertError } = await supabase
      .from('game_participants')
      .insert([
        {
          game_id: gameId,
          name,
          ip_address: ipAddress,
          retry_count: 0
        }
      ])
      .select()
      .single();

    if (insertError) {
      console.error("Error adding new participant:", insertError);
      return {
        success: false,
        message: "Không thể thêm người tham gia mới"
      };
    }

    // Lưu vào localStorage để theo dõi các phiên tham gia
    try {
      const sessionsJson = localStorage.getItem('game_sessions');
      const sessions = sessionsJson ? JSON.parse(sessionsJson) : [];
      
      let sessionIndex = sessions.findIndex((s: any) => s.id === gameId);
      if (sessionIndex >= 0) {
        // Game đã tồn tại, thêm người tham gia mới vào
        if (!sessions[sessionIndex].participants) {
          sessions[sessionIndex].participants = [];
        }
        
        sessions[sessionIndex].participants.push({
          id: newParticipant.id,
          name: newParticipant.name,
          ipAddress: newParticipant.ip_address,
          timestamp: newParticipant.timestamp,
          gameId: newParticipant.game_id,
          retryCount: newParticipant.retry_count
        });
      } else {
        // Game chưa có trong sessions, thêm mới
        sessions.push({
          id: gameId,
          participants: [
            {
              id: newParticipant.id,
              name: newParticipant.name,
              ipAddress: newParticipant.ip_address,
              timestamp: newParticipant.timestamp,
              gameId: newParticipant.game_id,
              retryCount: newParticipant.retry_count
            }
          ]
        });
      }
      
      localStorage.setItem('game_sessions', JSON.stringify(sessions));
    } catch (localStorageError) {
      console.error("Error updating localStorage:", localStorageError);
      // Tiếp tục xử lý dù có lỗi localStorage
    }

    return {
      success: true,
      participant: {
        id: newParticipant.id,
        name: newParticipant.name,
        ipAddress: newParticipant.ip_address,
        timestamp: newParticipant.timestamp,
        gameId: newParticipant.game_id,
        retryCount: newParticipant.retry_count
      }
    };
  } catch (error) {
    console.error("Unhandled error in addParticipant:", error);
    return {
      success: false,
      message: "Đã xảy ra lỗi khi xử lý yêu cầu tham gia"
    };
  }
};

// Tạo một phiên game mới
export const createGameSession = async (
  title: string,
  content: string
): Promise<{ id: string }> => {
  // Tạo một ID mới cho game
  const gameId = crypto.randomUUID();
  
  try {
    // Lưu session vào localStorage
    const sessionsJson = localStorage.getItem('game_sessions');
    const sessions = sessionsJson ? JSON.parse(sessionsJson) : [];
    
    sessions.push({
      id: gameId,
      title,
      content,
      createdAt: new Date().toISOString(),
      participants: []
    });
    
    localStorage.setItem('game_sessions', JSON.stringify(sessions));
    
    return { id: gameId };
  } catch (error) {
    console.error("Error creating game session:", error);
    throw new Error("Không thể tạo phiên game mới");
  }
};

// Lấy danh sách người tham gia game
export const getGameParticipants = async (
  gameId: string
): Promise<GameParticipant[]> => {
  if (!gameId) return [];
  
  try {
    const { data, error } = await supabase
      .from('game_participants')
      .select('*')
      .eq('game_id', gameId)
      .order('timestamp', { ascending: false });
    
    if (error) {
      console.error("Error fetching participants:", error);
      return [];
    }
    
    return data.map(p => ({
      id: p.id,
      name: p.name,
      ipAddress: p.ip_address,
      timestamp: p.timestamp,
      gameId: p.game_id,
      retryCount: p.retry_count || 0
    }));
  } catch (error) {
    console.error("Error in getGameParticipants:", error);
    return [];
  }
};

// Lấy một game từ localStorage (fallback khi không có kết nối đến Supabase)
export const getLocalGame = (gameId: string): any => {
  try {
    const sessionsJson = localStorage.getItem('game_sessions');
    if (!sessionsJson) return null;
    
    const sessions = JSON.parse(sessionsJson);
    return sessions.find((s: any) => s.id === gameId) || null;
  } catch (error) {
    console.error("Error retrieving local game:", error);
    return null;
  }
};

// Kiểm tra xem game có tồn tại không và chưa hết hạn
export const isGameValid = async (gameId: string): Promise<boolean> => {
  try {
    const { data } = await supabase
      .from('games')
      .select('expires_at')
      .eq('id', gameId)
      .single();
    
    if (!data) return false;
    
    const expiryDate = new Date(data.expires_at);
    const now = new Date();
    
    return expiryDate > now;
  } catch (error) {
    console.error("Error checking game validity:", error);
    
    // Fallback kiểm tra trong localStorage
    const localGame = getLocalGame(gameId);
    return !!localGame;
  }
};

export interface GameWithParticipants {
  game: any;
  participants: GameParticipant[];
}

// Lấy thông tin game và người tham gia
export const getGameWithParticipants = async (
  gameId: string
): Promise<GameWithParticipants | null> => {
  try {
    // Lấy thông tin game
    const game = await getSharedGame(gameId);
    if (!game) return null;
    
    // Lấy danh sách người tham gia
    const participants = await getGameParticipants(gameId);
    
    return { game, participants };
  } catch (error) {
    console.error("Error in getGameWithParticipants:", error);
    return null;
  }
};
