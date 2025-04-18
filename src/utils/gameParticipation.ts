
import { supabase } from "@/integrations/supabase/client";
import { GameParticipant, GameSession } from "@/utils/types";

// Generate a fake IP for development/demo purposes
export const getFakeIpAddress = () => {
  const octets = Array.from({ length: 4 }, () => Math.floor(Math.random() * 256));
  return octets.join('.');
};

// Add a participant to a game
export const addParticipant = async (gameId: string, name: string, ipAddress: string): Promise<{ 
  success: boolean; 
  message: string; 
  participant: GameParticipant | null;
}> => {
  try {
    // Check if this IP has already participated recently
    const { data: existingParticipants, error: checkError } = await supabase
      .from('game_participants')
      .select('retry_count')
      .eq('game_id', gameId)
      .eq('ip_address', ipAddress)
      .order('timestamp', { ascending: false })
      .limit(1);

    const retryCount = existingParticipants?.[0]?.retry_count || 0;

    const { data: participant, error } = await supabase
      .from('game_participants')
      .insert({
        game_id: gameId,
        name,
        ip_address: ipAddress,
        retry_count: retryCount + 1
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
