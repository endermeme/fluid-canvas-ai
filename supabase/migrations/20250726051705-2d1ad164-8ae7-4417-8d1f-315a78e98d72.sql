-- MIGRATION: Database Schema Cleanup - Fix trigger issue
-- Only create what doesn't exist yet

-- Step 1: Create unified scoring system (if not exists)
CREATE TABLE IF NOT EXISTS public.unified_game_scores (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  game_id UUID NOT NULL,
  source_table TEXT NOT NULL CHECK (source_table IN ('games', 'educational_games', 'quizzes')),
  player_name TEXT NOT NULL,
  player_id UUID NULL,
  score INTEGER NOT NULL DEFAULT 0,
  total_questions INTEGER NOT NULL DEFAULT 0,
  completion_time INTEGER NULL,
  scoring_data JSONB DEFAULT '{}',
  game_type TEXT NOT NULL,
  ip_address TEXT NULL,
  completed_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Step 2: Create game score details (if not exists)
CREATE TABLE IF NOT EXISTS public.game_score_details (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  score_id UUID NOT NULL REFERENCES public.unified_game_scores(id) ON DELETE CASCADE,
  metric_name TEXT NOT NULL,
  metric_value INTEGER NOT NULL,
  metric_data JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Step 3: Enable RLS
ALTER TABLE public.unified_game_scores ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.game_score_details ENABLE ROW LEVEL SECURITY;

-- Step 4: Add missing columns to profiles (avoid duplicates)
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'email') THEN
    ALTER TABLE public.profiles ADD COLUMN email TEXT;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'avatar_url') THEN
    ALTER TABLE public.profiles ADD COLUMN avatar_url TEXT;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'is_verified') THEN
    ALTER TABLE public.profiles ADD COLUMN is_verified BOOLEAN DEFAULT false;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'user_type') THEN
    ALTER TABLE public.profiles ADD COLUMN user_type TEXT DEFAULT 'user';
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'updated_at') THEN
    ALTER TABLE public.profiles ADD COLUMN updated_at TIMESTAMPTZ DEFAULT NOW();
  END IF;
END $$;