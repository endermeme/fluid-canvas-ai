import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { saveCustomGame, getCustomGame, updateCustomGame, deleteCustomGame } from '@/components/quiz/custom-games/api/customGameAPI';

export const useCustomGameManager = () => {
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const saveCustomGame = async (
    gameData: CustomGameData & {
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
      const result = await newCustomGameAPI.saveCustomGameInstance(gameData);
      
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
      console.error('Error saving custom game:', error);
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

  const getCustomGame = async (gameId: string) => {
    setIsLoading(true);
    
    try {
      const result = await newCustomGameAPI.getCustomGameInstance(gameId);
      
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
      console.error('Error getting custom game:', error);
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

  const saveCustomGameScore = async (scoreData: CustomGameScore) => {
    try {
      const success = await newCustomGameAPI.saveCustomGameScore(scoreData);
      
      if (success) {
        toast({
          title: "Điểm đã được lưu! 🎉",
          description: `Bạn đạt ${scoreData.score}/${scoreData.totalQuestions} điểm.`,
        });
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
      console.error('Error saving custom game score:', error);
      return false;
    }
  };

  const addCustomGameParticipant = async (gameInstanceId: string, playerName: string, ipAddress?: string) => {
    try {
      const success = await newCustomGameAPI.addCustomGameParticipant({
        gameInstanceId,
        playerName,
        ipAddress
      });
      
      return success;
    } catch (error) {
      console.error('Error adding custom game participant:', error);
      return false;
    }
  };

  const getCustomGameLeaderboard = async (gameInstanceId: string, limit: number = 10) => {
    try {
      return await newCustomGameAPI.getCustomGameLeaderboard(gameInstanceId, limit);
    } catch (error) {
      console.error('Error getting custom game leaderboard:', error);
      return [];
    }
  };

  const getCustomGameParticipants = async (gameInstanceId: string) => {
    try {
      return await newCustomGameAPI.getCustomGameParticipants(gameInstanceId);
    } catch (error) {
      console.error('Error getting custom game participants:', error);
      return [];
    }
  };

  const getCustomGameStats = async (gameInstanceId: string) => {
    try {
      return await newCustomGameAPI.getCustomGameStats(gameInstanceId);
    } catch (error) {
      console.error('Error getting custom game stats:', error);
      return null;
    }
  };

  const getCustomGamesList = async (accountId?: string, creatorIp?: string) => {
    try {
      return await newCustomGameAPI.getCustomGamesList(accountId, creatorIp);
    } catch (error) {
      console.error('Error getting custom games list:', error);
      return [];
    }
  };

  const deleteCustomGame = async (gameInstanceId: string) => {
    try {
      const success = await newCustomGameAPI.deleteCustomGameInstance(gameInstanceId);
      
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
      console.error('Error deleting custom game:', error);
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
      await newCustomGameAPI.incrementShareCount(gameInstanceId);
    } catch (error) {
      console.error('Error incrementing share count:', error);
    }
  };

  return {
    saveCustomGame,
    getCustomGame,
    saveCustomGameScore,
    addCustomGameParticipant,
    getCustomGameLeaderboard,
    getCustomGameParticipants,
    getCustomGameStats,
    getCustomGamesList,
    deleteCustomGame,
    incrementShareCount,
    isSaving,
    isLoading
  };
};