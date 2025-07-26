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
      custom_games: {
        Row: {
          account_id: string | null
          created_at: string
          creator_ip: string | null
          custom_duration: number | null
          description: string | null
          expires_at: string | null
          game_data: Json
          game_id: string | null
          html_content: string | null
          id: string
          is_published: boolean | null
          last_accessed_at: string | null
          max_participants: number | null
          password: string | null
          require_registration: boolean | null
          settings: Json | null
          share_count: number | null
          show_leaderboard: boolean | null
          title: string | null
          updated_at: string
        }
        Insert: {
          account_id?: string | null
          created_at?: string
          creator_ip?: string | null
          custom_duration?: number | null
          description?: string | null
          expires_at?: string | null
          game_data?: Json
          game_id?: string | null
          html_content?: string | null
          id?: string
          is_published?: boolean | null
          last_accessed_at?: string | null
          max_participants?: number | null
          password?: string | null
          require_registration?: boolean | null
          settings?: Json | null
          share_count?: number | null
          show_leaderboard?: boolean | null
          title?: string | null
          updated_at?: string
        }
        Update: {
          account_id?: string | null
          created_at?: string
          creator_ip?: string | null
          custom_duration?: number | null
          description?: string | null
          expires_at?: string | null
          game_data?: Json
          game_id?: string | null
          html_content?: string | null
          id?: string
          is_published?: boolean | null
          last_accessed_at?: string | null
          max_participants?: number | null
          password?: string | null
          require_registration?: boolean | null
          settings?: Json | null
          share_count?: number | null
          show_leaderboard?: boolean | null
          title?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      custom_leaderboard: {
        Row: {
          completed_at: string | null
          completion_time: number | null
          created_at: string
          game_id: string
          id: string
          ip_address: string | null
          is_active: boolean | null
          joined_at: string
          last_active_at: string | null
          player_name: string
          score: number | null
          scoring_data: Json | null
          session_data: Json | null
          total_questions: number | null
          updated_at: string
        }
        Insert: {
          completed_at?: string | null
          completion_time?: number | null
          created_at?: string
          game_id: string
          id?: string
          ip_address?: string | null
          is_active?: boolean | null
          joined_at?: string
          last_active_at?: string | null
          player_name: string
          score?: number | null
          scoring_data?: Json | null
          session_data?: Json | null
          total_questions?: number | null
          updated_at?: string
        }
        Update: {
          completed_at?: string | null
          completion_time?: number | null
          created_at?: string
          game_id?: string
          id?: string
          ip_address?: string | null
          is_active?: boolean | null
          joined_at?: string
          last_active_at?: string | null
          player_name?: string
          score?: number | null
          scoring_data?: Json | null
          session_data?: Json | null
          total_questions?: number | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "custom_leaderboard_game_id_fkey"
            columns: ["game_id"]
            isOneToOne: false
            referencedRelation: "custom_games"
            referencedColumns: ["id"]
          },
        ]
      }
      preset_games: {
        Row: {
          created_at: string
          default_settings: Json | null
          description: string | null
          game_type: string
          id: string
          is_active: boolean | null
          template_data: Json
          title: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          default_settings?: Json | null
          description?: string | null
          game_type: string
          id?: string
          is_active?: boolean | null
          template_data?: Json
          title: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          default_settings?: Json | null
          description?: string | null
          game_type?: string
          id?: string
          is_active?: boolean | null
          template_data?: Json
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      preset_leaderboard: {
        Row: {
          completed_at: string | null
          completion_time: number | null
          created_at: string
          game_id: string
          id: string
          ip_address: string | null
          is_active: boolean | null
          joined_at: string
          last_active_at: string | null
          player_name: string
          score: number | null
          scoring_data: Json | null
          session_data: Json | null
          total_questions: number | null
          updated_at: string
        }
        Insert: {
          completed_at?: string | null
          completion_time?: number | null
          created_at?: string
          game_id: string
          id?: string
          ip_address?: string | null
          is_active?: boolean | null
          joined_at?: string
          last_active_at?: string | null
          player_name: string
          score?: number | null
          scoring_data?: Json | null
          session_data?: Json | null
          total_questions?: number | null
          updated_at?: string
        }
        Update: {
          completed_at?: string | null
          completion_time?: number | null
          created_at?: string
          game_id?: string
          id?: string
          ip_address?: string | null
          is_active?: boolean | null
          joined_at?: string
          last_active_at?: string | null
          player_name?: string
          score?: number | null
          scoring_data?: Json | null
          session_data?: Json | null
          total_questions?: number | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "preset_leaderboard_game_id_fkey"
            columns: ["game_id"]
            isOneToOne: false
            referencedRelation: "preset_games"
            referencedColumns: ["id"]
          },
        ]
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
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_current_user_role: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      get_custom_game_leaderboard: {
        Args: { target_game_instance_id: string; limit_count?: number }
        Returns: {
          player_name: string
          score: number
          total_questions: number
          completion_time: number
          scoring_data: Json
          completed_at: string
        }[]
      }
      get_custom_game_participants_realtime: {
        Args: { target_game_instance_id: string }
        Returns: {
          id: string
          player_name: string
          joined_at: string
          last_active_at: string
          is_active: boolean
          session_data: Json
        }[]
      }
      get_custom_game_stats_admin: {
        Args: { target_game_instance_id: string }
        Returns: {
          total_participants: number
          total_scores: number
          average_score: number
          best_score: number
          completion_rate: number
          active_participants: number
        }[]
      }
      get_custom_leaderboard: {
        Args: { target_game_id: string; limit_count?: number }
        Returns: {
          player_name: string
          score: number
          total_questions: number
          completion_time: number
          scoring_data: Json
          completed_at: string
        }[]
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
      get_game_participants_realtime: {
        Args: { target_game_id: string }
        Returns: {
          id: string
          player_name: string
          joined_at: string
          last_active_at: string
          is_active: boolean
          session_data: Json
        }[]
      }
      get_preset_game_leaderboard: {
        Args: { target_game_instance_id: string; limit_count?: number }
        Returns: {
          player_name: string
          score: number
          total_questions: number
          completion_time: number
          scoring_data: Json
          completed_at: string
        }[]
      }
      get_preset_game_participants_realtime: {
        Args: { target_game_instance_id: string }
        Returns: {
          id: string
          player_name: string
          joined_at: string
          last_active_at: string
          is_active: boolean
          session_data: Json
        }[]
      }
      get_preset_game_stats_admin: {
        Args: { target_game_instance_id: string }
        Returns: {
          total_participants: number
          total_scores: number
          average_score: number
          best_score: number
          completion_rate: number
          active_participants: number
        }[]
      }
      get_preset_leaderboard: {
        Args: { target_game_id: string; limit_count?: number }
        Returns: {
          player_name: string
          score: number
          total_questions: number
          completion_time: number
          scoring_data: Json
          completed_at: string
        }[]
      }
      get_unified_game_leaderboard: {
        Args: {
          target_game_id: string
          target_source_table: string
          limit_count?: number
        }
        Returns: {
          player_name: string
          score: number
          total_questions: number
          completion_time: number
          scoring_data: Json
          completed_at: string
          game_type: string
        }[]
      }
      get_unified_participants_leaderboard: {
        Args: { target_game_id: string; limit_count?: number }
        Returns: {
          player_name: string
          status: string
          score: number
          total_questions: number
          completion_time: number
          scoring_data: Json
          completed_at: string
          joined_at: string
          game_type: string
          is_active: boolean
        }[]
      }
      increment_custom_game_share_count: {
        Args: { game_instance_id: string }
        Returns: undefined
      }
      increment_preset_game_share_count: {
        Args: { game_instance_id: string }
        Returns: undefined
      }
      increment_share_count: {
        Args: { game_id: string }
        Returns: undefined
      }
      update_custom_participant_activity: {
        Args: { target_game_id: string; target_player_name: string }
        Returns: undefined
      }
      update_game_participant_activity: {
        Args: { target_game_id: string; target_player_name: string }
        Returns: undefined
      }
      update_preset_participant_activity: {
        Args: { target_game_id: string; target_player_name: string }
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
