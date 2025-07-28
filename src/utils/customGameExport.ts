import { supabase } from '@/integrations/supabase/client';

export interface CustomShareSettings {
  password?: string;
  maxParticipants?: number;
  showLeaderboard: boolean;
  requireRegistration: boolean;
  customDuration?: number;
}

export interface CustomStoredGame {
  id: string;
  title: string;
  gameType: string; // Add missing gameType property
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
  creator_ip?: string;
  account_id?: string;
  data?: any; // Add missing data property for compatibility
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

export const saveCustomGameForSharing = async (
  title: string,
  content: any,
  htmlContent: string,
  description?: string,
  accountId?: string,
  shareSettings?: CustomShareSettings
): Promise<string> => {
  try {
    console.log('💾 [CustomGameExport] Saving custom game:', { title, content });
    
    const gameId = crypto.randomUUID();
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);
    
    if (shareSettings?.customDuration) {
      expiresAt.setTime(Date.now() + shareSettings.customDuration * 60 * 60 * 1000);
    }

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

    // Return share URL
    const baseUrl = window.location.origin;
    const shareUrl = `${baseUrl}/game/${gameId}`;
    
    console.log("Share URL generated:", shareUrl);
    return shareUrl;
    
  } catch (error) {
    console.error("Error in saveCustomGameForSharing:", error);
    throw error;
  }
};

export const getCustomGame = async (id: string): Promise<CustomStoredGame | null> => {
  if (!id) {
    console.error("Missing game ID");
    return null;
  }

  try {
    console.log("💾 [CustomGameExport] Fetching custom game with ID:", id);
    
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
        gameType: 'custom', // Default type for custom games
        content: parsedContent || {},
        htmlContent: customGame.html_content || '',
        description: customGame.description || `Game chia sẻ: ${customGame.title}`,
        expiresAt: new Date(customGame.expires_at || Date.now() + 7 * 24 * 60 * 60 * 1000).getTime(),
        createdAt: new Date(customGame.created_at).getTime(),
        settings: customGame.settings_data as CustomShareSettings || {},
        data: parsedContent || {} // Add data property for compatibility
      };
    }

    console.error("Custom game not found or expired with ID:", id);
    return null;
  } catch (error) {
    console.error("Error in getCustomGame:", error);
    return null;
  }
};