-- CLEANUP: Remove unused database tables and consolidate schema
-- Phase 1: Drop unused tables that are completely not referenced in code

-- 1. Drop products ecosystem (không sử dụng)
DROP TABLE IF EXISTS public.products CASCADE;
DROP TABLE IF EXISTS public.categories CASCADE;
DROP TABLE IF EXISTS public.subcategories CASCADE;

-- 2. Drop quiz system (không sử dụng, thay bằng unified system)
DROP TABLE IF EXISTS public.user_answers CASCADE;
DROP TABLE IF EXISTS public.question_options CASCADE;
DROP TABLE IF EXISTS public.questions CASCADE;
DROP TABLE IF EXISTS public.quiz_attempts CASCADE;
DROP TABLE IF EXISTS public.quizzes CASCADE;

-- 3. Drop educational games system (không sử dụng)
DROP TABLE IF EXISTS public.game_attempts CASCADE;
DROP TABLE IF EXISTS public.educational_games CASCADE;

-- 4. Drop unused utility tables
DROP TABLE IF EXISTS public.game_templates CASCADE;
DROP TABLE IF EXISTS public.shared_games CASCADE;
DROP TABLE IF EXISTS public.visitor_logs CASCADE;

-- 5. Drop accounts table (duplicate with profiles)
DROP TABLE IF EXISTS public.accounts CASCADE;

-- 6. Clean up old game_scores (replaced by unified_game_scores)
-- First backup any existing data
INSERT INTO public.unified_game_scores (
  game_id, source_table, player_name, score, total_questions, 
  completion_time, game_type, ip_address, completed_at
)
SELECT 
  game_id, 'games', player_name, score, total_questions,
  completion_time, game_type, ip_address, completed_at
FROM public.game_scores
WHERE NOT EXISTS (
  SELECT 1 FROM public.unified_game_scores 
  WHERE unified_game_scores.game_id = game_scores.game_id 
  AND unified_game_scores.player_name = game_scores.player_name
  AND unified_game_scores.completed_at = game_scores.completed_at
);

-- Drop old game_scores table
DROP TABLE IF EXISTS public.game_scores CASCADE;

-- 7. Clean up old game_participants (use unified system)
INSERT INTO public.unified_game_scores (
  game_id, source_table, player_name, score, total_questions, 
  completion_time, game_type, ip_address, completed_at, created_at
)
SELECT 
  game_id, 'games', name, COALESCE(score, 0), COALESCE(total_questions, 0),
  completion_time, 'shared', ip_address, timestamp, timestamp
FROM public.game_participants
WHERE NOT EXISTS (
  SELECT 1 FROM public.unified_game_scores 
  WHERE unified_game_scores.game_id = game_participants.game_id 
  AND unified_game_scores.player_name = game_participants.name
  AND unified_game_scores.completed_at = game_participants.timestamp
);

-- Drop old game_participants table
DROP TABLE IF EXISTS public.game_participants CASCADE;