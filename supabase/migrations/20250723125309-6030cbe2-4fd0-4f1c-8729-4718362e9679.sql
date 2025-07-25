-- Fix RLS policy for game_participants to allow public game participation
DROP POLICY IF EXISTS "Allow read own participation data" ON public.game_participants;
DROP POLICY IF EXISTS "Allow insert for participants" ON public.game_participants;

-- Allow anyone to insert participants for published games
CREATE POLICY "Allow insert for shared game participants" 
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

-- Allow reading participants for shared games
CREATE POLICY "Allow read participants for shared games" 
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

-- Allow updates for participants (for retry count, etc.)
CREATE POLICY "Allow update participants for shared games" 
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