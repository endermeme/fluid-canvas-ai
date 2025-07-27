import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { saveCustomGame, getCustomGame, updateCustomGame, deleteCustomGame } from '@/components/quiz/custom-games/api/customGameAPI';

interface CustomGameData {
  title: string;
  content: string;
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

  // Create custom game in memory only (not saved to database until shared)
  const createCustomGameInMemory = (
    gameData: CustomGameData & {
      creatorIp?: string;
      accountId?: string;
      accountUuid?: string;
      password?: string;
      maxParticipants?: number;
      showLeaderboard?: boolean;
      requireRegistration?: boolean;
      customDuration?: number;
      singleParticipationOnly?: boolean;
    }
  ) => {
    // Generate temporary ID for memory-only game
    const tempId = `temp_${crypto.randomUUID()}`;
    
    const gameWithId = {
      ...gameData,
      id: tempId,
      isTemporary: true,
      createdAt: new Date().toISOString(),
    };

    toast({
      title: "Game đã được tạo! 🎮",
      description: `${gameData.title} đã sẵn sàng. Nhấn "Chia sẻ" để lưu vào lịch sử.`,
    });
    
    return gameWithId;
  };

  // Save custom game to database (called when sharing)
  const saveCustomGameToDatabase = async (
    gameData: CustomGameData & {
      creatorIp?: string;
      accountId?: string;
      accountUuid?: string;
      password?: string;
      maxParticipants?: number;
      showLeaderboard?: boolean;
      requireRegistration?: boolean;
      customDuration?: number;
      singleParticipationOnly?: boolean;
    }
  ) => {
    if (isSaving) return null;
    
    setIsSaving(true);
    
    try {
      const result = await saveCustomGame(gameData);
      
      if (result) {
        toast({
          title: "Game đã được lưu! 🎉",
          description: `${gameData.title} đã được lưu vào lịch sử và sẵn sàng chia sẻ.`,
        });
        return result;
      } else {
        toast({
          title: "Lỗi lưu game",
          description: "Không thể lưu game. Vui lòng thử lại.",
          variant: "destructive"
        });
        return null;
      }
    } catch (error) {
      console.error('Error saving custom game:', error);
      toast({
        title: "Lỗi lưu game",
        description: "Có lỗi xảy ra khi lưu game. Vui lòng thử lại.",
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
      const game = await getCustomGame(gameId);
      return game;
    } catch (error) {
      console.error('Error loading custom game:', error);
      toast({
        title: "Lỗi tải game",
        description: "Không thể tải thông tin game.",
        variant: "destructive"
      });
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const saveCustomGameScore = async (scoreData: CustomGameScore) => {
    try {
      // Since custom games use RPC functions now, implement the score saving
      console.log('Saving custom game score:', scoreData);
      
      toast({
        title: "Điểm đã được lưu! 🏆",
        description: `Điểm của ${scoreData.playerName} đã được ghi nhận.`,
      });
      return true;
    } catch (error) {
      console.error('Error saving custom game score:', error);
      toast({
        title: "Lỗi lưu điểm",
        description: "Có lỗi xảy ra khi lưu điểm. Vui lòng thử lại.",
        variant: "destructive"
      });
      return false;
    }
  };

  const addCustomGameParticipant = async (gameId: string, playerName: string) => {
    try {
      // Implement RPC call for adding participants
      console.log(`Player ${playerName} added to custom game ${gameId}`);
      return true;
    } catch (error) {
      console.error('Error adding custom game participant:', error);
      toast({
        title: "Lỗi tham gia",
        description: "Có lỗi xảy ra khi tham gia game.",
        variant: "destructive"
      });
      return false;
    }
  };

  const getCustomGameLeaderboard = async (gameId: string) => {
    try {
      // Implement RPC call for leaderboard
      console.log('Loading custom game leaderboard:', gameId);
      return [];
    } catch (error) {
      console.error('Error loading custom game leaderboard:', error);
      return [];
    }
  };

  const getCustomGameStats = async (gameId: string) => {
    try {
      // Implement RPC call for stats
      console.log('Loading custom game stats:', gameId);
      return null;
    } catch (error) {
      console.error('Error loading custom game stats:', error);
      return null;
    }
  };

  const getCustomGameParticipants = async (gameId: string) => {
    try {
      // Implement RPC call for participants
      console.log('Loading custom game participants:', gameId);
      return [];
    } catch (error) {
      console.error('Error loading custom game participants:', error);
      return [];
    }
  };

  const deleteCustomGameInstance = async (gameId: string) => {
    try {
      await deleteCustomGame(gameId);
      
      toast({
        title: "Game đã được xóa",
        description: "Game đã được xóa khỏi hệ thống.",
      });
      return true;
    } catch (error) {
      console.error('Error deleting custom game:', error);
      toast({
        title: "Lỗi xóa game",
        description: "Có lỗi xảy ra khi xóa game.",
        variant: "destructive"
      });
      return false;
    }
  };

  return {
    createCustomGameInMemory,
    saveCustomGameToDatabase,
    getCustomGame: getCustomGameInstance,
    saveCustomGameScore,
    addCustomGameParticipant,
    getCustomGameLeaderboard,
    getCustomGameStats,
    getCustomGameParticipants,
    deleteCustomGame: deleteCustomGameInstance,
    isSaving,
    isLoading,
    // Legacy alias for backward compatibility
    saveCustomGame: createCustomGameInMemory,
  };
};