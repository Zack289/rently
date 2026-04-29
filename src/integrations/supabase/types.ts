export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      banners: {
        Row: {
          created_at: string
          cta_link: string | null
          cta_text: string | null
          display_order: number
          id: string
          image_url: string | null
          is_active: boolean
          subtitle: string | null
          title: string
        }
        Insert: {
          created_at?: string
          cta_link?: string | null
          cta_text?: string | null
          display_order?: number
          id?: string
          image_url?: string | null
          is_active?: boolean
          subtitle?: string | null
          title: string
        }
        Update: {
          created_at?: string
          cta_link?: string | null
          cta_text?: string | null
          display_order?: number
          id?: string
          image_url?: string | null
          is_active?: boolean
          subtitle?: string | null
          title?: string
        }
        Relationships: []
      }
      bookings: {
        Row: {
          booking_ref: string
          check_in: string
          check_out: string
          created_at: string
          guests: number
          id: string
          nights: number
          payment_method: Database["public"]["Enums"]["payment_method"]
          payment_status: Database["public"]["Enums"]["payment_status"]
          platform_fee: number
          property_id: string
          room_rate: number
          room_type_id: string | null
          special_requests: string | null
          status: Database["public"]["Enums"]["booking_status"]
          stripe_session_id: string | null
          taxes: number
          total_price: number
          tourist_id: string
          updated_at: string
        }
        Insert: {
          booking_ref: string
          check_in: string
          check_out: string
          created_at?: string
          guests?: number
          id?: string
          nights: number
          payment_method?: Database["public"]["Enums"]["payment_method"]
          payment_status?: Database["public"]["Enums"]["payment_status"]
          platform_fee?: number
          property_id: string
          room_rate: number
          room_type_id?: string | null
          special_requests?: string | null
          status?: Database["public"]["Enums"]["booking_status"]
          stripe_session_id?: string | null
          taxes?: number
          total_price: number
          tourist_id: string
          updated_at?: string
        }
        Update: {
          booking_ref?: string
          check_in?: string
          check_out?: string
          created_at?: string
          guests?: number
          id?: string
          nights?: number
          payment_method?: Database["public"]["Enums"]["payment_method"]
          payment_status?: Database["public"]["Enums"]["payment_status"]
          platform_fee?: number
          property_id?: string
          room_rate?: number
          room_type_id?: string | null
          special_requests?: string | null
          status?: Database["public"]["Enums"]["booking_status"]
          stripe_session_id?: string | null
          taxes?: number
          total_price?: number
          tourist_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "bookings_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "properties"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bookings_room_type_id_fkey"
            columns: ["room_type_id"]
            isOneToOne: false
            referencedRelation: "room_types"
            referencedColumns: ["id"]
          },
        ]
      }
      destinations: {
        Row: {
          created_at: string
          description: string
          gallery: string[]
          hero_image: string | null
          id: string
          is_featured: boolean
          name: string
          province: string | null
          region: string
          slug: string
          tags: string[]
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string
          gallery?: string[]
          hero_image?: string | null
          id?: string
          is_featured?: boolean
          name: string
          province?: string | null
          region?: string
          slug: string
          tags?: string[]
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string
          gallery?: string[]
          hero_image?: string | null
          id?: string
          is_featured?: boolean
          name?: string
          province?: string | null
          region?: string
          slug?: string
          tags?: string[]
          updated_at?: string
        }
        Relationships: []
      }
      messages: {
        Row: {
          booking_id: string | null
          content: string
          created_at: string
          id: string
          is_read: boolean
          receiver_id: string
          sender_id: string
        }
        Insert: {
          booking_id?: string | null
          content: string
          created_at?: string
          id?: string
          is_read?: boolean
          receiver_id: string
          sender_id: string
        }
        Update: {
          booking_id?: string | null
          content?: string
          created_at?: string
          id?: string
          is_read?: boolean
          receiver_id?: string
          sender_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "messages_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: false
            referencedRelation: "bookings"
            referencedColumns: ["id"]
          },
        ]
      }
      payouts: {
        Row: {
          booking_id: string
          commission_amount: number
          created_at: string
          gross_amount: number
          host_id: string
          id: string
          net_amount: number
          processed_at: string | null
          status: Database["public"]["Enums"]["payout_status"]
        }
        Insert: {
          booking_id: string
          commission_amount: number
          created_at?: string
          gross_amount: number
          host_id: string
          id?: string
          net_amount: number
          processed_at?: string | null
          status?: Database["public"]["Enums"]["payout_status"]
        }
        Update: {
          booking_id?: string
          commission_amount?: number
          created_at?: string
          gross_amount?: number
          host_id?: string
          id?: string
          net_amount?: number
          processed_at?: string | null
          status?: Database["public"]["Enums"]["payout_status"]
        }
        Relationships: [
          {
            foreignKeyName: "payouts_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: false
            referencedRelation: "bookings"
            referencedColumns: ["id"]
          },
        ]
      }
      platform_settings: {
        Row: {
          id: string
          key: string
          updated_at: string
          value: string
        }
        Insert: {
          id?: string
          key: string
          updated_at?: string
          value: string
        }
        Update: {
          id?: string
          key?: string
          updated_at?: string
          value?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          email: string | null
          id: string
          is_suspended: boolean
          is_verified: boolean
          name: string
          phone: string | null
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          email?: string | null
          id: string
          is_suspended?: boolean
          is_verified?: boolean
          name?: string
          phone?: string | null
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          email?: string | null
          id?: string
          is_suspended?: boolean
          is_verified?: boolean
          name?: string
          phone?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      properties: {
        Row: {
          address: string
          amenities: string[]
          cancellation_policy: Database["public"]["Enums"]["cancellation_policy"]
          checkin_time: string
          checkout_time: string
          commission_rate: number
          created_at: string
          description: string
          destination_id: string | null
          gallery: string[]
          hero_image: string | null
          host_id: string
          house_rules: string | null
          id: string
          is_verified: boolean
          latitude: number | null
          longitude: number | null
          name: string
          province: string | null
          region: string | null
          status: Database["public"]["Enums"]["property_status"]
          type: Database["public"]["Enums"]["property_type"]
          updated_at: string
        }
        Insert: {
          address?: string
          amenities?: string[]
          cancellation_policy?: Database["public"]["Enums"]["cancellation_policy"]
          checkin_time?: string
          checkout_time?: string
          commission_rate?: number
          created_at?: string
          description?: string
          destination_id?: string | null
          gallery?: string[]
          hero_image?: string | null
          host_id: string
          house_rules?: string | null
          id?: string
          is_verified?: boolean
          latitude?: number | null
          longitude?: number | null
          name: string
          province?: string | null
          region?: string | null
          status?: Database["public"]["Enums"]["property_status"]
          type?: Database["public"]["Enums"]["property_type"]
          updated_at?: string
        }
        Update: {
          address?: string
          amenities?: string[]
          cancellation_policy?: Database["public"]["Enums"]["cancellation_policy"]
          checkin_time?: string
          checkout_time?: string
          commission_rate?: number
          created_at?: string
          description?: string
          destination_id?: string | null
          gallery?: string[]
          hero_image?: string | null
          host_id?: string
          house_rules?: string | null
          id?: string
          is_verified?: boolean
          latitude?: number | null
          longitude?: number | null
          name?: string
          province?: string | null
          region?: string | null
          status?: Database["public"]["Enums"]["property_status"]
          type?: Database["public"]["Enums"]["property_type"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "properties_destination_id_fkey"
            columns: ["destination_id"]
            isOneToOne: false
            referencedRelation: "destinations"
            referencedColumns: ["id"]
          },
        ]
      }
      reviews: {
        Row: {
          admin_note: string | null
          booking_id: string | null
          comment: string | null
          created_at: string
          id: string
          is_approved: boolean
          is_flagged: boolean
          property_id: string
          rating_accuracy: number
          rating_cleanliness: number
          rating_location: number
          rating_overall: number
          rating_value: number
          tourist_id: string
        }
        Insert: {
          admin_note?: string | null
          booking_id?: string | null
          comment?: string | null
          created_at?: string
          id?: string
          is_approved?: boolean
          is_flagged?: boolean
          property_id: string
          rating_accuracy: number
          rating_cleanliness: number
          rating_location: number
          rating_overall: number
          rating_value: number
          tourist_id: string
        }
        Update: {
          admin_note?: string | null
          booking_id?: string | null
          comment?: string | null
          created_at?: string
          id?: string
          is_approved?: boolean
          is_flagged?: boolean
          property_id?: string
          rating_accuracy?: number
          rating_cleanliness?: number
          rating_location?: number
          rating_overall?: number
          rating_value?: number
          tourist_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "reviews_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: false
            referencedRelation: "bookings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reviews_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "properties"
            referencedColumns: ["id"]
          },
        ]
      }
      room_types: {
        Row: {
          capacity: number
          created_at: string
          description: string | null
          id: string
          images: string[]
          name: string
          price_per_night: number
          property_id: string
          quantity: number
        }
        Insert: {
          capacity?: number
          created_at?: string
          description?: string | null
          id?: string
          images?: string[]
          name: string
          price_per_night: number
          property_id: string
          quantity?: number
        }
        Update: {
          capacity?: number
          created_at?: string
          description?: string | null
          id?: string
          images?: string[]
          name?: string
          price_per_night?: number
          property_id?: string
          quantity?: number
        }
        Relationships: [
          {
            foreignKeyName: "room_types_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "properties"
            referencedColumns: ["id"]
          },
        ]
      }
      support_tickets: {
        Row: {
          admin_reply: string | null
          assigned_to: string | null
          booking_id: string | null
          created_at: string
          id: string
          message: string
          priority: Database["public"]["Enums"]["ticket_priority"]
          resolved_at: string | null
          status: Database["public"]["Enums"]["ticket_status"]
          subject: string
          user_id: string
        }
        Insert: {
          admin_reply?: string | null
          assigned_to?: string | null
          booking_id?: string | null
          created_at?: string
          id?: string
          message: string
          priority?: Database["public"]["Enums"]["ticket_priority"]
          resolved_at?: string | null
          status?: Database["public"]["Enums"]["ticket_status"]
          subject: string
          user_id: string
        }
        Update: {
          admin_reply?: string | null
          assigned_to?: string | null
          booking_id?: string | null
          created_at?: string
          id?: string
          message?: string
          priority?: Database["public"]["Enums"]["ticket_priority"]
          resolved_at?: string | null
          status?: Database["public"]["Enums"]["ticket_status"]
          subject?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "support_tickets_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: false
            referencedRelation: "bookings"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      wishlists: {
        Row: {
          created_at: string
          id: string
          property_id: string
          tourist_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          property_id: string
          tourist_id: string
        }
        Update: {
          created_at?: string
          id?: string
          property_id?: string
          tourist_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "wishlists_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "properties"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "tourist" | "host" | "admin"
      booking_status:
        | "pending"
        | "confirmed"
        | "cancelled"
        | "completed"
        | "disputed"
      cancellation_policy: "flexible" | "moderate" | "strict"
      payment_method: "esewa" | "khalti" | "card" | "pay_at_property"
      payment_status: "pending" | "paid" | "refunded"
      payout_status: "pending" | "processed" | "failed"
      property_status: "pending" | "active" | "suspended" | "rejected"
      property_type: "hotel" | "guesthouse" | "homestay" | "resort" | "hostel"
      ticket_priority: "low" | "medium" | "high"
      ticket_status: "open" | "in_progress" | "resolved" | "closed"
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
    Enums: {
      app_role: ["tourist", "host", "admin"],
      booking_status: [
        "pending",
        "confirmed",
        "cancelled",
        "completed",
        "disputed",
      ],
      cancellation_policy: ["flexible", "moderate", "strict"],
      payment_method: ["esewa", "khalti", "card", "pay_at_property"],
      payment_status: ["pending", "paid", "refunded"],
      payout_status: ["pending", "processed", "failed"],
      property_status: ["pending", "active", "suspended", "rejected"],
      property_type: ["hotel", "guesthouse", "homestay", "resort", "hostel"],
      ticket_priority: ["low", "medium", "high"],
      ticket_status: ["open", "in_progress", "resolved", "closed"],
    },
  },
} as const
