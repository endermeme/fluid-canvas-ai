import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { presetGameAPI, PresetGameData, PresetLeaderboardEntry } from '@/components/quiz/preset-games/api/presetGameAPI';

export const usePresetGameManager = () => {
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  // Create preset game in memory only (not saved to database until shared)
  const createPresetGameInMemory = (
    gameData: PresetGameData & {
      creatorIp?: string;
      accountId?: string;
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

  // Save preset game to database (called when sharing)
  const savePresetGameToDatabase = async (
    gameData: PresetGameData & {
      creatorIp?: string;
      accountId?: string;
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
      const result = await presetGameAPI.savePresetGameInstance(gameData);
      
      if (result.success) {
        toast({
          title: "Game đã được lưu! 🎉",
          description: `${gameData.title} đã được lưu vào lịch sử và sẵn sàng chia sẻ.`,
        });
        return result;
      } else {
        toast({
          title: "Lỗi lưu game",
          description: result.error || "Không thể lưu game. Vui lòng thử lại.",
          variant: "destructive"
        });
        return null;
      }
    } catch (error) {
      console.error('Error saving preset game:', error);
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

  const getPresetGame = async (gameId: string) => {
    setIsLoading(true);
    try {
      const game = await presetGameAPI.getPresetGameInstance(gameId);
      return game;
    } catch (error) {
      console.error('Error loading preset game:', error);
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

  const savePresetGameScore = async (scoreData: { gameId: string; playerName: string; score?: number; totalQuestions?: number; completionTime?: number; scoringData?: any }) => {
    try {
      const success = await presetGameAPI.savePresetGameScore(scoreData);
      
      if (success) {
        toast({
          title: "Điểm đã được lưu! 🏆",
          description: `Điểm của ${scoreData.playerName} đã được ghi nhận.`,
        });
        return true;
      } else {
        toast({
          title: "Lỗi lưu điểm",
          description: "Không thể lưu điểm số. Vui lòng thử lại.",
          variant: "destructive"
        });
        return false;
      }
    } catch (error) {
      console.error('Error saving preset game score:', error);
      toast({
        title: "Lỗi lưu điểm",
        description: "Có lỗi xảy ra khi lưu điểm. Vui lòng thử lại.",
        variant: "destructive"
      });
      return false;
    }
  };

  const addPresetGameParticipant = async (gameId: string, playerName: string) => {
    try {
      const participantData: PresetLeaderboardEntry = {
        gameId,
        playerName,
        ipAddress: 'dynamic',
        isActive: true,
        sessionData: {}
      };
      
      const success = await presetGameAPI.addPresetGameParticipant(participantData);
      
      if (success) {
        console.log(`Player ${playerName} added to preset game ${gameId}`);
        return true;
      } else {
        toast({
          title: "Lỗi tham gia",
          description: "Không thể tham gia game. Vui lòng thử lại.",
          variant: "destructive"
        });
        return false;
      }
    } catch (error) {
      console.error('Error adding preset game participant:', error);
      toast({
        title: "Lỗi tham gia",
        description: "Có lỗi xảy ra khi tham gia game.",
        variant: "destructive"
      });
      return false;
    }
  };

  const getPresetGameLeaderboard = async (gameId: string): Promise<PresetLeaderboardEntry[]> => {
    try {
      const leaderboard = await presetGameAPI.getPresetGameLeaderboard(gameId);
      return leaderboard;
    } catch (error) {
      console.error('Error loading preset game leaderboard:', error);
      toast({
        title: "Lỗi tải bảng xếp hạng",
        description: "Không thể tải bảng xếp hạng.",
        variant: "destructive"
      });
      return [];
    }
  };

  const getPresetGameStats = async (gameId: string) => {
    try {
      const stats = await presetGameAPI.getPresetGameStats(gameId);
      return stats;
    } catch (error) {
      console.error('Error loading preset game stats:', error);
      return null;
    }
  };

  const getPresetGameParticipants = async (gameId: string) => {
    try {
      const participants = await presetGameAPI.getPresetGameParticipants(gameId);
      return participants;
    } catch (error) {
      console.error('Error loading preset game participants:', error);
      return [];
    }
  };

  const deletePresetGame = async (gameId: string) => {
    try {
      const success = await presetGameAPI.deletePresetGameInstance(gameId);
      
      if (success) {
        toast({
          title: "Game đã được xóa",
          description: "Game đã được xóa khỏi hệ thống.",
        });
        return true;
      } else {
        toast({
          title: "Lỗi xóa game",
          description: "Không thể xóa game. Vui lòng thử lại.",
          variant: "destructive"
        });
        return false;
      }
    } catch (error) {
      console.error('Error deleting preset game:', error);
      toast({
        title: "Lỗi xóa game",
        description: "Có lỗi xảy ra khi xóa game.",
        variant: "destructive"
      });
      return false;
    }
  };

  return {
    createPresetGameInMemory,
    savePresetGameToDatabase,
    getPresetGame,
    savePresetGameScore,
    addPresetGameParticipant,
    getPresetGameLeaderboard,
    getPresetGameStats,
    getPresetGameParticipants,
    deletePresetGame,
    isSaving,
    isLoading,
    // Legacy alias for backward compatibility
    savePresetGame: createPresetGameInMemory,
  };
};