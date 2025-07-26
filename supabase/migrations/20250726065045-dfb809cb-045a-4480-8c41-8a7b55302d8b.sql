-- TÁCH ĐÔI HỆ THỐNG GAME - PRESET VÀ CUSTOM
-- PHẦN 1: TẠO BẢNG CHO PRESET GAMES

-- 1.1 Bảng preset_games - Lưu template games (quiz, flashcard, memory, etc.)
CREATE TABLE public.preset_games (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  game_type TEXT NOT NULL, -- 'quiz', 'flashcard', 'memory', 'matching', etc.
  template_data JSONB NOT NULL DEFAULT '{}', -- Template structure
  default_settings JSONB DEFAULT '{}', -- Default game settings
  description TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- 1.2 Bảng preset_game_instances - Instances được tạo từ template
CREATE TABLE public.preset_game_instances (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  preset_game_id UUID NOT NULL REFERENCES public.preset_games(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  game_data JSONB NOT NULL DEFAULT '{}', -- Generated game content
  settings JSONB DEFAULT '{}', -- Custom settings for this instance
  is_published BOOLEAN DEFAULT false,
  creator_ip TEXT,
  account_id TEXT,
  password TEXT,
  max_participants INTEGER,
  show_leaderboard BOOLEAN DEFAULT true,
  require_registration BOOLEAN DEFAULT false,
  custom_duration INTEGER, -- hours
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT (now() + '48:00:00'::interval),
  share_count INTEGER DEFAULT 0,
  last_accessed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- 1.3 Bảng preset_game_scores - Điểm số cho preset games
CREATE TABLE public.preset_game_scores (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  game_instance_id UUID NOT NULL REFERENCES public.preset_game_instances(id) ON DELETE CASCADE,
  player_name TEXT NOT NULL,
  player_id UUID,
  score INTEGER NOT NULL DEFAULT 0,
  total_questions INTEGER NOT NULL DEFAULT 0,
  completion_time INTEGER, -- seconds
  scoring_data JSONB DEFAULT '{}',
  ip_address TEXT,
  completed_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- 1.4 Bảng preset_game_participants - Người chơi preset games (real-time tracking)
CREATE TABLE public.preset_game_participants (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  game_instance_id UUID NOT NULL REFERENCES public.preset_game_instances(id) ON DELETE CASCADE,
  player_name TEXT NOT NULL,
  ip_address TEXT,
  joined_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  last_active_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  is_active BOOLEAN DEFAULT true,
  session_data JSONB DEFAULT '{}'
);

-- PHẦN 2: BẢNG CHO CUSTOM GAMES (Cải thiện existing structure)

-- 2.1 Bảng custom_game_instances - Instances của custom games
CREATE TABLE public.custom_game_instances (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  custom_game_id UUID NOT NULL REFERENCES public.custom_games(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  html_content TEXT NOT NULL,
  description TEXT,
  is_published BOOLEAN DEFAULT false,
  creator_ip TEXT,
  account_id TEXT,
  password TEXT,
  max_participants INTEGER,
  show_leaderboard BOOLEAN DEFAULT true,
  require_registration BOOLEAN DEFAULT false,
  custom_duration INTEGER, -- hours
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT (now() + '48:00:00'::interval),
  share_count INTEGER DEFAULT 0,
  last_accessed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- 2.2 Bảng custom_game_scores - Điểm số cho custom games
CREATE TABLE public.custom_game_scores (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  game_instance_id UUID NOT NULL REFERENCES public.custom_game_instances(id) ON DELETE CASCADE,
  player_name TEXT NOT NULL,
  player_id UUID,
  score INTEGER NOT NULL DEFAULT 0,
  total_questions INTEGER NOT NULL DEFAULT 0,
  completion_time INTEGER, -- seconds
  scoring_data JSONB DEFAULT '{}',
  ip_address TEXT,
  completed_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- 2.3 Bảng custom_game_participants - Người chơi custom games
CREATE TABLE public.custom_game_participants (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  game_instance_id UUID NOT NULL REFERENCES public.custom_game_instances(id) ON DELETE CASCADE,
  player_name TEXT NOT NULL,
  ip_address TEXT,
  joined_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  last_active_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  is_active BOOLEAN DEFAULT true,
  session_data JSONB DEFAULT '{}'
);

-- PHẦN 3: ENABLE RLS CHO TẤT CẢ BẢNG MỚI

-- Enable RLS for preset game tables
ALTER TABLE public.preset_games ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.preset_game_instances ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.preset_game_scores ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.preset_game_participants ENABLE ROW LEVEL SECURITY;

-- Enable RLS for custom game tables
ALTER TABLE public.custom_game_instances ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.custom_game_scores ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.custom_game_participants ENABLE ROW LEVEL SECURITY;

-- PHẦN 4: TẠO RLS POLICIES CHO PRESET GAMES

-- Preset games templates - public read
CREATE POLICY "Anyone can view preset game templates" 
ON public.preset_games 
FOR SELECT 
USING (is_active = true);

-- Preset game instances - public read for published games
CREATE POLICY "Anyone can view published preset game instances" 
ON public.preset_game_instances 
FOR SELECT 
USING (is_published = true AND expires_at > now());

-- Creators can manage their preset game instances
CREATE POLICY "Creators can manage preset game instances" 
ON public.preset_game_instances 
FOR ALL 
USING (creator_ip = ((current_setting('request.headers'))::json ->> 'x-real-ip'));

-- Anyone can insert preset game instances
CREATE POLICY "Anyone can create preset game instances" 
ON public.preset_game_instances 
FOR INSERT 
WITH CHECK (true);

-- Preset game scores - anyone can insert for published games
CREATE POLICY "Anyone can insert preset game scores" 
ON public.preset_game_scores 
FOR INSERT 
WITH CHECK (EXISTS (
  SELECT 1 FROM public.preset_game_instances 
  WHERE id = preset_game_scores.game_instance_id 
  AND is_published = true 
  AND expires_at > now()
));

-- Anyone can view preset game scores for published games
CREATE POLICY "Anyone can view preset game scores" 
ON public.preset_game_scores 
FOR SELECT 
USING (EXISTS (
  SELECT 1 FROM public.preset_game_instances 
  WHERE id = preset_game_scores.game_instance_id 
  AND is_published = true 
  AND expires_at > now()
));

-- Preset game participants - anyone can insert/view for published games
CREATE POLICY "Anyone can join preset games" 
ON public.preset_game_participants 
FOR INSERT 
WITH CHECK (EXISTS (
  SELECT 1 FROM public.preset_game_instances 
  WHERE id = preset_game_participants.game_instance_id 
  AND is_published = true 
  AND expires_at > now()
));

CREATE POLICY "Anyone can view preset game participants" 
ON public.preset_game_participants 
FOR SELECT 
USING (EXISTS (
  SELECT 1 FROM public.preset_game_instances 
  WHERE id = preset_game_participants.game_instance_id 
  AND is_published = true 
  AND expires_at > now()
));

-- PHẦN 5: TẠO RLS POLICIES CHO CUSTOM GAMES

-- Custom game instances - public read for published games  
CREATE POLICY "Anyone can view published custom game instances" 
ON public.custom_game_instances 
FOR SELECT 
USING (is_published = true AND expires_at > now());

-- Creators can manage their custom game instances
CREATE POLICY "Creators can manage custom game instances" 
ON public.custom_game_instances 
FOR ALL 
USING (creator_ip = ((current_setting('request.headers'))::json ->> 'x-real-ip'));

-- Anyone can insert custom game instances
CREATE POLICY "Anyone can create custom game instances" 
ON public.custom_game_instances 
FOR INSERT 
WITH CHECK (true);

-- Custom game scores - anyone can insert for published games
CREATE POLICY "Anyone can insert custom game scores" 
ON public.custom_game_scores 
FOR INSERT 
WITH CHECK (EXISTS (
  SELECT 1 FROM public.custom_game_instances 
  WHERE id = custom_game_scores.game_instance_id 
  AND is_published = true 
  AND expires_at > now()
));

-- Anyone can view custom game scores for published games
CREATE POLICY "Anyone can view custom game scores" 
ON public.custom_game_scores 
FOR SELECT 
USING (EXISTS (
  SELECT 1 FROM public.custom_game_instances 
  WHERE id = custom_game_scores.game_instance_id 
  AND is_published = true 
  AND expires_at > now()
));

-- Custom game participants - anyone can insert/view for published games
CREATE POLICY "Anyone can join custom games" 
ON public.custom_game_participants 
FOR INSERT 
WITH CHECK (EXISTS (
  SELECT 1 FROM public.custom_game_instances 
  WHERE id = custom_game_participants.game_instance_id 
  AND is_published = true 
  AND expires_at > now()
));

CREATE POLICY "Anyone can view custom game participants" 
ON public.custom_game_participants 
FOR SELECT 
USING (EXISTS (
  SELECT 1 FROM public.custom_game_instances 
  WHERE id = custom_game_participants.game_instance_id 
  AND is_published = true 
  AND expires_at > now()
));

-- PHẦN 6: TẠO TRIGGERS CHO AUTO UPDATE timestamps

-- Trigger for preset_games
CREATE TRIGGER update_preset_games_updated_at
BEFORE UPDATE ON public.preset_games
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Trigger for preset_game_instances
CREATE TRIGGER update_preset_game_instances_updated_at
BEFORE UPDATE ON public.preset_game_instances
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Trigger for custom_game_instances
CREATE TRIGGER update_custom_game_instances_updated_at
BEFORE UPDATE ON public.custom_game_instances
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Trigger for share settings validation on preset_game_instances
CREATE TRIGGER validate_preset_game_settings
BEFORE INSERT OR UPDATE ON public.preset_game_instances
FOR EACH ROW
EXECUTE FUNCTION public.validate_share_settings();

-- Trigger for share settings validation on custom_game_instances
CREATE TRIGGER validate_custom_game_settings
BEFORE INSERT OR UPDATE ON public.custom_game_instances
FOR EACH ROW
EXECUTE FUNCTION public.validate_share_settings();

-- PHẦN 7: TẠO INDEXES CHO PERFORMANCE

-- Indexes for preset games
CREATE INDEX idx_preset_game_instances_published ON public.preset_game_instances(is_published, expires_at);
CREATE INDEX idx_preset_game_instances_creator ON public.preset_game_instances(creator_ip);
CREATE INDEX idx_preset_game_instances_account ON public.preset_game_instances(account_id);
CREATE INDEX idx_preset_game_scores_instance ON public.preset_game_scores(game_instance_id);
CREATE INDEX idx_preset_game_participants_instance ON public.preset_game_participants(game_instance_id);

-- Indexes for custom games
CREATE INDEX idx_custom_game_instances_published ON public.custom_game_instances(is_published, expires_at);
CREATE INDEX idx_custom_game_instances_creator ON public.custom_game_instances(creator_ip);
CREATE INDEX idx_custom_game_instances_account ON public.custom_game_instances(account_id);
CREATE INDEX idx_custom_game_scores_instance ON public.custom_game_scores(game_instance_id);
CREATE INDEX idx_custom_game_participants_instance ON public.custom_game_participants(game_instance_id);