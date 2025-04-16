
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
  const { data: game, error } = await supabase
    .from('games')
    .insert({
      title,
      game_type: gameType,
      html_content: htmlContent,
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
