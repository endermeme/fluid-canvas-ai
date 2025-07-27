-- Create accounts table to replace text-based account_id
CREATE TABLE public.accounts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  account_name text NOT NULL UNIQUE,
  created_at timestamp with time zone DEFAULT now() NOT NULL,
  updated_at timestamp with time zone DEFAULT now() NOT NULL,
  is_active boolean DEFAULT true NOT NULL
);

-- Enable RLS on accounts
ALTER TABLE public.accounts ENABLE ROW LEVEL SECURITY;

-- Create policies for accounts
CREATE POLICY "Anyone can view active accounts" 
ON public.accounts 
FOR SELECT 
USING (is_active = true);

CREATE POLICY "Anyone can insert accounts" 
ON public.accounts 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Users can update their own accounts" 
ON public.accounts 
FOR UPDATE 
USING (true);

-- Add trigger for updated_at
CREATE TRIGGER update_accounts_updated_at
BEFORE UPDATE ON public.accounts
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Migrate existing account_id data to accounts table
-- First, insert unique account_ids from custom_games
INSERT INTO public.accounts (account_name)
SELECT DISTINCT account_id 
FROM public.custom_games 
WHERE account_id IS NOT NULL
AND account_id NOT IN (SELECT account_name FROM public.accounts);

-- Insert unique account_ids from preset_games
INSERT INTO public.accounts (account_name)
SELECT DISTINCT account_id 
FROM public.preset_games 
WHERE account_id IS NOT NULL
AND account_id NOT IN (SELECT account_name FROM public.accounts);

-- Add new account_uuid columns to games tables
ALTER TABLE public.custom_games 
ADD COLUMN account_uuid uuid REFERENCES public.accounts(id);

ALTER TABLE public.preset_games 
ADD COLUMN account_uuid uuid REFERENCES public.accounts(id);

-- Update the account_uuid columns with proper references
UPDATE public.custom_games 
SET account_uuid = (
  SELECT id FROM public.accounts 
  WHERE account_name = custom_games.account_id
)
WHERE account_id IS NOT NULL;

UPDATE public.preset_games 
SET account_uuid = (
  SELECT id FROM public.accounts 
  WHERE account_name = preset_games.account_id
)
WHERE account_id IS NOT NULL;

-- Update RLS policies for custom_games to use account_uuid
DROP POLICY IF EXISTS "Users can view their own published custom games" ON public.custom_games;
DROP POLICY IF EXISTS "Users can update their own custom games" ON public.custom_games;
DROP POLICY IF EXISTS "Users can delete their own custom games" ON public.custom_games;

CREATE POLICY "Users can view their own published custom games" 
ON public.custom_games 
FOR SELECT 
USING (account_uuid IS NOT NULL AND is_published = true);

CREATE POLICY "Users can update their own custom games" 
ON public.custom_games 
FOR UPDATE 
USING (account_uuid IS NOT NULL);

CREATE POLICY "Users can delete their own custom games" 
ON public.custom_games 
FOR DELETE 
USING (account_uuid IS NOT NULL);

-- Update RLS policies for preset_games to use account_uuid
DROP POLICY IF EXISTS "Users can update their own preset games" ON public.preset_games;
DROP POLICY IF EXISTS "Users can delete their own preset games" ON public.preset_games;

CREATE POLICY "Users can update their own preset games" 
ON public.preset_games 
FOR UPDATE 
USING (account_uuid IS NOT NULL);

CREATE POLICY "Users can delete their own preset games" 
ON public.preset_games 
FOR DELETE 
USING (account_uuid IS NOT NULL);

-- Create function to get or create account
CREATE OR REPLACE FUNCTION public.get_or_create_account(account_name_param text)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  account_uuid_result uuid;
BEGIN
  -- Try to get existing account
  SELECT id INTO account_uuid_result 
  FROM public.accounts 
  WHERE account_name = account_name_param AND is_active = true;
  
  -- If not found, create new account
  IF account_uuid_result IS NULL THEN
    INSERT INTO public.accounts (account_name)
    VALUES (account_name_param)
    RETURNING id INTO account_uuid_result;
  END IF;
  
  RETURN account_uuid_result;
END;
$$;