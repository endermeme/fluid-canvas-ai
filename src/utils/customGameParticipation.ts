// Custom Game Participation Utils
import { supabase } from '@/integrations/supabase/client';

export const addParticipant = async (gameId: string, playerName: string) => {
  try {
    const { error } = await supabase
      .from('custom_leaderboard')
      .insert({
        game_id: gameId,
        player_name: playerName,
        ip_address: 'web-participant'
      });

    if (error) throw error;
    
    console.log('Custom game participant added:', { gameId, playerName });
  } catch (error) {
    console.error('Error adding custom game participant:', error);
    throw error;
  }
};

export const updateParticipantActivity = async (gameId: string, playerName: string) => {
  try {
    const { error } = await supabase.rpc('update_custom_participant_activity', {
      target_game_id: gameId,
      target_player_name: playerName
    });

    if (error) throw error;
  } catch (error) {
    console.error('Error updating custom participant activity:', error);
  }
};