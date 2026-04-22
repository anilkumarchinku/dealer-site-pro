/**
 * Supabase database types — manually maintained to match migrations.
 * To regenerate: npx supabase gen types typescript --project-id llsvbyeumrfngjvbedbz > lib/database.types.ts
 * (Requires: npx supabase login)
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
          google_maps_url: string | null
          google_place_id: string | null
          years_in_business: number | null
          phone: string | null
          whatsapp: string | null
          email: string | null
          gstin: string | null
          logo_url: string | null
          hero_image_url: string | null
          sells_new_cars: boolean
          sells_used_cars: boolean
          sells_two_wheelers: boolean
          sells_three_wheelers: boolean
          sells_four_wheelers: boolean
          inventory_system: string | null
          style_template: string | null
          dealer_type: string | null
          subdomain: string | null
          slug: string | null
          custom_domain: string | null
          dns_verified: boolean
          onboarding_step: number
          onboarding_complete: boolean
          is_active: boolean
          role: string | null
          cyepro_api_key: string | null
          branches: Json | null
          vehicle_type: string | null
          brands: string[] | null
          created_at: string
          updated_at: string
        }
        Insert: Partial<Database['public']['Tables']['dealers']['Row']> & {
          user_id: string
          dealership_name: string
        }
        Update: Partial<Database['public']['Tables']['dealers']['Row']>
        Relationships: []
      }
      dealer_brands: {
        Row: {
          id: string
          dealer_id: string
          brand_name: string
          is_primary: boolean
          vehicle_type: string | null
          created_at: string
        }
        Insert: Partial<Database['public']['Tables']['dealer_brands']['Row']> & {
          dealer_id: string
          brand_name: string
        }
        Update: Partial<Database['public']['Tables']['dealer_brands']['Row']>
        Relationships: []
      }
      dealer_services: {
        Row: {
          id: string
          dealer_id: string
          service_name: string
          is_active: boolean
          created_at: string
        }
        Insert: Partial<Database['public']['Tables']['dealer_services']['Row']> & {
          dealer_id: string
          service_name: string
        }
        Update: Partial<Database['public']['Tables']['dealer_services']['Row']>
        Relationships: []
      }
      dealer_template_configs: {
        Row: {
          id: string
          dealer_id: string
          hero_title: string | null
          hero_subtitle: string | null
          hero_cta_text: string | null
          features_title: string | null
          facebook_url: string | null
          instagram_url: string | null
          twitter_url: string | null
          youtube_url: string | null
          linkedin_url: string | null
          working_hours: string | null
          created_at: string
          updated_at: string
        }
        Insert: Partial<Database['public']['Tables']['dealer_template_configs']['Row']> & {
          dealer_id: string
        }
        Update: Partial<Database['public']['Tables']['dealer_template_configs']['Row']>
        Relationships: []
      }
      dealer_site_configs: {
        Row: {
          id: string
          dealer_id: string
          brand_slug: string
          style_template: string | null
          hero_title: string | null
          hero_subtitle: string | null
          hero_cta_text: string | null
          tagline: string | null
          working_hours: string | null
          created_at: string
          updated_at: string
        }
        Insert: Partial<Database['public']['Tables']['dealer_site_configs']['Row']> & {
          dealer_id: string
          brand_slug: string
        }
        Update: Partial<Database['public']['Tables']['dealer_site_configs']['Row']>
        Relationships: []
      }
      dealer_domains: {
        Row: {
          id: string
          dealer_id: string
          subdomain: string | null
          subdomain_url: string | null
          custom_domain: string | null
          domain_type: 'subdomain' | 'custom' | 'managed'
          status: 'pending' | 'active' | 'failed' | 'expired' | 'suspended'
          ssl_status: 'pending' | 'provisioning' | 'active' | 'expired' | 'failed'
          is_primary: boolean
          site_slug: string | null
          verification_token: string | null
          dns_verified: boolean
          dns_verified_at: string | null
          ssl_provisioned_at: string | null
          ssl_expires_at: string | null
          last_checked_at: string | null
          registrar: string | null
          registration_expires_at: string | null
          auto_renew: boolean
          created_at: string
          updated_at: string
        }
        Insert: Partial<Database['public']['Tables']['dealer_domains']['Row']> & {
          dealer_id: string
        }
        Update: Partial<Database['public']['Tables']['dealer_domains']['Row']>
        Relationships: []
      }
      domains: {
        Row: {
          id: string
          dealer_id: string
          domain: string
          slug: string
          type: 'subdomain' | 'custom' | 'managed'
          template_id: string | null
          status: 'pending' | 'verifying' | 'active' | 'failed' | 'expired'
          ssl_status: 'pending' | 'provisioning' | 'active' | 'expired' | 'failed'
          is_primary: boolean
          dns_verified_at: string | null
          ssl_provisioned_at: string | null
          ssl_expires_at: string | null
          last_checked_at: string | null
          registrar: string | null
          registration_expires_at: string | null
          auto_renew: boolean
          created_at: string
          updated_at: string
        }
        Insert: Partial<Database['public']['Tables']['domains']['Row']> & {
          dealer_id: string
          domain: string
          slug: string
        }
        Update: Partial<Database['public']['Tables']['domains']['Row']>
        Relationships: []
      }
      domain_subscriptions: {
        Row: {
          id: string
          dealer_id: string
          domain_id: string | null
          plan: 'free' | 'pro' | 'premium' | 'enterprise'
          tier: 'pro' | 'premium' | null
          price_paise: number
          billing_cycle: 'monthly' | 'yearly'
          razorpay_subscription_id: string | null
          razorpay_plan_id: string | null
          razorpay_customer_id: string | null
          razorpay_order_id: string | null
          razorpay_payment_id: string | null
          status: 'active' | 'cancelled' | 'past_due' | 'expired' | 'trialing' | 'pending' | 'failed'
          current_period_start: string | null
          current_period_end: string | null
          cancelled_at: string | null
          cancel_reason: string | null
          created_at: string
          updated_at: string
        }
        Insert: Partial<Database['public']['Tables']['domain_subscriptions']['Row']> & {
          dealer_id: string
        }
        Update: Partial<Database['public']['Tables']['domain_subscriptions']['Row']>
        Relationships: []
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
          views: number
          leads_count: number
          is_featured: boolean
          image_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: Partial<Database['public']['Tables']['vehicles']['Row']> & {
          dealer_id: string
          make: string
          model: string
          year: number
          price_paise: number
        }
        Update: Partial<Database['public']['Tables']['vehicles']['Row']>
        Relationships: []
      }
      leads: {
        Row: {
          id: string
          dealer_id: string
          vehicle_id: string | null
          customer_name: string
          customer_email: string | null
          customer_phone: string
          lead_type: string
          priority: 'hot' | 'warm' | 'cold'
          status: 'new' | 'contacted' | 'qualified' | 'converted' | 'lost'
          message: string | null
          notes: string | null
          vehicle_interest: string | null
          source: string
          utm_source: string | null
          utm_medium: string | null
          utm_campaign: string | null
          follow_up_date: string | null
          contacted_at: string | null
          converted_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: Partial<Database['public']['Tables']['leads']['Row']> & {
          dealer_id: string
          customer_name: string
          customer_phone: string
        }
        Update: Partial<Database['public']['Tables']['leads']['Row']>
        Relationships: []
      }
      test_drive_bookings: {
        Row: {
          id: string
          dealer_id: string
          lead_id: string | null
          vehicle_id: string | null
          customer_name: string
          customer_phone: string
          customer_email: string | null
          vehicle_interest: string | null
          preferred_date: string | null
          preferred_time: string | null
          status: 'pending' | 'confirmed' | 'completed' | 'cancelled' | 'no_show'
          notes: string | null
          source: string
          utm_source: string | null
          confirmed_at: string | null
          completed_at: string | null
          cancelled_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: Partial<Database['public']['Tables']['test_drive_bookings']['Row']> & {
          dealer_id: string
          customer_name: string
          customer_phone: string
        }
        Update: Partial<Database['public']['Tables']['test_drive_bookings']['Row']>
        Relationships: []
      }
      messages: {
        Row: {
          id: string
          dealer_id: string
          sender_name: string
          sender_email: string | null
          sender_phone: string | null
          subject: string | null
          content: string
          is_read: boolean
          is_starred: boolean
          is_archived: boolean
          read_at: string | null
          replied_at: string | null
          created_at: string
        }
        Insert: Partial<Database['public']['Tables']['messages']['Row']> & {
          dealer_id: string
          sender_name: string
          content: string
        }
        Update: Partial<Database['public']['Tables']['messages']['Row']>
        Relationships: []
      }
      reviews: {
        Row: {
          id: string
          dealer_id: string
          vehicle_id: string | null
          customer_name: string
          customer_email: string | null
          rating: number
          title: string | null
          content: string | null
          status: 'pending' | 'published' | 'rejected'
          is_featured: boolean
          admin_reply: string | null
          replied_at: string | null
          source: string
          created_at: string
          updated_at: string
        }
        Insert: Partial<Database['public']['Tables']['reviews']['Row']> & {
          dealer_id: string
          customer_name: string
          rating: number
        }
        Update: Partial<Database['public']['Tables']['reviews']['Row']>
        Relationships: []
      }
      dealer_reviews: {
        Row: {
          id: string
          dealer_id: string
          reviewer_name: string
          reviewer_phone: string | null
          rating: number
          review_text: string | null
          car_purchased: string | null
          is_approved: boolean
          created_at: string
        }
        Insert: Partial<Database['public']['Tables']['dealer_reviews']['Row']> & {
          dealer_id: string
          reviewer_name: string
          rating: number
        }
        Update: Partial<Database['public']['Tables']['dealer_reviews']['Row']>
        Relationships: []
      }
      analytics_daily: {
        Row: {
          id: string
          dealer_id: string
          date: string
          page_views: number
          unique_visitors: number
          bounce_rate: number | null
          leads_count: number
          test_drives_count: number
          calls_count: number
          whatsapp_count: number
          organic_traffic: number
          social_traffic: number
          direct_traffic: number
          referral_traffic: number
          top_pages: Json
          mobile_pct: number | null
          desktop_pct: number | null
          tablet_pct: number | null
          created_at: string
        }
        Insert: Partial<Database['public']['Tables']['analytics_daily']['Row']> & {
          dealer_id: string
          date: string
        }
        Update: Partial<Database['public']['Tables']['analytics_daily']['Row']>
        Relationships: []
      }
      dealer_deployments: {
        Row: {
          id: string
          dealer_id: string
          domain_id: string | null
          status: 'pending' | 'deploying' | 'ready' | 'failed'
          vercel_deployment_id: string | null
          vercel_url: string | null
          site_url: string | null
          github_repo: string | null
          is_current: boolean
          error_message: string | null
          created_at: string
          updated_at: string
        }
        Insert: Partial<Database['public']['Tables']['dealer_deployments']['Row']> & {
          dealer_id: string
        }
        Update: Partial<Database['public']['Tables']['dealer_deployments']['Row']>
        Relationships: []
      }
      otp_codes: {
        Row: {
          id: string
          phone: string
          code: string
          expires_at: string
          attempts: number
          used: boolean
          created_at: string
        }
        Insert: Partial<Database['public']['Tables']['otp_codes']['Row']> & {
          phone: string
          code: string
          expires_at: string
        }
        Update: Partial<Database['public']['Tables']['otp_codes']['Row']>
        Relationships: []
      }
      domain_onboardings: {
        Row: {
          id: string
          user_id: string
          domain_name: string
          registrar: string | null
          access_level: string | null
          verification: Json | null
          dns_analysis: Json | null
          configuration: Json | null
          ssl: Json | null
          deployment: Json | null
          test_results: Json | null
          current_state: string
          error_message: string | null
          created_at: string
          updated_at: string
          completed_at: string | null
        }
        Insert: Partial<Database['public']['Tables']['domain_onboardings']['Row']> & {
          user_id: string
          domain_name: string
        }
        Update: Partial<Database['public']['Tables']['domain_onboardings']['Row']>
        Relationships: []
      }
      tw_vehicles: {
        Row: {
          id: string
          dealer_id: string
          type: 'bike' | 'scooter' | 'moped' | 'electric'
          brand: string
          model: string
          variant: string | null
          year: number
          engine_cc: number | null
          battery_kwh: number | null
          fuel_type: 'petrol' | 'electric'
          mileage_kmpl: number | null
          range_km: number | null
          top_speed_kmph: number | null
          colors: Json
          ex_showroom_price_paise: number
          on_road_price_paise: number | null
          emi_starting_paise: number | null
          stock_status: 'available' | 'booking_open' | 'out_of_stock'
          images: string[]
          brochure_url: string | null
          bs6_compliant: boolean
          fame_subsidy_eligible: boolean
          charging_time_hours: number | null
          battery_warranty_years: number | null
          description: string | null
          features: string[]
          status: 'active' | 'inactive'
          views: number
          created_at: string
          updated_at: string
        }
        Insert: Partial<Database['public']['Tables']['tw_vehicles']['Row']> & {
          dealer_id: string
          type: string
          brand: string
          model: string
          year: number
          fuel_type: string
          ex_showroom_price_paise: number
        }
        Update: Partial<Database['public']['Tables']['tw_vehicles']['Row']>
        Relationships: []
      }
      tw_used_vehicles: {
        Row: {
          id: string
          dealer_id: string
          type: string
          brand: string
          model: string
          variant: string | null
          year: number
          fuel_type: string
          km_driven: number
          no_of_owners: number
          condition_grade: string | null
          rc_status: string | null
          insurance_valid_until: string | null
          inspection_report_url: string | null
          certified_pre_owned: boolean
          price_paise: number
          negotiable: boolean
          images: string[]
          description: string | null
          status: 'available' | 'sold' | 'reserved'
          created_at: string
          updated_at: string
        }
        Insert: Partial<Database['public']['Tables']['tw_used_vehicles']['Row']> & {
          dealer_id: string
          type: string
          brand: string
          model: string
          year: number
          fuel_type: string
          km_driven: number
          price_paise: number
        }
        Update: Partial<Database['public']['Tables']['tw_used_vehicles']['Row']>
        Relationships: []
      }
      tw_leads: {
        Row: {
          id: string
          dealer_id: string
          vehicle_id: string | null
          used_vehicle_id: string | null
          lead_type: string
          name: string
          phone: string
          email: string | null
          preferred_date: string | null
          message: string | null
          offer_price_paise: number | null
          status: string
          created_at: string
        }
        Insert: Partial<Database['public']['Tables']['tw_leads']['Row']> & {
          dealer_id: string
          lead_type: string
          name: string
          phone: string
        }
        Update: Partial<Database['public']['Tables']['tw_leads']['Row']>
        Relationships: []
      }
      tw_service_bookings: {
        Row: {
          id: string
          dealer_id: string
          customer_name: string
          phone: string
          vehicle_make: string | null
          vehicle_model: string | null
          vehicle_year: number | null
          km_reading: number | null
          service_type: string
          preferred_date: string
          preferred_slot: string
          status: string
          created_at: string
        }
        Insert: Partial<Database['public']['Tables']['tw_service_bookings']['Row']> & {
          dealer_id: string
          customer_name: string
          phone: string
          service_type: string
          preferred_date: string
          preferred_slot: string
        }
        Update: Partial<Database['public']['Tables']['tw_service_bookings']['Row']>
        Relationships: []
      }
      tw_bookings: {
        Row: {
          id: string
          dealer_id: string
          vehicle_id: string | null
          used_vehicle_id: string | null
          customer_name: string
          phone: string
          email: string | null
          booking_amount_paise: number
          razorpay_order_id: string | null
          razorpay_payment_id: string | null
          idempotency_key: string
          status: string
          created_at: string
        }
        Insert: Partial<Database['public']['Tables']['tw_bookings']['Row']> & {
          dealer_id: string
          customer_name: string
          phone: string
          booking_amount_paise: number
          idempotency_key: string
        }
        Update: Partial<Database['public']['Tables']['tw_bookings']['Row']>
        Relationships: []
      }
      thw_vehicles: {
        Row: {
          id: string
          dealer_id: string
          type: 'passenger' | 'cargo' | 'electric' | 'school_van'
          brand: string
          model: string
          variant: string | null
          year: number
          fuel_type: string
          engine_cc: number | null
          battery_kwh: number | null
          range_km: number | null
          charging_time_hours: number | null
          battery_warranty_years: number | null
          payload_kg: number | null
          body_type: string | null
          passenger_capacity: number | null
          max_speed_kmph: number | null
          mileage_kmpl: number | null
          cng_mileage_km_per_kg: number | null
          permit_type: string | null
          gvw_kg: number | null
          fame_subsidy_eligible: boolean
          bs6_compliant: boolean
          ex_showroom_price_paise: number
          on_road_price_paise: number | null
          emi_starting_paise: number | null
          stock_status: string
          colors: Json
          images: string[]
          brochure_url: string | null
          description: string | null
          features: string[]
          status: 'active' | 'inactive'
          views: number
          created_at: string
          updated_at: string
        }
        Insert: Partial<Database['public']['Tables']['thw_vehicles']['Row']> & {
          dealer_id: string
          type: string
          brand: string
          model: string
          year: number
          fuel_type: string
          ex_showroom_price_paise: number
        }
        Update: Partial<Database['public']['Tables']['thw_vehicles']['Row']>
        Relationships: []
      }
      thw_used_vehicles: {
        Row: {
          id: string
          dealer_id: string
          type: string
          brand: string
          model: string
          variant: string | null
          year: number
          fuel_type: string
          km_driven: number
          no_of_owners: number
          condition_grade: string | null
          rc_status: string | null
          insurance_valid_until: string | null
          certified_pre_owned: boolean
          price_paise: number
          negotiable: boolean
          images: string[]
          description: string | null
          status: string
          created_at: string
          updated_at: string
        }
        Insert: Partial<Database['public']['Tables']['thw_used_vehicles']['Row']> & {
          dealer_id: string
          type: string
          brand: string
          model: string
          year: number
          fuel_type: string
          km_driven: number
          price_paise: number
        }
        Update: Partial<Database['public']['Tables']['thw_used_vehicles']['Row']>
        Relationships: []
      }
      thw_leads: {
        Row: {
          id: string
          dealer_id: string
          vehicle_id: string | null
          used_vehicle_id: string | null
          lead_type: string
          name: string
          phone: string
          email: string | null
          preferred_date: string | null
          message: string | null
          status: string
          created_at: string
        }
        Insert: Partial<Database['public']['Tables']['thw_leads']['Row']> & {
          dealer_id: string
          lead_type: string
          name: string
          phone: string
        }
        Update: Partial<Database['public']['Tables']['thw_leads']['Row']>
        Relationships: []
      }
      thw_service_bookings: {
        Row: {
          id: string
          dealer_id: string
          customer_name: string
          phone: string
          vehicle_make: string | null
          vehicle_model: string | null
          vehicle_year: number | null
          km_reading: number | null
          service_type: string
          preferred_date: string
          preferred_slot: string
          status: string
          created_at: string
        }
        Insert: Partial<Database['public']['Tables']['thw_service_bookings']['Row']> & {
          dealer_id: string
          customer_name: string
          phone: string
          service_type: string
          preferred_date: string
          preferred_slot: string
        }
        Update: Partial<Database['public']['Tables']['thw_service_bookings']['Row']>
        Relationships: []
      }
      thw_bookings: {
        Row: {
          id: string
          dealer_id: string
          vehicle_id: string | null
          used_vehicle_id: string | null
          customer_name: string
          phone: string
          email: string | null
          booking_amount_paise: number
          razorpay_order_id: string | null
          razorpay_payment_id: string | null
          idempotency_key: string
          status: string
          created_at: string
        }
        Insert: Partial<Database['public']['Tables']['thw_bookings']['Row']> & {
          dealer_id: string
          customer_name: string
          phone: string
          booking_amount_paise: number
          idempotency_key: string
        }
        Update: Partial<Database['public']['Tables']['thw_bookings']['Row']>
        Relationships: []
      }
      domain_verifications: {
        Row: {
          id: string
          domain_id: string
          record_type: 'A' | 'CNAME' | 'TXT'
          record_name: string
          expected_value: string
          actual_value: string | null
          is_verified: boolean
          error_message: string | null
          checked_at: string
          created_at: string
        }
        Insert: Partial<Database['public']['Tables']['domain_verifications']['Row']> & {
          domain_id: string
          record_type: 'A' | 'CNAME' | 'TXT'
          record_name: string
          expected_value: string
        }
        Update: Partial<Database['public']['Tables']['domain_verifications']['Row']>
        Relationships: []
      }
      payment_idempotency_log: {
        Row: {
          id: string
          idempotency_key: string
          payment_id: string
          subscription_id: string | null
          response: Json | null
          created_at: string
        }
        Insert: Partial<Database['public']['Tables']['payment_idempotency_log']['Row']> & {
          idempotency_key: string
          payment_id: string
        }
        Update: Partial<Database['public']['Tables']['payment_idempotency_log']['Row']>
        Relationships: []
      }
      car_catalog: {
        Row: {
          id: string
          make: string
          model: string
          variant: string | null
          year: number
          fuel_type: string | null
          transmission: string | null
          body_type: string | null
          seating_capacity: number | null
          price_min_paise: number | null
          price_max_paise: number | null
          engine_cc: number | null
          mileage_kmpl: number | null
          image_url: string | null
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: Partial<Database['public']['Tables']['car_catalog']['Row']> & {
          make: string
          model: string
          year: number
        }
        Update: Partial<Database['public']['Tables']['car_catalog']['Row']>
        Relationships: []
      }
      notification_settings: {
        Row: {
          id: string
          dealer_id: string
          new_leads: boolean
          test_drives: boolean
          service_bookings: boolean
          new_reviews: boolean
          weekly_report: boolean
          created_at: string
          updated_at: string
        }
        Insert: Partial<Database['public']['Tables']['notification_settings']['Row']> & {
          dealer_id: string
        }
        Update: Partial<Database['public']['Tables']['notification_settings']['Row']>
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      increment_tw_vehicle_view: {
        Args: { vehicle_id: string }
        Returns: undefined
      }
      increment_thw_vehicle_view: {
        Args: { vehicle_id: string }
        Returns: undefined
      }
      increment_vehicle_view: {
        Args: { vehicle_id: string }
        Returns: undefined
      }
    }
    Enums: {
      [_ in never]: never
    }
  }
}

// ── Convenience row types ─────────────────────────────────────────────────────
export type DealerRow                = Database['public']['Tables']['dealers']['Row']
export type DealerBrandRow           = Database['public']['Tables']['dealer_brands']['Row']
export type DealerServiceRow         = Database['public']['Tables']['dealer_services']['Row']
export type DealerTemplateConfigRow  = Database['public']['Tables']['dealer_template_configs']['Row']
export type DealerSiteConfigRow      = Database['public']['Tables']['dealer_site_configs']['Row']
export type DealerDomainRow          = Database['public']['Tables']['dealer_domains']['Row']
export type DomainRow                = Database['public']['Tables']['domains']['Row']
export type DomainSubscriptionRow    = Database['public']['Tables']['domain_subscriptions']['Row']
export type VehicleRow               = Database['public']['Tables']['vehicles']['Row']
export type LeadRow                  = Database['public']['Tables']['leads']['Row']
export type MessageRow               = Database['public']['Tables']['messages']['Row']
export type ReviewRow                = Database['public']['Tables']['reviews']['Row']
export type DealerReviewRow          = Database['public']['Tables']['dealer_reviews']['Row']
export type AnalyticsDailyRow        = Database['public']['Tables']['analytics_daily']['Row']
export type DealerDeploymentRow      = Database['public']['Tables']['dealer_deployments']['Row']
