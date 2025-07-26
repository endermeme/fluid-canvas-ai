-- Drop functions cũ trước khi tạo lại
DROP FUNCTION IF EXISTS public.update_preset_participant_activity(uuid, text);
DROP FUNCTION IF EXISTS public.update_custom_participant_activity(uuid, text);

-- Functions để cập nhật participant activity với tên parameter mới
CREATE OR REPLACE FUNCTION public.update_preset_participant_activity(target_game_id uuid, target_player_name text)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
  UPDATE public.preset_leaderboard 
  SET 
    last_active_at = now(),
    is_active = true
  WHERE game_id = target_game_id 
    AND player_name = target_player_name;
    
  -- If no participant found, insert new one
  IF NOT FOUND THEN
    INSERT INTO public.preset_leaderboard (
      game_id, 
      player_name, 
      ip_address
    ) VALUES (
      target_game_id, 
      target_player_name, 
      'dynamic-ip'
    );
  END IF;
END;
$function$;

CREATE OR REPLACE FUNCTION public.update_custom_participant_activity(target_game_id uuid, target_player_name text)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
  UPDATE public.custom_leaderboard 
  SET 
    last_active_at = now(),
    is_active = true
  WHERE game_id = target_game_id 
    AND player_name = target_player_name;
    
  -- If no participant found, insert new one
  IF NOT FOUND THEN
    INSERT INTO public.custom_leaderboard (
      game_id, 
      player_name, 
      ip_address
    ) VALUES (
      target_game_id, 
      target_player_name, 
      'dynamic-ip'
    );
  END IF;
END;
$function$;