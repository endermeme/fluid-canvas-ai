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
      // Determine if this is a time-based game (Memory, Word Search, Matching)
      const timeBasedGames = ['memory', 'wordsearch', 'matching'];
      const isTimeBasedGame = timeBasedGames.includes(scoreData.gameType?.toLowerCase());
      
      const { error } = await supabase
        .from('unified_game_scores')
        .insert({
          game_id: scoreData.gameId,
          source_table: 'games',
          player_name: scoreData.playerName,
          score: isTimeBasedGame ? 0 : scoreData.score,
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

      // Show appropriate success message based on game type
      
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