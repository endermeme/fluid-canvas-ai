import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface UnifiedGameScore {
  gameId: string;
  sourceTable: 'games';
  playerName: string;
  playerId?: string;
  score: number;
  totalQuestions: number;
  completionTime?: number;
  scoringData?: Record<string, any>;
  gameType: string;
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
      // Insert main score
      const { data: scoreRecord, error: scoreError } = await supabase
        .from('unified_game_scores')
        .insert({
          game_id: scoreData.gameId,
          source_table: scoreData.sourceTable,
          player_name: scoreData.playerName,
          player_id: scoreData.playerId,
          score: scoreData.score,
          total_questions: scoreData.totalQuestions,
          completion_time: scoreData.completionTime,
          scoring_data: scoreData.scoringData || {},
          game_type: scoreData.gameType,
          ip_address: 'shared-game'
        })
        .select()
        .single();

      if (scoreError) {
        console.error('Error saving unified score:', scoreError);
        toast({
          title: "Lưu điểm thất bại",
          description: "Không thể lưu điểm số của bạn.",
          variant: "destructive"
        });
        return false;
      }

      // Insert score details if provided
      if (details && details.length > 0 && scoreRecord) {
        const detailsToInsert = details.map(detail => ({
          score_id: scoreRecord.id,
          metric_name: detail.metricName,
          metric_value: detail.metricValue,
          metric_data: detail.metricData || {}
        }));

        const { error: detailsError } = await supabase
          .from('game_score_details')
          .insert(detailsToInsert);

        if (detailsError) {
          console.error('Error saving score details:', detailsError);
        }
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
    sourceTable: 'games',
    limit: number = 10
  ) => {
    try {
      const { data, error } = await supabase.rpc('get_unified_game_leaderboard', {
        target_game_id: gameId,
        target_source_table: sourceTable,
        limit_count: limit
      });

      if (error) {
        console.error('Error fetching unified leaderboard:', error);
        return [];
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