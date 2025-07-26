-- Create game_participants table for the main games table
CREATE TABLE public.game_participants (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  game_id UUID NOT NULL,
  player_name TEXT NOT NULL,
  ip_address TEXT,
  joined_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  last_active_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  is_active BOOLEAN DEFAULT true,
  session_data JSONB DEFAULT '{}'::jsonb
);

-- Enable RLS
ALTER TABLE public.game_participants ENABLE ROW LEVEL SECURITY;

-- Create policies for game participants
CREATE POLICY "Anyone can join published games"
ON public.game_participants
FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.games
    WHERE games.id = game_participants.game_id
      AND games.is_published = true
      AND games.expires_at > now()
  )
);

CREATE POLICY "Anyone can view participants of published games"
ON public.game_participants
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.games
    WHERE games.id = game_participants.game_id
      AND games.is_published = true
      AND games.expires_at > now()
  )
);

CREATE POLICY "Anyone can update participant activity"
ON public.game_participants
FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM public.games
    WHERE games.id = game_participants.game_id
      AND games.is_published = true
      AND games.expires_at > now()
  )
);

-- Create function to update participant activity
CREATE OR REPLACE FUNCTION public.update_game_participant_activity(target_game_id uuid, target_player_name text)
 RETURNS void
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
BEGIN
  UPDATE public.game_participants 
  SET 
    last_active_at = now(),
    is_active = true
  WHERE game_id = target_game_id 
    AND player_name = target_player_name;
    
  -- If no participant found, insert new one
  IF NOT FOUND THEN
    INSERT INTO public.game_participants (
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

-- Create function to get real-time participants
CREATE OR REPLACE FUNCTION public.get_game_participants_realtime(target_game_id uuid)
 RETURNS TABLE(id uuid, player_name text, joined_at timestamp with time zone, last_active_at timestamp with time zone, is_active boolean, session_data jsonb)
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
BEGIN
  RETURN QUERY
  SELECT 
    gp.id,
    gp.player_name,
    gp.joined_at,
    gp.last_active_at,
    gp.is_active,
    gp.session_data
  FROM public.game_participants gp
  JOIN public.games g ON g.id = gp.game_id
  WHERE gp.game_id = target_game_id 
    AND g.is_published = true 
    AND g.expires_at > now()
  ORDER BY gp.joined_at DESC;
END;
$function$;