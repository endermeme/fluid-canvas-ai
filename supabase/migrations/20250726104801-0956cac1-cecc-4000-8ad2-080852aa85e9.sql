-- BƯỚC 6 SỬA LẠI: Migration dữ liệu từ custom_game_instances vào custom_games
INSERT INTO public.custom_games (
  id, title, description, html_content, game_data, settings,
  is_published, max_participants, show_leaderboard, require_registration,
  custom_duration, expires_at, share_count, last_accessed_at,
  creator_ip, account_id, password, created_at, updated_at
)
SELECT 
  cgi.id, cgi.title, cgi.description, cgi.html_content,
  COALESCE(cg.game_data, '{}'::jsonb) as game_data, 
  COALESCE(cg.settings, '{}'::jsonb) as settings,
  cgi.is_published, cgi.max_participants, cgi.show_leaderboard, cgi.require_registration,
  cgi.custom_duration, cgi.expires_at, cgi.share_count, cgi.last_accessed_at,
  cgi.creator_ip, cgi.account_id, cgi.password, cgi.created_at, cgi.updated_at
FROM public.custom_game_instances cgi
LEFT JOIN public.custom_games cg ON cg.id = cgi.custom_game_id
WHERE NOT EXISTS (SELECT 1 FROM public.custom_games cg2 WHERE cg2.id = cgi.id)
ON CONFLICT (id) DO NOTHING;