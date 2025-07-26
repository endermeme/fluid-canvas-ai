-- Migration từng phần để tránh lỗi - Bước 1: Thêm cột cơ bản
ALTER TABLE public.custom_games ADD COLUMN title TEXT;
ALTER TABLE public.custom_games ADD COLUMN description TEXT;
ALTER TABLE public.custom_games ADD COLUMN html_content TEXT;