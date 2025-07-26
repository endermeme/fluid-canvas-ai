-- MIGRATION: Database Schema Cleanup and Consolidation
-- Fixing scoring system confusion and other schema issues

-- Step 1: Create unified scoring system
CREATE TABLE IF NOT EXISTS public.unified_game_scores (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  game_id UUID NOT NULL,
  source_table TEXT NOT NULL CHECK (source_table IN ('games', 'educational_games', 'quizzes')),
  player_name TEXT NOT NULL,
  player_id UUID NULL, -- optional link to profiles
  score INTEGER NOT NULL DEFAULT 0,
  total_questions INTEGER NOT NULL DEFAULT 0,
  completion_time INTEGER NULL, -- in seconds
  scoring_data JSONB DEFAULT '{}', -- flexible metrics: moves, hints, words_found, etc
  game_type TEXT NOT NULL,
  ip_address TEXT NULL,
  completed_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Step 2: Create game score details for complex metrics
CREATE TABLE IF NOT EXISTS public.game_score_details (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  score_id UUID NOT NULL REFERENCES public.unified_game_scores(id) ON DELETE CASCADE,
  metric_name TEXT NOT NULL, -- 'moves', 'hints', 'words_found', 'levels_completed'
  metric_value INTEGER NOT NULL,
  metric_data JSONB DEFAULT '{}', -- additional context
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Step 3: Enable RLS on new tables
ALTER TABLE public.unified_game_scores ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.game_score_details ENABLE ROW LEVEL SECURITY;

-- Step 4: Create policies for unified_game_scores
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

-- Step 5: Create policies for game_score_details
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

-- Step 6: Create updated leaderboard function
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
      -- Time-based games: sort by completion_time ASC (faster first)
      WHEN ugs.game_type IN ('memory', 'wordsearch', 'matching') THEN ugs.completion_time
      ELSE NULL
    END ASC NULLS LAST,
    CASE 
      -- Score-based games: sort by score DESC (higher score first)
      WHEN ugs.game_type NOT IN ('memory', 'wordsearch', 'matching') THEN ugs.score
      ELSE NULL
    END DESC NULLS LAST,
    ugs.completed_at ASC
  LIMIT limit_count;
END;
$$;

-- Step 7: Fix accounts vs profiles duplication
-- Keep profiles as main user table, accounts seems redundant
-- Add missing columns to profiles if needed
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS email TEXT,
ADD COLUMN IF NOT EXISTS avatar_url TEXT,
ADD COLUMN IF NOT EXISTS is_verified BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS user_type TEXT DEFAULT 'user';

-- Step 8: Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_unified_game_scores_game_source ON public.unified_game_scores(game_id, source_table);
CREATE INDEX IF NOT EXISTS idx_unified_game_scores_completed_at ON public.unified_game_scores(completed_at);
CREATE INDEX IF NOT EXISTS idx_unified_game_scores_game_type ON public.unified_game_scores(game_type);
CREATE INDEX IF NOT EXISTS idx_game_score_details_score_id ON public.game_score_details(score_id);

-- Step 9: Add triggers for updated_at
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add updated_at to profiles if missing
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();

CREATE TRIGGER update_profiles_updated_at
    BEFORE UPDATE ON public.profiles
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();