-- Drop the unnecessary preset_game_instances table
DROP TABLE IF EXISTS public.preset_game_instances CASCADE;

-- Add necessary columns to preset_games table
ALTER TABLE public.preset_games 
ADD COLUMN IF NOT EXISTS is_published boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS expires_at timestamp with time zone DEFAULT (now() + interval '48 hours'),
ADD COLUMN IF NOT EXISTS creator_ip text,
ADD COLUMN IF NOT EXISTS account_id text,
ADD COLUMN IF NOT EXISTS password text,
ADD COLUMN IF NOT EXISTS max_participants integer,
ADD COLUMN IF NOT EXISTS show_leaderboard boolean DEFAULT true,
ADD COLUMN IF NOT EXISTS require_registration boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS custom_duration integer,
ADD COLUMN IF NOT EXISTS single_participation_only boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS share_count integer DEFAULT 0,
ADD COLUMN IF NOT EXISTS last_accessed_at timestamp with time zone;

-- Update RLS policies for preset_games to handle the new columns
DROP POLICY IF EXISTS "Anyone can view preset game templates" ON public.preset_games;
DROP POLICY IF EXISTS "Users can insert preset games" ON public.preset_games;
DROP POLICY IF EXISTS "Users can update their own preset games" ON public.preset_games;
DROP POLICY IF EXISTS "Users can delete their own preset games" ON public.preset_games;

-- Create new RLS policies
CREATE POLICY "Anyone can view active preset games" 
ON public.preset_games 
FOR SELECT 
USING (is_active = true);

CREATE POLICY "Anyone can view published preset games" 
ON public.preset_games 
FOR SELECT 
USING (is_published = true);

CREATE POLICY "Allow insert for preset games" 
ON public.preset_games 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Users can update their own preset games" 
ON public.preset_games 
FOR UPDATE 
USING (account_id IS NOT NULL);

CREATE POLICY "Users can delete their own preset games" 
ON public.preset_games 
FOR DELETE 
USING (account_id IS NOT NULL);

-- Update functions to work with preset_games instead of preset_game_instances
DROP FUNCTION IF EXISTS public.get_preset_game_leaderboard(uuid, integer);
DROP FUNCTION IF EXISTS public.get_preset_game_stats_admin(uuid);
DROP FUNCTION IF EXISTS public.get_preset_game_participants_realtime(uuid);
DROP FUNCTION IF EXISTS public.increment_preset_game_share_count(uuid);

-- Recreate functions to work with preset_games
CREATE OR REPLACE FUNCTION public.get_preset_game_leaderboard(target_game_id uuid, limit_count integer DEFAULT 10)
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
    AND pl.score IS NOT NULL
  ORDER BY 
    CASE 
      WHEN pg.game_type IN ('memory', 'wordsearch', 'matching') 
      THEN pl.completion_time
      ELSE NULL
    END ASC NULLS LAST,
    CASE 
      WHEN pg.game_type NOT IN ('memory', 'wordsearch', 'matching') 
      THEN pl.score
      ELSE NULL
    END DESC NULLS LAST,
    pl.completed_at ASC
  LIMIT limit_count;
END;
$function$;

CREATE OR REPLACE FUNCTION public.get_preset_game_stats_admin(target_game_id uuid)
 RETURNS TABLE(total_participants integer, total_scores integer, average_score numeric, best_score integer, completion_rate numeric, active_participants integer)
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
BEGIN
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
END;
$function$;

CREATE OR REPLACE FUNCTION public.get_preset_game_participants_realtime(target_game_id uuid)
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

CREATE OR REPLACE FUNCTION public.increment_preset_game_share_count(game_id uuid)
 RETURNS void
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
BEGIN
  UPDATE public.preset_games 
  SET 
    share_count = COALESCE(share_count, 0) + 1,
    last_accessed_at = now()
  WHERE id = game_id;
END;
$function$;