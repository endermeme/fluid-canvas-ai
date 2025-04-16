
import { supabase } from '@/integrations/supabase/client';

export interface StoredGame {
  id: string;
  title: string;
  gameType: string;
  content: any;
  htmlContent: string;
  description?: string; // Changed to optional to match types.ts
  expiresAt: Date | number;
  createdAt: Date | number;
}

export const saveGameForSharing = async (
  title: string, 
  gameType: string,
  content: any,
  htmlContent: string,
  description?: string
): Promise<string> => {
  // Format the HTML content to maintain structure and readability
  const formattedHtml = formatHtmlContent(htmlContent);

  const { data: game, error } = await supabase
    .from('games')
    .insert({
      title,
      game_type: gameType,
      html_content: formattedHtml,
      content_type: 'html',
      is_published: true,
      description: description || `Shared game: ${title}`
    })
    .select()
    .single();

  if (error) throw error;
  
  // Create a slug from the title
  const slug = title.toLowerCase().replace(/[^\w\s]/gi, '').replace(/\s+/g, '-');
  
  // Return the full URL with game type and slug in the path
  const baseUrl = window.location.origin;
  return `${baseUrl}/play/${gameType}/${slug}/${game.id}`;
};

export const getSharedGame = async (id: string): Promise<StoredGame | null> => {
  // Extract the actual UUID from the path if it contains type/slug format
  let gameId = id;
  if (id.includes('/')) {
    // Get the last segment which should be the UUID
    const segments = id.split('/');
    gameId = segments[segments.length - 1];
  }

  const { data: game, error } = await supabase
    .from('games')
    .select('*')
    .eq('id', gameId)
    .single();

  if (error || !game) return null;

  // Try to parse the HTML content to extract game data if possible
  let parsedContent = null;
  if (game.html_content && game.html_content.includes('data-game-content')) {
    try {
      // Extract the content from a data attribute if it exists in the HTML
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

// New helper function to format HTML content with proper indentation and line breaks
const formatHtmlContent = (html: string): string => {
  if (!html) return html;
  
  try {
    // First, clean up any existing formatting
    let cleaned = html.trim();
    
    // Basic formatting for HTML/CSS/JS by adding line breaks at key points
    cleaned = cleaned
      // Format HTML tags with line breaks
      .replace(/>\s*</g, '>\n<')
      // Format CSS blocks
      .replace(/\{([^{}]*)\}/g, '{\n$1\n}')
      .replace(/;/g, ';\n')
      // Format JS blocks - add line breaks after common JS syntax
      .replace(/\}\s*function/g, '}\n\nfunction')
      .replace(/;\s*function/g, ';\n\nfunction')
      .replace(/;\s*const/g, ';\n\nconst')
      .replace(/;\s*let/g, ';\n\nlet')
      .replace(/;\s*var/g, ';\n\nvar')
      .replace(/\}\s*else/g, '}\nelse')
      .replace(/\{\s*if/g, '{\nif')
      .replace(/;\s*if/g, ';\n\nif')
      .replace(/\}\s*for/g, '}\n\nfor')
      .replace(/;\s*for/g, ';\n\nfor')
      .replace(/\}\s*while/g, '}\n\nwhile')
      .replace(/\}\s*\}/g, '}\n}');
      
    // Ensure <script> content is properly formatted
    cleaned = cleaned.replace(/<script[^>]*>(.*?)<\/script>/gs, (match, content) => {
      const formattedJS = content
        .replace(/\{/g, '{\n  ')
        .replace(/\}/g, '\n}')
        .replace(/;(?!\s*$)/g, ';\n  ')
        .replace(/\)\s*\{/g, ') {')
        .replace(/else\s*\{/g, 'else {')
        .replace(/if\s*\(/g, 'if (');
      
      return `<script>\n${formattedJS}\n</script>`;
    });
    
    // Ensure <style> content is properly formatted
    cleaned = cleaned.replace(/<style[^>]*>(.*?)<\/style>/gs, (match, content) => {
      const formattedCSS = content
        .replace(/\{/g, ' {\n  ')
        .replace(/;/g, ';\n  ')
        .replace(/\s*\}/g, '\n}')
        .replace(/\}\s*(\.[^{]*)\{/g, '}\n\n$1{');
      
      return `<style>\n${formattedCSS}\n</style>`;
    });
    
    return cleaned;
  } catch (error) {
    console.error('Error formatting HTML content:', error);
    return html; // Return original HTML if formatting fails
  }
};
