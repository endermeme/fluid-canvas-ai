import { saveCustomGameForSharing, getCustomGame } from './customGameExport';
import { savePresetGameForSharing, getPresetGame } from './presetGameExport';

export interface ShareSettings {
  password?: string;
  maxParticipants?: number;
  showLeaderboard: boolean;
  requireRegistration: boolean;
  customDuration?: number;
}

export interface StoredGame {
  id: string;
  title: string;
  gameType: string;
  content?: any;
  htmlContent: string;
  description?: string;
  expiresAt: Date | number;
  createdAt: Date | number;
  password?: string;
  maxParticipants?: number;
  showLeaderboard?: boolean;
  requireRegistration?: boolean;
  customDuration?: number;
  singleParticipationOnly?: boolean;
  creator_ip?: string;
  account_id?: string;
  data?: any; // Add data property for preset games
}

export const saveGameForSharing = async (
  title: string,
  gameType: string,
  content: any,
  htmlContent: string,
  description?: string,
  accountId?: string,
  shareSettings?: ShareSettings
): Promise<string> => {
  try {
    console.log('💾 [GameExport] Routing game save:', { title, gameType, content });
    
    // Detect if this is a preset game (has questions, cards, items structure)
    const isPresetGame = typeof content === 'object' && content !== null && 
                        (content.questions || content.cards || content.items || content.pairs);
    
    if (isPresetGame) {
      console.log('💾 [GameExport] Routing to preset game export');
      return await savePresetGameForSharing(title, gameType, content, description, accountId, shareSettings);
    } else {
      console.log('💾 [GameExport] Routing to custom game export');
      return await saveCustomGameForSharing(title, content, htmlContent, description, accountId, shareSettings);
    }
    
  } catch (error) {
    console.error("Error in saveGameForSharing:", error);
    throw error;
  }
};

export const getSharedGame = async (id: string): Promise<StoredGame | null> => {
  if (!id) {
    console.error("Missing game ID");
    return null;
  }

  try {
    console.log("💾 [GameExport] Fetching game with ID:", id);
    
    // Try preset games first
    const presetGame = await getPresetGame(id);
    if (presetGame) {
      console.log("💾 [GameExport] Found preset game");
      return {
        id: presetGame.id,
        title: presetGame.title,
        gameType: presetGame.gameType,
        content: presetGame.content,
        htmlContent: '',
        description: presetGame.description,
        expiresAt: presetGame.expiresAt,
        createdAt: presetGame.createdAt,
        password: presetGame.password,
        maxParticipants: presetGame.maxParticipants,
        showLeaderboard: presetGame.showLeaderboard,
        requireRegistration: presetGame.requireRegistration,
        customDuration: presetGame.customDuration,
        data: presetGame.data
      };
    }
    
    // Try custom games if not found in preset games
    const customGame = await getCustomGame(id);
    if (customGame) {
      console.log("💾 [GameExport] Found custom game");
      return {
        id: customGame.id,
        title: customGame.title,
        gameType: 'custom',
        content: customGame.content,
        htmlContent: customGame.htmlContent,
        description: customGame.description,
        expiresAt: customGame.expiresAt,
        createdAt: customGame.createdAt,
        password: customGame.password,
        maxParticipants: customGame.maxParticipants,
        showLeaderboard: customGame.showLeaderboard,
        requireRegistration: customGame.requireRegistration,
        customDuration: customGame.customDuration
      };
    }

    console.error("Game not found or expired with ID:", id);
    return null;
  } catch (error) {
    console.error("Error in getSharedGame:", error);
    return null;
  }
};

export const getRemainingTime = (expiresAt: Date | number): string => {
  const now = new Date();
  const expTimestamp = typeof expiresAt === 'number' ? expiresAt : expiresAt.getTime();
  const diff = expTimestamp - now.getTime();
  
  if (diff <= 0) return 'Đã hết hạn';
  
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  
  if (days > 0) return `${days} ngày ${hours}h`;
  if (hours > 0) return `${hours}h ${minutes}m`;
  return `${minutes}m`;
};