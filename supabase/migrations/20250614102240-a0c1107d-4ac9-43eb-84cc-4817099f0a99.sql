
-- Thêm các cột mới vào bảng games
ALTER TABLE public.games 
ADD COLUMN IF NOT EXISTS share_count integer DEFAULT 0,
ADD COLUMN IF NOT EXISTS last_accessed_at timestamp with time zone;

-- Tạo index để tăng hiệu suất truy vấn
CREATE INDEX IF NOT EXISTS idx_games_expires_at ON public.games (expires_at);
CREATE INDEX IF NOT EXISTS idx_games_game_type ON public.games (game_type);
CREATE INDEX IF NOT EXISTS idx_games_share_count ON public.games (share_count);

-- Cập nhật Row Level Security cho bảng games
ALTER TABLE public.games ENABLE ROW LEVEL SECURITY;

-- Xóa policy cũ nếu tồn tại và tạo mới
DROP POLICY IF EXISTS "Anyone can view shared games" ON public.games;
DROP POLICY IF EXISTS "Anyone can create games" ON public.games;

-- Policy cho phép mọi người đọc game đã được chia sẻ (không hết hạn)
CREATE POLICY "Anyone can view shared games" 
  ON public.games 
  FOR SELECT 
  USING (expires_at > now() AND is_published = true);

-- Policy cho phép tạo game mới (không cần authentication)
CREATE POLICY "Anyone can create games" 
  ON public.games 
  FOR INSERT 
  WITH CHECK (true);

-- Policy cho phép update game stats (share_count, last_accessed_at)
CREATE POLICY "Anyone can update game stats" 
  ON public.games 
  FOR UPDATE 
  USING (expires_at > now() AND is_published = true)
  WITH CHECK (expires_at > now() AND is_published = true);

-- Tạo bảng cho game template mới (nếu cần)
CREATE TABLE IF NOT EXISTS public.game_templates (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  description text,
  template_data jsonb NOT NULL DEFAULT '{}',
  is_active boolean DEFAULT true,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Policy cho game templates
ALTER TABLE public.game_templates ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can view active templates" ON public.game_templates;

CREATE POLICY "Anyone can view active templates" 
  ON public.game_templates 
  FOR SELECT 
  USING (is_active = true);
