-- Fix RLS policies for new tables

-- Policies for unified_game_scores
CREATE POLICY "Anyone can insert scores for active games" 
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

CREATE POLICY "Anyone can view scores for active games" 
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

-- Policies for game_score_details  
CREATE POLICY "Anyone can insert score details" 
ON public.game_score_details 
FOR INSERT 
WITH CHECK (
  EXISTS (SELECT 1 FROM public.unified_game_scores WHERE id = score_id)
);

CREATE POLICY "Anyone can view score details for valid scores" 
ON public.game_score_details 
FOR SELECT 
USING (
  EXISTS (SELECT 1 FROM public.unified_game_scores WHERE id = score_id)
);

-- Create updated leaderboard function with proper search_path
CREATE OR REPLACE FUNCTION public.get_unified_game_leaderboard(
  target_game_id UUID, 
  target_source_table TEXT,
  limit_count INTEGER DEFAULT 10
)
RETURNS TABLE(
  player_name TEXT,
  score INTEGER,
  total_questions INTEGER,
  completion_time INTEGER,
  scoring_data JSONB,
  completed_at TIMESTAMPTZ,
  game_type TEXT
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    ugs.player_name,
    ugs.score,
    ugs.total_questions,
    ugs.completion_time,
    ugs.scoring_data,
    ugs.completed_at,
    ugs.game_type
  FROM public.unified_game_scores ugs
  WHERE ugs.game_id = target_game_id 
    AND ugs.source_table = target_source_table
    AND CASE 
      WHEN target_source_table = 'games' THEN
        EXISTS (SELECT 1 FROM public.games WHERE id = target_game_id AND is_published = true AND expires_at > now())
      WHEN target_source_table = 'educational_games' THEN
        EXISTS (SELECT 1 FROM public.educational_games WHERE id = target_game_id AND is_published = true)
      WHEN target_source_table = 'quizzes' THEN
        EXISTS (SELECT 1 FROM public.quizzes WHERE id = target_game_id AND is_published = true)
      ELSE false
    END
  ORDER BY 
    CASE 
      WHEN ugs.game_type IN ('memory', 'wordsearch', 'matching') THEN ugs.completion_time
      ELSE NULL
    END ASC NULLS LAST,
    CASE 
      WHEN ugs.game_type NOT IN ('memory', 'wordsearch', 'matching') THEN ugs.score
      ELSE NULL
    END DESC NULLS LAST,
    ugs.completed_at ASC
  LIMIT limit_count;
END;
$$;