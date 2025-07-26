import { supabase } from '@/integrations/supabase/client';

// Types cho Custom Games
export interface CustomGameData {
  title: string;
  content: string;
  description?: string;
  settings?: any;
}

export interface CustomGameInstance {
  id: string;
  title: string;
  htmlContent: string;
  description?: string;
  isPublished: boolean;
  creatorIp?: string;
  accountId?: string;
  password?: string;
  maxParticipants?: number;
  showLeaderboard?: boolean;
  requireRegistration?: boolean;
  customDuration?: number;
  expiresAt: string;
  shareCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface CustomGameScore {
  gameInstanceId: string;
  playerName: string;
  playerId?: string;
  score: number;
  totalQuestions: number;
  completionTime?: number;
  scoringData?: any;
  ipAddress?: string;
}

export interface CustomGameParticipant {
  gameInstanceId: string;
  playerName: string;
  ipAddress?: string;
  sessionData?: any;
}

// API Functions cho Custom Games
export const newCustomGameAPI = {
  // Lưu custom game instance
  async saveCustomGameInstance(gameData: CustomGameData & {
    customGameId?: string;
    creatorIp?: string;
    accountId?: string;
    password?: string;
    maxParticipants?: number;
    showLeaderboard?: boolean;
    requireRegistration?: boolean;
    customDuration?: number;
  }): Promise<any> {
    try {
      // Create custom game template if needed
      let customGameId = gameData.customGameId;
      
      if (!customGameId) {
        const { data: customGame, error: customError } = await supabase
          .from('custom_games')
          .insert({
            game_data: {
              title: gameData.title,
              content: gameData.content,
              description: gameData.description
            },
            settings: gameData.settings || {}
          })
          .select()
          .single();

        if (customError) {
          console.error('Error creating custom game:', customError);
          throw customError;
        }
        customGameId = customGame.id;
      }

      // Create game instance
      const { data: instance, error: instanceError } = await supabase
        .from('custom_game_instances')
        .insert({
          custom_game_id: customGameId,
          title: gameData.title,
          html_content: gameData.content,
          description: gameData.description,
          is_published: true,
          creator_ip: gameData.creatorIp,
          account_id: gameData.accountId,
          password: gameData.password,
          max_participants: gameData.maxParticipants,
          show_leaderboard: gameData.showLeaderboard ?? true,
          require_registration: gameData.requireRegistration ?? false,
          custom_duration: gameData.customDuration
        })
        .select()
        .single();

      if (instanceError) {
        console.error('Error creating custom game instance:', instanceError);
        throw instanceError;
      }

      return {
        success: true,
        gameId: instance.id,
        data: instance
      };
    } catch (error) {
      console.error('Error saving custom game:', error);
      return {
        success: false,
        error: error
      };
    }
  },

  // Lấy custom game instance
  async getCustomGameInstance(gameId: string): Promise<any> {
    try {
      const { data, error } = await supabase
        .from('custom_game_instances')
        .select(`
          *,
          custom_games (
            game_data,
            settings
          )
        `)
        .eq('id', gameId)
        .eq('is_published', true)
        .single();

      if (error) {
        console.error('Error fetching custom game:', error);
        throw error;
      }

      return {
        success: true,
        data: data
      };
    } catch (error) {
      console.error('Error getting custom game:', error);
      return {
        success: false,
        error: error
      };
    }
  },

  // Lưu điểm số custom game
  async saveCustomGameScore(scoreData: CustomGameScore): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('custom_game_scores')
        .insert({
          game_instance_id: scoreData.gameInstanceId,
          player_name: scoreData.playerName,
          player_id: scoreData.playerId,
          score: scoreData.score,
          total_questions: scoreData.totalQuestions,
          completion_time: scoreData.completionTime,
          scoring_data: scoreData.scoringData || {},
          ip_address: scoreData.ipAddress || 'custom-game'
        });

      if (error) {
        console.error('Error saving custom game score:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error saving custom game score:', error);
      return false;
    }
  },

  // Thêm participant
  async addCustomGameParticipant(participantData: CustomGameParticipant): Promise<boolean> {
    try {
      // Update participant activity
      await supabase.rpc('update_custom_participant_activity', {
        target_game_id: participantData.gameInstanceId,
        target_player_name: participantData.playerName
      });

      return true;
    } catch (error) {
      console.error('Error adding custom game participant:', error);
      return false;
    }
  },

  // Lấy leaderboard
  async getCustomGameLeaderboard(gameInstanceId: string, limit: number = 10): Promise<any[]> {
    try {
      const { data, error } = await supabase.rpc('get_custom_game_leaderboard', {
        target_game_instance_id: gameInstanceId,
        limit_count: limit
      });

      if (error) {
        console.error('Error fetching custom game leaderboard:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Error fetching custom game leaderboard:', error);
      return [];
    }
  },

  // Lấy participants real-time
  async getCustomGameParticipants(gameInstanceId: string): Promise<any[]> {
    try {
      const { data, error } = await supabase.rpc('get_custom_game_participants_realtime', {
        target_game_instance_id: gameInstanceId
      });

      if (error) {
        console.error('Error fetching custom game participants:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Error fetching custom game participants:', error);
      return [];
    }
  },

  // Lấy stats cho admin
  async getCustomGameStats(gameInstanceId: string): Promise<any> {
    try {
      const { data, error } = await supabase.rpc('get_custom_game_stats_admin', {
        target_game_instance_id: gameInstanceId
      });

      if (error) {
        console.error('Error fetching custom game stats:', error);
        return null;
      }

      return data?.[0] || null;
    } catch (error) {
      console.error('Error fetching custom game stats:', error);
      return null;
    }
  },

  // Increment share count
  async incrementShareCount(gameInstanceId: string): Promise<void> {
    try {
      await supabase.rpc('increment_custom_game_share_count', {
        game_instance_id: gameInstanceId
      });
    } catch (error) {
      console.error('Error incrementing custom game share count:', error);
    }
  },

  // Lấy danh sách custom games cho admin
  async getCustomGamesList(accountId?: string, creatorIp?: string): Promise<any[]> {
    try {
      let query = supabase
        .from('custom_game_instances')
        .select(`
          *,
          custom_games (
            game_data,
            settings
          )
        `)
        .eq('is_published', true)
        .order('created_at', { ascending: false });

      // Filter by account or IP if provided
      if (accountId) {
        query = query.eq('account_id', accountId);
      } else if (creatorIp) {
        query = query.eq('creator_ip', creatorIp);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Error fetching custom games list:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Error fetching custom games list:', error);
      return [];
    }
  },

  // Xóa custom game instance
  async deleteCustomGameInstance(gameInstanceId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('custom_game_instances')
        .delete()
        .eq('id', gameInstanceId);

      if (error) {
        console.error('Error deleting custom game instance:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error deleting custom game instance:', error);
      return false;
    }
  }
};