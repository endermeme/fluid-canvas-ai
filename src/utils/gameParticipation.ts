
import { supabase } from "@/integrations/supabase/client";

export interface GameParticipant {
  id: string;
  name: string;
  timestamp: string;
  ipAddress?: string;
}

export interface GameSession {
  id: string;
  title: string;
  participants: GameParticipant[];
  createdAt: number;
}

// Generate a fake IP for development/demo purposes
export const getFakeIpAddress = () => {
  const octets = Array.from({ length: 4 }, () => Math.floor(Math.random() * 256));
  return octets.join('.');
};

// Add a participant to a game
export const addParticipant = async (gameId: string, name: string, ipAddress: string) => {
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

    return { 
      success: true, 
      message: "Tham gia thành công", 
      participant 
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

    return {
      id: game.id,
      title: game.title,
      participants: participants || [],
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

        return {
          id: game.id,
          title: game.title,
          participants: participants || [],
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
