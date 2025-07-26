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

// Add participant - now saves to database for real-time sync
export const addParticipant = async (
  gameId: string,
  name: string,
  ipAddress: string,
  accountId?: string
): Promise<{ success: boolean; message?: string; participant?: GameParticipant }> => {
  console.log('🎯 [addParticipant] Starting participant addition:', { gameId, name, ipAddress, accountId });
  try {
    // Check if game exists and is valid
    console.log('🔍 [addParticipant] Validating game:', gameId);
    // Try custom_games first
    const { data: customGame } = await supabase
      .from('custom_games')
      .select('*')
      .eq('id', gameId)
      .gt('expires_at', new Date().toISOString())
      .single();

    // Then try preset_games if not found
    const { data: presetGame } = customGame ? { data: null } : await supabase
      .from('preset_games')
      .select('*')
      .eq('id', gameId)
      .single();

    const game = customGame || presetGame;

    console.log('📋 [addParticipant] Game validation result:', { game: game?.title });

    if (!game) {
      console.log('❌ [addParticipant] Game validation failed');
      return { success: false, message: 'Game không tồn tại hoặc đã hết hạn' };
    }

    // Save participant to appropriate leaderboard table
    console.log('💾 [addParticipant] Saving participant to leaderboard');
    const tableName = customGame ? 'custom_leaderboard' : 'preset_leaderboard';
    
    const { error: insertError } = await supabase
      .from(tableName)
      .insert({
        game_id: gameId,
        player_name: name,
        ip_address: ipAddress,
        score: 0,
        total_questions: 0
      });

    if (insertError) {
      console.error('💥 [addParticipant] Error saving participant to database:', insertError);
      // Still continue with localStorage fallback
    } else {
      console.log('✅ [addParticipant] Successfully saved participant to database');
    }

    const participant: GameParticipant = {
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      name,
      ipAddress,
      timestamp: new Date().toISOString(),
      gameId,
      retryCount: 0,
      score: 0
    };

    console.log('📦 [addParticipant] Created participant object:', participant);

    // Store in localStorage for backward compatibility
    console.log('💽 [addParticipant] Storing in localStorage for backward compatibility');
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
        console.log('✅ [addParticipant] Updated localStorage session with new participant');
      } else {
        console.log('ℹ️ [addParticipant] Participant already exists in localStorage');
      }
    }

    console.log('🎉 [addParticipant] Successfully completed participant addition');
    return { success: true, participant };
  } catch (error) {
    console.error('💥 [addParticipant] Exception in addParticipant:', error);
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

// Get game participants from leaderboard tables
export const getGameParticipants = async (gameId: string, accountId?: string): Promise<GameParticipant[]> => {
  console.log('📋 [getGameParticipants] Fetching participants for gameId:', gameId);
  try {
    // Get from both leaderboard tables
    const { data: customParticipants } = await supabase
      .from('custom_leaderboard')
      .select('*')
      .eq('game_id', gameId)
      .order('created_at', { ascending: false });

    const { data: presetParticipants } = await supabase
      .from('preset_leaderboard')
      .select('*')
      .eq('game_id', gameId)
      .order('created_at', { ascending: false });

    const allParticipants = [...(customParticipants || []), ...(presetParticipants || [])];

    console.log('📊 [getGameParticipants] Found participants:', allParticipants.length);

    // Convert to GameParticipant format
    const mappedParticipants = allParticipants.map((p: any) => ({
      id: p.id,
      name: p.player_name,
      ipAddress: p.ip_address || 'unknown',
      timestamp: p.joined_at || p.created_at,
      gameId: gameId,
      retryCount: 0,
      score: p.score || 0
    }));

    console.log('✅ [getGameParticipants] Successfully mapped participants:', mappedParticipants.length, 'participants');
    return mappedParticipants;
  } catch (error) {
    console.error('💥 [getGameParticipants] Exception in getGameParticipants:', error);
    // Fallback to localStorage
    console.log('🔄 [getGameParticipants] Exception fallback to localStorage');
    const localGame = getLocalGame(gameId);
    return localGame?.participants || [];
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
    // Try custom_games first
    const { data: customGame } = await supabase
      .from('custom_games')
      .select('expires_at')
      .eq('id', gameId)
      .single();

    // Then try preset_games
    const { data: presetGame } = customGame ? { data: null } : await supabase
      .from('preset_games')
      .select('is_active')
      .eq('id', gameId)
      .single();

    if (customGame) {
      return new Date(customGame.expires_at).getTime() > Date.now();
    }

    if (presetGame) {
      return presetGame.is_active;
    }

    // Check localStorage as fallback
    const localGame = getLocalGame(gameId);
    if (localGame) {
      const expiryTime = typeof localGame.expiresAt === 'number' 
        ? localGame.expiresAt 
        : new Date(localGame.expiresAt).getTime();
      return Date.now() < expiryTime;
    }
    
    return false;
  } catch (error) {
    console.error('Error checking game validity:', error);
    return false;
  }
};

// Get game with participants
export const getGameWithParticipants = async (gameId: string): Promise<{ game: StoredGame, participants: GameParticipant[] } | null> => {
  try {
    // Try custom_games first
    const { data: customGame } = await supabase
      .from('custom_games')
      .select('*')
      .eq('id', gameId)
      .single();

    // Then try preset_games
    const { data: presetGame } = customGame ? { data: null } : await supabase
      .from('preset_games')
      .select('*')
      .eq('id', gameId)
      .single();

    const game = customGame || presetGame;

    if (!game) {
      return null;
    }

    const participants = await getGameParticipants(gameId);

    let storedGame: StoredGame;
    
    if (customGame) {
      storedGame = {
        id: customGame.id,
        title: customGame.title,
        gameType: 'custom',
        content: customGame.game_data,
        htmlContent: customGame.html_content || '',
        description: customGame.description,
        expiresAt: new Date(customGame.expires_at),
        createdAt: new Date(customGame.created_at),
        password: customGame.password,
        maxParticipants: customGame.max_participants,
        showLeaderboard: customGame.show_leaderboard ?? true,
        requireRegistration: customGame.require_registration ?? false,
        customDuration: customGame.custom_duration
      };
    } else {
      storedGame = {
        id: presetGame.id,
        title: presetGame.title,
        gameType: presetGame.game_type,
        content: presetGame.template_data,
        htmlContent: '',
        description: presetGame.description,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // Default expiry
        createdAt: new Date(presetGame.created_at),
        password: null,
        maxParticipants: null,
        showLeaderboard: true,
        requireRegistration: false,
        customDuration: null
      };
    }

    return { game: storedGame, participants };
  } catch (error) {
    console.error('Error getting game with participants:', error);
    return null;
  }
};

// Get game session
export const getGameSession = async (gameId: string): Promise<GameSession | null> => {
  try {
    // Try custom_games first
    const { data: customGame } = await supabase
      .from('custom_games')
      .select('*')
      .eq('id', gameId)
      .single();

    // Then try preset_games
    const { data: presetGame } = customGame ? { data: null } : await supabase
      .from('preset_games')
      .select('*')
      .eq('id', gameId)
      .single();

    const game = customGame || presetGame;

    if (game) {
      const participants = await getGameParticipants(gameId);
      
      if (customGame) {
        return {
          id: customGame.id,
          title: customGame.title,
          gameType: 'custom',
          htmlContent: customGame.html_content,
          description: customGame.description,
          expiresAt: new Date(customGame.expires_at),
          createdAt: new Date(customGame.created_at).getTime(),
          participants
        };
      } else {
        return {
          id: presetGame.id,
          title: presetGame.title,
          gameType: presetGame.game_type,
          htmlContent: '',
          description: presetGame.description,
          expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
          createdAt: new Date(presetGame.created_at).getTime(),
          participants
        };
      }
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

    // Get from custom_games
    const { data: customGames } = await supabase
      .from('custom_games')
      .select('*')
      .order('created_at', { ascending: false });

    // Get from preset_games
    const { data: presetGames } = await supabase
      .from('preset_games')
      .select('*')
      .eq('is_active', true)
      .order('created_at', { ascending: false });

    // Process custom games
    if (customGames) {
      for (const game of customGames) {
        const participants = await getGameParticipants(game.id);
        sessions.push({
          id: game.id,
          title: game.title,
          gameType: 'custom',
          htmlContent: game.html_content,
          description: game.description,
          expiresAt: new Date(game.expires_at),
          createdAt: new Date(game.created_at).getTime(),
          participants
        });
      }
    }

    // Process preset games
    if (presetGames) {
      for (const game of presetGames) {
        const participants = await getGameParticipants(game.id);
        sessions.push({
          id: game.id,
          title: game.title,
          gameType: game.game_type,
          htmlContent: '',
          description: game.description,
          expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
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