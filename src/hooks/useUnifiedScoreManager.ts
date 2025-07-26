import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface UnifiedGameScore {
  gameId: string;
  sourceTable: 'custom_games' | 'preset_games';
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

export const useUnifiedScoreManager = () => {
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

  const saveUnifiedScore = async (scoreData: UnifiedGameScore, details?: ScoreDetail[]) => {
    if (isSaving) return false;
    
    setIsSaving(true);
    
    try {
      console.log('💾 [useUnifiedScoreManager] Saving score:', scoreData);
      
      const tableName = scoreData.sourceTable === 'custom_games' ? 'custom_leaderboard' : 'preset_leaderboard';
      
      // First try to update existing record, then insert if not found
      const { error: updateError } = await supabase
        .from(tableName)
        .update({
          score: scoreData.score,
          total_questions: scoreData.totalQuestions,
          completion_time: scoreData.completionTime,
          scoring_data: details ? { details } : scoreData.scoringData || {},
          completed_at: new Date().toISOString(),
          last_active_at: new Date().toISOString()
        })
        .eq('game_id', scoreData.gameId)
        .eq('player_name', scoreData.playerName);

      let scoreError = updateError;

      if (updateError) {
        console.log('🔄 [useUnifiedScoreManager] Update failed, trying insert:', updateError);
        
        // If update failed, try insert
        const { error: insertError } = await supabase
          .from(tableName)
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
      }

      if (scoreError) {
        console.error('Error saving score:', scoreError);
        toast({
          title: "Lưu điểm thất bại",
          description: "Không thể lưu điểm số của bạn.",
          variant: "destructive"
        });
        return false;
      }

      // Show success message
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
      console.error('Error saving unified score:', error);
      return false;
    } finally {
      setIsSaving(false);
    }
  };

  const getUnifiedLeaderboard = async (
    gameId: string, 
    sourceTable: 'custom_games' | 'preset_games',
    limit: number = 10
  ) => {
    try {
      let data = [];
      
      if (sourceTable === 'custom_games') {
        const { data: leaderboardData, error } = await supabase
          .from('custom_leaderboard')
          .select('player_name, score, total_questions, completion_time, scoring_data, completed_at')
          .eq('game_id', gameId)
          .not('score', 'is', null)
          .order('score', { ascending: false })
          .limit(limit);
          
        if (!error && leaderboardData) {
          data = leaderboardData.map(entry => ({
            ...entry,
            game_type: 'custom'
          }));
        }
      } else if (sourceTable === 'preset_games') {
        const { data: leaderboardData, error } = await supabase
          .from('preset_leaderboard')
          .select('player_name, score, total_questions, completion_time, scoring_data, completed_at')
          .eq('game_id', gameId)
          .not('score', 'is', null)
          .order('score', { ascending: false })
          .limit(limit);
          
        if (!error && leaderboardData) {
          data = leaderboardData.map(entry => ({
            ...entry,
            game_type: 'preset'
          }));
        }
      }

      return data || [];
    } catch (error) {
      console.error('Error fetching unified leaderboard:', error);
      return [];
    }
  };

  return {
    saveUnifiedScore,
    getUnifiedLeaderboard,
    isSaving
  };
};