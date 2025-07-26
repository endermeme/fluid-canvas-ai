-- Step 1: Add score-related columns to preset_game_participants
ALTER TABLE public.preset_game_participants 
ADD COLUMN score integer,
ADD COLUMN total_questions integer,
ADD COLUMN completion_time integer,
ADD COLUMN scoring_data jsonb DEFAULT '{}'::jsonb,
ADD COLUMN completed_at timestamp with time zone;

-- Step 2: Migrate existing data from preset_game_scores to preset_game_participants
UPDATE public.preset_game_participants 
SET 
  score = pgs.score,
  total_questions = pgs.total_questions,
  completion_time = pgs.completion_time,
  scoring_data = pgs.scoring_data,
  completed_at = pgs.completed_at
FROM public.preset_game_scores pgs
WHERE preset_game_participants.game_instance_id = pgs.game_instance_id
  AND preset_game_participants.player_name = pgs.player_name;

-- Step 3: Update RPC function for leaderboard to use unified table
CREATE OR REPLACE FUNCTION public.get_preset_game_leaderboard(target_game_instance_id uuid, limit_count integer DEFAULT 10)
 RETURNS TABLE(player_name text, score integer, total_questions integer, completion_time integer, scoring_data jsonb, completed_at timestamp with time zone)
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
BEGIN
  RETURN QUERY
  SELECT 
    pgp.player_name,
    pgp.score,
    pgp.total_questions,
    pgp.completion_time,
    pgp.scoring_data,
    pgp.completed_at
  FROM public.preset_game_participants pgp
  JOIN public.preset_game_instances pgi ON pgi.id = pgp.game_instance_id
  WHERE pgp.game_instance_id = target_game_instance_id 
    AND pgi.is_published = true 
    AND pgi.expires_at > now()
    AND pgp.score IS NOT NULL  -- Only show completed games
  ORDER BY 
    CASE 
      WHEN pgi.settings->>'gameType' IN ('memory', 'wordsearch', 'matching') 
      THEN pgp.completion_time
      ELSE NULL
    END ASC NULLS LAST,
    CASE 
      WHEN pgi.settings->>'gameType' NOT IN ('memory', 'wordsearch', 'matching') 
      THEN pgp.score
      ELSE NULL
    END DESC NULLS LAST,
    pgp.completed_at ASC
  LIMIT limit_count;
END;
$function$;

-- Step 4: Update stats function to work with unified table
CREATE OR REPLACE FUNCTION public.get_preset_game_stats_admin(target_game_instance_id uuid)
 RETURNS TABLE(total_participants integer, total_scores integer, average_score numeric, best_score integer, completion_rate numeric, active_participants integer)
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
BEGIN
  RETURN QUERY
  SELECT 
    (SELECT COUNT(*)::integer FROM public.preset_game_participants 
     WHERE game_instance_id = target_game_instance_id) as total_participants,
    (SELECT COUNT(*)::integer FROM public.preset_game_participants 
     WHERE game_instance_id = target_game_instance_id AND score IS NOT NULL) as total_scores,
    (SELECT ROUND(AVG(score), 2) FROM public.preset_game_participants 
     WHERE game_instance_id = target_game_instance_id AND score IS NOT NULL) as average_score,
    (SELECT MAX(score) FROM public.preset_game_participants 
     WHERE game_instance_id = target_game_instance_id AND score IS NOT NULL) as best_score,
    (SELECT CASE 
       WHEN (SELECT COUNT(*) FROM public.preset_game_participants WHERE game_instance_id = target_game_instance_id) = 0 
       THEN 0 
       ELSE ROUND(
         (SELECT COUNT(*)::numeric FROM public.preset_game_participants WHERE game_instance_id = target_game_instance_id AND score IS NOT NULL) / 
         (SELECT COUNT(*)::numeric FROM public.preset_game_participants WHERE game_instance_id = target_game_instance_id) * 100, 2
       ) 
     END) as completion_rate,
    (SELECT COUNT(*)::integer FROM public.preset_game_participants 
     WHERE game_instance_id = target_game_instance_id AND is_active = true) as active_participants;
END;
$function$;

-- Step 5: Update participant activity function to allow score updates
CREATE OR REPLACE FUNCTION public.update_preset_participant_activity(target_game_instance_id uuid, target_player_name text)
 RETURNS void
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
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
$function$;

-- Step 6: Drop the old preset_game_scores table after migration
DROP TABLE IF EXISTS public.preset_game_scores;