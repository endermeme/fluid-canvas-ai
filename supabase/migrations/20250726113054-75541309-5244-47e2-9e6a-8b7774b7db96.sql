-- Migration từng phần - Bước 2: Thêm các cột sharing và management
ALTER TABLE public.custom_games ADD COLUMN is_published BOOLEAN DEFAULT false;
ALTER TABLE public.custom_games ADD COLUMN max_participants INTEGER;
ALTER TABLE public.custom_games ADD COLUMN show_leaderboard BOOLEAN DEFAULT true;
ALTER TABLE public.custom_games ADD COLUMN require_registration BOOLEAN DEFAULT false;
ALTER TABLE public.custom_games ADD COLUMN custom_duration INTEGER;
ALTER TABLE public.custom_games ADD COLUMN expires_at TIMESTAMP WITH TIME ZONE DEFAULT (now() + '48:00:00'::interval);
ALTER TABLE public.custom_games ADD COLUMN share_count INTEGER DEFAULT 0;
ALTER TABLE public.custom_games ADD COLUMN last_accessed_at TIMESTAMP WITH TIME ZONE;
ALTER TABLE public.custom_games ADD COLUMN creator_ip TEXT;
ALTER TABLE public.custom_games ADD COLUMN account_id TEXT;
ALTER TABLE public.custom_games ADD COLUMN password TEXT;