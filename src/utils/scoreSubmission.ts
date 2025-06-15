
import { supabase } from "@/integrations/supabase/client";

export interface ScoreSubmissionData {
  gameId: string;
  playerName: string;
  score: number;
  totalQuestions: number;
  completionTime?: number;
  ipAddress?: string;
  gameType?: string;
}

export const submitGameScore = async (data: ScoreSubmissionData) => {
  try {
    console.log("Submitting game score:", data);
    
    const { data: scoreEntry, error } = await supabase
      .from('game_scores')
      .insert([{
        game_id: data.gameId,
        player_name: data.playerName,
        score: data.score,
        total_questions: data.totalQuestions,
        completion_time: data.completionTime,
        ip_address: data.ipAddress,
        game_type: data.gameType || 'quiz'
      }])
      .select()
      .single();

    if (error) {
      console.error("Error submitting score to Supabase:", error);
      throw error;
    }

    console.log("Score submitted successfully:", scoreEntry);
    return scoreEntry;
  } catch (error) {
    console.error('Error submitting game score:', error);
    throw error;
  }
};

export const getGameLeaderboard = async (gameId: string, limit: number = 10) => {
  try {
    const { data, error } = await supabase
      .rpc('get_game_leaderboard', {
        target_game_id: gameId,
        limit_count: limit
      });

    if (error) {
      console.error("Error fetching leaderboard:", error);
      throw error;
    }

    return data || [];
  } catch (error) {
    console.error('Error fetching game leaderboard:', error);
    throw error;
  }
};
