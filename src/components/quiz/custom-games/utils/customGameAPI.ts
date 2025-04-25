
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
    // Save to games table with proper HTML content and metadata
    const { data: gameEntry, error: gameError } = await supabase
      .from('games')
      .insert([{
        title: gameData.title,
        html_content: gameData.content,
        game_type: 'custom',
        description: gameData.description || 'Game tương tác tùy chỉnh',
        is_preset: false,
        content_type: 'html',
        expires_at: new Date(Date.now() + (48 * 60 * 60 * 1000)).toISOString() // 48 hours
      }])
      .select()
      .single();

    if (gameError) throw gameError;

    // Save additional game data to custom_games table
    const { data: customGame, error: customError } = await supabase
      .from('custom_games')
      .insert([{
        game_id: gameEntry.id,
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

    if (customError) throw customError;

    return { ...gameEntry, customData: customGame };
  } catch (error) {
    console.error('Error saving custom game:', error);
    throw error;
  }
};

export const getCustomGame = async (gameId: string) => {
  try {
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

    if (gameError) throw gameError;
    return game;
  } catch (error) {
    console.error('Error fetching custom game:', error);
    throw error;
  }
};

export const updateCustomGame = async (gameId: string, gameData: Partial<CustomGameData>) => {
  try {
    // Update games table with basic game info
    const { data: gameUpdate, error: gameError } = await supabase
      .from('games')
      .update({
        title: gameData.title,
        html_content: gameData.content,
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
    return data;
  } catch (error) {
    console.error('Error listing custom games:', error);
    throw error;
  }
};

