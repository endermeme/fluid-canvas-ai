import { supabase } from '@/integrations/supabase/client';

export interface PresetShareSettings {
  password?: string;
  maxParticipants?: number;
  showLeaderboard: boolean;
  requireRegistration: boolean;
  customDuration?: number;
}

export interface PresetStoredGame {
  id: string;
  title: string;
  gameType: string;
  content: any;
  description?: string;
  expiresAt: Date | number;
  createdAt: Date | number;
  settings?: PresetShareSettings;
  creator_ip?: string;
  account_id?: string;
  data: any; // For GameViewSelector to detect preset game
}

export const savePresetGameForSharing = async (
  title: string,
  gameType: string,
  content: any,
  description?: string,
  accountId?: string,
  shareSettings?: PresetShareSettings
): Promise<string> => {
  try {
    console.log('💾 [PresetGameExport] Saving preset game:', { title, gameType, content });
    
    const gameId = crypto.randomUUID();
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);
    
    if (shareSettings?.customDuration) {
      expiresAt.setTime(Date.now() + shareSettings.customDuration * 60 * 60 * 1000);
    }

    const { data, error } = await supabase
      .from('preset_games')
      .insert([
        {
          id: gameId,
          title: title || 'Game tương tác',
          game_type: gameType,
          template_data: content,
          description: description || `Game chia sẻ: ${title}`,
          expires_at: expiresAt.toISOString(),
          creator_ip: 'localhost',
          account_id: accountId,
          password: shareSettings?.password || null,
          max_participants: shareSettings?.maxParticipants || null,
          show_leaderboard: shareSettings?.showLeaderboard ?? true,
          require_registration: shareSettings?.requireRegistration ?? false,
          custom_duration: shareSettings?.customDuration || null,
          is_published: true,
          is_active: true
        }
      ])
      .select()
      .single();

    if (error) {
      console.error("Error saving preset game:", error);
      throw new Error(`Cannot save preset game: ${error.message}`);
    }
    
    console.log("Preset game saved successfully:", data);

    // Return share URL
    const baseUrl = window.location.origin;
    const shareUrl = `${baseUrl}/preset/${gameId}`;
    
    console.log("Share URL generated:", shareUrl);
    return shareUrl;
    
  } catch (error) {
    console.error("Error in savePresetGameForSharing:", error);
    throw error;
  }
};

export const getPresetGame = async (id: string): Promise<PresetStoredGame | null> => {
  if (!id) {
    console.error("Missing game ID");
    return null;
  }

  try {
    console.log("💾 [PresetGameExport] Fetching preset game with ID:", id);
    
    const { data: presetGame } = await supabase
      .from('preset_games')
      .select('*')
      .eq('id', id)
      .eq('is_active', true)
      .single();

    if (presetGame) {
      console.log("Found preset game:", presetGame);
      return {
        id: presetGame.id,
        title: presetGame.title,
        gameType: presetGame.game_type,
        content: presetGame.template_data || {},
        description: presetGame.description || `Game chia sẻ: ${presetGame.title}`,
        expiresAt: new Date(presetGame.expires_at || Date.now() + 7 * 24 * 60 * 60 * 1000).getTime(),
        createdAt: new Date(presetGame.created_at).getTime(),
        settings: (presetGame.settings_data as any) || {},
        // Add data property for GameViewSelector to detect preset game
        data: presetGame.template_data || {}
      };
    }

    console.error("Preset game not found or expired with ID:", id);
    return null;
  } catch (error) {
    console.error("Error in getPresetGame:", error);
    return null;
  }
};