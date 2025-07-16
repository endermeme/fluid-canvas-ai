
-- Kiểm tra và thêm foreign key constraints chỉ khi chưa tồn tại

-- Thêm constraint cho game_participants nếu chưa có
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'game_participants_game_id_fkey'
    ) THEN
        ALTER TABLE public.game_participants 
        ADD CONSTRAINT game_participants_game_id_fkey 
        FOREIGN KEY (game_id) REFERENCES public.games(id) ON DELETE CASCADE;
    END IF;
END $$;

-- Thêm constraint cho game_scores nếu chưa có
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'game_scores_game_id_fkey'
    ) THEN
        ALTER TABLE public.game_scores 
        ADD CONSTRAINT game_scores_game_id_fkey 
        FOREIGN KEY (game_id) REFERENCES public.games(id) ON DELETE CASCADE;
    END IF;
END $$;

-- Thêm constraint cho shared_games nếu chưa có
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'shared_games_game_id_fkey'
    ) THEN
        ALTER TABLE public.shared_games 
        ADD CONSTRAINT shared_games_game_id_fkey 
        FOREIGN KEY (game_id) REFERENCES public.games(id) ON DELETE CASCADE;
    END IF;
END $$;

-- Thêm constraint cho game_attempts nếu chưa có
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'game_attempts_game_id_fkey'
    ) THEN
        ALTER TABLE public.game_attempts 
        ADD CONSTRAINT game_attempts_game_id_fkey 
        FOREIGN KEY (game_id) REFERENCES public.educational_games(id) ON DELETE CASCADE;
    END IF;
END $$;

-- Thêm constraint cho questions nếu chưa có
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'questions_quiz_id_fkey'
    ) THEN
        ALTER TABLE public.questions 
        ADD CONSTRAINT questions_quiz_id_fkey 
        FOREIGN KEY (quiz_id) REFERENCES public.quizzes(id) ON DELETE CASCADE;
    END IF;
END $$;

-- Thêm constraint cho question_options nếu chưa có
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'question_options_question_id_fkey'
    ) THEN
        ALTER TABLE public.question_options 
        ADD CONSTRAINT question_options_question_id_fkey 
        FOREIGN KEY (question_id) REFERENCES public.questions(id) ON DELETE CASCADE;
    END IF;
END $$;

-- Thêm constraint cho quiz_attempts nếu chưa có
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'quiz_attempts_quiz_id_fkey'
    ) THEN
        ALTER TABLE public.quiz_attempts 
        ADD CONSTRAINT quiz_attempts_quiz_id_fkey 
        FOREIGN KEY (quiz_id) REFERENCES public.quizzes(id) ON DELETE CASCADE;
    END IF;
END $$;

-- Thêm constraints cho user_answers nếu chưa có
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'user_answers_attempt_id_fkey'
    ) THEN
        ALTER TABLE public.user_answers 
        ADD CONSTRAINT user_answers_attempt_id_fkey 
        FOREIGN KEY (attempt_id) REFERENCES public.quiz_attempts(id) ON DELETE CASCADE;
    END IF;
    
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'user_answers_question_id_fkey'
    ) THEN
        ALTER TABLE public.user_answers 
        ADD CONSTRAINT user_answers_question_id_fkey 
        FOREIGN KEY (question_id) REFERENCES public.questions(id) ON DELETE CASCADE;
    END IF;
    
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'user_answers_selected_option_id_fkey'
    ) THEN
        ALTER TABLE public.user_answers 
        ADD CONSTRAINT user_answers_selected_option_id_fkey 
        FOREIGN KEY (selected_option_id) REFERENCES public.question_options(id) ON DELETE SET NULL;
    END IF;
END $$;

-- Thêm unique constraint cho share_code nếu chưa có
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'shared_games_share_code_unique'
    ) THEN
        ALTER TABLE public.shared_games 
        ADD CONSTRAINT shared_games_share_code_unique UNIQUE (share_code);
    END IF;
END $$;

-- Thêm index nếu chưa có
CREATE INDEX IF NOT EXISTS idx_games_game_type ON public.games(game_type);
CREATE INDEX IF NOT EXISTS idx_games_expires_at ON public.games(expires_at);
CREATE INDEX IF NOT EXISTS idx_games_is_published ON public.games(is_published);
CREATE INDEX IF NOT EXISTS idx_game_participants_game_id ON public.game_participants(game_id);
CREATE INDEX IF NOT EXISTS idx_game_scores_game_id ON public.game_scores(game_id);
CREATE INDEX IF NOT EXISTS idx_custom_games_game_id ON public.custom_games(game_id);

-- Tạo triggers cho updated_at
CREATE OR REPLACE TRIGGER update_custom_games_updated_at
    BEFORE UPDATE ON public.custom_games
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

CREATE OR REPLACE TRIGGER update_quizzes_updated_at
    BEFORE UPDATE ON public.quizzes
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

CREATE OR REPLACE TRIGGER update_educational_games_updated_at
    BEFORE UPDATE ON public.educational_games
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

CREATE OR REPLACE TRIGGER update_profiles_updated_at
    BEFORE UPDATE ON public.profiles
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();
