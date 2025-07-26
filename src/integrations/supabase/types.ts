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
      custom_game_instances: {
        Row: {
          account_id: string | null
          created_at: string
          creator_ip: string | null
          custom_duration: number | null
          custom_game_id: string
          description: string | null
          expires_at: string
          html_content: string
          id: string
          is_published: boolean | null
          last_accessed_at: string | null
          max_participants: number | null
          password: string | null
          require_registration: boolean | null
          share_count: number | null
          show_leaderboard: boolean | null
          title: string
          updated_at: string
        }
        Insert: {
          account_id?: string | null
          created_at?: string
          creator_ip?: string | null
          custom_duration?: number | null
          custom_game_id: string
          description?: string | null
          expires_at?: string
          html_content: string
          id?: string
          is_published?: boolean | null
          last_accessed_at?: string | null
          max_participants?: number | null
          password?: string | null
          require_registration?: boolean | null
          share_count?: number | null
          show_leaderboard?: boolean | null
          title: string
          updated_at?: string
        }
        Update: {
          account_id?: string | null
          created_at?: string
          creator_ip?: string | null
          custom_duration?: number | null
          custom_game_id?: string
          description?: string | null
          expires_at?: string
          html_content?: string
          id?: string
          is_published?: boolean | null
          last_accessed_at?: string | null
          max_participants?: number | null
          password?: string | null
          require_registration?: boolean | null
          share_count?: number | null
          show_leaderboard?: boolean | null
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "custom_game_instances_custom_game_id_fkey"
            columns: ["custom_game_id"]
            isOneToOne: false
            referencedRelation: "custom_games"
            referencedColumns: ["id"]
          },
        ]
      }
      custom_game_participants: {
        Row: {
          game_instance_id: string
          id: string
          ip_address: string | null
          is_active: boolean | null
          joined_at: string
          last_active_at: string | null
          player_name: string
          session_data: Json | null
        }
        Insert: {
          game_instance_id: string
          id?: string
          ip_address?: string | null
          is_active?: boolean | null
          joined_at?: string
          last_active_at?: string | null
          player_name: string
          session_data?: Json | null
        }
        Update: {
          game_instance_id?: string
          id?: string
          ip_address?: string | null
          is_active?: boolean | null
          joined_at?: string
          last_active_at?: string | null
          player_name?: string
          session_data?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "custom_game_participants_game_instance_id_fkey"
            columns: ["game_instance_id"]
            isOneToOne: false
            referencedRelation: "custom_game_instances"
            referencedColumns: ["id"]
          },
        ]
      }
      custom_game_scores: {
        Row: {
          completed_at: string
          completion_time: number | null
          created_at: string
          game_instance_id: string
          id: string
          ip_address: string | null
          player_id: string | null
          player_name: string
          score: number
          scoring_data: Json | null
          total_questions: number
        }
        Insert: {
          completed_at?: string
          completion_time?: number | null
          created_at?: string
          game_instance_id: string
          id?: string
          ip_address?: string | null
          player_id?: string | null
          player_name: string
          score?: number
          scoring_data?: Json | null
          total_questions?: number
        }
        Update: {
          completed_at?: string
          completion_time?: number | null
          created_at?: string
          game_instance_id?: string
          id?: string
          ip_address?: string | null
          player_id?: string | null
          player_name?: string
          score?: number
          scoring_data?: Json | null
          total_questions?: number
        }
        Relationships: [
          {
            foreignKeyName: "custom_game_scores_game_instance_id_fkey"
            columns: ["game_instance_id"]
            isOneToOne: false
            referencedRelation: "custom_game_instances"
            referencedColumns: ["id"]
          },
        ]
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
      preset_game_instances: {
        Row: {
          account_id: string | null
          created_at: string
          creator_ip: string | null
          custom_duration: number | null
          expires_at: string
          game_data: Json
          id: string
          is_published: boolean | null
          last_accessed_at: string | null
          max_participants: number | null
          password: string | null
          preset_game_id: string
          require_registration: boolean | null
          settings: Json | null
          share_count: number | null
          show_leaderboard: boolean | null
          title: string
          updated_at: string
        }
        Insert: {
          account_id?: string | null
          created_at?: string
          creator_ip?: string | null
          custom_duration?: number | null
          expires_at?: string
          game_data?: Json
          id?: string
          is_published?: boolean | null
          last_accessed_at?: string | null
          max_participants?: number | null
          password?: string | null
          preset_game_id: string
          require_registration?: boolean | null
          settings?: Json | null
          share_count?: number | null
          show_leaderboard?: boolean | null
          title: string
          updated_at?: string
        }
        Update: {
          account_id?: string | null
          created_at?: string
          creator_ip?: string | null
          custom_duration?: number | null
          expires_at?: string
          game_data?: Json
          id?: string
          is_published?: boolean | null
          last_accessed_at?: string | null
          max_participants?: number | null
          password?: string | null
          preset_game_id?: string
          require_registration?: boolean | null
          settings?: Json | null
          share_count?: number | null
          show_leaderboard?: boolean | null
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "preset_game_instances_preset_game_id_fkey"
            columns: ["preset_game_id"]
            isOneToOne: false
            referencedRelation: "preset_games"
            referencedColumns: ["id"]
          },
        ]
      }
      preset_game_participants: {
        Row: {
          game_instance_id: string
          id: string
          ip_address: string | null
          is_active: boolean | null
          joined_at: string
          last_active_at: string | null
          player_name: string
          session_data: Json | null
        }
        Insert: {
          game_instance_id: string
          id?: string
          ip_address?: string | null
          is_active?: boolean | null
          joined_at?: string
          last_active_at?: string | null
          player_name: string
          session_data?: Json | null
        }
        Update: {
          game_instance_id?: string
          id?: string
          ip_address?: string | null
          is_active?: boolean | null
          joined_at?: string
          last_active_at?: string | null
          player_name?: string
          session_data?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "preset_game_participants_game_instance_id_fkey"
            columns: ["game_instance_id"]
            isOneToOne: false
            referencedRelation: "preset_game_instances"
            referencedColumns: ["id"]
          },
        ]
      }
      preset_game_scores: {
        Row: {
          completed_at: string
          completion_time: number | null
          created_at: string
          game_instance_id: string
          id: string
          ip_address: string | null
          player_id: string | null
          player_name: string
          score: number
          scoring_data: Json | null
          total_questions: number
        }
        Insert: {
          completed_at?: string
          completion_time?: number | null
          created_at?: string
          game_instance_id: string
          id?: string
          ip_address?: string | null
          player_id?: string | null
          player_name: string
          score?: number
          scoring_data?: Json | null
          total_questions?: number
        }
        Update: {
          completed_at?: string
          completion_time?: number | null
          created_at?: string
          game_instance_id?: string
          id?: string
          ip_address?: string | null
          player_id?: string | null
          player_name?: string
          score?: number
          scoring_data?: Json | null
          total_questions?: number
        }
        Relationships: [
          {
            foreignKeyName: "preset_game_scores_game_instance_id_fkey"
            columns: ["game_instance_id"]
            isOneToOne: false
            referencedRelation: "preset_game_instances"
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
