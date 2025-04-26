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
    // Tạo một ID mới cho game
    const gameId = crypto.randomUUID();
    
    // Tính thời gian hết hạn (3 ngày từ hiện tại)
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 3);
    
    // Nhúng dữ liệu game vào HTML content
    let processedHtmlContent = htmlContent;
    
    // Nếu content là object, encode nó và nhúng vào HTML
    if (typeof content === 'object' && content !== null) {
      const encodedContent = encodeURIComponent(JSON.stringify(content));
      
      // Thêm data attribute vào thẻ body
      if (!processedHtmlContent.includes('data-game-content')) {
        processedHtmlContent = processedHtmlContent.replace(
          /<body([^>]*)>/i,
          `<body$1 data-game-content="${encodedContent}">`
        );
      }
    }
    
    // Lưu game vào database
    const { data, error } = await supabase
      .from('games')
      .insert([
        {
          id: gameId,
          title,
          game_type: gameType,
          description: description || `Shared game: ${title}`,
          html_content: processedHtmlContent,
          expires_at: expiresAt.toISOString(),
        }
      ])
      .select()
      .single();

    if (error) {
      console.error("Error saving game:", error);
      throw new Error("Không thể lưu game");
    }

    // Trả về URL cho game đã được chia sẻ
    const baseUrl = window.location.origin;
    return `${baseUrl}/game/${gameId}`;
  } catch (error) {
    console.error("Error in saveGameForSharing:", error);
    throw error;
  }
};

export const getSharedGame = async (id: string): Promise<StoredGame | null> => {
  const { data: game, error } = await supabase
    .from('games')
    .select('*')
    .eq('id', id)
    .single();

  if (error || !game) return null;

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
    description: game.description || `Shared game: ${game.title}`,
    expiresAt: new Date(game.expires_at).getTime(),
    createdAt: new Date(game.created_at).getTime()
  };
};

export const getRemainingTime = (expiresAt: Date | number): string => {
  const now = new Date();
  const expTimestamp = typeof expiresAt === 'number' ? expiresAt : expiresAt.getTime();
  const diff = expTimestamp - now.getTime();
  
  if (diff <= 0) return 'Đã hết hạn';
  
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  
  return `${hours}h ${minutes}m`;
};
