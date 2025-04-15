
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
      content, // Store the entire game content/configuration
      description: description || `Shared game: ${title}` // Add a default description
    })
    .select()
    .single();

  if (error) throw error;
  return game.id;
};

export const getSharedGame = async (id: string): Promise<StoredGame | null> => {
  const { data: game, error } = await supabase
    .from('games')
    .select('*')
    .eq('id', id)
    .single();

  if (error || !game) return null;

  return {
    id: game.id,
    title: game.title,
    gameType: game.game_type,
    content: game.content || {}, // Handle case when content is null
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
