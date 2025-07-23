import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface GameScore {
  gameId: string;
  playerName: string;
  score: number;
  totalQuestions: number;
  completionTime?: number;
  gameType: string;
}

export const useGameScoreManager = () => {
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

  const saveGameScore = async (scoreData: GameScore) => {
    if (isSaving) return;
    
    setIsSaving(true);
    
    try {
      const { error } = await supabase
        .from('game_scores')
        .insert({
          game_id: scoreData.gameId,
          player_name: scoreData.playerName,
          score: scoreData.score,
          total_questions: scoreData.totalQuestions,
          completion_time: scoreData.completionTime,
          game_type: scoreData.gameType,
          ip_address: 'shared-game'
        });

      if (error) {
        console.error('Error saving game score:', error);
        toast({
          title: "Lưu điểm thất bại",
          description: "Không thể lưu điểm số của bạn.",
          variant: "destructive"
        });
        return false;
      }

      toast({
        title: "Điểm đã được lưu! 🎉",
        description: `Bạn đạt ${scoreData.score}/${scoreData.totalQuestions} điểm.`,
      });
      
      return true;
    } catch (error) {
      console.error('Error saving game score:', error);
      return false;
    } finally {
      setIsSaving(false);
    }
  };

  return {
    saveGameScore,
    isSaving
  };
};