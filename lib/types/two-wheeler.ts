/**
 * Two-Wheeler Dealership Module — TypeScript Types
 * All types for 2W inventory, used vehicles, leads, service bookings, and payments.
 */

// ── Primitive enums ───────────────────────────────────────────

export type TwoWheelerType = 'bike' | 'scooter' | 'moped' | 'electric'

export type TwoWheelerFuelType = 'petrol' | 'electric'

export type TwoWheelerStockStatus = 'available' | 'booking_open' | 'out_of_stock'

export type TwoWheelerConditionGrade = 'A' | 'B' | 'C'

export type TwoWheelerRCStatus = 'clear' | 'hypothecation' | 'pending'

export type TwoWheelerLeadType =
    | 'test_ride'
    | 'best_price'
    | 'finance'
    | 'exchange'
    | 'callback'
    | 'inspection'
    | 'offer'
    | 'service'
    | 'parts'

export type TwoWheelerServiceType =
    | 'general_service'
    | 'oil_change'
    | 'tyre'
    | 'battery'
    | 'repair'
    | 'amc'

export type TwoWheelerLeadStatus = 'new' | 'contacted' | 'converted' | 'lost'

export type TwoWheelerServiceStatus = 'pending' | 'confirmed' | 'completed' | 'cancelled'

export type TwoWheelerBookingStatus = 'pending' | 'paid' | 'failed' | 'refunded'

// ── Shared sub-types ──────────────────────────────────────────

export interface TwoWheelerColor {
    name: string
    hex:  string
}

// ── Main entity interfaces ────────────────────────────────────

export interface TwoWheelerVehicle {
    id:                      string
    dealer_id:               string

    type:                    TwoWheelerType
    brand:                   string
    model:                   string
    variant:                 string | null
    year:                    number

    engine_cc:               number | null
    battery_kwh:             number | null
    fuel_type:               TwoWheelerFuelType
    mileage_kmpl:            number | null
    range_km:                number | null
    top_speed_kmph:          number | null

    colors:                  TwoWheelerColor[]

    ex_showroom_price_paise: number
    on_road_price_paise:     number | null
    emi_starting_paise:      number | null

    stock_status:            TwoWheelerStockStatus

    images:                  string[]
    brochure_url:            string | null

    bs6_compliant:           boolean
    fame_subsidy_eligible:   boolean
    charging_time_hours:     number | null
    battery_warranty_years:  number | null

    description:             string | null
    features:                string[]

    status:                  'active' | 'inactive'
    views:                   number

    created_at:              string
    updated_at:              string
}

export interface TwoWheelerUsedVehicle {
    id:                    string
    dealer_id:             string

    type:                  TwoWheelerType
    brand:                 string
    model:                 string
    variant:               string | null
    year:                  number
    fuel_type:             TwoWheelerFuelType

    km_driven:             number
    no_of_owners:          number
    condition_grade:       TwoWheelerConditionGrade | null
    rc_status:             TwoWheelerRCStatus | null
    insurance_valid_until: string | null   // ISO date
    inspection_report_url: string | null
    certified_pre_owned:   boolean

    price_paise:           number
    negotiable:            boolean

    images:                string[]
    description:           string | null

    status:                'available' | 'sold' | 'reserved'

    created_at:            string
    updated_at:            string
}

export interface TwoWheelerLead {
    id:                 string
    dealer_id:          string

    vehicle_id:         string | null
    used_vehicle_id:    string | null

    lead_type:          TwoWheelerLeadType

    name:               string
    phone:              string
    email:              string | null
    preferred_date:     string | null   // ISO date
    message:            string | null
    offer_price_paise:  number | null

    status:             TwoWheelerLeadStatus

    created_at:         string
}

export interface TwoWheelerServiceBooking {
    id:              string
    dealer_id:       string

    customer_name:   string
    phone:           string
    vehicle_make:    string | null
    vehicle_model:   string | null
    vehicle_year:    number | null
    km_reading:      number | null

    service_type:    TwoWheelerServiceType
    preferred_date:  string   // ISO date
    preferred_slot:  string

    status:          TwoWheelerServiceStatus

    created_at:      string
}

export interface TwoWheelerBooking {
    id:                    string
    dealer_id:             string

    vehicle_id:            string | null
    used_vehicle_id:       string | null

    customer_name:         string
    phone:                 string
    email:                 string | null

    booking_amount_paise:  number
    razorpay_order_id:     string | null
    razorpay_payment_id:   string | null
    idempotency_key:       string

    status:                TwoWheelerBookingStatus

    created_at:            string
}

// ── Payload types for insert operations ───────────────────────

export type AddTwoWheelerVehiclePayload = Omit<
    TwoWheelerVehicle,
    'id' | 'views' | 'created_at' | 'updated_at'
>

export type AddTwoWheelerUsedVehiclePayload = Omit<
    TwoWheelerUsedVehicle,
    'id' | 'created_at' | 'updated_at'
>

export type CreateTwoWheelerLeadPayload = Omit<TwoWheelerLead, 'id' | 'status' | 'created_at'>

export type CreateServiceBookingPayload = Omit<TwoWheelerServiceBooking, 'id' | 'status' | 'created_at'>

export type CreateTwoWheelerBookingPayload = Omit<
    TwoWheelerBooking,
    'id' | 'razorpay_order_id' | 'razorpay_payment_id' | 'status' | 'created_at'
>

// ── Filter types ──────────────────────────────────────────────

export interface TwoWheelerFilters {
    type?:        TwoWheelerType
    brand?:       string
    fuelType?:    TwoWheelerFuelType
    minPrice?:    number   // in paise
    maxPrice?:    number   // in paise
    stockStatus?: TwoWheelerStockStatus
    sortBy?:      'price_asc' | 'price_desc' | 'newest' | 'views'
    page?:        number
    pageSize?:    number
}

export interface TwoWheelerUsedFilters {
    type?:           TwoWheelerType
    brand?:          string
    fuelType?:       TwoWheelerFuelType
    minPrice?:       number
    maxPrice?:       number
    conditionGrade?: TwoWheelerConditionGrade
    maxKm?:          number
    sortBy?:         'price_asc' | 'price_desc' | 'newest' | 'km_asc'
    page?:           number
    pageSize?:       number
}

export interface TwoWheelerLeadFilters {
    leadType?: TwoWheelerLeadType
    status?:   TwoWheelerLeadStatus
    page?:     number
    pageSize?: number
}

export interface ServiceBookingFilters {
    status?:   TwoWheelerServiceStatus
    page?:     number
    pageSize?: number
}

// ── Compare state (used client-side) ─────────────────────────

export interface TwoWheelerCompareItem {
    id:    string
    brand: string
    model: string
    image: string | null
}
