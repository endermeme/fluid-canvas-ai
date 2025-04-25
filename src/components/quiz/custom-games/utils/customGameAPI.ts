
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
    // First save to games table
    const { data: gameEntry, error: gameError } = await supabase
      .from('games')
      .insert([{
        title: gameData.title,
        html_content: gameData.content,
        game_type: gameData.gameType,
        description: gameData.description,
        is_preset: false,
        content_type: 'html'
      }])
      .select()
      .single();

    if (gameError) throw gameError;

    // Then save additional data to custom_games table
    const { data: customGame, error: customError } = await supabase
      .from('custom_games')
      .insert([{
        game_id: gameEntry.id,
        game_data: {
          title: gameData.title,
          content: gameData.content,
          type: gameData.gameType
        },
        settings: gameData.settings || {}
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
    const { data: game, error: gameError } = await supabase
      .from('games')
      .select('*, custom_games(*)')
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
    // Update games table
    const { data: gameUpdate, error: gameError } = await supabase
      .from('games')
      .update({
        title: gameData.title,
        html_content: gameData.content,
        game_type: gameData.gameType,
        description: gameData.description
      })
      .eq('id', gameId)
      .select()
      .single();

    if (gameError) throw gameError;

    // Update custom_games table
    const { data: customUpdate, error: customError } = await supabase
      .from('custom_games')
      .update({
        game_data: {
          title: gameData.title,
          content: gameData.content,
          type: gameData.gameType
        },
        settings: gameData.settings || {}
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
    // Due to CASCADE delete, removing from games will also remove from custom_games
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
      .select('*, custom_games(*)')
      .eq('is_preset', false)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error listing custom games:', error);
    throw error;
  }
};

