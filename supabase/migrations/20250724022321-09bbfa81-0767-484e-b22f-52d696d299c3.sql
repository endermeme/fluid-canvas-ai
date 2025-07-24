-- Remove age-related columns from game_participants table if they exist
-- This will clean up any age fields that may have been added

-- Note: The current schema doesn't show age fields, so this is preventive
-- In case age fields were added in previous iterations, this will remove them

-- Update the addParticipant function will be handled in the code changes