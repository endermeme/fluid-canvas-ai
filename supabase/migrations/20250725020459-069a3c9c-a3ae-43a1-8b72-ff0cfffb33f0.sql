-- Update get_game_leaderboard function to handle time-based games correctly
CREATE OR REPLACE FUNCTION public.get_game_leaderboard(target_game_id uuid, limit_count integer DEFAULT 10)
 RETURNS TABLE(player_name text, score integer, total_questions integer, completion_time integer, completed_at timestamp with time zone)
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
BEGIN
  RETURN QUERY
  SELECT 
    gs.player_name,
    gs.score,
    gs.total_questions,
    gs.completion_time,
    gs.completed_at
  FROM public.game_scores gs
  JOIN public.games g ON g.id = gs.game_id
  WHERE gs.game_id = target_game_id 
    AND g.is_published = true 
    AND g.expires_at > now()
  ORDER BY 
    CASE 
      -- For time-based games (memory, wordsearch, matching), sort by completion_time ASC (faster first)
      WHEN gs.game_type IN ('memory', 'wordsearch', 'matching') THEN gs.completion_time
      ELSE NULL
    END ASC NULLS LAST,
    CASE 
      -- For score-based games, sort by score DESC (higher score first)
      WHEN gs.game_type NOT IN ('memory', 'wordsearch', 'matching') THEN gs.score
      ELSE NULL
    END DESC NULLS LAST,
    gs.completed_at ASC
  LIMIT limit_count;
END;
$function$