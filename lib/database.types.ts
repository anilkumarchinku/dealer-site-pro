/**
 * Auto-generated Supabase database types.
 * To regenerate run: npm run db:types
 *
 * DO NOT EDIT manually — wrong column names here will cause build errors.
 */

export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export interface Database {
  public: {
    Tables: {
      dealers: {
        Row: {
          id: string
          user_id: string
          dealership_name: string
          tagline: string | null
          location: string | null
          full_address: string | null
          map_link: string | null
          years_in_business: number | null
          phone: string | null
          whatsapp: string | null
          email: string | null
          gstin: string | null
          logo_url: string | null
          hero_image_url: string | null
          sells_new_cars: boolean
          sells_used_cars: boolean
          inventory_system: string | null
          style_template: string | null
          dealer_type: string | null
          subdomain: string | null
          slug: string | null
          onboarding_step: number
          onboarding_complete: boolean
          is_active: boolean
          role: string | null
          cyepro_api_key: string | null
          branches: Json | null
          created_at: string
          updated_at: string
        }
        Insert: Partial<Database['public']['Tables']['dealers']['Row']> & {
          user_id: string
          dealership_name: string
        }
        Update: Partial<Database['public']['Tables']['dealers']['Row']>
      }
      vehicles: {
        Row: {
          id: string
          dealer_id: string
          vin: string | null
          make: string
          model: string
          variant: string | null
          year: number
          price_paise: number
          on_road_price_paise: number | null
          mileage_km: number | null
          color: string | null
          body_type: string | null
          transmission: string | null
          fuel_type: string | null
          seating_capacity: number | null
          engine_cc: number | null
          features: string[]
          description: string | null
          condition: 'new' | 'used' | 'certified_pre_owned'
          status: 'available' | 'reserved' | 'sold' | 'inactive'
          views: number          // ← correct name (NOT view_count)
          leads_count: number
          is_featured: boolean
          created_at: string
          updated_at: string
          // video_url does NOT exist — do not add it
        }
        Insert: Partial<Database['public']['Tables']['vehicles']['Row']> & {
          dealer_id: string
          make: string
          model: string
          year: number
          price_paise: number
        }
        Update: Partial<Database['public']['Tables']['vehicles']['Row']>
      }
      leads: {
        Row: {
          id: string
          dealer_id: string
          vehicle_id: string | null
          name: string
          phone: string
          email: string | null
          message: string | null
          source: string | null
          status: string
          created_at: string
        }
        Insert: Partial<Database['public']['Tables']['leads']['Row']> & {
          dealer_id: string
          name: string
          phone: string
        }
        Update: Partial<Database['public']['Tables']['leads']['Row']>
      }
    }
  }
}

// Convenience row types
export type DealerRow    = Database['public']['Tables']['dealers']['Row']
export type VehicleRow   = Database['public']['Tables']['vehicles']['Row']
export type LeadRow      = Database['public']['Tables']['leads']['Row']
