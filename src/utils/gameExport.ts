
import { supabase } from '@/integrations/supabase/client';

export interface StoredGame {
  id: string;
  title: string;
  gameType: string;
  content: any;
  htmlContent: string;
  description?: string; // Added description field
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
      // Don't include the content field since it doesn't exist in the database
      description: description || `Shared game: ${title}` // Add a default description
    })
    .select()
    .single();

  if (error) throw error;
  
  // Create a slug from the title
  const slug = title.toLowerCase().replace(/[^\w\s]/gi, '').replace(/\s+/g, '-');
  
  // Return the full URL with game type and slug in the path
  const baseUrl = window.location.origin;
  return `${baseUrl}/game/${gameType}/${slug}/${game.id}`;
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

  // The game object from Supabase has snake_case properties
  // We need to convert them to camelCase for our frontend
  return {
    id: game.id,
    title: game.title,
    gameType: game.game_type,
    // Since content might not exist in the database, provide a default empty object
    content: {},
    htmlContent: game.html_content,
    description: game.description || `Shared game: ${game.title}`, // Provide a default if missing
    expiresAt: new Date(game.expires_at).getTime(), // Convert to timestamp for consistency
    createdAt: new Date(game.created_at).getTime()  // Convert to timestamp for consistency
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
