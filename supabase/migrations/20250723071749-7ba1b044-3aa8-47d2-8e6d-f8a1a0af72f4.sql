-- Add account_id column to games table
ALTER TABLE public.games 
ADD COLUMN account_id TEXT;

-- Add account_id column to game_participants table  
ALTER TABLE public.game_participants 
ADD COLUMN account_id TEXT;

-- Add account_id column to game_scores table
ALTER TABLE public.game_scores 
ADD COLUMN account_id TEXT;

-- Create indexes for performance
CREATE INDEX idx_games_account_id ON public.games(account_id);
CREATE INDEX idx_game_participants_account_id ON public.game_participants(account_id);  
CREATE INDEX idx_game_scores_account_id ON public.game_scores(account_id);

-- Create validation function for account_id
CREATE OR REPLACE FUNCTION validate_account_id()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.account_id IS NOT NULL AND LENGTH(NEW.account_id) < 10 THEN
    RAISE EXCEPTION 'account_id must be at least 10 characters long';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add validation triggers
CREATE TRIGGER validate_games_account_id
  BEFORE INSERT OR UPDATE ON public.games
  FOR EACH ROW EXECUTE FUNCTION validate_account_id();

CREATE TRIGGER validate_participants_account_id  
  BEFORE INSERT OR UPDATE ON public.game_participants
  FOR EACH ROW EXECUTE FUNCTION validate_account_id();

CREATE TRIGGER validate_scores_account_id
  BEFORE INSERT OR UPDATE ON public.game_scores  
  FOR EACH ROW EXECUTE FUNCTION validate_account_id();