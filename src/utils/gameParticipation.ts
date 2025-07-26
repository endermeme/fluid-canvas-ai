import { supabase } from '@/integrations/supabase/client';
import { StoredGame, GameParticipant, GameSession } from './types';

// IP Address utilities
export const maskIpAddress = (ip?: string): string => {
  if (!ip) return 'unknown';
  const parts = ip.split('.');
  if (parts.length === 4) {
    return `${parts[0]}.${parts[1]}.*.* `;
  }
  return ip;
};

export const getFakeIpAddress = (): string => {
  return `192.168.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`;
};

// Convert unified score to GameParticipant for compatibility
const mapUnifiedScoreToParticipant = (score: any): GameParticipant => {
  return {
    id: score.id,
    name: score.player_name,
    ipAddress: score.ip_address,
    timestamp: score.completed_at,
    gameId: score.game_id,
    retryCount: 0, // Not tracked in unified system
    score: score.score
  };
};

// Add participant - simplified to work with unified scoring
export const addParticipant = async (
  gameId: string,
  name: string,
  ipAddress: string,
  accountId?: string
): Promise<{ success: boolean; message?: string; participant?: GameParticipant }> => {
  try {
    // Check if game exists and is valid
    const { data: game, error: gameError } = await supabase
      .from('games')
      .select('*')
      .eq('id', gameId)
      .eq('is_published', true)
      .gt('expires_at', new Date().toISOString())
      .single();

    if (gameError || !game) {
      return { success: false, message: 'Game không tồn tại hoặc đã hết hạn' };
    }

    // For unified system, we just return success - actual participation is tracked when game is completed
    const participant: GameParticipant = {
      id: `temp-${Date.now()}`,
      name,
      ipAddress,
      timestamp: new Date().toISOString(),
      gameId,
      retryCount: 0,
      score: 0
    };

    // Store in localStorage for backward compatibility
    const storageKey = `game-session-${gameId}`;
    const existingSession = localStorage.getItem(storageKey);
    
    if (existingSession) {
      const session = JSON.parse(existingSession);
      if (!session.participants) {
        session.participants = [];
      }
      // Check if participant already exists
      const existingParticipant = session.participants.find((p: any) => p.name === name);
      if (!existingParticipant) {
        session.participants.push(participant);
        localStorage.setItem(storageKey, JSON.stringify(session));
      }
    }

    return { success: true, participant };
  } catch (error) {
    console.error('Error adding participant:', error);
    return { success: false, message: 'Có lỗi xảy ra khi tham gia game' };
  }
};

// Create game session
export const createGameSession = async (title: string, content: string): Promise<{ id: string }> => {
  const gameId = `game-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  
  const session: GameSession = {
    id: gameId,
    title,
    content,
    createdAt: Date.now(),
    participants: []
  };

  localStorage.setItem(`game-session-${gameId}`, JSON.stringify(session));
  
  return { id: gameId };
};

// Get game participants using unified scoring system
export const getGameParticipants = async (gameId: string, accountId?: string): Promise<GameParticipant[]> => {
  try {
    // Get from unified_game_scores
    const { data: scores, error } = await supabase
      .from('unified_game_scores')
      .select('*')
      .eq('game_id', gameId)
      .eq('source_table', 'games')
      .order('completed_at', { ascending: false });

    if (error) {
      console.error('Error fetching participants:', error);
      return [];
    }

    return scores?.map(mapUnifiedScoreToParticipant) || [];
  } catch (error) {
    console.error('Error in getGameParticipants:', error);
    return [];
  }
};

// Get local game from localStorage
export const getLocalGame = (gameId: string): any => {
  try {
    const gameData = localStorage.getItem(`game-session-${gameId}`);
    return gameData ? JSON.parse(gameData) : null;
  } catch (error) {
    console.error('Error getting local game:', error);
    return null;
  }
};

// Check if game is valid
export const isGameValid = async (gameId: string): Promise<boolean> => {
  try {
    const { data: game, error } = await supabase
      .from('games')
      .select('expires_at, is_published')
      .eq('id', gameId)
      .single();

    if (error || !game) {
      // Check localStorage as fallback
      const localGame = getLocalGame(gameId);
      if (localGame) {
        const expiryTime = typeof localGame.expiresAt === 'number' 
          ? localGame.expiresAt 
          : new Date(localGame.expiresAt).getTime();
        return Date.now() < expiryTime;
      }
      return false;
    }

    return game.is_published && new Date(game.expires_at).getTime() > Date.now();
  } catch (error) {
    console.error('Error checking game validity:', error);
    return false;
  }
};

// Get game with participants
export const getGameWithParticipants = async (gameId: string): Promise<{ game: StoredGame, participants: GameParticipant[] } | null> => {
  try {
    const { data: game, error } = await supabase
      .from('games')
      .select('*')
      .eq('id', gameId)
      .single();

    if (error || !game) {
      return null;
    }

    const participants = await getGameParticipants(gameId);

    const storedGame: StoredGame = {
      id: game.id,
      title: game.title,
      gameType: game.game_type,
      htmlContent: game.html_content,
      description: game.description,
      expiresAt: new Date(game.expires_at),
      createdAt: new Date(game.created_at),
      password: game.password,
      maxParticipants: game.max_participants,
      showLeaderboard: game.show_leaderboard,
      requireRegistration: game.require_registration,
      customDuration: game.custom_duration
    };

    return { game: storedGame, participants };
  } catch (error) {
    console.error('Error getting game with participants:', error);
    return null;
  }
};

// Get game session
export const getGameSession = async (gameId: string): Promise<GameSession | null> => {
  try {
    // Try to get from Supabase first
    const { data: game, error } = await supabase
      .from('games')
      .select('*')
      .eq('id', gameId)
      .single();

    if (!error && game) {
      const participants = await getGameParticipants(gameId);
      return {
        id: game.id,
        title: game.title,
        gameType: game.game_type,
        htmlContent: game.html_content,
        description: game.description,
        expiresAt: new Date(game.expires_at),
        createdAt: new Date(game.created_at).getTime(),
        participants
      };
    }

    // Fallback to localStorage
    return getLocalGame(gameId);
  } catch (error) {
    console.error('Error getting game session:', error);
    return null;
  }
};

// Get all game sessions
export const getAllGameSessions = async (): Promise<GameSession[]> => {
  try {
    const sessions: GameSession[] = [];

    // Get from Supabase
    const { data: supabaseGames, error } = await supabase
      .from('games')
      .select('*')
      .eq('is_published', true)
      .order('created_at', { ascending: false });

    if (!error && supabaseGames) {
      for (const game of supabaseGames) {
        const participants = await getGameParticipants(game.id);
        sessions.push({
          id: game.id,
          title: game.title,
          gameType: game.game_type,
          htmlContent: game.html_content,
          description: game.description,
          expiresAt: new Date(game.expires_at),
          createdAt: new Date(game.created_at).getTime(),
          participants
        });
      }
    }

    // Get from localStorage and merge
    const localKeys = Object.keys(localStorage).filter(key => key.startsWith('game-session-'));
    for (const key of localKeys) {
      try {
        const session = JSON.parse(localStorage.getItem(key) || '{}');
        // Avoid duplicates
        if (!sessions.find(s => s.id === session.id)) {
          sessions.push(session);
        }
      } catch (e) {
        console.error('Error parsing local session:', e);
      }
    }

    return sessions.sort((a, b) => b.createdAt - a.createdAt);
  } catch (error) {
    console.error('Error getting all game sessions:', error);
    return [];
  }
};

// Export participants to CSV
export const exportParticipantsToCSV = async (gameId: string): Promise<string> => {
  try {
    const participants = await getGameParticipants(gameId);
    
    if (participants.length === 0) {
      return 'Không có dữ liệu để xuất';
    }

    const headers = ['Tên', 'Điểm số', 'Thời gian hoàn thành', 'IP Address', 'Thời gian tham gia'];
    const csvContent = [
      headers.join(','),
      ...participants.map(p => [
        `"${p.name}"`,
        p.score || 0,
        new Date(p.timestamp).toLocaleString('vi-VN'),
        maskIpAddress(p.ipAddress),
        new Date(p.timestamp).toLocaleString('vi-VN')
      ].join(','))
    ].join('\n');

    return csvContent;
  } catch (error) {
    console.error('Error exporting participants:', error);
    throw error;
  }
};