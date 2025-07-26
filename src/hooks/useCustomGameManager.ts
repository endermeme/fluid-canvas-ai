import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { saveCustomGame, getCustomGame, updateCustomGame, deleteCustomGame } from '@/components/quiz/custom-games/api/customGameAPI';

interface CustomGameData {
  title: string;
  content: any;
  gameType: string;
  description?: string;
  settings?: any;
}

interface CustomGameScore {
  gameInstanceId: string;
  playerName: string;
  score: number;
  totalQuestions: number;
  completionTime?: number;
  gameType: string;
}

export const useCustomGameManager = () => {
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const saveCustomGameInstance = async (
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
      const result = await saveCustomGame(gameData);
      
      if (result) {
        toast({
          title: "Game đã được tạo! 🎉",
          description: `${gameData.title} đã sẵn sàng để chia sẻ.`,
        });
        return result;
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

  const getCustomGameInstance = async (gameId: string) => {
    setIsLoading(true);
    
    try {
      const result = await getCustomGame(gameId);
      
      if (result) {
        return result;
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
      // This functionality should be handled by useUnifiedScoreManager instead
      return false;
    } catch (error) {
      console.error('Error saving custom game score:', error);
      return false;
    }
  };

  const addCustomGameParticipant = async (gameInstanceId: string, playerName: string, ipAddress?: string) => {
    try {
      // This should be handled by the new API structure
      return false;
    } catch (error) {
      console.error('Error adding custom game participant:', error);
      return false;
    }
  };

  const getCustomGameLeaderboard = async (gameInstanceId: string, limit: number = 10) => {
    try {
      // This should use useUnifiedScoreManager instead
      return [];
    } catch (error) {
      console.error('Error getting custom game leaderboard:', error);
      return [];
    }
  };

  const getCustomGameParticipants = async (gameInstanceId: string) => {
    try {
      // This should be handled by the new API structure
      return [];
    } catch (error) {
      console.error('Error getting custom game participants:', error);
      return [];
    }
  };

  const getCustomGameStats = async (gameInstanceId: string) => {
    try {
      // This should be handled by the new API structure
      return null;
    } catch (error) {
      console.error('Error getting custom game stats:', error);
      return null;
    }
  };

  const getCustomGamesList = async (accountId?: string, creatorIp?: string) => {
    try {
      // This should be handled by the customGameAPI
      return [];
    } catch (error) {
      console.error('Error getting custom games list:', error);
      return [];
    }
  };

  const deleteCustomGameInstance = async (gameInstanceId: string) => {
    try {
      await deleteCustomGame(gameInstanceId);
      toast({
        title: "Game đã được xóa",
        description: "Game đã được xóa thành công.",
      });
      return true;
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
      // This should be handled by the new API structure
    } catch (error) {
      console.error('Error incrementing share count:', error);
    }
  };

  return {
    saveCustomGame: saveCustomGameInstance,
    getCustomGame: getCustomGameInstance,
    saveCustomGameScore,
    addCustomGameParticipant,
    getCustomGameLeaderboard,
    getCustomGameParticipants,
    getCustomGameStats,
    getCustomGamesList,
    deleteCustomGame: deleteCustomGameInstance,
    incrementShareCount,
    isSaving,
    isLoading
  };
};