// Auto-generated types for De Vuelta — schema v0001 + v0002
// Regenerate with: supabase gen types typescript --linked > types/database.ts

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          display_name: string;
          phone: string | null;
          avatar_url: string | null;
          neighborhood: string | null;
          is_partner: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string; // mirrors auth.users.id
          display_name: string;
          phone?: string | null;
          avatar_url?: string | null;
          neighborhood?: string | null;
          is_partner?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          display_name?: string;
          phone?: string | null;
          avatar_url?: string | null;
          neighborhood?: string | null;
          is_partner?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "users_id_fkey";
            columns: ["id"];
            isOneToOne: true;
            referencedRelation: "users";
            referencedColumns: ["id"];
          }
        ];
      };

      pets: {
        Row: {
          id: string;
          owner_id: string;
          name: string;
          species: PetSpecies;
          breed: string | null;
          color: string;
          description: string | null;
          photo_urls: string[];
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          owner_id: string;
          name: string;
          species: PetSpecies;
          breed?: string | null;
          color: string;
          description?: string | null;
          photo_urls?: string[];
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          owner_id?: string;
          name?: string;
          species?: PetSpecies;
          breed?: string | null;
          color?: string;
          description?: string | null;
          photo_urls?: string[];
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "pets_owner_id_fkey";
            columns: ["owner_id"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          }
        ];
      };

      lost_reports: {
        Row: {
          id: string;
          pet_id: string;
          reporter_id: string | null; // nullable: user may delete account (0002)
          status: LostReportStatus;
          last_seen_lat: number;
          last_seen_lng: number;
          last_seen_at: string;
          last_seen_loc: unknown; // PostGIS geography — use lat/lng for app logic
          notes: string | null;
          reward_amount: number | null;
          resolved_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          pet_id: string;
          reporter_id?: string | null;
          status?: LostReportStatus;
          last_seen_lat: number;
          last_seen_lng: number;
          last_seen_at: string;
          // last_seen_loc is a generated column — do not insert
          notes?: string | null;
          reward_amount?: number | null;
          resolved_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          pet_id?: string;
          reporter_id?: string | null;
          status?: LostReportStatus;
          last_seen_lat?: number;
          last_seen_lng?: number;
          last_seen_at?: string;
          notes?: string | null;
          reward_amount?: number | null;
          resolved_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "lost_reports_pet_id_fkey";
            columns: ["pet_id"];
            isOneToOne: false;
            referencedRelation: "pets";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "lost_reports_reporter_id_fkey";
            columns: ["reporter_id"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          }
        ];
      };

      sightings: {
        Row: {
          id: string;
          report_id: string | null; // nullable: animal sin dueño conocido (0002)
          spotter_id: string | null; // nullable: preserva avistamiento si usuario se borra (0002)
          lat: number;
          lng: number;
          location: unknown; // PostGIS geography — use lat/lng for app logic
          spotted_at: string;
          photo_urls: string[];
          notes: string | null;
          needs_help: boolean; // true cuando report_id IS NULL (flujo animal callejero)
          created_at: string;
        };
        Insert: {
          id?: string;
          report_id?: string | null;
          spotter_id?: string | null;
          lat: number;
          lng: number;
          // location is a generated column — do not insert
          spotted_at: string;
          photo_urls?: string[];
          notes?: string | null;
          needs_help?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          report_id?: string | null;
          spotter_id?: string | null;
          lat?: number;
          lng?: number;
          spotted_at?: string;
          photo_urls?: string[];
          notes?: string | null;
          needs_help?: boolean;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "sightings_report_id_fkey";
            columns: ["report_id"];
            isOneToOne: false;
            referencedRelation: "lost_reports";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "sightings_spotter_id_fkey";
            columns: ["spotter_id"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          }
        ];
      };

      matches: {
        Row: {
          id: string;
          report_id: string;
          sighting_id: string;
          confidence: number | null; // 0–1, populated by AI in Fase 6
          confirmed: boolean;
          confirmed_by: string | null;
          confirmed_at: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          report_id: string;
          sighting_id: string;
          confidence?: number | null;
          confirmed?: boolean;
          confirmed_by?: string | null;
          confirmed_at?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          report_id?: string;
          sighting_id?: string;
          confidence?: number | null;
          confirmed?: boolean;
          confirmed_by?: string | null;
          confirmed_at?: string | null;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "matches_report_id_fkey";
            columns: ["report_id"];
            isOneToOne: false;
            referencedRelation: "lost_reports";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "matches_sighting_id_fkey";
            columns: ["sighting_id"];
            isOneToOne: false;
            referencedRelation: "sightings";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "matches_confirmed_by_fkey";
            columns: ["confirmed_by"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          }
        ];
      };

      notifications: {
        Row: {
          id: string;
          user_id: string;
          type: NotificationType;
          payload: Json;
          read: boolean;
          sent_at: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          type: NotificationType;
          payload?: Json;
          read?: boolean;
          sent_at?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          type?: NotificationType;
          payload?: Json;
          read?: boolean;
          sent_at?: string | null;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "notifications_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          }
        ];
      };

      partners: {
        Row: {
          id: string;
          user_id: string | null;
          name: string;
          type: PartnerType;
          address: string;
          lat: number;
          lng: number;
          location: unknown; // PostGIS geography
          phone: string | null;
          website: string | null;
          active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id?: string | null;
          name: string;
          type: PartnerType;
          address: string;
          lat: number;
          lng: number;
          // location is a generated column — do not insert
          phone?: string | null;
          website?: string | null;
          active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string | null;
          name?: string;
          type?: PartnerType;
          address?: string;
          lat?: number;
          lng?: number;
          phone?: string | null;
          website?: string | null;
          active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "partners_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          }
        ];
      };

      adoptable_pets: {
        Row: {
          id: string;
          partner_id: string;
          name: string;
          species: PetSpecies;
          breed: string | null;
          age_months: number | null;
          description: string | null;
          photo_urls: string[];
          available: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          partner_id: string;
          name: string;
          species: PetSpecies;
          breed?: string | null;
          age_months?: number | null;
          description?: string | null;
          photo_urls?: string[];
          available?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          partner_id?: string;
          name?: string;
          species?: PetSpecies;
          breed?: string | null;
          age_months?: number | null;
          description?: string | null;
          photo_urls?: string[];
          available?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "adoptable_pets_partner_id_fkey";
            columns: ["partner_id"];
            isOneToOne: false;
            referencedRelation: "partners";
            referencedColumns: ["id"];
          }
        ];
      };

      animal_stories: {
        Row: {
          id: string;
          report_id: string | null;
          author_id: string | null; // nullable: preserva historia si autor se borra (0002)
          title: string;
          body: string;
          photo_urls: string[];
          published: boolean;
          published_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          report_id?: string | null;
          author_id?: string | null;
          title: string;
          body: string;
          photo_urls?: string[];
          published?: boolean;
          published_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          report_id?: string | null;
          author_id?: string | null;
          title?: string;
          body?: string;
          photo_urls?: string[];
          published?: boolean;
          published_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "animal_stories_report_id_fkey";
            columns: ["report_id"];
            isOneToOne: false;
            referencedRelation: "lost_reports";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "animal_stories_author_id_fkey";
            columns: ["author_id"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          }
        ];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};

// ── Enum helpers ───────────────────────────────────────────────────────────────────────────────

export type PetSpecies =
  | "dog"
  | "cat"
  | "rabbit"
  | "bird"
  | "reptile"
  | "rodent"
  | "other";

export type LostReportStatus = "active" | "resolved" | "expired";

export type NotificationType =
  | "new_sighting"
  | "match_found"
  | "report_nearby"
  | "report_resolved"
  | "partner_alert";

export type PartnerType = "vet" | "shelter" | "rescue";

// ── Convenience row types ──────────────────────────────────────────────────────────────────────────

type Tables = Database["public"]["Tables"];

export type UserRow          = Tables["users"]["Row"];
export type PetRow           = Tables["pets"]["Row"];
export type LostReportRow    = Tables["lost_reports"]["Row"];
export type SightingRow      = Tables["sightings"]["Row"];
export type MatchRow         = Tables["matches"]["Row"];
export type NotificationRow  = Tables["notifications"]["Row"];
export type PartnerRow       = Tables["partners"]["Row"];
export type AdoptablePetRow  = Tables["adoptable_pets"]["Row"];
export type AnimalStoryRow   = Tables["animal_stories"]["Row"];
