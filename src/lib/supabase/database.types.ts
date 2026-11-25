/**
 * Hand-authored Phase 1 types for the public schema.
 * Regenerate from the live schema after migrations:
 *   npm run db:types
 * (requires local Supabase: npm run db:start)
 */
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type LeadStatus =
  | "new"
  | "contacted"
  | "qualified"
  | "converted"
  | "closed"
  | "spam";

export type Database = {
  public: {
    Tables: {
      leads: {
        Row: {
          id: string;
          full_name: string;
          email: string;
          phone: string | null;
          country: string | null;
          project_type: string | null;
          location: string | null;
          budget_range: string | null;
          message: string;
          source: string;
          status: LeadStatus;
          metadata: Json;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          full_name: string;
          email: string;
          phone?: string | null;
          country?: string | null;
          project_type?: string | null;
          location?: string | null;
          budget_range?: string | null;
          message: string;
          source?: string;
          status?: LeadStatus;
          metadata?: Json;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          full_name?: string;
          email?: string;
          phone?: string | null;
          country?: string | null;
          project_type?: string | null;
          location?: string | null;
          budget_range?: string | null;
          message?: string;
          source?: string;
          status?: LeadStatus;
          metadata?: Json;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: {
      lead_status: LeadStatus;
    };
    CompositeTypes: Record<string, never>;
  };
};

export type Tables<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Row"];

export type TablesInsert<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Insert"];
