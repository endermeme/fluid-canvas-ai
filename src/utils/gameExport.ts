
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

/**
 * Formats HTML content for better readability before saving
 * @param content Raw HTML content
 * @returns Formatted HTML content with proper indentation and line breaks
 */
const formatHtmlContent = (content: string): string => {
  if (!content) return '';
  
  try {
    // Remove existing code markers if any
    let formattedContent = content.replace(/```html|```/g, '').trim();
    
    // Basic formatting for HTML structure
    formattedContent = formattedContent
      // Add line breaks after opening tags
      .replace(/(<[^\/!][^>]*>)(?!\s*[\r\n])/g, '$1\n')
      // Add line breaks before closing tags
      .replace(/(?<!\s*[\r\n])(<\/[^>]+>)/g, '\n$1')
      // Add line breaks after self-closing tags and comments
      .replace(/(<(?:[^>]*\/>|!--.*?-->))(?!\s*[\r\n])/g, '$1\n')
      // Ensure DOCTYPE has its own line
      .replace(/(<!DOCTYPE[^>]*>)(?!\s*[\r\n])/gi, '$1\n')
      // Add double line breaks before key structural elements
      .replace(/(<(?:html|head|body|script|style)[^>]*>)/g, '\n$1\n')
      // Add double line breaks after key structural closing elements
      .replace(/(<\/(?:html|head|body|script|style)>)/g, '\n$1\n')
      // Clean up excessive empty lines
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
  console.log("Đang lưu game để chia sẻ:", { title, gameType });
  
  try {
    // Mã hóa nội dung game để có thể khôi phục sau này
    const encodedContent = encodeURIComponent(JSON.stringify(content));
    const enhancedHtml = `<div data-game-type="${gameType}" data-game-content="${encodedContent}">${htmlContent}</div>`;
    
    // Format the HTML content for better readability
    const formattedHtmlContent = formatHtmlContent(enhancedHtml);
    
    const { data: game, error } = await supabase
      .from('games')
      .insert({
        title,
        game_type: gameType,
        html_content: formattedHtmlContent,
        content_type: 'html',
        is_published: true,
        description: description || `Shared game: ${title}`
      })
      .select()
      .single();
  
    if (error) {
      console.error("Lỗi khi lưu game vào Supabase:", error);
      throw error;
    }
    
    console.log("Game đã được lưu thành công với ID:", game.id);
    
    // Create a slug from the title
    const slug = title.toLowerCase().replace(/[^\w\s]/gi, '').replace(/\s+/g, '-');
    
    // Return the full URL with game type and slug in the path
    const baseUrl = window.location.origin;
    return `${baseUrl}/play/${gameType}/${slug}/${game.id}`;
  } catch (error) {
    console.error("Lỗi trong quá trình lưu game:", error);
    throw error;
  }
};

export const getSharedGame = async (id: string): Promise<StoredGame | null> => {
  console.log("Đang lấy game với ID:", id);
  
  try {
    // Extract the actual UUID from the path if it contains type/slug format
    let gameId = id;
    if (id.includes('/')) {
      // Get the last segment which should be the UUID
      const segments = id.split('/');
      gameId = segments[segments.length - 1];
    }
  
    console.log("Đang truy vấn Supabase với ID:", gameId);
    
    const { data: game, error } = await supabase
      .from('games')
      .select('*')
      .eq('id', gameId)
      .single();
  
    if (error) {
      console.error("Lỗi khi lấy game từ Supabase:", error);
      return null;
    }
    
    if (!game) {
      console.error("Game không tồn tại trong Supabase");
      return null;
    }
    
    console.log("Đã tìm thấy game:", game);
  
    // Try to parse the HTML content to extract game data if possible
    let parsedContent = null;
    if (game.html_content && game.html_content.includes('data-game-content')) {
      try {
        // Extract the content from a data attribute if it exists in the HTML
        const contentMatch = game.html_content.match(/data-game-content="([^"]*)"/);
        if (contentMatch && contentMatch[1]) {
          parsedContent = JSON.parse(decodeURIComponent(contentMatch[1]));
          console.log("Đã giải mã dữ liệu game:", parsedContent);
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
  } catch (error) {
    console.error("Lỗi trong quá trình lấy game:", error);
    return null;
  }
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
