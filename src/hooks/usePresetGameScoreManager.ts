import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface PresetGameScore {
  gameId: string;
  playerName: string;
  playerId?: string;
  score: number;
  totalQuestions: number;
  completionTime?: number;
  scoringData?: Record<string, any>;
  gameType: string;
  ipAddress?: string;
}

interface ScoreDetail {
  metricName: string;
  metricValue: number;
  metricData?: Record<string, any>;
}

export const usePresetGameScoreManager = () => {
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

  const savePresetGameScore = async (scoreData: PresetGameScore, details?: ScoreDetail[]) => {
    if (isSaving) return false;
    
    setIsSaving(true);
    
    try {
      console.log('💾 [PresetGameScoreManager] Saving score:', scoreData);
      
      // Try to update existing participant record first
      const { data: updateData, error: updateError } = await supabase
        .from('preset_leaderboard')
        .update({
          score: scoreData.score,
          total_questions: scoreData.totalQuestions,
          completion_time: scoreData.completionTime,
          scoring_data: details ? { details } : scoreData.scoringData || {},
          completed_at: new Date().toISOString(),
          last_active_at: new Date().toISOString()
        })
        .eq('game_id', scoreData.gameId)
        .eq('player_name', scoreData.playerName)
        .select();

      console.log('🔄 [PresetGameScoreManager] Update result:', { updateData, updateError });

      let scoreError = updateError;

      // If no rows were affected by update, participant doesn't exist - create new one
      if (!updateError && (!updateData || updateData.length === 0)) {
        console.log('🔄 [PresetGameScoreManager] No existing participant, creating new one');
        
        const { error: insertError } = await supabase
          .from('preset_leaderboard')
          .insert({
            game_id: scoreData.gameId,
            player_name: scoreData.playerName,
            score: scoreData.score,
            total_questions: scoreData.totalQuestions,
            completion_time: scoreData.completionTime,
            scoring_data: details ? { details } : scoreData.scoringData || {},
            completed_at: new Date().toISOString(),
            ip_address: scoreData.ipAddress || 'unknown'
          });
        
        scoreError = insertError;
        console.log('🔄 [PresetGameScoreManager] Insert result:', { insertError });
      }

      if (scoreError) {
        console.error('Error saving preset game score:', scoreError);
        toast({
          title: "Lưu điểm thất bại",
          description: "Không thể lưu điểm số của bạn.",
          variant: "destructive"
        });
        return false;
      }

      // Show appropriate success message based on game type
      const isTimeBasedGame = ['memory', 'wordsearch', 'matching'].includes(scoreData.gameType?.toLowerCase());
      
      if (isTimeBasedGame && scoreData.completionTime) {
        const minutes = Math.floor(scoreData.completionTime / 60);
        const seconds = scoreData.completionTime % 60;
        const timeText = minutes > 0 ? `${minutes}:${seconds.toString().padStart(2, '0')}` : `${seconds}s`;
        
        toast({
          title: "Kết quả đã được lưu! 🎉",
          description: `Hoàn thành trong ${timeText}`,
        });
      } else {
        toast({
          title: "Điểm đã được lưu! 🎉",
          description: `Bạn đạt ${scoreData.score}/${scoreData.totalQuestions} điểm.`,
        });
      }
      
      return true;
    } catch (error) {
      console.error('Error saving preset game score:', error);
      return false;
    } finally {
      setIsSaving(false);
    }
  };

  const getPresetGameLeaderboard = async (gameId: string, limit: number = 10) => {
    try {
      const { data: leaderboardData, error } = await supabase
        .from('preset_leaderboard')
        .select('player_name, score, total_questions, completion_time, scoring_data, completed_at')
        .eq('game_id', gameId)
        .not('score', 'is', null)
        .order('score', { ascending: false })
        .limit(limit);
        
      if (error) {
        console.error('Error fetching preset game leaderboard:', error);
        return [];
      }

      return leaderboardData || [];
    } catch (error) {
      console.error('Error fetching preset game leaderboard:', error);
      return [];
    }
  };

  return {
    savePresetGameScore,
    getPresetGameLeaderboard,
    isSaving
  };
};