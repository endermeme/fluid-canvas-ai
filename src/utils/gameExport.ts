import { supabase } from '@/integrations/supabase/client';

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

export const formatHtmlContent = (content: string): string => {
  if (!content) return '';
  
  try {
    let formattedContent = content.replace(/```html|```/g, '').trim();
    
    formattedContent = formattedContent
      .replace(/(<[^\/!][^>]*>)(?!\s*[\r\n])/g, '$1\n')
      .replace(/(?<!\s*[\r\n])(<\/[^>]+>)/g, '\n$1')
      .replace(/(<(?:[^>]*\/>|!--.*?-->))(?!\s*[\r\n])/g, '$1\n')
      .replace(/(<!DOCTYPE[^>]*>)(?!\s*[\r\n])/gi, '$1\n')
      .replace(/(<(?:html|head|body|script|style)[^>]*>)/g, '\n$1\n')
      .replace(/(<\/(?:html|head|body|script|style)>)/g, '\n$1\n')
      .replace(/\n\s*\n\s*\n/g, '\n\n')
      .trim();
      
    return formattedContent;
  } catch (error) {
    console.error('Error formatting HTML content:', error);
    return content;
  }
};

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
    console.log('Saving game for sharing:', { title, gameType, content });
    
    const gameId = crypto.randomUUID();
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);
    
    // Detect if this is a preset game (has questions, cards, items structure)
    const isPresetGame = typeof content === 'object' && content !== null && 
                        (content.questions || content.cards || content.items || content.pairs);
    
    if (shareSettings?.customDuration) {
      expiresAt.setTime(Date.now() + shareSettings.customDuration * 60 * 60 * 1000);
    }

    if (isPresetGame) {
      // Save preset games to preset_games table
      console.log('Saving preset game to preset_games table');
      
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
    } else {
      // Save custom games to custom_games table
      console.log('Saving custom game to custom_games table');
      
      let processedHtmlContent = htmlContent;
      
      // Add game content to HTML for custom games
      if (typeof content === 'object' && content !== null && htmlContent) {
        try {
          const encodedContent = encodeURIComponent(JSON.stringify(content));
          if (!processedHtmlContent.includes('data-game-content')) {
            processedHtmlContent = processedHtmlContent.replace(
              /<body([^>]*)>/i,
              `<body$1 data-game-content="${encodedContent}">`
            );
          }
        } catch (encodeError) {
          console.error("Error encoding game content:", encodeError);
        }
      }
      
      // Ensure HTML structure for custom games
      if (htmlContent && !processedHtmlContent.includes('<!DOCTYPE html')) {
        processedHtmlContent = `<!DOCTYPE html>\n<html lang="vi">\n<head>\n<meta charset="UTF-8">\n<meta name="viewport" content="width=device-width, initial-scale=1.0">\n<title>${title}</title>\n</head>\n<body>\n${processedHtmlContent}\n</body>\n</html>`;
      }
      
      // Limit content size
      const maxContentLength = 500000; // ~500KB
      if (processedHtmlContent && processedHtmlContent.length > maxContentLength) {
        processedHtmlContent = processedHtmlContent.substring(0, maxContentLength);
        console.warn("Content truncated due to size limitations");
      }

      const { data, error } = await supabase
        .from('custom_games')
        .insert([
          {
            id: gameId,
            title: title || 'Game tương tác',
            game_data: {},
            description: description || `Game chia sẻ: ${title}`,
            html_content: processedHtmlContent,
            expires_at: expiresAt.toISOString(),
            creator_ip: 'localhost',
            account_id: accountId,
            password: shareSettings?.password || null,
            max_participants: shareSettings?.maxParticipants || null,
            show_leaderboard: shareSettings?.showLeaderboard ?? true,
            require_registration: shareSettings?.requireRegistration ?? false,
            custom_duration: shareSettings?.customDuration || null,
            is_published: true
          }
        ])
        .select()
        .single();

      if (error) {
        console.error("Error saving custom game:", error);
        throw new Error(`Cannot save custom game: ${error.message}`);
      }
      
      console.log("Custom game saved successfully:", data);
    }

    // Return share URL
    const baseUrl = window.location.origin;
    const shareUrl = `${baseUrl}/game/${gameId}`;
    
    console.log("Share URL generated:", shareUrl);
    return shareUrl;
    
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
    console.log("Fetching game with ID:", id);
    
    // Try preset_games first
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
        htmlContent: '',
        description: presetGame.description || `Game chia sẻ: ${presetGame.title}`,
        expiresAt: new Date(presetGame.expires_at || Date.now() + 7 * 24 * 60 * 60 * 1000).getTime(),
        createdAt: new Date(presetGame.created_at).getTime(),
        password: presetGame.password,
        maxParticipants: presetGame.max_participants,
        showLeaderboard: presetGame.show_leaderboard ?? true,
        requireRegistration: presetGame.require_registration ?? false,
        customDuration: presetGame.custom_duration,
        // Add data property for GameViewSelector to detect preset game
        data: presetGame.template_data || {}
      };
    }
    
    // Try custom_games if not found in preset_games
    const { data: customGame } = await supabase
      .from('custom_games')
      .select('*')
      .eq('id', id)
      .gt('expires_at', new Date().toISOString())
      .single();

    if (customGame) {
      console.log("Found custom game:", customGame);
      
      let parsedContent = null;
      if (customGame.html_content && customGame.html_content.includes('data-game-content')) {
        try {
          const contentMatch = customGame.html_content.match(/data-game-content="([^"]*)"/);
          if (contentMatch && contentMatch[1]) {
            parsedContent = JSON.parse(decodeURIComponent(contentMatch[1]));
          }
        } catch (e) {
          console.error('Error parsing game content from HTML:', e);
        }
      }

      return {
        id: customGame.id,
        title: customGame.title,
        gameType: 'custom',
        content: parsedContent || {},
        htmlContent: customGame.html_content || '',
        description: customGame.description || `Game chia sẻ: ${customGame.title}`,
        expiresAt: new Date(customGame.expires_at || Date.now() + 7 * 24 * 60 * 60 * 1000).getTime(),
        createdAt: new Date(customGame.created_at).getTime(),
        password: customGame.password,
        maxParticipants: customGame.max_participants,
        showLeaderboard: customGame.show_leaderboard ?? true,
        requireRegistration: customGame.require_registration ?? false,
        customDuration: customGame.custom_duration
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