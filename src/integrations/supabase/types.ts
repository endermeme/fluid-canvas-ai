export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      accounts: {
        Row: {
          avatar_url: string | null
          created_at: string
          email: string
          full_name: string
          id: string
          is_verified: boolean
          updated_at: string
          user_type: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          email: string
          full_name: string
          id?: string
          is_verified?: boolean
          updated_at?: string
          user_type?: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          email?: string
          full_name?: string
          id?: string
          is_verified?: boolean
          updated_at?: string
          user_type?: string
        }
        Relationships: []
      }
      categories: {
        Row: {
          created_at: string
          description: string | null
          icon: string | null
          id: number
          is_active: boolean
          name: string
          slug: string
          sort_order: number
        }
        Insert: {
          created_at?: string
          description?: string | null
          icon?: string | null
          id?: number
          is_active?: boolean
          name: string
          slug: string
          sort_order?: number
        }
        Update: {
          created_at?: string
          description?: string | null
          icon?: string | null
          id?: number
          is_active?: boolean
          name?: string
          slug?: string
          sort_order?: number
        }
        Relationships: []
      }
      custom_games: {
        Row: {
          created_at: string
          game_data: Json
          game_id: string | null
          id: string
          settings: Json | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          game_data?: Json
          game_id?: string | null
          id?: string
          settings?: Json | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          game_data?: Json
          game_id?: string | null
          id?: string
          settings?: Json | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "custom_games_game_id_fkey"
            columns: ["game_id"]
            isOneToOne: false
            referencedRelation: "games"
            referencedColumns: ["id"]
          },
        ]
      }
      educational_games: {
        Row: {
          category: string
          created_at: string
          created_by: string | null
          description: string | null
          difficulty: string
          duration: number
          game_content: Json
          id: string
          image_url: string | null
          instructions: string | null
          is_published: boolean | null
          title: string
          updated_at: string
        }
        Insert: {
          category: string
          created_at?: string
          created_by?: string | null
          description?: string | null
          difficulty: string
          duration?: number
          game_content?: Json
          id?: string
          image_url?: string | null
          instructions?: string | null
          is_published?: boolean | null
          title: string
          updated_at?: string
        }
        Update: {
          category?: string
          created_at?: string
          created_by?: string | null
          description?: string | null
          difficulty?: string
          duration?: number
          game_content?: Json
          id?: string
          image_url?: string | null
          instructions?: string | null
          is_published?: boolean | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      game_attempts: {
        Row: {
          completed_at: string
          correct_answers: number
          game_id: string
          id: string
          score: number
          time_taken: number | null
          total_questions: number
          user_id: string | null
          user_name: string | null
        }
        Insert: {
          completed_at?: string
          correct_answers?: number
          game_id: string
          id?: string
          score: number
          time_taken?: number | null
          total_questions: number
          user_id?: string | null
          user_name?: string | null
        }
        Update: {
          completed_at?: string
          correct_answers?: number
          game_id?: string
          id?: string
          score?: number
          time_taken?: number | null
          total_questions?: number
          user_id?: string | null
          user_name?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "game_attempts_game_id_fkey"
            columns: ["game_id"]
            isOneToOne: false
            referencedRelation: "educational_games"
            referencedColumns: ["id"]
          },
        ]
      }
      game_participants: {
        Row: {
          account_id: string | null
          completion_time: number | null
          game_id: string | null
          id: string
          ip_address: string | null
          name: string
          retry_count: number | null
          score: number | null
          timestamp: string
          total_questions: number | null
        }
        Insert: {
          account_id?: string | null
          completion_time?: number | null
          game_id?: string | null
          id?: string
          ip_address?: string | null
          name: string
          retry_count?: number | null
          score?: number | null
          timestamp?: string
          total_questions?: number | null
        }
        Update: {
          account_id?: string | null
          completion_time?: number | null
          game_id?: string | null
          id?: string
          ip_address?: string | null
          name?: string
          retry_count?: number | null
          score?: number | null
          timestamp?: string
          total_questions?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "game_participants_game_id_fkey"
            columns: ["game_id"]
            isOneToOne: false
            referencedRelation: "games"
            referencedColumns: ["id"]
          },
        ]
      }
      game_score_details: {
        Row: {
          created_at: string
          id: string
          metric_data: Json | null
          metric_name: string
          metric_value: number
          score_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          metric_data?: Json | null
          metric_name: string
          metric_value: number
          score_id: string
        }
        Update: {
          created_at?: string
          id?: string
          metric_data?: Json | null
          metric_name?: string
          metric_value?: number
          score_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "game_score_details_score_id_fkey"
            columns: ["score_id"]
            isOneToOne: false
            referencedRelation: "unified_game_scores"
            referencedColumns: ["id"]
          },
        ]
      }
      game_scores: {
        Row: {
          account_id: string | null
          completed_at: string
          completion_time: number | null
          game_id: string | null
          game_type: string
          id: string
          ip_address: string | null
          player_name: string
          score: number
          total_questions: number
        }
        Insert: {
          account_id?: string | null
          completed_at?: string
          completion_time?: number | null
          game_id?: string | null
          game_type?: string
          id?: string
          ip_address?: string | null
          player_name: string
          score?: number
          total_questions?: number
        }
        Update: {
          account_id?: string | null
          completed_at?: string
          completion_time?: number | null
          game_id?: string | null
          game_type?: string
          id?: string
          ip_address?: string | null
          player_name?: string
          score?: number
          total_questions?: number
        }
        Relationships: [
          {
            foreignKeyName: "game_scores_game_id_fkey"
            columns: ["game_id"]
            isOneToOne: false
            referencedRelation: "games"
            referencedColumns: ["id"]
          },
        ]
      }
      game_templates: {
        Row: {
          created_at: string
          description: string | null
          id: string
          is_active: boolean | null
          name: string
          template_data: Json
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean | null
          name: string
          template_data?: Json
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
          template_data?: Json
        }
        Relationships: []
      }
      games: {
        Row: {
          account_id: string | null
          content_type: string | null
          created_at: string
          creator_ip: string | null
          custom_duration: number | null
          description: string | null
          expires_at: string
          game_type: string
          html_content: string
          id: string
          is_preset: boolean | null
          is_published: boolean | null
          last_accessed_at: string | null
          max_participants: number | null
          password: string | null
          require_registration: boolean | null
          share_count: number | null
          show_leaderboard: boolean | null
          title: string
        }
        Insert: {
          account_id?: string | null
          content_type?: string | null
          created_at?: string
          creator_ip?: string | null
          custom_duration?: number | null
          description?: string | null
          expires_at?: string
          game_type: string
          html_content: string
          id?: string
          is_preset?: boolean | null
          is_published?: boolean | null
          last_accessed_at?: string | null
          max_participants?: number | null
          password?: string | null
          require_registration?: boolean | null
          share_count?: number | null
          show_leaderboard?: boolean | null
          title: string
        }
        Update: {
          account_id?: string | null
          content_type?: string | null
          created_at?: string
          creator_ip?: string | null
          custom_duration?: number | null
          description?: string | null
          expires_at?: string
          game_type?: string
          html_content?: string
          id?: string
          is_preset?: boolean | null
          is_published?: boolean | null
          last_accessed_at?: string | null
          max_participants?: number | null
          password?: string | null
          require_registration?: boolean | null
          share_count?: number | null
          show_leaderboard?: boolean | null
          title?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          email: string | null
          full_name: string | null
          id: string
          is_verified: boolean | null
          role: string
          updated_at: string
          user_type: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          email?: string | null
          full_name?: string | null
          id: string
          is_verified?: boolean | null
          role?: string
          updated_at?: string
          user_type?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          email?: string | null
          full_name?: string | null
          id?: string
          is_verified?: boolean | null
          role?: string
          updated_at?: string
          user_type?: string | null
        }
        Relationships: []
      }
      question_options: {
        Row: {
          created_at: string
          id: string
          is_correct: boolean | null
          option_text: string
          order_index: number
          question_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_correct?: boolean | null
          option_text: string
          order_index: number
          question_id: string
        }
        Update: {
          created_at?: string
          id?: string
          is_correct?: boolean | null
          option_text?: string
          order_index?: number
          question_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "question_options_question_id_fkey"
            columns: ["question_id"]
            isOneToOne: false
            referencedRelation: "questions"
            referencedColumns: ["id"]
          },
        ]
      }
      questions: {
        Row: {
          created_at: string
          id: string
          order_index: number
          points: number | null
          question_text: string
          question_type: string
          quiz_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          order_index: number
          points?: number | null
          question_text: string
          question_type: string
          quiz_id: string
        }
        Update: {
          created_at?: string
          id?: string
          order_index?: number
          points?: number | null
          question_text?: string
          question_type?: string
          quiz_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "questions_quiz_id_fkey"
            columns: ["quiz_id"]
            isOneToOne: false
            referencedRelation: "quizzes"
            referencedColumns: ["id"]
          },
        ]
      }
      quiz_attempts: {
        Row: {
          completed_at: string
          id: string
          quiz_id: string
          score: number
          time_taken: number | null
          total_questions: number
          user_id: string | null
          user_name: string | null
        }
        Insert: {
          completed_at?: string
          id?: string
          quiz_id: string
          score: number
          time_taken?: number | null
          total_questions: number
          user_id?: string | null
          user_name?: string | null
        }
        Update: {
          completed_at?: string
          id?: string
          quiz_id?: string
          score?: number
          time_taken?: number | null
          total_questions?: number
          user_id?: string | null
          user_name?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "quiz_attempts_quiz_id_fkey"
            columns: ["quiz_id"]
            isOneToOne: false
            referencedRelation: "quizzes"
            referencedColumns: ["id"]
          },
        ]
      }
      quizzes: {
        Row: {
          category: string
          created_at: string
          created_by: string
          description: string | null
          difficulty: string
          duration: number
          id: string
          is_published: boolean | null
          title: string
          updated_at: string
        }
        Insert: {
          category: string
          created_at?: string
          created_by: string
          description?: string | null
          difficulty: string
          duration?: number
          id?: string
          is_published?: boolean | null
          title: string
          updated_at?: string
        }
        Update: {
          category?: string
          created_at?: string
          created_by?: string
          description?: string | null
          difficulty?: string
          duration?: number
          id?: string
          is_published?: boolean | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      shared_games: {
        Row: {
          created_at: string | null
          expires_at: string | null
          game_id: string | null
          id: string
          is_active: boolean | null
          share_code: string | null
        }
        Insert: {
          created_at?: string | null
          expires_at?: string | null
          game_id?: string | null
          id?: string
          is_active?: boolean | null
          share_code?: string | null
        }
        Update: {
          created_at?: string | null
          expires_at?: string | null
          game_id?: string | null
          id?: string
          is_active?: boolean | null
          share_code?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "shared_games_game_id_fkey"
            columns: ["game_id"]
            isOneToOne: false
            referencedRelation: "games"
            referencedColumns: ["id"]
          },
        ]
      }
      subcategories: {
        Row: {
          category_id: number
          created_at: string
          description: string | null
          id: number
          is_active: boolean
          name: string
          slug: string
          sort_order: number
        }
        Insert: {
          category_id: number
          created_at?: string
          description?: string | null
          id?: number
          is_active?: boolean
          name: string
          slug: string
          sort_order?: number
        }
        Update: {
          category_id?: number
          created_at?: string
          description?: string | null
          id?: number
          is_active?: boolean
          name?: string
          slug?: string
          sort_order?: number
        }
        Relationships: [
          {
            foreignKeyName: "subcategories_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
        ]
      }
      unified_game_scores: {
        Row: {
          completed_at: string
          completion_time: number | null
          created_at: string
          game_id: string
          game_type: string
          id: string
          ip_address: string | null
          player_id: string | null
          player_name: string
          score: number
          scoring_data: Json | null
          source_table: string
          total_questions: number
        }
        Insert: {
          completed_at?: string
          completion_time?: number | null
          created_at?: string
          game_id: string
          game_type: string
          id?: string
          ip_address?: string | null
          player_id?: string | null
          player_name: string
          score?: number
          scoring_data?: Json | null
          source_table: string
          total_questions?: number
        }
        Update: {
          completed_at?: string
          completion_time?: number | null
          created_at?: string
          game_id?: string
          game_type?: string
          id?: string
          ip_address?: string | null
          player_id?: string | null
          player_name?: string
          score?: number
          scoring_data?: Json | null
          source_table?: string
          total_questions?: number
        }
        Relationships: []
      }
      user_answers: {
        Row: {
          attempt_id: string
          created_at: string
          id: string
          is_correct: boolean
          question_id: string
          selected_option_id: string | null
        }
        Insert: {
          attempt_id: string
          created_at?: string
          id?: string
          is_correct: boolean
          question_id: string
          selected_option_id?: string | null
        }
        Update: {
          attempt_id?: string
          created_at?: string
          id?: string
          is_correct?: boolean
          question_id?: string
          selected_option_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_answers_attempt_id_fkey"
            columns: ["attempt_id"]
            isOneToOne: false
            referencedRelation: "quiz_attempts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_answers_question_id_fkey"
            columns: ["question_id"]
            isOneToOne: false
            referencedRelation: "questions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_answers_selected_option_id_fkey"
            columns: ["selected_option_id"]
            isOneToOne: false
            referencedRelation: "question_options"
            referencedColumns: ["id"]
          },
        ]
      }
      visitor_logs: {
        Row: {
          browser: string
          created_at: string | null
          id: string
          ip_address: string | null
          os: string
          timestamp: string | null
        }
        Insert: {
          browser: string
          created_at?: string | null
          id?: string
          ip_address?: string | null
          os: string
          timestamp?: string | null
        }
        Update: {
          browser?: string
          created_at?: string | null
          id?: string
          ip_address?: string | null
          os?: string
          timestamp?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_current_user_role: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      get_game_leaderboard: {
        Args: { target_game_id: string; limit_count?: number }
        Returns: {
          player_name: string
          score: number
          total_questions: number
          completion_time: number
          completed_at: string
        }[]
      }
      increment_share_count: {
        Args: { game_id: string }
        Returns: undefined
      }
      update_user_role: {
        Args: { target_user_id: string; new_role: string }
        Returns: undefined
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
