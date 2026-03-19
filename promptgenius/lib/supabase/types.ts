export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      prompts: {
        Row: {
          id: string
          user_id: string | null
          prompt: string
          model: string
          style: string | null
          format: string | null
          temperature: number | null
          max_tokens: number | null
          has_image: boolean
          user_input: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id?: string | null
          prompt: string
          model: string
          style?: string | null
          format?: string | null
          temperature?: number | null
          max_tokens?: number | null
          has_image?: boolean
          user_input?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string | null
          prompt?: string
          model?: string
          style?: string | null
          format?: string | null
          temperature?: number | null
          max_tokens?: number | null
          has_image?: boolean
          user_input?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      users: {
        Row: {
          id: string
          email: string | null
          name: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          email?: string | null
          name?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string | null
          name?: string | null
          created_at?: string
          updated_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}