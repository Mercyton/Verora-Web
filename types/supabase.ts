export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string;
          full_name: string | null;
          avatar_url: string | null;
          role: 'admin' | 'user';
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          full_name?: string | null;
          avatar_url?: string | null;
          role?: 'admin' | 'user';
        };
        Update: {
          full_name?: string | null;
          avatar_url?: string | null;
          role?: 'admin' | 'user';
        };
      };
      services: {
        Row: {
          id: string;
          title: string;
          slug: string;
          description: string;
          short_description: string | null;
          icon: string;
          features: string[];
          price_range: string | null;
          is_featured: boolean;
          sort_order: number;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['services']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['services']['Insert']>;
      };
      projects: {
        Row: {
          id: string;
          title: string;
          slug: string;
          description: string;
          short_description: string | null;
          category: 'design' | 'video' | 'photography' | 'branding' | 'web';
          cover_image: string;
          images: string[];
          client: string | null;
          tags: string[];
          project_url: string | null;
          is_featured: boolean;
          sort_order: number;
          published_at: string;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['projects']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['projects']['Insert']>;
      };
      team_members: {
        Row: {
          id: string;
          name: string;
          role: string;
          bio: string | null;
          avatar_url: string | null;
          social_links: Json;
          is_active: boolean;
          sort_order: number;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['team_members']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['team_members']['Insert']>;
      };
      testimonials: {
        Row: {
          id: string;
          client_name: string;
          client_role: string | null;
          client_company: string | null;
          client_avatar: string | null;
          content: string;
          rating: number;
          is_featured: boolean;
          sort_order: number;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['testimonials']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['testimonials']['Insert']>;
      };
      site_settings: {
        Row: {
          id: string;
          key: string;
          value: Json;
          description: string | null;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['site_settings']['Row'], 'id' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['site_settings']['Insert']>;
      };
      contact_submissions: {
        Row: {
          id: string;
          name: string;
          email: string;
          subject: string | null;
          message: string;
          is_read: boolean;
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['contact_submissions']['Row'], 'id' | 'created_at'>;
        Update: { is_read?: boolean };
      };
    };
  };
}

// Convenience types
export type Profile = Database['public']['Tables']['profiles']['Row'];
export type Service = Database['public']['Tables']['services']['Row'];
export type Project = Database['public']['Tables']['projects']['Row'];
export type TeamMember = Database['public']['Tables']['team_members']['Row'];
export type Testimonial = Database['public']['Tables']['testimonials']['Row'];
export type SiteSetting = Database['public']['Tables']['site_settings']['Row'];
export type ContactSubmission = Database['public']['Tables']['contact_submissions']['Row'];
