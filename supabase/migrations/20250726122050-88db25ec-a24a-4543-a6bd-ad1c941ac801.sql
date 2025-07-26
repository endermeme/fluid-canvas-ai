-- Create preset_leaderboard table
CREATE TABLE public.preset_leaderboard (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  game_id UUID NOT NULL REFERENCES public.preset_games(id) ON DELETE CASCADE,
  player_name TEXT NOT NULL,
  score INTEGER,
  total_questions INTEGER,
  completion_time INTEGER,
  scoring_data JSONB DEFAULT '{}'::jsonb,
  completed_at TIMESTAMP WITH TIME ZONE,
  joined_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  last_active_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  is_active BOOLEAN DEFAULT true,
  ip_address TEXT,
  session_data JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create custom_leaderboard table
CREATE TABLE public.custom_leaderboard (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  game_id UUID NOT NULL REFERENCES public.custom_games(id) ON DELETE CASCADE,
  player_name TEXT NOT NULL,
  score INTEGER,
  total_questions INTEGER,
  completion_time INTEGER,
  scoring_data JSONB DEFAULT '{}'::jsonb,
  completed_at TIMESTAMP WITH TIME ZONE,
  joined_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  last_active_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  is_active BOOLEAN DEFAULT true,
  ip_address TEXT,
  session_data JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on both tables
ALTER TABLE public.preset_leaderboard ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.custom_leaderboard ENABLE ROW LEVEL SECURITY;

-- RLS policies for preset_leaderboard
CREATE POLICY "Anyone can view preset leaderboard entries" 
ON public.preset_leaderboard 
FOR SELECT 
USING (true);

CREATE POLICY "Anyone can insert preset leaderboard entries" 
ON public.preset_leaderboard 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Anyone can update their own preset leaderboard entries" 
ON public.preset_leaderboard 
FOR UPDATE 
USING (true);

-- RLS policies for custom_leaderboard
CREATE POLICY "Anyone can view custom leaderboard entries" 
ON public.custom_leaderboard 
FOR SELECT 
USING (true);

CREATE POLICY "Anyone can insert custom leaderboard entries" 
ON public.custom_leaderboard 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Anyone can update their own custom leaderboard entries" 
ON public.custom_leaderboard 
FOR UPDATE 
USING (true);

-- Add triggers for updated_at
CREATE TRIGGER update_preset_leaderboard_updated_at
BEFORE UPDATE ON public.preset_leaderboard
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_custom_leaderboard_updated_at
BEFORE UPDATE ON public.custom_leaderboard
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Add indexes for performance
CREATE INDEX idx_preset_leaderboard_game_id ON public.preset_leaderboard(game_id);
CREATE INDEX idx_preset_leaderboard_player_name ON public.preset_leaderboard(player_name);
CREATE INDEX idx_preset_leaderboard_score ON public.preset_leaderboard(score DESC);
CREATE INDEX idx_preset_leaderboard_completion_time ON public.preset_leaderboard(completion_time ASC);

CREATE INDEX idx_custom_leaderboard_game_id ON public.custom_leaderboard(game_id);
CREATE INDEX idx_custom_leaderboard_player_name ON public.custom_leaderboard(player_name);
CREATE INDEX idx_custom_leaderboard_score ON public.custom_leaderboard(score DESC);
CREATE INDEX idx_custom_leaderboard_completion_time ON public.custom_leaderboard(completion_time ASC);