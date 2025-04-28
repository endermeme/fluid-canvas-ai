// Tệp mới để quản lý người tham gia game
import { supabase } from '@/integrations/supabase/client';
import { GameParticipant, GameSession, StoredGame, SupabaseGameParticipant } from './types';
import { getSharedGame as getGameFromExport } from './gameExport';

// Ẩn địa chỉ IP (chỉ hiện 2 octet đầu tiên)
export const maskIpAddress = (ip?: string): string => {
  if (!ip) return 'Không có';
  const parts = ip.split('.');
  if (parts.length !== 4) return ip;
  return `${parts[0]}.${parts[1]}.*.*`;
};

export const getFakeIpAddress = (): string => {
  // Tạo "fake IP" cho mục đích demo
  const segments = [];
  for (let i = 0; i < 4; i++) {
    segments.push(Math.floor(Math.random() * 256));
  }
  return segments.join('.');
};

// Chuyển đối tượng từ Supabase sang định dạng GameParticipant
const mapSupabaseParticipant = (participant: SupabaseGameParticipant): GameParticipant => {
  return {
    id: participant.id,
    name: participant.name,
    ipAddress: participant.ip_address,
    timestamp: participant.timestamp,
    gameId: participant.game_id,
    retryCount: participant.retry_count || 0,
    score: participant.score || 0
  };
};

// Thêm người tham gia mới vào game
export const addParticipant = async (
  gameId: string,
  name: string,
  ipAddress: string
): Promise<{ success: boolean; message?: string; participant?: GameParticipant }> => {
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
        participant: mapSupabaseParticipant(updatedParticipant as SupabaseGameParticipant)
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
        
        sessions[sessionIndex].participants.push(
          mapSupabaseParticipant(newParticipant as SupabaseGameParticipant)
        );
      } else {
        // Game chưa có trong sessions, thêm mới
        sessions.push({
          id: gameId,
          participants: [
            mapSupabaseParticipant(newParticipant as SupabaseGameParticipant)
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
      participant: mapSupabaseParticipant(newParticipant as SupabaseGameParticipant)
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
    
    return data.map(p => mapSupabaseParticipant(p as SupabaseGameParticipant));
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

// Lấy thông tin game và người tham gia
export const getGameWithParticipants = async (
  gameId: string
): Promise<{ game: StoredGame, participants: GameParticipant[] } | null> => {
  try {
    // Lấy thông tin game
    const game = await getGameFromExport(gameId);
    if (!game) return null;
    
    // Lấy danh sách người tham gia
    const participants = await getGameParticipants(gameId);
    
    return { game, participants };
  } catch (error) {
    console.error("Error in getGameWithParticipants:", error);
    return null;
  }
};

// Lấy thông tin một phiên game
export const getGameSession = async (gameId: string): Promise<GameSession | null> => {
  try {
    // Thử lấy từ Supabase trước
    const gameData = await getGameFromExport(gameId);
    const participants = await getGameParticipants(gameId);
    
    if (gameData) {
      return {
        id: gameData.id,
        title: gameData.title,
        gameType: gameData.gameType,
        description: gameData.description,
        htmlContent: gameData.htmlContent,
        expiresAt: gameData.expiresAt,
        createdAt: gameData.createdAt instanceof Date ? gameData.createdAt.getTime() : gameData.createdAt as number,
        participants
      };
    }
    
    // Fallback: thử lấy từ localStorage
    const localGame = getLocalGame(gameId);
    if (localGame) {
      return {
        id: localGame.id,
        title: localGame.title || 'Unnamed Game',
        gameType: localGame.gameType || 'custom',
        createdAt: new Date(localGame.createdAt).getTime(),
        participants
      };
    }
    
    return null;
  } catch (error) {
    console.error("Error getting game session:", error);
    return null;
  }
};

// Lấy tất cả các phiên game đã tạo
export const getAllGameSessions = async (): Promise<GameSession[]> => {
  try {
    // Lấy danh sách game từ localStorage trước
    const sessionsJson = localStorage.getItem('game_sessions');
    const localSessions = sessionsJson ? JSON.parse(sessionsJson) : [];
    
    // Lấy danh sách game từ Supabase
    const { data: dbGames, error } = await supabase
      .from('games')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error("Error fetching games from db:", error);
      // Trả về chỉ các phiên local nếu có lỗi
      return localSessions.map((session: any) => ({
        id: session.id,
        title: session.title || 'Unnamed Game',
        gameType: session.gameType || 'custom',
        createdAt: new Date(session.createdAt).getTime(),
        participants: session.participants || []
      }));
    }
    
    // Kết hợp dữ liệu từ localStorage và Supabase
    const combinedSessions: GameSession[] = [];
    
    // Thêm dữ liệu từ Supabase
    for (const game of dbGames) {
      const participants = await getGameParticipants(game.id);
      
      combinedSessions.push({
        id: game.id,
        title: game.title,
        gameType: game.game_type,
        createdAt: new Date(game.created_at).getTime(),
        expiresAt: new Date(game.expires_at).getTime(),
        htmlContent: game.html_content,
        description: game.description,
        participants
      });
    }
    
    // Thêm dữ liệu localStorage mà không trùng với dữ liệu từ Supabase
    for (const session of localSessions) {
      if (!combinedSessions.some(s => s.id === session.id)) {
        combinedSessions.push({
          id: session.id,
          title: session.title || 'Unnamed Game',
          gameType: session.gameType || 'custom',
          createdAt: new Date(session.createdAt).getTime(),
          participants: session.participants || []
        });
      }
    }
    
    // Sắp xếp theo thời gian tạo (mới nhất lên đầu)
    return combinedSessions.sort((a, b) => b.createdAt - a.createdAt);
  } catch (error) {
    console.error("Error in getAllGameSessions:", error);
    
    // Fallback: trả về từ localStorage
    try {
      const sessionsJson = localStorage.getItem('game_sessions');
      const localSessions = sessionsJson ? JSON.parse(sessionsJson) : [];
      
      return localSessions.map((session: any) => ({
        id: session.id,
        title: session.title || 'Unnamed Game',
        gameType: session.gameType || 'custom',
        createdAt: new Date(session.createdAt).getTime(),
        participants: session.participants || []
      }));
    } catch {
      return [];
    }
  }
};

// Xuất danh sách người tham gia dưới dạng CSV
export const exportParticipantsToCSV = async (gameId: string): Promise<string> => {
  try {
    // Lấy thông tin game và người tham gia
    const gameSession = await getGameSession(gameId);
    if (!gameSession) {
      throw new Error("Game không tồn tại");
    }
    
    const participants = gameSession.participants;
    
    // Tạo header cho CSV
    let csvContent = "Name,IP Address,Score,Retry Count,Time\n";
    
    // Thêm dữ liệu từng người tham gia
    for (const p of participants) {
      const row = [
        `"${p.name.replace(/"/g, '""')}"`,
        p.ipAddress || '',
        p.score || '0',
        p.retryCount || '0',
        new Date(p.timestamp).toLocaleString()
      ].join(',');
      
      csvContent += row + '\n';
    }
    
    return csvContent;
  } catch (error) {
    console.error("Error exporting to CSV:", error);
    throw new Error("Không thể xuất dữ liệu CSV");
  }
};
