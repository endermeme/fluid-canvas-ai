-- Optimize leaderboard queries with proper indexes for custom and preset games
-- Add indexes for better performance

-- Custom leaderboard optimizations
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_custom_leaderboard_game_score 
ON custom_leaderboard(game_id, score DESC) 
WHERE score IS NOT NULL;

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_custom_leaderboard_realtime 
ON custom_leaderboard(game_id, last_active_at DESC);

-- Preset leaderboard optimizations  
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_preset_leaderboard_game_score 
ON preset_leaderboard(game_id, score DESC) 
WHERE score IS NOT NULL;

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_preset_leaderboard_game_time 
ON preset_leaderboard(game_id, completion_time ASC) 
WHERE completion_time IS NOT NULL;

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_preset_leaderboard_realtime 
ON preset_leaderboard(game_id, last_active_at DESC);

-- Game table optimizations
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_custom_games_published_active 
ON custom_games(is_published, expires_at) 
WHERE is_published = true AND expires_at > now();

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_preset_games_published_active 
ON preset_games(is_published, is_active, expires_at) 
WHERE is_published = true AND is_active = true AND expires_at > now();