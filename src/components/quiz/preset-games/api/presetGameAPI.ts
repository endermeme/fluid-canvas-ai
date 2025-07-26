import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

// Types cho Preset Games
export interface PresetGameData {
  title: string;
  gameType: string;
  content: any;
  description?: string;
  settings?: any;
}

export interface PresetGameInstance {
  id: string;
  title: string;
  gameType: string;
  gameData: any;
  settings: any;
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

export interface PresetGameScore {
  gameInstanceId: string;
  playerName: string;
  playerId?: string;
  score: number;
  totalQuestions: number;
  completionTime?: number;
  scoringData?: any;
  ipAddress?: string;
}

export interface PresetGameParticipant {
  gameInstanceId: string;
  playerName: string;
  ipAddress?: string;
  sessionData?: any;
}

// API Functions cho Preset Games
export const presetGameAPI = {
  // Lưu preset game instance
  async savePresetGameInstance(gameData: PresetGameData & {
    presetGameId?: string;
    creatorIp?: string;
    accountId?: string;
    password?: string;
    maxParticipants?: number;
    showLeaderboard?: boolean;
    requireRegistration?: boolean;
    customDuration?: number;
  }): Promise<any> {
    try {
      // Create preset game template if needed
      let presetGameId = gameData.presetGameId;
      
      if (!presetGameId) {
        const { data: presetGame, error: presetError } = await supabase
          .from('preset_games')
          .insert({
            title: gameData.title,
            game_type: gameData.gameType,
            template_data: gameData.content,
            default_settings: gameData.settings || {},
            description: gameData.description
          })
          .select()
          .single();

        if (presetError) {
          console.error('Error creating preset game:', presetError);
          throw presetError;
        }
        presetGameId = presetGame.id;
      }

      // Create game instance
      const { data: instance, error: instanceError } = await supabase
        .from('preset_game_instances')
        .insert({
          preset_game_id: presetGameId,
          title: gameData.title,
          game_data: gameData.content,
          settings: gameData.settings || {},
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
        console.error('Error creating preset game instance:', instanceError);
        throw instanceError;
      }

      return {
        success: true,
        gameId: instance.id,
        data: instance
      };
    } catch (error) {
      console.error('Error saving preset game:', error);
      return {
        success: false,
        error: error
      };
    }
  },

  // Lấy preset game instance
  async getPresetGameInstance(gameId: string): Promise<any> {
    try {
      const { data, error } = await supabase
        .from('preset_game_instances')
        .select(`
          *,
          preset_games (
            title,
            game_type,
            template_data,
            default_settings
          )
        `)
        .eq('id', gameId)
        .eq('is_published', true)
        .single();

      if (error) {
        console.error('Error fetching preset game:', error);
        throw error;
      }

      return {
        success: true,
        data: data
      };
    } catch (error) {
      console.error('Error getting preset game:', error);
      return {
        success: false,
        error: error
      };
    }
  },

  // Lưu điểm số preset game
  async savePresetGameScore(scoreData: PresetGameScore): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('preset_game_scores')
        .insert({
          game_instance_id: scoreData.gameInstanceId,
          player_name: scoreData.playerName,
          player_id: scoreData.playerId,
          score: scoreData.score,
          total_questions: scoreData.totalQuestions,
          completion_time: scoreData.completionTime,
          scoring_data: scoreData.scoringData || {},
          ip_address: scoreData.ipAddress || 'preset-game'
        });

      if (error) {
        console.error('Error saving preset game score:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error saving preset game score:', error);
      return false;
    }
  },

  // Thêm participant
  async addPresetGameParticipant(participantData: PresetGameParticipant): Promise<boolean> {
    try {
      // Update participant activity
      await supabase.rpc('update_preset_participant_activity', {
        target_game_instance_id: participantData.gameInstanceId,
        target_player_name: participantData.playerName
      });

      return true;
    } catch (error) {
      console.error('Error adding preset game participant:', error);
      return false;
    }
  },

  // Lấy leaderboard
  async getPresetGameLeaderboard(gameInstanceId: string, limit: number = 10): Promise<any[]> {
    try {
      const { data, error } = await supabase.rpc('get_preset_game_leaderboard', {
        target_game_instance_id: gameInstanceId,
        limit_count: limit
      });

      if (error) {
        console.error('Error fetching preset game leaderboard:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Error fetching preset game leaderboard:', error);
      return [];
    }
  },

  // Lấy participants real-time
  async getPresetGameParticipants(gameInstanceId: string): Promise<any[]> {
    try {
      const { data, error } = await supabase.rpc('get_preset_game_participants_realtime', {
        target_game_instance_id: gameInstanceId
      });

      if (error) {
        console.error('Error fetching preset game participants:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Error fetching preset game participants:', error);
      return [];
    }
  },

  // Lấy stats cho admin
  async getPresetGameStats(gameInstanceId: string): Promise<any> {
    try {
      const { data, error } = await supabase.rpc('get_preset_game_stats_admin', {
        target_game_instance_id: gameInstanceId
      });

      if (error) {
        console.error('Error fetching preset game stats:', error);
        return null;
      }

      return data?.[0] || null;
    } catch (error) {
      console.error('Error fetching preset game stats:', error);
      return null;
    }
  },

  // Increment share count
  async incrementShareCount(gameInstanceId: string): Promise<void> {
    try {
      await supabase.rpc('increment_preset_game_share_count', {
        game_instance_id: gameInstanceId
      });
    } catch (error) {
      console.error('Error incrementing preset game share count:', error);
    }
  },

  // Lấy danh sách preset games cho admin
  async getPresetGamesList(accountId?: string, creatorIp?: string): Promise<any[]> {
    try {
      let query = supabase
        .from('preset_game_instances')
        .select(`
          *,
          preset_games (
            title,
            game_type
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
        console.error('Error fetching preset games list:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Error fetching preset games list:', error);
      return [];
    }
  },

  // Xóa preset game instance
  async deletePresetGameInstance(gameInstanceId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('preset_game_instances')
        .delete()
        .eq('id', gameInstanceId);

      if (error) {
        console.error('Error deleting preset game instance:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error deleting preset game instance:', error);
      return false;
    }
  }
};