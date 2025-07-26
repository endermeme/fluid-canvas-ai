-- BƯỚC 1: Tạo bảng preset_leaderboard mới (gộp participants + scores)
CREATE TABLE public.preset_leaderboard (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  game_id UUID NOT NULL, -- trỏ tới preset_games
  player_name TEXT NOT NULL,
  ip_address TEXT,
  joined_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  last_active_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  is_active BOOLEAN DEFAULT true,
  session_data JSONB DEFAULT '{}'::jsonb,
  -- Score data (NULL nếu chưa hoàn thành)
  score INTEGER,
  total_questions INTEGER,
  completion_time INTEGER,
  scoring_data JSONB DEFAULT '{}'::jsonb,
  completed_at TIMESTAMP WITH TIME ZONE
);

-- BƯỚC 2: Tạo bảng custom_leaderboard mới (gộp participants + scores)
CREATE TABLE public.custom_leaderboard (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  game_id UUID NOT NULL, -- trỏ tới custom_games
  player_name TEXT NOT NULL,
  ip_address TEXT,
  joined_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  last_active_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  is_active BOOLEAN DEFAULT true,
  session_data JSONB DEFAULT '{}'::jsonb,
  -- Score data (NULL nếu chưa hoàn thành)
  score INTEGER,
  total_questions INTEGER,
  completion_time INTEGER,
  scoring_data JSONB DEFAULT '{}'::jsonb,
  completed_at TIMESTAMP WITH TIME ZONE
);

-- BƯỚC 3: Cập nhật bảng preset_games (gộp với preset_game_instances)
ALTER TABLE public.preset_games ADD COLUMN IF NOT EXISTS is_published BOOLEAN DEFAULT false;
ALTER TABLE public.preset_games ADD COLUMN IF NOT EXISTS max_participants INTEGER;
ALTER TABLE public.preset_games ADD COLUMN IF NOT EXISTS show_leaderboard BOOLEAN DEFAULT true;
ALTER TABLE public.preset_games ADD COLUMN IF NOT EXISTS require_registration BOOLEAN DEFAULT false;
ALTER TABLE public.preset_games ADD COLUMN IF NOT EXISTS custom_duration INTEGER;
ALTER TABLE public.preset_games ADD COLUMN IF NOT EXISTS expires_at TIMESTAMP WITH TIME ZONE DEFAULT (now() + '48:00:00'::interval);
ALTER TABLE public.preset_games ADD COLUMN IF NOT EXISTS share_count INTEGER DEFAULT 0;
ALTER TABLE public.preset_games ADD COLUMN IF NOT EXISTS last_accessed_at TIMESTAMP WITH TIME ZONE;
ALTER TABLE public.preset_games ADD COLUMN IF NOT EXISTS creator_ip TEXT;
ALTER TABLE public.preset_games ADD COLUMN IF NOT EXISTS account_id TEXT;
ALTER TABLE public.preset_games ADD COLUMN IF NOT EXISTS password TEXT;
ALTER TABLE public.preset_games ADD COLUMN IF NOT EXISTS game_data JSONB DEFAULT '{}'::jsonb;
ALTER TABLE public.preset_games ADD COLUMN IF NOT EXISTS settings JSONB DEFAULT '{}'::jsonb;

-- BƯỚC 4: Cập nhật bảng custom_games (gộp với custom_game_instances)
ALTER TABLE public.custom_games ADD COLUMN IF NOT EXISTS is_published BOOLEAN DEFAULT false;
ALTER TABLE public.custom_games ADD COLUMN IF NOT EXISTS max_participants INTEGER;
ALTER TABLE public.custom_games ADD COLUMN IF NOT EXISTS show_leaderboard BOOLEAN DEFAULT true;
ALTER TABLE public.custom_games ADD COLUMN IF NOT EXISTS require_registration BOOLEAN DEFAULT false;
ALTER TABLE public.custom_games ADD COLUMN IF NOT EXISTS custom_duration INTEGER;
ALTER TABLE public.custom_games ADD COLUMN IF NOT EXISTS expires_at TIMESTAMP WITH TIME ZONE DEFAULT (now() + '48:00:00'::interval);
ALTER TABLE public.custom_games ADD COLUMN IF NOT EXISTS share_count INTEGER DEFAULT 0;
ALTER TABLE public.custom_games ADD COLUMN IF NOT EXISTS last_accessed_at TIMESTAMP WITH TIME ZONE;
ALTER TABLE public.custom_games ADD COLUMN IF NOT EXISTS creator_ip TEXT;
ALTER TABLE public.custom_games ADD COLUMN IF NOT EXISTS account_id TEXT;
ALTER TABLE public.custom_games ADD COLUMN IF NOT EXISTS password TEXT;
ALTER TABLE public.custom_games ADD COLUMN IF NOT EXISTS title TEXT;
ALTER TABLE public.custom_games ADD COLUMN IF NOT EXISTS html_content TEXT;
ALTER TABLE public.custom_games ADD COLUMN IF NOT EXISTS description TEXT;

-- BƯỚC 5: Migration dữ liệu từ preset_game_instances vào preset_games
INSERT INTO public.preset_games (
  id, title, game_type, description, template_data, default_settings,
  is_published, max_participants, show_leaderboard, require_registration,
  custom_duration, expires_at, share_count, last_accessed_at,
  creator_ip, account_id, password, game_data, settings, created_at, updated_at
)
SELECT 
  pgi.id, pgi.title, 'preset' as game_type, '' as description,
  pgi.game_data as template_data, pgi.settings as default_settings,
  pgi.is_published, pgi.max_participants, pgi.show_leaderboard, pgi.require_registration,
  pgi.custom_duration, pgi.expires_at, pgi.share_count, pgi.last_accessed_at,
  pgi.creator_ip, pgi.account_id, pgi.password, pgi.game_data, pgi.settings,
  pgi.created_at, pgi.updated_at
FROM public.preset_game_instances pgi
WHERE NOT EXISTS (SELECT 1 FROM public.preset_games pg WHERE pg.id = pgi.id);

-- BƯỚC 6: Migration dữ liệu từ custom_game_instances vào custom_games
INSERT INTO public.custom_games (
  id, title, description, html_content, game_data, settings,
  is_published, max_participants, show_leaderboard, require_registration,
  custom_duration, expires_at, share_count, last_accessed_at,
  creator_ip, account_id, password, created_at, updated_at
)
SELECT 
  cgi.id, cgi.title, cgi.description, cgi.html_content,
  cg.game_data, cgi.settings || cg.settings as settings,
  cgi.is_published, cgi.max_participants, cgi.show_leaderboard, cgi.require_registration,
  cgi.custom_duration, cgi.expires_at, cgi.share_count, cgi.last_accessed_at,
  cgi.creator_ip, cgi.account_id, cgi.password, cgi.created_at, cgi.updated_at
FROM public.custom_game_instances cgi
LEFT JOIN public.custom_games cg ON cg.id = cgi.custom_game_id
WHERE NOT EXISTS (SELECT 1 FROM public.custom_games cg2 WHERE cg2.id = cgi.id);

-- BƯỚC 7: Migration dữ liệu từ preset_game_participants vào preset_leaderboard
INSERT INTO public.preset_leaderboard (
  game_id, player_name, ip_address, joined_at, last_active_at,
  is_active, session_data, score, total_questions, completion_time,
  scoring_data, completed_at
)
SELECT 
  pgp.game_instance_id as game_id, pgp.player_name, pgp.ip_address,
  pgp.joined_at, pgp.last_active_at, pgp.is_active, pgp.session_data,
  pgp.score, pgp.total_questions, pgp.completion_time,
  pgp.scoring_data, pgp.completed_at
FROM public.preset_game_participants pgp;

-- BƯỚC 8: Migration dữ liệu từ custom_game_participants + custom_game_scores vào custom_leaderboard
INSERT INTO public.custom_leaderboard (
  game_id, player_name, ip_address, joined_at, last_active_at,
  is_active, session_data, score, total_questions, completion_time,
  scoring_data, completed_at
)
SELECT 
  cgp.game_instance_id as game_id, cgp.player_name, cgp.ip_address,
  cgp.joined_at, cgp.last_active_at, cgp.is_active, cgp.session_data,
  cgs.score, cgs.total_questions, cgs.completion_time,
  cgs.scoring_data, cgs.completed_at
FROM public.custom_game_participants cgp
LEFT JOIN public.custom_game_scores cgs ON (
  cgs.game_instance_id = cgp.game_instance_id 
  AND cgs.player_name = cgp.player_name
);

-- BƯỚC 9: Enable RLS cho các bảng mới
ALTER TABLE public.preset_leaderboard ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.custom_leaderboard ENABLE ROW LEVEL SECURITY;

-- BƯỚC 10: Tạo RLS policies cho preset_leaderboard
CREATE POLICY "Anyone can join preset games leaderboard" 
ON public.preset_leaderboard FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.preset_games 
    WHERE id = preset_leaderboard.game_id 
    AND is_published = true 
    AND expires_at > now()
  )
);

CREATE POLICY "Anyone can view preset games leaderboard" 
ON public.preset_leaderboard FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.preset_games 
    WHERE id = preset_leaderboard.game_id 
    AND is_published = true 
    AND expires_at > now()
  )
);

CREATE POLICY "Anyone can update preset leaderboard activity" 
ON public.preset_leaderboard FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM public.preset_games 
    WHERE id = preset_leaderboard.game_id 
    AND is_published = true 
    AND expires_at > now()
  )
);

-- BƯỚC 11: Tạo RLS policies cho custom_leaderboard
CREATE POLICY "Anyone can join custom games leaderboard" 
ON public.custom_leaderboard FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.custom_games 
    WHERE id = custom_leaderboard.game_id 
    AND is_published = true 
    AND expires_at > now()
  )
);

CREATE POLICY "Anyone can view custom games leaderboard" 
ON public.custom_leaderboard FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.custom_games 
    WHERE id = custom_leaderboard.game_id 
    AND is_published = true 
    AND expires_at > now()
  )
);

CREATE POLICY "Anyone can update custom leaderboard activity" 
ON public.custom_leaderboard FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM public.custom_games 
    WHERE id = custom_leaderboard.game_id 
    AND is_published = true 
    AND expires_at > now()
  )
);

-- BƯỚC 12: Cập nhật RLS policies cho preset_games
DROP POLICY IF EXISTS "Anyone can view preset game templates" ON public.preset_games;
CREATE POLICY "Anyone can view published preset games" 
ON public.preset_games FOR SELECT
USING ((is_published = true AND expires_at > now()) OR is_active = true);

CREATE POLICY "Anyone can create preset games" 
ON public.preset_games FOR INSERT
WITH CHECK (true);

CREATE POLICY "Creators can manage preset games" 
ON public.preset_games FOR ALL
USING (creator_ip = ((current_setting('request.headers'::text))::json ->> 'x-real-ip'::text));

-- BƯỚC 13: Cập nhật RLS policies cho custom_games  
DROP POLICY IF EXISTS "Allow insert for custom games" ON public.custom_games;
DROP POLICY IF EXISTS "Allow public read access for custom games" ON public.custom_games;

CREATE POLICY "Anyone can view published custom games" 
ON public.custom_games FOR SELECT
USING (is_published = true AND expires_at > now());

CREATE POLICY "Anyone can create custom games" 
ON public.custom_games FOR INSERT
WITH CHECK (true);

CREATE POLICY "Creators can manage custom games" 
ON public.custom_games FOR ALL
USING (creator_ip = ((current_setting('request.headers'::text))::json ->> 'x-real-ip'::text));