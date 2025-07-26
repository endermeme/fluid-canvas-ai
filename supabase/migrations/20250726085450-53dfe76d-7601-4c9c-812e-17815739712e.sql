-- Create unified participant and leaderboard view function
CREATE OR REPLACE FUNCTION public.get_unified_participants_leaderboard(target_game_id uuid, limit_count integer DEFAULT 50)
 RETURNS TABLE(
   player_name text, 
   status text,
   score integer, 
   total_questions integer, 
   completion_time integer, 
   scoring_data jsonb, 
   completed_at timestamp with time zone,
   joined_at timestamp with time zone,
   game_type text,
   is_active boolean
 )
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
BEGIN
  RETURN QUERY
  SELECT 
    COALESCE(ugs.player_name, gp.player_name) as player_name,
    CASE 
      WHEN ugs.id IS NOT NULL THEN 'completed'
      ELSE 'playing'
    END as status,
    COALESCE(ugs.score, 0) as score,
    COALESCE(ugs.total_questions, 0) as total_questions,
    ugs.completion_time,
    ugs.scoring_data,
    ugs.completed_at,
    gp.joined_at,
    ugs.game_type,
    gp.is_active
  FROM public.game_participants gp
  LEFT JOIN public.unified_game_scores ugs ON (
    ugs.game_id = gp.game_id 
    AND ugs.player_name = gp.player_name 
    AND ugs.source_table = 'games'
  )
  JOIN public.games g ON g.id = gp.game_id
  WHERE gp.game_id = target_game_id 
    AND g.is_published = true 
    AND g.expires_at > now()
  ORDER BY 
    CASE 
      WHEN ugs.game_type IN ('memory', 'wordsearch', 'matching') THEN ugs.completion_time
      ELSE NULL
    END ASC NULLS LAST,
    CASE 
      WHEN ugs.game_type NOT IN ('memory', 'wordsearch', 'matching') OR ugs.game_type IS NULL THEN ugs.score
      ELSE NULL
    END DESC NULLS LAST,
    gp.joined_at ASC
  LIMIT limit_count;
END;
$function$