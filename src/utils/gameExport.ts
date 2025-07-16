
import { supabase } from '@/integrations/supabase/client';

export interface StoredGame {
  id: string;
  title: string;
  gameType: string;
  content: any;
  htmlContent: string;
  description?: string;
  expiresAt: Date | number;
  createdAt: Date | number;
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
  description?: string
): Promise<string> => {
  try {
    console.log('Saving game for sharing:', { title, gameType });
    
    // Tạo một ID mới cho game
    const gameId = crypto.randomUUID();
    
    // Tính thời gian hết hạn (7 ngày từ hiện tại)
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);
    
    // Xử lý HTML content cho template games
    let processedHtmlContent = htmlContent;
    
    // Kiểm tra xem có phải là template game không
    if (typeof content === 'object' && content !== null) {
      try {
        // Nếu content có cấu trúc template (questions, settings, etc.)
        if (content.questions || content.cards || content.items) {
          // Nhúng dữ liệu vào HTML content nếu chưa có
          if (!processedHtmlContent.includes('data-game-content')) {
            const encodedContent = encodeURIComponent(JSON.stringify(content));
            processedHtmlContent = processedHtmlContent.replace(
              /<body([^>]*)>/i,
              `<body$1 data-game-content="${encodedContent}">`
            );
          }
        } else {
          // Nếu là custom game, encode toàn bộ content
          const encodedContent = encodeURIComponent(JSON.stringify(content));
          if (!processedHtmlContent.includes('data-game-content')) {
            processedHtmlContent = processedHtmlContent.replace(
              /<body([^>]*)>/i,
              `<body$1 data-game-content="${encodedContent}">`
            );
          }
        }
      } catch (encodeError) {
        console.error("Error encoding game content:", encodeError);
      }
    }
    
    // Đảm bảo HTML content có cấu trúc đầy đủ
    if (!processedHtmlContent.includes('<!DOCTYPE html')) {
      processedHtmlContent = `<!DOCTYPE html>\n<html lang="vi">\n<head>\n<meta charset="UTF-8">\n<meta name="viewport" content="width=device-width, initial-scale=1.0">\n<title>${title}</title>\n</head>\n<body>\n${processedHtmlContent}\n</body>\n</html>`;
    }
    
    // Giới hạn kích thước nội dung HTML
    const maxContentLength = 500000; // ~500KB
    if (processedHtmlContent && processedHtmlContent.length > maxContentLength) {
      processedHtmlContent = processedHtmlContent.substring(0, maxContentLength);
      console.warn("HTML content truncated due to size limitations");
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
          creator_ip: 'localhost'
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
    if (game.html_content && game.html_content.includes('data-game-content')) {
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
      createdAt: new Date(game.created_at).getTime()
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
