-- PHASE 2: Database Optimization - Tối ưu custom_games và preset_games tables

-- Step 1: Add settings_data JSONB column to custom_games
ALTER TABLE public.custom_games 
ADD COLUMN settings_data JSONB DEFAULT '{}'::jsonb;

-- Step 2: Add settings_data JSONB column to preset_games  
ALTER TABLE public.preset_games
ADD COLUMN settings_data JSONB DEFAULT '{}'::jsonb;

-- Step 3: Migrate existing settings data to settings_data JSONB for custom_games
UPDATE public.custom_games 
SET settings_data = jsonb_build_object(
  'maxParticipants', max_participants,
  'showLeaderboard', show_leaderboard,
  'requireRegistration', require_registration,
  'customDuration', custom_duration,
  'password', password
) WHERE settings_data = '{}'::jsonb;

-- Step 4: Migrate existing settings data to settings_data JSONB for preset_games
UPDATE public.preset_games
SET settings_data = jsonb_build_object(
  'maxParticipants', max_participants,
  'showLeaderboard', show_leaderboard,
  'requireRegistration', require_registration,
  'customDuration', custom_duration,
  'singleParticipationOnly', single_participation_only,
  'password', password
) WHERE settings_data = '{}'::jsonb;

-- Step 5: Drop old setting columns from custom_games
ALTER TABLE public.custom_games 
DROP COLUMN max_participants,
DROP COLUMN show_leaderboard,
DROP COLUMN require_registration,
DROP COLUMN custom_duration,
DROP COLUMN password;

-- Step 6: Drop old setting columns from preset_games
ALTER TABLE public.preset_games
DROP COLUMN max_participants,
DROP COLUMN show_leaderboard,
DROP COLUMN require_registration,
DROP COLUMN custom_duration,
DROP COLUMN single_participation_only,
DROP COLUMN password;