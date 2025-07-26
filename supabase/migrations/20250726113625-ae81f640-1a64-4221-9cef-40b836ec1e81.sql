-- XÓA CÁC BẢNG CŨ KHÔNG CẦN THIẾT
DROP TABLE IF EXISTS public.preset_game_instances CASCADE;
DROP TABLE IF EXISTS public.preset_game_participants CASCADE;
DROP TABLE IF EXISTS public.custom_game_instances CASCADE;
DROP TABLE IF EXISTS public.custom_game_participants CASCADE;
DROP TABLE IF EXISTS public.custom_game_scores CASCADE;
DROP TABLE IF EXISTS public.games CASCADE;
DROP TABLE IF EXISTS public.unified_game_scores CASCADE;
DROP TABLE IF EXISTS public.game_participants CASCADE;
DROP TABLE IF EXISTS public.game_score_details CASCADE;

-- Tạo thêm các RPC functions cần thiết cho preset và custom leaderboard
CREATE OR REPLACE FUNCTION public.get_preset_participants_realtime(target_game_id uuid)
RETURNS TABLE(id uuid, player_name text, joined_at timestamp with time zone, last_active_at timestamp with time zone, is_active boolean, session_data jsonb)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
  RETURN QUERY
  SELECT 
    pl.id,
    pl.player_name,
    pl.joined_at,
    pl.last_active_at,
    pl.is_active,
    pl.session_data
  FROM public.preset_leaderboard pl
  JOIN public.preset_games pg ON pg.id = pl.game_id
  WHERE pl.game_id = target_game_id 
    AND pg.is_published = true 
    AND pg.expires_at > now()
  ORDER BY pl.joined_at DESC;
END;
$function$;

CREATE OR REPLACE FUNCTION public.get_custom_participants_realtime(target_game_id uuid)
RETURNS TABLE(id uuid, player_name text, joined_at timestamp with time zone, last_active_at timestamp with time zone, is_active boolean, session_data jsonb)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
  RETURN QUERY
  SELECT 
    cl.id,
    cl.player_name,
    cl.joined_at,
    cl.last_active_at,
    cl.is_active,
    cl.session_data
  FROM public.custom_leaderboard cl
  JOIN public.custom_games cg ON cg.id = cl.game_id
  WHERE cl.game_id = target_game_id 
    AND cg.is_published = true 
    AND cg.expires_at > now()
  ORDER BY cl.joined_at DESC;
END;
$function$;

-- Functions để cập nhật participant activity
CREATE OR REPLACE FUNCTION public.update_preset_participant_activity(target_game_id uuid, target_player_name text)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
  UPDATE public.preset_leaderboard 
  SET 
    last_active_at = now(),
    is_active = true
  WHERE game_id = target_game_id 
    AND player_name = target_player_name;
    
  -- If no participant found, insert new one
  IF NOT FOUND THEN
    INSERT INTO public.preset_leaderboard (
      game_id, 
      player_name, 
      ip_address
    ) VALUES (
      target_game_id, 
      target_player_name, 
      'dynamic-ip'
    );
  END IF;
END;
$function$;

CREATE OR REPLACE FUNCTION public.update_custom_participant_activity(target_game_id uuid, target_player_name text)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
  UPDATE public.custom_leaderboard 
  SET 
    last_active_at = now(),
    is_active = true
  WHERE game_id = target_game_id 
    AND player_name = target_player_name;
    
  -- If no participant found, insert new one
  IF NOT FOUND THEN
    INSERT INTO public.custom_leaderboard (
      game_id, 
      player_name, 
      ip_address
    ) VALUES (
      target_game_id, 
      target_player_name, 
      'dynamic-ip'
    );
  END IF;
END;
$function$;