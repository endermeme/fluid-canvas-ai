import { supabase } from "@/integrations/supabase/client";
import { GameParticipant, GameSession } from "@/utils/types";

// Generate a fake IP for development/demo purposes
export const getFakeIpAddress = () => {
  const octets = Array.from({ length: 4 }, () => Math.floor(Math.random() * 256));
  return octets.join('.');
};

// Thêm hàm để kiểm tra anti-cheat
export const verifyParticipant = async (gameId: string, ipAddress: string): Promise<boolean> => {
  try {
    console.log(`Verifying participant for game ${gameId}, IP: ${maskIpAddress(ipAddress)}`);
    
    // Kiểm tra số lần tham gia trong một khoảng thời gian ngắn
    const { data: recentAttempts, error: checkError } = await supabase
      .from('game_participants')
      .select('timestamp, retry_count')
      .eq('game_id', gameId)
      .eq('ip_address', ipAddress)
      .order('timestamp', { ascending: false })
      .limit(10);
    
    if (checkError) {
      console.error("Error checking participant data:", checkError);
      return true; // Cho phép tham gia trong trường hợp lỗi
    }
    
    // Nếu có quá nhiều lần tham gia trong thời gian ngắn (1 phút)
    if (recentAttempts && recentAttempts.length > 3) {
      const now = Date.now();
      const oneMinuteAgo = now - 60 * 1000;
      const fiveMinutesAgo = now - 5 * 60 * 1000;
      
      const recentMinuteCount = recentAttempts.filter(attempt => {
        const timestamp = new Date(attempt.timestamp).getTime();
        return timestamp > oneMinuteAgo;
      }).length;
      
      const recentFiveMinutesCount = recentAttempts.filter(attempt => {
        const timestamp = new Date(attempt.timestamp).getTime();
        return timestamp > fiveMinutesAgo;
      }).length;
      
      // Kiểm tra các mức độ lạm dụng khác nhau
      if (recentMinuteCount > 5) {
        console.warn(`Possible abuse detected: ${recentMinuteCount} attempts in the last minute from IP ${maskIpAddress(ipAddress)}`);
        return false;
      }
      
      if (recentFiveMinutesCount > 15) {
        console.warn(`Possible abuse detected: ${recentFiveMinutesCount} attempts in the last 5 minutes from IP ${maskIpAddress(ipAddress)}`);
        return false;
      }
      
      // Kiểm tra nếu retry_count cao bất thường
      const highRetryCount = recentAttempts.some(attempt => attempt.retry_count > 20);
      if (highRetryCount) {
        console.warn(`Suspicious activity: very high retry count from IP ${maskIpAddress(ipAddress)}`);
        return false;
      }
    }
    
    return true;
  } catch (error) {
    console.error("Error in verifyParticipant:", error);
    return true; // Cho phép tham gia trong trường hợp lỗi
  }
};

// Add a participant to a game
export const addParticipant = async (gameId: string, name: string, ipAddress: string): Promise<{ 
  success: boolean; 
  message: string; 
  participant: GameParticipant | null;
}> => {
  try {
    console.log(`Adding participant ${name} to game ${gameId}`);
    
    // Kiểm tra anti-cheat
    const isAllowed = await verifyParticipant(gameId, ipAddress);
    
    if (!isAllowed) {
      console.warn(`Request blocked by anti-cheat for IP: ${maskIpAddress(ipAddress)}`);
      return { 
        success: false, 
        message: "Quá nhiều yêu cầu trong thời gian ngắn. Vui lòng thử lại sau một lúc.", 
        participant: null 
      };
    }
    
    // Check if this IP has already participated recently
    const { data: existingParticipants, error: checkError } = await supabase
      .from('game_participants')
      .select('id, retry_count, name')
      .eq('game_id', gameId)
      .eq('ip_address', ipAddress)
      .order('timestamp', { ascending: false })
      .limit(1);
    
    console.log("Existing participants check:", existingParticipants);

    // Nếu người chơi đã tồn tại, cập nhật thông tin thay vì tạo mới
    if (existingParticipants && existingParticipants.length > 0) {
      const existingParticipant = existingParticipants[0];
      const retryCount = existingParticipant?.retry_count || 0;
      
      // Cập nhật dữ liệu
      const { data: updatedParticipant, error: updateError } = await supabase
        .from('game_participants')
        .update({
          name: name, // Cập nhật tên
          retry_count: retryCount + 1, // Tăng retry_count
          timestamp: new Date().toISOString() // Cập nhật timestamp
        })
        .eq('id', existingParticipant.id)
        .select()
        .single();

      if (updateError) {
        console.error("Error updating participant:", updateError);
        return { 
          success: false, 
          message: "Không thể cập nhật thông tin người tham gia",
          participant: null
        };
      }

      // Format data
      const formattedParticipant: GameParticipant = {
        id: updatedParticipant.id,
        game_id: updatedParticipant.game_id,
        name: updatedParticipant.name,
        timestamp: updatedParticipant.timestamp,
        ipAddress: updatedParticipant.ip_address,
        retryCount: updatedParticipant.retry_count
      };

      return { 
        success: true, 
        message: "Thông tin đã được cập nhật", 
        participant: formattedParticipant
      };
    }
    
    // Tạo người tham gia mới nếu chưa tồn tại
    const { data: participant, error } = await supabase
      .from('game_participants')
      .insert({
        game_id: gameId,
        name,
        ip_address: ipAddress,
        retry_count: 0 // Bắt đầu với 0 vì là lần đầu tham gia
      })
      .select()
      .single();

    if (error) {
      console.error("Error adding participant:", error);
      return { 
        success: false, 
        message: "Không thể tham gia game lúc này",
        participant: null
      };
    }

    // Convert database fields to our interface format
    const formattedParticipant: GameParticipant = {
      id: participant.id,
      game_id: participant.game_id,
      name: participant.name,
      timestamp: participant.timestamp,
      ipAddress: participant.ip_address,
      retryCount: participant.retry_count
    };

    return { 
      success: true, 
      message: "Tham gia thành công", 
      participant: formattedParticipant
    };
  } catch (error) {
    console.error("Error in addParticipant:", error);
    return { 
      success: false, 
      message: "Đã xảy ra lỗi khi tham gia game", 
      participant: null 
    };
  }
};

// Get a game session by ID
export const getGameSession = async (gameId: string): Promise<GameSession | null> => {
  try {
    const { data: game, error: gameError } = await supabase
      .from('games')
      .select('*')
      .eq('id', gameId)
      .single();

    if (gameError || !game) {
      console.error("Error getting game:", gameError);
      return null;
    }

    const { data: participants, error: participantsError } = await supabase
      .from('game_participants')
      .select('*')
      .eq('game_id', gameId)
      .order('timestamp', { ascending: false });

    if (participantsError) {
      console.error("Error getting participants:", participantsError);
      return null;
    }

    // Format participants to match our interface
    const formattedParticipants: GameParticipant[] = (participants || []).map(p => ({
      id: p.id,
      game_id: p.game_id,
      name: p.name,
      timestamp: p.timestamp,
      ipAddress: p.ip_address,
      retryCount: p.retry_count
    }));

    return {
      id: game.id,
      title: game.title,
      htmlContent: game.html_content,
      participants: formattedParticipants,
      createdAt: new Date(game.created_at).getTime()
    };
  } catch (error) {
    console.error("Error in getGameSession:", error);
    return null;
  }
};

// Get all game sessions
export const getAllGameSessions = async (): Promise<GameSession[]> => {
  try {
    const { data: games, error: gamesError } = await supabase
      .from('games')
      .select('*')
      .order('created_at', { ascending: false });

    if (gamesError || !games) {
      console.error("Error getting games:", gamesError);
      return [];
    }

    const sessions: GameSession[] = await Promise.all(
      games.map(async (game) => {
        const { data: participants } = await supabase
          .from('game_participants')
          .select('*')
          .eq('game_id', game.id)
          .order('timestamp', { ascending: false });

        // Format participants to match our interface
        const formattedParticipants: GameParticipant[] = (participants || []).map(p => ({
          id: p.id,
          game_id: p.game_id,
          name: p.name,
          timestamp: p.timestamp,
          ipAddress: p.ip_address,
          retryCount: p.retry_count
        }));

        return {
          id: game.id,
          title: game.title,
          htmlContent: game.html_content,
          participants: formattedParticipants,
          createdAt: new Date(game.created_at).getTime()
        };
      })
    );

    return sessions;
  } catch (error) {
    console.error("Error in getAllGameSessions:", error);
    return [];
  }
};

// Create a new game session
export const createGameSession = async (title: string, htmlContent: string): Promise<GameSession> => {
  try {
    const { data, error } = await supabase
      .from('games')
      .insert({
        title: title || "Minigame Tương tác",
        html_content: htmlContent,
        game_type: 'shared'
      })
      .select()
      .single();
      
    if (error) {
      console.error("Error creating game session:", error);
      // Return a temporary session object for fallback
      return {
        id: Math.random().toString(36).substring(2, 9),
        title: title,
        htmlContent: htmlContent,
        participants: [],
        createdAt: Date.now()
      };
    }
    
    return {
      id: data.id,
      title: data.title,
      htmlContent: data.html_content,
      participants: [],
      createdAt: new Date(data.created_at).getTime()
    };
  } catch (error) {
    console.error("Error in createGameSession:", error);
    return {
      id: Math.random().toString(36).substring(2, 9),
      title: title,
      htmlContent: htmlContent,
      participants: [],
      createdAt: Date.now()
    };
  }
};

// Export participants to CSV
export const exportParticipantsToCSV = async (gameId: string): Promise<string> => {
  try {
    // Get participants for the game
    const { data: participants, error } = await supabase
      .from('game_participants')
      .select('*')
      .eq('game_id', gameId)
      .order('timestamp', { ascending: false });
      
    if (error || !participants || participants.length === 0) {
      return "Name,IP Address,Timestamp,Retry Count\n";
    }
    
    // Create CSV header
    let csv = "Name,IP Address,Timestamp,Retry Count\n";
    
    // Add data rows
    participants.forEach(p => {
      const row = [
        `"${p.name.replace(/"/g, '""')}"`,
        `"${p.ip_address || ''}"`,
        `"${new Date(p.timestamp).toLocaleString()}"`,
        p.retry_count || 0
      ];
      csv += row.join(',') + '\n';
    });
    
    return csv;
  } catch (error) {
    console.error("Error exporting participants to CSV:", error);
    return "Error generating CSV data";
  }
};

// Mask IP address for privacy
export const maskIpAddress = (ip?: string): string => {
  if (!ip) return "N/A";
  
  const parts = ip.split('.');
  if (parts.length !== 4) return ip;
  
  return `${parts[0]}.${parts[1]}.*.*`;
};
