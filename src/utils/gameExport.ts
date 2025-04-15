
import { supabase } from "@/integrations/supabase/client";
import { StoredGame } from "@/utils/types";

// Get the base URL for shared games
const getBaseUrl = () => {
  const url = window.location.origin;
  return `${url}/quiz/shared`;
};

// Save game to Supabase with 48-hour expiration
export const saveGameForSharing = async (title: string, description: string, htmlContent: string): Promise<string> => {
  try {
    if (!htmlContent) {
      console.error("Cannot save empty game content");
      return "";
    }
    
    const { data: game, error } = await supabase
      .from('games')
      .insert({
        title: title || "Minigame Tương tác",
        description: description || "",
        html_content: htmlContent,
        game_type: 'custom',
      })
      .select('id')
      .single();

    if (error) {
      console.error("Error saving game:", error);
      return "";
    }
    
    // Return the share URL
    return `${getBaseUrl()}/${game.id}`;
  } catch (error) {
    console.error("Error saving game:", error);
    return "";
  }
};

// Get a game by ID
export const getSharedGame = async (id: string): Promise<StoredGame | null> => {
  try {
    if (!id) return null;
    
    const { data: game, error } = await supabase
      .from('games')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !game) {
      console.error("Error getting shared game:", error);
      return null;
    }

    return {
      id: game.id,
      title: game.title,
      description: game.description || "",
      htmlContent: game.html_content,
      createdAt: new Date(game.created_at).getTime(),
      expiresAt: new Date(game.expires_at).getTime()
    };
  } catch (error) {
    console.error("Error getting shared game:", error);
    return null;
  }
};

// Calculate remaining time for a game
export const getRemainingTime = (expiresAt: number): string => {
  try {
    const now = Date.now();
    const remainingMs = expiresAt - now;
    
    if (remainingMs <= 0) return 'Đã hết hạn';
    
    const hours = Math.floor(remainingMs / (60 * 60 * 1000));
    const minutes = Math.floor((remainingMs % (60 * 60 * 1000)) / (60 * 1000));
    
    return `${hours} giờ ${minutes} phút`;
  } catch (error) {
    console.error("Error calculating remaining time:", error);
    return "Không xác định";
  }
};

// Clean up expired games from local storage
export const cleanupExpiredGames = () => {
  try {
    const gamesJson = localStorage.getItem('shared_games');
    if (!gamesJson) return;
    
    const games: StoredGame[] = JSON.parse(gamesJson);
    const now = Date.now();
    const validGames = games.filter(game => game.expiresAt > now);
    
    if (validGames.length !== games.length) {
      localStorage.setItem('shared_games', JSON.stringify(validGames));
    }
  } catch (error) {
    console.error("Error cleaning up expired games:", error);
  }
};
