import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { presetGameAPI, PresetGameData, PresetGameScore } from '@/components/quiz/preset-games/api/presetGameAPI';

export const usePresetGameManager = () => {
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const savePresetGame = async (
    gameData: PresetGameData & {
      creatorIp?: string;
      accountId?: string;
      password?: string;
      maxParticipants?: number;
      showLeaderboard?: boolean;
      requireRegistration?: boolean;
      customDuration?: number;
    }
  ) => {
    if (isSaving) return null;
    
    setIsSaving(true);
    
    try {
      const result = await presetGameAPI.savePresetGameInstance(gameData);
      
      if (result.success) {
        toast({
          title: "Game đã được tạo! 🎉",
          description: `${gameData.title} đã sẵn sàng để chia sẻ.`,
        });
        return result.gameId;
      } else {
        toast({
          title: "Tạo game thất bại",
          description: "Không thể tạo game. Vui lòng thử lại.",
          variant: "destructive"
        });
        return null;
      }
    } catch (error) {
      console.error('Error saving preset game:', error);
      toast({
        title: "Lỗi hệ thống",
        description: "Đã xảy ra lỗi khi tạo game.",
        variant: "destructive"
      });
      return null;
    } finally {
      setIsSaving(false);
    }
  };

  const getPresetGame = async (gameId: string) => {
    setIsLoading(true);
    
    try {
      const result = await presetGameAPI.getPresetGameInstance(gameId);
      
      if (result.success) {
        return result.data;
      } else {
        toast({
          title: "Không tìm thấy game",
          description: "Game không tồn tại hoặc đã hết hạn.",
          variant: "destructive"
        });
        return null;
      }
    } catch (error) {
      console.error('Error getting preset game:', error);
      toast({
        title: "Lỗi tải game",
        description: "Không thể tải game. Vui lòng thử lại.",
        variant: "destructive"
      });
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const savePresetGameScore = async (scoreData: PresetGameScore) => {
    try {
      const success = await presetGameAPI.savePresetGameScore(scoreData);
      
      if (success) {
        // Get game data to determine game type for appropriate message
        const gameData = await presetGameAPI.getPresetGameInstance(scoreData.gameInstanceId);
        const gameType = gameData?.data?.preset_games?.game_type?.toLowerCase() || 
                        gameData?.data?.settings?.gameType?.toLowerCase();
        
        const isTimeBasedGame = ['memory', 'wordsearch', 'matching'].includes(gameType);
        
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
      } else {
        toast({
          title: "Lưu điểm thất bại",
          description: "Không thể lưu điểm số của bạn.",
          variant: "destructive"
        });
        return false;
      }
    } catch (error) {
      console.error('Error saving preset game score:', error);
      return false;
    }
  };

  const addPresetGameParticipant = async (gameInstanceId: string, playerName: string, ipAddress?: string) => {
    try {
      const success = await presetGameAPI.addPresetGameParticipant({
        gameInstanceId,
        playerName,
        ipAddress
      });
      
      return success;
    } catch (error) {
      console.error('Error adding preset game participant:', error);
      return false;
    }
  };

  const getPresetGameLeaderboard = async (gameInstanceId: string, limit: number = 10) => {
    try {
      return await presetGameAPI.getPresetGameLeaderboard(gameInstanceId, limit);
    } catch (error) {
      console.error('Error getting preset game leaderboard:', error);
      return [];
    }
  };

  const getPresetGameParticipants = async (gameInstanceId: string) => {
    try {
      return await presetGameAPI.getPresetGameParticipants(gameInstanceId);
    } catch (error) {
      console.error('Error getting preset game participants:', error);
      return [];
    }
  };

  const getPresetGameStats = async (gameInstanceId: string) => {
    try {
      return await presetGameAPI.getPresetGameStats(gameInstanceId);
    } catch (error) {
      console.error('Error getting preset game stats:', error);
      return null;
    }
  };

  const getPresetGamesList = async (accountId?: string, creatorIp?: string) => {
    try {
      return await presetGameAPI.getPresetGamesList(accountId, creatorIp);
    } catch (error) {
      console.error('Error getting preset games list:', error);
      return [];
    }
  };

  const deletePresetGame = async (gameInstanceId: string) => {
    try {
      const success = await presetGameAPI.deletePresetGameInstance(gameInstanceId);
      
      if (success) {
        toast({
          title: "Game đã được xóa",
          description: "Game đã được xóa thành công.",
        });
        return true;
      } else {
        toast({
          title: "Xóa game thất bại",
          description: "Không thể xóa game. Vui lòng thử lại.",
          variant: "destructive"
        });
        return false;
      }
    } catch (error) {
      console.error('Error deleting preset game:', error);
      toast({
        title: "Lỗi hệ thống",
        description: "Đã xảy ra lỗi khi xóa game.",
        variant: "destructive"
      });
      return false;
    }
  };

  const incrementShareCount = async (gameInstanceId: string) => {
    try {
      await presetGameAPI.incrementShareCount(gameInstanceId);
    } catch (error) {
      console.error('Error incrementing share count:', error);
    }
  };

  return {
    savePresetGame,
    getPresetGame,
    savePresetGameScore,
    addPresetGameParticipant,
    getPresetGameLeaderboard,
    getPresetGameParticipants,
    getPresetGameStats,
    getPresetGamesList,
    deletePresetGame,
    incrementShareCount,
    isSaving,
    isLoading
  };
};