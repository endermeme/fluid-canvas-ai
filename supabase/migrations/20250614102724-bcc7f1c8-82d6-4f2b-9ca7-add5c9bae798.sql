
-- Tạo function để tăng share_count và cập nhật last_accessed_at
CREATE OR REPLACE FUNCTION public.increment_share_count(game_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE public.games 
  SET 
    share_count = COALESCE(share_count, 0) + 1,
    last_accessed_at = now()
  WHERE id = game_id;
END;
$$;
