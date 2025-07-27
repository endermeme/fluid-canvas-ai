import { supabase } from '@/integrations/supabase/client';

// Types for the new simplified structure
export interface PresetGameData {
  title: string;
  gameType: string;
  templateData: any;
  settings?: any;
  description?: string;
}

export interface PresetLeaderboardEntry {
  gameId: string;
  playerName: string;
  ipAddress?: string;
  joinedAt?: string;
  lastActiveAt?: string;
  isActive?: boolean;
  sessionData?: any;
  score?: number;
  totalQuestions?: number;
  completionTime?: number;
  scoringData?: any;
  completedAt?: string;
}

// API Functions cho Preset Games với cấu trúc mới
export const presetGameAPI = {
  // Lưu preset game 
  async savePresetGameInstance(gameData: PresetGameData & { 
    isPublished?: boolean;
    maxParticipants?: number;
    showLeaderboard?: boolean;
    requireRegistration?: boolean;
    customDuration?: number;
    singleParticipationOnly?: boolean;
    password?: string;
    creatorIp?: string;
    accountId?: string;
  }): Promise<any> {
    try {
      // Calculate expiration time
      const expiresAt = new Date();
      if (gameData.customDuration) {
        expiresAt.setTime(Date.now() + gameData.customDuration * 60 * 60 * 1000);
      } else {
        expiresAt.setDate(expiresAt.getDate() + 2); // Default 2 days
      }

      const { data, error } = await (supabase as any)
        .from('preset_games')
        .insert({
          title: gameData.title,
          game_type: gameData.gameType,
          description: gameData.description || '',
          template_data: gameData.templateData,
          default_settings: gameData.settings || {},
          is_published: true, // Published when sharing
          expires_at: expiresAt.toISOString(),
          creator_ip: gameData.creatorIp || 'localhost',
          account_id: gameData.accountId,
          password: gameData.password || null,
          max_participants: gameData.maxParticipants || null,
          show_leaderboard: gameData.showLeaderboard ?? true,
          require_registration: gameData.requireRegistration ?? false,
          custom_duration: gameData.customDuration || null,
          single_participation_only: gameData.singleParticipationOnly ?? false
        })
        .select()
        .single();

      if (error) throw error;
      return { success: true, gameId: data.id, data };
    } catch (error) {
      console.error('Error saving preset game:', error);
      return { success: false, error };
    }
  },

  // Lấy preset game
  async getPresetGameInstance(gameId: string): Promise<any> {
    try {
      const { data, error } = await (supabase as any)
        .from('preset_games')
        .select('*')
        .eq('id', gameId)
        .eq('is_published', true)
        .gt('expires_at', new Date().toISOString())
        .single();

      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      console.error('Error fetching preset game:', error);
      return { success: false, error };
    }
  },

  // Lưu điểm số preset game - cập nhật trực tiếp trong preset_leaderboard
  async savePresetGameScore(scoreData: { gameId: string; playerName: string; score?: number; totalQuestions?: number; completionTime?: number; scoringData?: any }): Promise<boolean> {
    try {
      const { error } = await (supabase as any)
        .from('preset_leaderboard')
        .update({
          score: scoreData.score,
          total_questions: scoreData.totalQuestions,
          completion_time: scoreData.completionTime,
          scoring_data: scoreData.scoringData,
          completed_at: new Date().toISOString()
        })
        .eq('game_id', scoreData.gameId)
        .eq('player_name', scoreData.playerName);

      return !error;
    } catch (error) {
      console.error('Error saving preset game score:', error);
      return false;
    }
  },

  // Thêm participant vào preset game
  async addPresetGameParticipant(participantData: PresetLeaderboardEntry): Promise<boolean> {
    try {
      const { error } = await (supabase as any)
        .from('preset_leaderboard')
        .insert({
          game_id: participantData.gameId,
          player_name: participantData.playerName,
          ip_address: participantData.ipAddress || 'unknown',
          is_active: true,
          session_data: participantData.sessionData || {}
        });

      return !error;
    } catch (error) {
      console.error('Error adding preset game participant:', error);
      return false;
    }
  },

  // Lấy leaderboard preset game
  async getPresetGameLeaderboard(gameId: string, limit: number = 10): Promise<any[]> {
    try {
      const { data, error } = await (supabase as any)
        .from('preset_leaderboard')
        .select('*')
        .eq('game_id', gameId)
        .not('score', 'is', null)
        .order('score', { ascending: false })
        .limit(limit);

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching preset game leaderboard:', error);
      return [];
    }
  },

  // Lấy danh sách participants real-time
  async getPresetGameParticipants(gameId: string): Promise<any[]> {
    try {
      // Tạm thời query trực tiếp table cho đến khi types được update
      const { data, error } = await (supabase as any)
        .from('preset_leaderboard')
        .select('*')
        .eq('game_id', gameId)
        .order('joined_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching preset game participants:', error);
      return [];
    }
  },

  // Lấy thống kê preset game cho admin
  async getPresetGameStats(gameId: string): Promise<any> {
    try {
      const { data, error } = await (supabase as any)
        .from('preset_leaderboard')
        .select('*')
        .eq('game_id', gameId);

      if (error) throw error;

      const totalParticipants = data.length;
      const completedGames = data.filter((p: any) => p.score !== null);
      const totalScores = completedGames.length;
      const averageScore = totalScores > 0 ? 
        completedGames.reduce((sum: number, p: any) => sum + (p.score || 0), 0) / totalScores : 0;
      const bestScore = totalScores > 0 ? 
        Math.max(...completedGames.map((p: any) => p.score || 0)) : 0;
      const completionRate = totalParticipants > 0 ? 
        (totalScores / totalParticipants) * 100 : 0;
      const activeParticipants = data.filter((p: any) => p.is_active).length;

      return {
        total_participants: totalParticipants,
        total_scores: totalScores,
        average_score: Math.round(averageScore * 100) / 100,
        best_score: bestScore,
        completion_rate: Math.round(completionRate * 100) / 100,
        active_participants: activeParticipants
      };
    } catch (error) {
      console.error('Error fetching preset game stats:', error);
      return null;
    }
  },

  // Tăng share count - Bỏ qua vì bảng preset_games không có trường này
  async incrementShareCount(gameId: string): Promise<void> {
    try {
      // Không làm gì vì bảng preset_games không có share_count field
      console.log('Share count tracking not available for preset games');
    } catch (error) {
      console.error('Error incrementing share count:', error);
    }
  },

  // Lấy danh sách preset games
  async getPresetGamesList(accountId?: string, creatorIp?: string): Promise<any[]> {
    try {
      let query = (supabase as any)
        .from('preset_games')
        .select('*')
        .eq('is_published', true)
        .gt('expires_at', new Date().toISOString())
        .order('created_at', { ascending: false });

      if (accountId) {
        query = query.eq('account_id', accountId);
      } else if (creatorIp) {
        query = query.eq('creator_ip', creatorIp);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching preset games list:', error);
      return [];
    }
  },

  // Xóa preset game
  async deletePresetGameInstance(gameId: string): Promise<boolean> {
    try {
      const { error } = await (supabase as any)
        .from('preset_games')
        .delete()
        .eq('id', gameId);

      return !error;
    } catch (error) {
      console.error('Error deleting preset game:', error);
      return false;
    }
  }
};