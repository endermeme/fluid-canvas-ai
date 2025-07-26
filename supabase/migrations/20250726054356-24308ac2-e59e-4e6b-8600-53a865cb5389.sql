-- Update get_game_leaderboard function to use unified_game_scores instead of deleted game_scores table
CREATE OR REPLACE FUNCTION public.get_game_leaderboard(target_game_id uuid, limit_count integer DEFAULT 10)
 RETURNS TABLE(player_name text, score integer, total_questions integer, completion_time integer, completed_at timestamp with time zone)
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
BEGIN
  RETURN QUERY
  SELECT 
    ugs.player_name,
    ugs.score,
    ugs.total_questions,
    ugs.completion_time,
    ugs.completed_at
  FROM public.unified_game_scores ugs
  JOIN public.games g ON g.id = ugs.game_id
  WHERE ugs.game_id = target_game_id 
    AND g.is_published = true 
    AND g.expires_at > now()
    AND ugs.source_table = 'games'
  ORDER BY 
    CASE 
      -- For time-based games (memory, wordsearch, matching), sort by completion_time ASC (faster first)
      WHEN ugs.game_type IN ('memory', 'wordsearch', 'matching') THEN ugs.completion_time
      ELSE NULL
    END ASC NULLS LAST,
    CASE 
      -- For score-based games, sort by score DESC (higher score first)
      WHEN ugs.game_type NOT IN ('memory', 'wordsearch', 'matching') THEN ugs.score
      ELSE NULL
    END DESC NULLS LAST,
    ugs.completed_at ASC
  LIMIT limit_count;
END;
$function$;