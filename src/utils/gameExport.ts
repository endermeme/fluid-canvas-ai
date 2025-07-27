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
  content: any;
  htmlContent: string;
  description?: string;
  expiresAt: Date | number;
  createdAt: Date | number;
  password?: string;
  maxParticipants?: number;
  showLeaderboard: boolean;
  requireRegistration: boolean;
  customDuration?: number;
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
    console.log('Saving game for sharing:', { title, gameType });
    
    // Tạo một ID mới cho game
    const gameId = crypto.randomUUID();
    
    // Tính thời gian hết hạn (7 ngày từ hiện tại)
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);
    
    // Lưu JSON data cho preset games để render bằng React components
    let processedHtmlContent = htmlContent;
    
    // Detect if this is a preset game
    const isPresetGame = typeof content === 'object' && content !== null && 
                        (content.questions || content.cards || content.items);
    
    // Nếu là preset game (có cấu trúc template), lưu vào preset_games table
    if (isPresetGame) {
      // Cập nhật expires_at nếu có custom duration
      if (shareSettings?.customDuration) {
        expiresAt.setTime(Date.now() + shareSettings.customDuration * 60 * 60 * 1000);
      }

      // Save to preset_games table for preset games
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
        console.error("Lỗi khi lưu preset game:", error);
        throw new Error(`Không thể lưu preset game: ${error.message}`);
      }
      
      if (!data) {
        throw new Error("Không nhận được dữ liệu từ database sau khi lưu preset game");
      }

      console.log("Preset game đã được lưu thành công:", data);
    } else {
      // Custom games: lưu HTML + embed JSON vào custom_games table
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
      
      // Đảm bảo HTML content có cấu trúc đầy đủ cho custom games
      if (htmlContent && !processedHtmlContent.includes('<!DOCTYPE html')) {
        processedHtmlContent = `<!DOCTYPE html>\n<html lang="vi">\n<head>\n<meta charset="UTF-8">\n<meta name="viewport" content="width=device-width, initial-scale=1.0">\n<title>${title}</title>\n</head>\n<body>\n${processedHtmlContent}\n</body>\n</html>`;
      }
      
      // Giới hạn kích thước nội dung HTML
      const maxContentLength = 500000; // ~500KB
      if (processedHtmlContent && processedHtmlContent.length > maxContentLength) {
        processedHtmlContent = processedHtmlContent.substring(0, maxContentLength);
        console.warn("Content truncated due to size limitations");
      }
      
      // Cập nhật expires_at nếu có custom duration
      if (shareSettings?.customDuration) {
        expiresAt.setTime(Date.now() + shareSettings.customDuration * 60 * 60 * 1000);
      }

      // Save to custom_games table for custom games
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
        console.error("Lỗi khi lưu custom game:", error);
        throw new Error(`Không thể lưu custom game: ${error.message}`);
      }
      
      if (!data) {
        throw new Error("Không nhận được dữ liệu từ database sau khi lưu custom game");
      }

      console.log("Custom game đã được lưu thành công:", data);
    }


    // Trả về URL cho game đã được chia sẻ
    const baseUrl = window.location.origin;
    const shareUrl = `${baseUrl}/game/${gameId}`;
    
    console.log("Share URL generated:", shareUrl);
    return shareUrl;
    
  } catch (error) {
    console.error("Lỗi trong saveGameForSharing:", error);
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
    
    // Try custom_games first
    const { data: customGame } = await supabase
      .from('custom_games')
      .select('*')
      .eq('id', id)
      .gt('expires_at', new Date().toISOString())
      .single();

    // Then try preset_games if not found in custom_games
    const { data: presetGame } = customGame ? { data: null } : await supabase
      .from('preset_games')
      .select('*')
      .eq('id', id)
      .single();

    const game = customGame || presetGame;

    if (!game) {
      console.error("Game not found or expired with ID:", id);
      return null;
    }

    console.log("Game data retrieved:", game);

    let parsedContent = null;
    
    // Handle different schemas for custom_games and preset_games
    if (customGame) {
      // Custom game schema
      if (customGame.html_content && customGame.html_content.startsWith('{')) {
        try {
          const gameData = JSON.parse(customGame.html_content);
          if (gameData.type === 'preset-game') {
            parsedContent = gameData.data;
          }
        } catch (e) {
          console.error('Error parsing preset game JSON:', e);
        }
      } 
      else if (customGame.html_content && customGame.html_content.includes('data-game-content')) {
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
    } else if (presetGame) {
      // Preset game schema
      return {
        id: presetGame.id,
        title: presetGame.title,
        gameType: presetGame.game_type,
        content: presetGame.template_data || {},
        htmlContent: '',
        description: presetGame.description || `Game chia sẻ: ${presetGame.title}`,
        expiresAt: Date.now() + 7 * 24 * 60 * 60 * 1000, // No expires_at in preset_games
        createdAt: new Date(presetGame.created_at).getTime(),
        password: null,
        maxParticipants: null,
        showLeaderboard: true,
        requireRegistration: false,
        customDuration: null
      };
    }

    return null;
  } catch (error) {
    console.error("Unhandled error in getSharedGame:", error);
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