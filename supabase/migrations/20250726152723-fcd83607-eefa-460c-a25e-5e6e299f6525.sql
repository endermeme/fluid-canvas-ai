-- Cập nhật RPC function để gộp leaderboard và participants
CREATE OR REPLACE FUNCTION public.get_unified_leaderboard_with_participants(
  target_game_id uuid, 
  target_source_table text, 
  limit_count integer DEFAULT 50
)
RETURNS TABLE(
  player_name text, 
  score integer, 
  total_questions integer, 
  completion_time integer, 
  scoring_data jsonb, 
  completed_at timestamp with time zone, 
  joined_at timestamp with time zone,
  last_active_at timestamp with time zone,
  is_active boolean,
  status text
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
  IF target_source_table = 'custom_games' THEN
    RETURN QUERY
    SELECT 
      cl.player_name,
      cl.score,
      cl.total_questions,
      cl.completion_time,
      cl.scoring_data,
      cl.completed_at,
      cl.joined_at,
      cl.last_active_at,
      cl.is_active,
      CASE 
        WHEN cl.score IS NOT NULL THEN 'completed'
        ELSE 'playing'
      END as status
    FROM public.custom_leaderboard cl
    JOIN public.custom_games cg ON cg.id = cl.game_id
    WHERE cl.game_id = target_game_id 
      AND cg.is_published = true 
      AND cg.expires_at > now()
    ORDER BY 
      cl.score DESC NULLS LAST,
      cl.joined_at ASC
    LIMIT limit_count;
    
  ELSIF target_source_table = 'preset_games' THEN
    RETURN QUERY
    SELECT 
      pl.player_name,
      pl.score,
      pl.total_questions,
      pl.completion_time,
      pl.scoring_data,
      pl.completed_at,
      pl.joined_at,
      pl.last_active_at,
      pl.is_active,
      CASE 
        WHEN pl.score IS NOT NULL THEN 'completed'
        ELSE 'playing'
      END as status
    FROM public.preset_leaderboard pl
    JOIN public.preset_games pg ON pg.id = pl.game_id
    WHERE pl.game_id = target_game_id 
      AND pg.is_active = true
    ORDER BY 
      pl.score DESC NULLS LAST,
      pl.joined_at ASC
    LIMIT limit_count;
  END IF;
END;
$function$;

-- Tạo RPC function để lấy stats game
CREATE OR REPLACE FUNCTION public.get_unified_game_stats(
  target_game_id uuid, 
  target_source_table text
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
AS $function$
BEGIN
  IF target_source_table = 'custom_games' THEN
    RETURN QUERY
    SELECT 
      (SELECT COUNT(*)::integer FROM public.custom_leaderboard 
       WHERE game_id = target_game_id) as total_participants,
      (SELECT COUNT(*)::integer FROM public.custom_leaderboard 
       WHERE game_id = target_game_id AND score IS NOT NULL) as total_scores,
      (SELECT ROUND(AVG(score), 2) FROM public.custom_leaderboard 
       WHERE game_id = target_game_id AND score IS NOT NULL) as average_score,
      (SELECT MAX(score) FROM public.custom_leaderboard 
       WHERE game_id = target_game_id AND score IS NOT NULL) as best_score,
      (SELECT CASE 
         WHEN (SELECT COUNT(*) FROM public.custom_leaderboard WHERE game_id = target_game_id) = 0 
         THEN 0 
         ELSE ROUND(
           (SELECT COUNT(*)::numeric FROM public.custom_leaderboard WHERE game_id = target_game_id AND score IS NOT NULL) / 
           (SELECT COUNT(*)::numeric FROM public.custom_leaderboard WHERE game_id = target_game_id) * 100, 2
         ) 
       END) as completion_rate,
      (SELECT COUNT(*)::integer FROM public.custom_leaderboard 
       WHERE game_id = target_game_id AND is_active = true) as active_participants;
       
  ELSIF target_source_table = 'preset_games' THEN
    RETURN QUERY
    SELECT 
      (SELECT COUNT(*)::integer FROM public.preset_leaderboard 
       WHERE game_id = target_game_id) as total_participants,
      (SELECT COUNT(*)::integer FROM public.preset_leaderboard 
       WHERE game_id = target_game_id AND score IS NOT NULL) as total_scores,
      (SELECT ROUND(AVG(score), 2) FROM public.preset_leaderboard 
       WHERE game_id = target_game_id AND score IS NOT NULL) as average_score,
      (SELECT MAX(score) FROM public.preset_leaderboard 
       WHERE game_id = target_game_id AND score IS NOT NULL) as best_score,
      (SELECT CASE 
         WHEN (SELECT COUNT(*) FROM public.preset_leaderboard WHERE game_id = target_game_id) = 0 
         THEN 0 
         ELSE ROUND(
           (SELECT COUNT(*)::numeric FROM public.preset_leaderboard WHERE game_id = target_game_id AND score IS NOT NULL) / 
           (SELECT COUNT(*)::numeric FROM public.preset_leaderboard WHERE game_id = target_game_id) * 100, 2
         ) 
       END) as completion_rate,
      (SELECT COUNT(*)::integer FROM public.preset_leaderboard 
       WHERE game_id = target_game_id AND is_active = true) as active_participants;
  END IF;
END;
$function$;

-- Cập nhật RPC function để update participant activity
CREATE OR REPLACE FUNCTION public.update_unified_participant_activity(
  target_game_id uuid, 
  target_player_name text, 
  target_source_table text
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
  IF target_source_table = 'custom_games' THEN
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
    
  ELSIF target_source_table = 'preset_games' THEN
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
  END IF;
END;
$function$;

-- Tạo trigger để tự động tạo profile khi user đăng ký
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $function$
BEGIN
  INSERT INTO public.profiles (id, full_name, email)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email),
    NEW.email
  );
  RETURN NEW;
END;
$function$;

-- Tạo trigger nếu chưa có
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();