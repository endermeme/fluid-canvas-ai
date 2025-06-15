
-- Tạo bảng để lưu điểm số của người chơi trong các game shared
CREATE TABLE IF NOT EXISTS public.game_scores (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  game_id uuid REFERENCES public.games(id) ON DELETE CASCADE,
  player_name text NOT NULL,
  score integer NOT NULL DEFAULT 0,
  total_questions integer NOT NULL DEFAULT 0,
  completion_time integer, -- thời gian hoàn thành tính bằng giây
  completed_at timestamp with time zone NOT NULL DEFAULT now(),
  ip_address text,
  game_type text NOT NULL DEFAULT 'quiz'
);

-- Thêm index để tăng hiệu suất truy vấn
CREATE INDEX IF NOT EXISTS idx_game_scores_game_id ON public.game_scores (game_id);
CREATE INDEX IF NOT EXISTS idx_game_scores_completed_at ON public.game_scores (completed_at);

-- Thêm RLS cho bảng game_scores
ALTER TABLE public.game_scores ENABLE ROW LEVEL SECURITY;

-- Policy cho phép mọi người xem điểm của game đã được chia sẻ
CREATE POLICY "Anyone can view scores for shared games" 
  ON public.game_scores 
  FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM public.games 
      WHERE games.id = game_scores.game_id 
      AND games.is_published = true 
      AND games.expires_at > now()
    )
  );

-- Policy cho phép mọi người thêm điểm số mới
CREATE POLICY "Anyone can insert game scores" 
  ON public.game_scores 
  FOR INSERT 
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.games 
      WHERE games.id = game_scores.game_id 
      AND games.is_published = true 
      AND games.expires_at > now()
    )
  );

-- Thêm cột score vào bảng game_participants nếu chưa có
ALTER TABLE public.game_participants 
ADD COLUMN IF NOT EXISTS score integer DEFAULT 0,
ADD COLUMN IF NOT EXISTS total_questions integer DEFAULT 0,
ADD COLUMN IF NOT EXISTS completion_time integer;

-- Tạo function để lấy top scores cho một game
CREATE OR REPLACE FUNCTION public.get_game_leaderboard(target_game_id uuid, limit_count integer DEFAULT 10)
RETURNS TABLE (
  player_name text,
  score integer,
  total_questions integer,
  completion_time integer,
  completed_at timestamp with time zone
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    gs.player_name,
    gs.score,
    gs.total_questions,
    gs.completion_time,
    gs.completed_at
  FROM public.game_scores gs
  JOIN public.games g ON g.id = gs.game_id
  WHERE gs.game_id = target_game_id 
    AND g.is_published = true 
    AND g.expires_at > now()
  ORDER BY 
    gs.score DESC, 
    gs.completion_time ASC NULLS LAST,
    gs.completed_at ASC
  LIMIT limit_count;
END;
$$;
