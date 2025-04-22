
import { supabase } from "@/integrations/supabase/client";

export interface CustomGameData {
  title: string;
  content: string;
  gameType: string;
  description?: string;
}

export const saveCustomGame = async (gameData: CustomGameData) => {
  try {
    const { data, error } = await supabase
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

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error saving custom game:', error);
    throw error;
  }
};

export const getCustomGame = async (gameId: string) => {
  try {
    const { data, error } = await supabase
      .from('games')
      .select('*')
      .eq('id', gameId)
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching custom game:', error);
    throw error;
  }
};

export const updateCustomGame = async (gameId: string, gameData: Partial<CustomGameData>) => {
  try {
    const { data, error } = await supabase
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

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error updating custom game:', error);
    throw error;
  }
};

export const deleteCustomGame = async (gameId: string) => {
  try {
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
      .select('*')
      .eq('is_preset', false)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error listing custom games:', error);
    throw error;
  }
};
