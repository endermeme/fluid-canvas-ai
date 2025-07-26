-- Create simplified RLS policies for unified_game_scores table focusing only on games table
-- Allow public read access for published games
CREATE POLICY "Anyone can view scores for published games" 
ON public.unified_game_scores 
FOR SELECT 
USING (
  source_table = 'games' AND
  EXISTS (SELECT 1 FROM public.games WHERE id = game_id AND is_published = true AND expires_at > now())
);

-- Allow anyone to insert scores for published games
CREATE POLICY "Anyone can insert scores for published games" 
ON public.unified_game_scores 
FOR INSERT 
WITH CHECK (
  source_table = 'games' AND
  EXISTS (SELECT 1 FROM public.games WHERE id = game_id AND is_published = true AND expires_at > now())
);

-- Allow creators to manage their game scores
CREATE POLICY "Creators can manage their game scores"
ON public.unified_game_scores
FOR ALL
USING (
  source_table = 'games' AND
  EXISTS (SELECT 1 FROM public.games WHERE id = game_id AND creator_ip = ((current_setting('request.headers'::text))::json ->> 'x-real-ip'::text))
);