-- TẠO DATABASE FUNCTIONS MỚI CHO HỆ THỐNG TÁCH ĐÔI

-- PHẦN 1: FUNCTIONS CHO PRESET GAMES

-- 1.1 Function để get preset game leaderboard
CREATE OR REPLACE FUNCTION public.get_preset_game_leaderboard(
  target_game_instance_id uuid, 
  limit_count integer DEFAULT 10
)
RETURNS TABLE(
  player_name text, 
  score integer, 
  total_questions integer, 
  completion_time integer, 
  scoring_data jsonb, 
  completed_at timestamp with time zone
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    pgs.player_name,
    pgs.score,
    pgs.total_questions,
    pgs.completion_time,
    pgs.scoring_data,
    pgs.completed_at
  FROM public.preset_game_scores pgs
  JOIN public.preset_game_instances pgi ON pgi.id = pgs.game_instance_id
  WHERE pgs.game_instance_id = target_game_instance_id 
    AND pgi.is_published = true 
    AND pgi.expires_at > now()
  ORDER BY 
    CASE 
      WHEN pgi.settings->>'gameType' IN ('memory', 'wordsearch', 'matching') 
      THEN pgs.completion_time
      ELSE NULL
    END ASC NULLS LAST,
    CASE 
      WHEN pgi.settings->>'gameType' NOT IN ('memory', 'wordsearch', 'matching') 
      THEN pgs.score
      ELSE NULL
    END DESC NULLS LAST,
    pgs.completed_at ASC
  LIMIT limit_count;
END;
$$;

-- 1.2 Function để get preset game participants real-time
CREATE OR REPLACE FUNCTION public.get_preset_game_participants_realtime(
  target_game_instance_id uuid
)
RETURNS TABLE(
  id uuid,
  player_name text,
  joined_at timestamp with time zone,
  last_active_at timestamp with time zone,
  is_active boolean,
  session_data jsonb
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    pgp.id,
    pgp.player_name,
    pgp.joined_at,
    pgp.last_active_at,
    pgp.is_active,
    pgp.session_data
  FROM public.preset_game_participants pgp
  JOIN public.preset_game_instances pgi ON pgi.id = pgp.game_instance_id
  WHERE pgp.game_instance_id = target_game_instance_id 
    AND pgi.is_published = true 
    AND pgi.expires_at > now()
  ORDER BY pgp.joined_at DESC;
END;
$$;

-- 1.3 Function để get preset game stats for admin
CREATE OR REPLACE FUNCTION public.get_preset_game_stats_admin(
  target_game_instance_id uuid
)
RETURNS TABLE(
  total_participants integer,
  total_scores integer,
  average_score numeric,
  best_score integer,
  completion_rate numeric,
  active_participants integer
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    (SELECT COUNT(*)::integer FROM public.preset_game_participants 
     WHERE game_instance_id = target_game_instance_id) as total_participants,
    (SELECT COUNT(*)::integer FROM public.preset_game_scores 
     WHERE game_instance_id = target_game_instance_id) as total_scores,
    (SELECT ROUND(AVG(score), 2) FROM public.preset_game_scores 
     WHERE game_instance_id = target_game_instance_id) as average_score,
    (SELECT MAX(score) FROM public.preset_game_scores 
     WHERE game_instance_id = target_game_instance_id) as best_score,
    (SELECT CASE 
       WHEN (SELECT COUNT(*) FROM public.preset_game_participants WHERE game_instance_id = target_game_instance_id) = 0 
       THEN 0 
       ELSE ROUND(
         (SELECT COUNT(*)::numeric FROM public.preset_game_scores WHERE game_instance_id = target_game_instance_id) / 
         (SELECT COUNT(*)::numeric FROM public.preset_game_participants WHERE game_instance_id = target_game_instance_id) * 100, 2
       ) 
     END) as completion_rate,
    (SELECT COUNT(*)::integer FROM public.preset_game_participants 
     WHERE game_instance_id = target_game_instance_id AND is_active = true) as active_participants;
END;
$$;

-- PHẦN 2: FUNCTIONS CHO CUSTOM GAMES

-- 2.1 Function để get custom game leaderboard  
CREATE OR REPLACE FUNCTION public.get_custom_game_leaderboard(
  target_game_instance_id uuid, 
  limit_count integer DEFAULT 10
)
RETURNS TABLE(
  player_name text, 
  score integer, 
  total_questions integer, 
  completion_time integer, 
  scoring_data jsonb, 
  completed_at timestamp with time zone
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    cgs.player_name,
    cgs.score,
    cgs.total_questions,
    cgs.completion_time,
    cgs.scoring_data,
    cgs.completed_at
  FROM public.custom_game_scores cgs
  JOIN public.custom_game_instances cgi ON cgi.id = cgs.game_instance_id
  WHERE cgs.game_instance_id = target_game_instance_id 
    AND cgi.is_published = true 
    AND cgi.expires_at > now()
  ORDER BY 
    cgs.score DESC,
    cgs.completed_at ASC
  LIMIT limit_count;
END;
$$;

-- 2.2 Function để get custom game participants real-time
CREATE OR REPLACE FUNCTION public.get_custom_game_participants_realtime(
  target_game_instance_id uuid
)
RETURNS TABLE(
  id uuid,
  player_name text,
  joined_at timestamp with time zone,
  last_active_at timestamp with time zone,
  is_active boolean,
  session_data jsonb
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    cgp.id,
    cgp.player_name,
    cgp.joined_at,
    cgp.last_active_at,
    cgp.is_active,
    cgp.session_data
  FROM public.custom_game_participants cgp
  JOIN public.custom_game_instances cgi ON cgi.id = cgp.game_instance_id
  WHERE cgp.game_instance_id = target_game_instance_id 
    AND cgi.is_published = true 
    AND cgi.expires_at > now()
  ORDER BY cgp.joined_at DESC;
END;
$$;

-- 2.3 Function để get custom game stats for admin
CREATE OR REPLACE FUNCTION public.get_custom_game_stats_admin(
  target_game_instance_id uuid
)
RETURNS TABLE(
  total_participants integer,
  total_scores integer,
  average_score numeric,
  best_score integer,
  completion_rate numeric,
  active_participants integer
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    (SELECT COUNT(*)::integer FROM public.custom_game_participants 
     WHERE game_instance_id = target_game_instance_id) as total_participants,
    (SELECT COUNT(*)::integer FROM public.custom_game_scores 
     WHERE game_instance_id = target_game_instance_id) as total_scores,
    (SELECT ROUND(AVG(score), 2) FROM public.custom_game_scores 
     WHERE game_instance_id = target_game_instance_id) as average_score,
    (SELECT MAX(score) FROM public.custom_game_scores 
     WHERE game_instance_id = target_game_instance_id) as best_score,
    (SELECT CASE 
       WHEN (SELECT COUNT(*) FROM public.custom_game_participants WHERE game_instance_id = target_game_instance_id) = 0 
       THEN 0 
       ELSE ROUND(
         (SELECT COUNT(*)::numeric FROM public.custom_game_scores WHERE game_instance_id = target_game_instance_id) / 
         (SELECT COUNT(*)::numeric FROM public.custom_game_participants WHERE game_instance_id = target_game_instance_id) * 100, 2
       ) 
     END) as completion_rate,
    (SELECT COUNT(*)::integer FROM public.custom_game_participants 
     WHERE game_instance_id = target_game_instance_id AND is_active = true) as active_participants;
END;
$$;

-- PHẦN 3: FUNCTIONS CHO SHARE COUNT

-- 3.1 Function để increment share count cho preset games
CREATE OR REPLACE FUNCTION public.increment_preset_game_share_count(game_instance_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  UPDATE public.preset_game_instances 
  SET 
    share_count = COALESCE(share_count, 0) + 1,
    last_accessed_at = now()
  WHERE id = game_instance_id;
END;
$$;

-- 3.2 Function để increment share count cho custom games
CREATE OR REPLACE FUNCTION public.increment_custom_game_share_count(game_instance_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  UPDATE public.custom_game_instances 
  SET 
    share_count = COALESCE(share_count, 0) + 1,
    last_accessed_at = now()
  WHERE id = game_instance_id;
END;
$$;

-- PHẦN 4: FUNCTIONS CHO PARTICIPANT MANAGEMENT

-- 4.1 Function để update participant activity cho preset games
CREATE OR REPLACE FUNCTION public.update_preset_participant_activity(
  target_game_instance_id uuid,
  target_player_name text
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  UPDATE public.preset_game_participants 
  SET 
    last_active_at = now(),
    is_active = true
  WHERE game_instance_id = target_game_instance_id 
    AND player_name = target_player_name;
    
  -- If no participant found, insert new one
  IF NOT FOUND THEN
    INSERT INTO public.preset_game_participants (
      game_instance_id, 
      player_name, 
      ip_address
    ) VALUES (
      target_game_instance_id, 
      target_player_name, 
      'dynamic-ip'
    );
  END IF;
END;
$$;

-- 4.2 Function để update participant activity cho custom games
CREATE OR REPLACE FUNCTION public.update_custom_participant_activity(
  target_game_instance_id uuid,
  target_player_name text
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  UPDATE public.custom_game_participants 
  SET 
    last_active_at = now(),
    is_active = true
  WHERE game_instance_id = target_game_instance_id 
    AND player_name = target_player_name;
    
  -- If no participant found, insert new one
  IF NOT FOUND THEN
    INSERT INTO public.custom_game_participants (
      game_instance_id, 
      player_name, 
      ip_address
    ) VALUES (
      target_game_instance_id, 
      target_player_name, 
      'dynamic-ip'
    );
  END IF;
END;
$$;