-- Migration dữ liệu từ custom_game_instances vào custom_games (bây giờ có đủ cột)
INSERT INTO public.custom_games (
  id, title, description, html_content, game_data, settings,
  is_published, max_participants, show_leaderboard, require_registration,
  custom_duration, expires_at, share_count, last_accessed_at,
  creator_ip, account_id, password, created_at, updated_at
)
SELECT 
  cgi.id, cgi.title, cgi.description, cgi.html_content,
  COALESCE(cg.game_data, '{}'::jsonb) as game_data, 
  COALESCE(cg.settings, '{}'::jsonb) as settings,
  cgi.is_published, cgi.max_participants, cgi.show_leaderboard, cgi.require_registration,
  cgi.custom_duration, cgi.expires_at, cgi.share_count, cgi.last_accessed_at,
  cgi.creator_ip, cgi.account_id, cgi.password, cgi.created_at, cgi.updated_at
FROM public.custom_game_instances cgi
LEFT JOIN public.custom_games cg ON cg.game_id = cgi.id
WHERE NOT EXISTS (SELECT 1 FROM public.custom_games cg2 WHERE cg2.id = cgi.id)
ON CONFLICT (id) DO NOTHING;

-- Tạo RPC functions mới cho preset_leaderboard
CREATE OR REPLACE FUNCTION public.get_preset_leaderboard(target_game_id uuid, limit_count integer DEFAULT 10)
RETURNS TABLE(player_name text, score integer, total_questions integer, completion_time integer, scoring_data jsonb, completed_at timestamp with time zone)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
  RETURN QUERY
  SELECT 
    pl.player_name,
    pl.score,
    pl.total_questions,
    pl.completion_time,
    pl.scoring_data,
    pl.completed_at
  FROM public.preset_leaderboard pl
  JOIN public.preset_games pg ON pg.id = pl.game_id
  WHERE pl.game_id = target_game_id 
    AND pg.is_published = true 
    AND pg.expires_at > now()
    AND pl.score IS NOT NULL  -- Only show completed games
  ORDER BY 
    CASE 
      WHEN pg.settings->>'gameType' IN ('memory', 'wordsearch', 'matching') 
      THEN pl.completion_time
      ELSE NULL
    END ASC NULLS LAST,
    CASE 
      WHEN pg.settings->>'gameType' NOT IN ('memory', 'wordsearch', 'matching') 
      THEN pl.score
      ELSE NULL
    END DESC NULLS LAST,
    pl.completed_at ASC
  LIMIT limit_count;
END;
$function$;

-- Tạo RPC functions mới cho custom_leaderboard
CREATE OR REPLACE FUNCTION public.get_custom_leaderboard(target_game_id uuid, limit_count integer DEFAULT 10)
RETURNS TABLE(player_name text, score integer, total_questions integer, completion_time integer, scoring_data jsonb, completed_at timestamp with time zone)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
  RETURN QUERY
  SELECT 
    cl.player_name,
    cl.score,
    cl.total_questions,
    cl.completion_time,
    cl.scoring_data,
    cl.completed_at
  FROM public.custom_leaderboard cl
  JOIN public.custom_games cg ON cg.id = cl.game_id
  WHERE cl.game_id = target_game_id 
    AND cg.is_published = true 
    AND cg.expires_at > now()
    AND cl.score IS NOT NULL  -- Only show completed games
  ORDER BY 
    cl.score DESC,
    cl.completed_at ASC
  LIMIT limit_count;
END;
$function$;