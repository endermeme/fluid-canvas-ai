-- Create RLS policies for unified_game_scores table
-- Allow public read access for shared games
CREATE POLICY "Anyone can view scores for published games" 
ON public.unified_game_scores 
FOR SELECT 
USING (
  CASE 
    WHEN source_table = 'games' THEN
      EXISTS (SELECT 1 FROM public.games WHERE id = game_id AND is_published = true AND expires_at > now())
    WHEN source_table = 'educational_games' THEN
      EXISTS (SELECT 1 FROM public.educational_games WHERE id = game_id AND is_published = true)
    WHEN source_table = 'quizzes' THEN
      EXISTS (SELECT 1 FROM public.quizzes WHERE id = game_id AND is_published = true)
    ELSE false
  END
);

-- Allow anyone to insert scores for published games
CREATE POLICY "Anyone can insert scores for published games" 
ON public.unified_game_scores 
FOR INSERT 
WITH CHECK (
  CASE 
    WHEN source_table = 'games' THEN
      EXISTS (SELECT 1 FROM public.games WHERE id = game_id AND is_published = true AND expires_at > now())
    WHEN source_table = 'educational_games' THEN
      EXISTS (SELECT 1 FROM public.educational_games WHERE id = game_id AND is_published = true)
    WHEN source_table = 'quizzes' THEN
      EXISTS (SELECT 1 FROM public.quizzes WHERE id = game_id AND is_published = true)
    ELSE false
  END
);

-- Allow creators to manage their game scores
CREATE POLICY "Creators can manage their game scores"
ON public.unified_game_scores
FOR ALL
USING (
  CASE 
    WHEN source_table = 'games' THEN
      EXISTS (SELECT 1 FROM public.games WHERE id = game_id AND creator_ip = ((current_setting('request.headers'::text))::json ->> 'x-real-ip'::text))
    ELSE false
  END
);