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

// Overload cho cách gọi cũ
export function saveGameForSharing(
  title: string,
  gameType: string | null | undefined,
  content: any,
  htmlContent: string,
  description?: string
): Promise<string>;

// Overload cho cách gọi với StoredGame
export function saveGameForSharing(
  gameData: StoredGame
): Promise<string>;

// Triển khai hàm
export async function saveGameForSharing(
  titleOrData: string | StoredGame,
  gameType?: string | null | undefined,
  content?: any,
  htmlContent?: string,
  description?: string
): Promise<string> {
  let title: string;
  let finalGameType: string;
  let finalContent: any;
  let finalHtmlContent: string;
  let finalDescription: string | undefined;
  let gameId: string;
  
  // Xác định xem đang sử dụng overload nào
  if (typeof titleOrData === 'object') {
    // Trường hợp gọi với StoredGame
    const gameData = titleOrData;
    console.log("saveGameForSharing called with StoredGame:", {
      title: gameData.title,
      gameType: gameData.gameType,
      hasContent: !!gameData.content,
      hasHtmlContent: !!gameData.htmlContent
    });
    
    title = gameData.title;
    finalGameType = gameData.gameType || 'custom'; // Đảm bảo không null
    finalContent = gameData.content;
    finalHtmlContent = gameData.htmlContent;
    finalDescription = gameData.description;
    gameId = gameData.id || crypto.randomUUID();
  } else {
    // Trường hợp gọi với các tham số riêng lẻ
    console.log("saveGameForSharing called with params:", {
      title: titleOrData,
      gameType,
      hasContent: !!content,
      hasHtmlContent: !!htmlContent
    });
    
    title = titleOrData;
    finalGameType = gameType || 'custom'; // Đảm bảo không null
    finalContent = content;
    finalHtmlContent = htmlContent || '';
    finalDescription = description;
    gameId = crypto.randomUUID();
  }
  
  console.log("Final values before saving:", {
    title,
    finalGameType,
    hasContent: !!finalContent,
    finalHtmlContentLength: finalHtmlContent?.length || 0
  });
  
  try {
    // Tính thời gian hết hạn (3 ngày từ hiện tại)
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 3);
    
    // Nhúng dữ liệu game vào HTML content
    let processedHtmlContent = finalHtmlContent;
    
    // Nếu content là object, encode nó và nhúng vào HTML
    if (typeof finalContent === 'object' && finalContent !== null) {
      try {
        const encodedContent = encodeURIComponent(JSON.stringify(finalContent));
        
        // Thêm data attribute vào thẻ body
        if (!processedHtmlContent.includes('data-game-content')) {
          processedHtmlContent = processedHtmlContent.replace(
            /<body([^>]*)>/i,
            `<body$1 data-game-content="${encodedContent}">`
          );
        }
      } catch (encodeError) {
        console.error("Error encoding game content:", encodeError);
        // Tiếp tục với HTML gốc nếu không thể encode
      }
    }
    
    // Giới hạn kích thước nội dung HTML để tránh lỗi
    const maxContentLength = 1000000; // ~ 1MB
    if (processedHtmlContent && processedHtmlContent.length > maxContentLength) {
      processedHtmlContent = processedHtmlContent.substring(0, maxContentLength);
      console.warn("HTML content truncated due to size limitations");
    }
    
    // Lưu game vào database với xử lý lỗi tốt hơn
    try {
      console.log("Saving game with type:", finalGameType);
      
      const { data, error } = await supabase
        .from('games')
        .insert([
          {
            id: gameId,
            title,
            game_type: finalGameType,
            description: finalDescription || `Shared game: ${title}`,
            html_content: processedHtmlContent,
            expires_at: expiresAt.toISOString(),
          }
        ])
        .select()
        .single();

      if (error) {
        console.error("Database error when saving game:", error);
        throw new Error(`Không thể lưu game: ${error.message}`);
      }

      if (!data) {
        throw new Error("Không nhận được dữ liệu từ database sau khi lưu");
      }

      // Trả về URL cho game đã được chia sẻ
      const baseUrl = window.location.origin;
      return `${baseUrl}/game/${gameId}`;
    } catch (dbError) {
      console.error("Database operation failed:", dbError);
      throw new Error("Lỗi khi lưu game vào database");
    }
  } catch (error) {
    console.error("Error in saveGameForSharing:", error);
    throw error;
  }
}

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
      .single();

    if (error) {
      console.error("Error fetching game:", error);
      return null;
    }

    if (!game) {
      console.error("Game not found with ID:", id);
      return null;
    }

    console.log("Game data retrieved:", game);

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
  
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  
  return `${hours}h ${minutes}m`;
};
