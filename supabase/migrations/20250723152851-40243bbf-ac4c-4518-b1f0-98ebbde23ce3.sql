-- Add share settings columns to games table
ALTER TABLE public.games 
ADD COLUMN password TEXT,
ADD COLUMN max_participants INTEGER,
ADD COLUMN show_leaderboard BOOLEAN DEFAULT true,
ADD COLUMN require_registration BOOLEAN DEFAULT false,
ADD COLUMN custom_duration INTEGER;

-- Create index for password lookups
CREATE INDEX idx_games_password ON public.games(password) WHERE password IS NOT NULL;

-- Create validation function for share settings
CREATE OR REPLACE FUNCTION validate_share_settings()
RETURNS TRIGGER AS $$
BEGIN
  -- Validate max_participants range
  IF NEW.max_participants IS NOT NULL AND (NEW.max_participants < 5 OR NEW.max_participants > 100) THEN
    RAISE EXCEPTION 'max_participants must be between 5 and 100';
  END IF;
  
  -- Validate custom_duration (in hours)
  IF NEW.custom_duration IS NOT NULL AND (NEW.custom_duration < 1 OR NEW.custom_duration > 168) THEN
    RAISE EXCEPTION 'custom_duration must be between 1 and 168 hours (1 week)';
  END IF;
  
  -- Update expires_at based on custom_duration
  IF NEW.custom_duration IS NOT NULL THEN
    NEW.expires_at = now() + (NEW.custom_duration || ' hours')::interval;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add validation trigger
CREATE TRIGGER validate_share_settings_trigger
  BEFORE INSERT OR UPDATE ON public.games
  FOR EACH ROW EXECUTE FUNCTION validate_share_settings();