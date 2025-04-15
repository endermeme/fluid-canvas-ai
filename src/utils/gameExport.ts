
import { supabase } from '@/integrations/supabase/client';

export interface StoredGame {
  id: string;
  title: string;
  gameType: string;
  content: any;
  htmlContent: string;
  expiresAt: Date;
  createdAt: Date;
}

export const saveGameForSharing = async (
  title: string, 
  gameType: string,
  content: any,
  htmlContent: string
): Promise<string> => {
  const { data: game, error } = await supabase
    .from('games')
    .insert({
      title,
      game_type: gameType,
      html_content: htmlContent,
      content: content // Store the entire game content/configuration
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
    content: game.content,
    htmlContent: game.html_content,
    expiresAt: new Date(game.expires_at),
    createdAt: new Date(game.created_at)
  };
};

export const getRemainingTime = (expiresAt: Date): string => {
  const now = new Date();
  const diff = expiresAt.getTime() - now.getTime();
  
  if (diff <= 0) return 'Đã hết hạn';
  
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  
  return `${hours}h ${minutes}m`;
};
