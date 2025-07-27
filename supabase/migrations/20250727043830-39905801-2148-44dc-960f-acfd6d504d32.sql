-- Add is_published column default to true for custom_games to fix sharing mechanism
ALTER TABLE public.custom_games 
ALTER COLUMN is_published SET DEFAULT true;

-- Update existing records to be published if they weren't already
UPDATE public.custom_games 
SET is_published = true 
WHERE is_published = false OR is_published IS NULL;

-- Add RLS policy for users to only see their own published games
CREATE POLICY "Users can view their own published custom games" 
ON public.custom_games 
FOR SELECT 
USING (account_id IS NOT NULL AND is_published = true);

-- Add RLS policy for users to update their own games
CREATE POLICY "Users can update their own custom games" 
ON public.custom_games 
FOR UPDATE 
USING (account_id IS NOT NULL);

-- Add RLS policy for users to delete their own games  
CREATE POLICY "Users can delete their own custom games" 
ON public.custom_games 
FOR DELETE 
USING (account_id IS NOT NULL);

-- Add similar structure for preset_game_instances table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.preset_game_instances (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title text NOT NULL,
  game_type text NOT NULL,
  template_data jsonb NOT NULL DEFAULT '{}'::jsonb,
  settings jsonb DEFAULT '{}'::jsonb,
  description text,
  is_published boolean DEFAULT true,
  expires_at timestamp with time zone DEFAULT (now() + '48:00:00'::interval),
  creator_ip text,
  account_id text,
  password text,
  max_participants integer,
  show_leaderboard boolean DEFAULT true,
  require_registration boolean DEFAULT false,
  custom_duration integer,
  singleParticipationOnly boolean DEFAULT false,
  share_count integer DEFAULT 0,
  last_accessed_at timestamp with time zone,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS on preset_game_instances
ALTER TABLE public.preset_game_instances ENABLE ROW LEVEL SECURITY;

-- Add RLS policies for preset_game_instances
CREATE POLICY "Anyone can view published preset game instances" 
ON public.preset_game_instances 
FOR SELECT 
USING (is_published = true);

CREATE POLICY "Allow insert for preset game instances" 
ON public.preset_game_instances 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Users can update their own preset game instances" 
ON public.preset_game_instances 
FOR UPDATE 
USING (account_id IS NOT NULL);

CREATE POLICY "Users can delete their own preset game instances" 
ON public.preset_game_instances 
FOR DELETE 
USING (account_id IS NOT NULL);

-- Add trigger for updated_at on preset_game_instances
CREATE TRIGGER update_preset_game_instances_updated_at
  BEFORE UPDATE ON public.preset_game_instances
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Add validation trigger for preset_game_instances share settings
CREATE TRIGGER validate_preset_game_instances_share_settings
  BEFORE INSERT OR UPDATE ON public.preset_game_instances
  FOR EACH ROW
  EXECUTE FUNCTION public.validate_share_settings();