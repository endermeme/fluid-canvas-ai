
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
    
    // Nếu là preset game (có cấu trúc template), lưu JSON data thay vì HTML
    if (typeof content === 'object' && content !== null) {
      if (content.questions || content.cards || content.items) {
        // Preset games: chỉ lưu JSON data, không cần HTML
        processedHtmlContent = JSON.stringify({
          type: 'preset-game',
          gameType: gameType,
          data: content
        });
      } else if (htmlContent) {
        // Custom games: vẫn lưu HTML + embed JSON
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
    }
    
    // Đảm bảo HTML content có cấu trúc đầy đủ cho custom games
    if (htmlContent && !processedHtmlContent.includes('<!DOCTYPE html') && !processedHtmlContent.startsWith('{')) {
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

    // Lưu game vào database
    const { data, error } = await supabase
      .from('games')
      .insert([
        {
          id: gameId,
          title: title || 'Game tương tác',
          game_type: gameType || 'custom',
          description: description || `Game chia sẻ: ${title}`,
          html_content: processedHtmlContent,
          expires_at: expiresAt.toISOString(),
          is_published: true,
          creator_ip: 'localhost',
          account_id: accountId,
          password: shareSettings?.password || null,
          max_participants: shareSettings?.maxParticipants || null,
          show_leaderboard: shareSettings?.showLeaderboard ?? true,
          require_registration: shareSettings?.requireRegistration ?? false,
          custom_duration: shareSettings?.customDuration || null
        }
      ])
      .select()
      .single();

    if (error) {
      console.error("Lỗi khi lưu game:", error);
      throw new Error(`Không thể lưu game: ${error.message}`);
    }

    if (!data) {
      throw new Error("Không nhận được dữ liệu từ database sau khi lưu");
    }

    console.log("Game đã được lưu thành công:", data);

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
    
    const { data: game, error } = await supabase
      .from('games')
      .select('*')
      .eq('id', id)
      .eq('is_published', true)
      .gt('expires_at', new Date().toISOString())
      .single();

    if (error) {
      console.error("Error fetching game:", error);
      return null;
    }

    if (!game) {
      console.error("Game not found or expired with ID:", id);
      return null;
    }

    console.log("Game data retrieved:", game);

    // Tăng share count
    await supabase.rpc('increment_share_count', { game_id: id });

    let parsedContent = null;
    
    // Xử lý preset games với JSON data
    if (game.html_content && game.html_content.startsWith('{')) {
      try {
        const gameData = JSON.parse(game.html_content);
        if (gameData.type === 'preset-game') {
          parsedContent = gameData.data;
        }
      } catch (e) {
        console.error('Error parsing preset game JSON:', e);
      }
    } 
    // Xử lý custom games với HTML + embedded data
    else if (game.html_content && game.html_content.includes('data-game-content')) {
      try {
        const contentMatch = game.html_content.match(/data-game-content="([^"]*)"/);
        if (contentMatch && contentMatch[1]) {
          parsedContent = JSON.parse(decodeURIComponent(contentMatch[1]));
        }
      } catch (e) {
        console.error('Error parsing game content from HTML:', e);
      }
    }

    return {
      id: game.id,
      title: game.title,
      gameType: game.game_type,
      content: parsedContent || {},
      htmlContent: game.html_content,
      description: game.description || `Game chia sẻ: ${game.title}`,
      expiresAt: new Date(game.expires_at).getTime(),
      createdAt: new Date(game.created_at).getTime(),
      password: game.password,
      maxParticipants: game.max_participants,
      showLeaderboard: game.show_leaderboard,
      requireRegistration: game.require_registration,
      customDuration: game.custom_duration
    };
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
