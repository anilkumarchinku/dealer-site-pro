// ── Three-Wheeler Module Types ────────────────────────────────

export type ThreeWheelerType        = 'passenger' | 'cargo' | 'electric' | 'school_van'
export type ThreeWheelerFuelType    = 'petrol' | 'diesel' | 'cng' | 'electric' | 'lpg'
export type ThreeWheelerStockStatus = 'available' | 'booking_open' | 'out_of_stock'
export type ThreeWheelerBodyType    = 'flatbed' | 'closed_body' | 'tipper' | 'container' | 'tanker' | 'pickup'
export type ThreeWheelerPermit      = 'all_india' | 'state' | 'city' | 'none'
export type ThreeWheelerConditionGrade = 'A' | 'B' | 'C'
export type ThreeWheelerRCStatus    = 'clear' | 'hypothecation' | 'pending'
export type ThreeWheelerLeadType    =
    | 'test_drive' | 'best_price' | 'finance' | 'exchange'
    | 'callback' | 'inspection' | 'offer' | 'service' | 'parts' | 'demo'
export type ThreeWheelerServiceType =
    | 'general_service' | 'oil_change' | 'tyre' | 'battery'
    | 'cng_kit' | 'body_work' | 'electrical' | 'repair' | 'amc'
export type ThreeWheelerLeadStatus    = 'new' | 'contacted' | 'converted' | 'lost'
export type ThreeWheelerServiceStatus = 'pending' | 'confirmed' | 'completed' | 'cancelled'
export type ThreeWheelerBookingStatus = 'pending' | 'paid' | 'failed' | 'refunded'

export interface ThreeWheelerColor {
    name: string
    hex:  string
}

// ── New Inventory ─────────────────────────────────────────────

export interface ThreeWheelerVehicle {
    id:                     string
    dealer_id:              string

    type:                   ThreeWheelerType
    brand:                  string
    model:                  string
    variant:                string | null
    year:                   number

    fuel_type:              ThreeWheelerFuelType
    engine_cc:              number | null
    max_power:              string | null
    torque:                 string | null
    battery_kwh:            number | null
    range_km:               number | null
    charging_time_hours:    number | null
    battery_warranty_years: number | null
    transmission:           string | null

    // Cargo
    payload_kg:             number | null
    body_type:              ThreeWheelerBodyType | null

    // Passenger
    passenger_capacity:     number | null

    // Performance
    max_speed_kmph:         number | null
    mileage_kmpl:           number | null
    cng_mileage_km_per_kg:  number | null

    // Regulatory
    permit_type:            ThreeWheelerPermit | null
    gvw_kg:                 number | null
    fame_subsidy_eligible:  boolean
    bs6_compliant:          boolean

    // Pricing (paise)
    ex_showroom_price_paise: number
    on_road_price_paise:     number | null
    emi_starting_paise:      number | null

    stock_status:   ThreeWheelerStockStatus
    colors:         ThreeWheelerColor[]
    images:         string[]
    brochure_url:   string | null
    description:    string | null
    features:       string[]
    video_url:      string | null
    is_featured:    boolean

    status:     'active' | 'inactive'
    views:      number
    created_at: string
    updated_at: string
}

export type ThreeWheelerVehiclePayload = Omit<
    ThreeWheelerVehicle,
    'id' | 'views' | 'created_at' | 'updated_at'
>

// ── Used Stock ────────────────────────────────────────────────

export interface ThreeWheelerUsedVehicle {
    id:                         string
    dealer_id:                  string

    type:                       ThreeWheelerType
    brand:                      string
    model:                      string
    variant:                    string | null
    year:                       number
    fuel_type:                  ThreeWheelerFuelType

    km_driven:                  number
    no_of_owners:               number
    condition_grade:            ThreeWheelerConditionGrade | null

    rc_status:                  ThreeWheelerRCStatus | null
    vehicle_reg_no:             string | null
    permit_valid_until:         string | null
    fitness_certificate_valid:  string | null
    insurance_valid_until:      string | null
    inspection_report_url:      string | null
    certified_pre_owned:        boolean

    payload_kg:                 number | null
    body_type:                  ThreeWheelerBodyType | null
    passenger_capacity:         number | null

    price_paise:    number
    negotiable:     boolean
    images:         string[]
    description:    string | null
    video_url:      string | null
    is_featured:    boolean

    status:     'available' | 'sold' | 'reserved'
    created_at: string
    updated_at: string
}

export type ThreeWheelerUsedVehiclePayload = Omit<
    ThreeWheelerUsedVehicle,
    'id' | 'created_at' | 'updated_at'
>

// ── Lead ─────────────────────────────────────────────────────

export interface ThreeWheelerLead {
    id:               string
    dealer_id:        string
    vehicle_id:       string | null
    used_vehicle_id:  string | null
    lead_type:        ThreeWheelerLeadType
    name:             string
    phone:            string
    email:            string | null
    preferred_date:   string | null
    message:          string | null
    offer_price_paise: number | null
    fleet_size:       number | null
    status:           ThreeWheelerLeadStatus
    created_at:       string
}

// ── Service Booking ───────────────────────────────────────────

export interface ThreeWheelerServiceBooking {
    id:                 string
    dealer_id:          string
    customer_name:      string
    phone:              string
    vehicle_make:       string | null
    vehicle_model:      string | null
    vehicle_year:       number | null
    vehicle_reg_no:     string | null
    km_reading:         number | null
    service_type:       ThreeWheelerServiceType
    preferred_date:     string
    preferred_slot:     string
    status:             ThreeWheelerServiceStatus
    created_at:         string
}

// ── Booking (Razorpay) ────────────────────────────────────────

export interface ThreeWheelerBooking {
    id:                   string
    dealer_id:            string
    vehicle_id:           string | null
    used_vehicle_id:      string | null
    customer_name:        string
    phone:                string
    email:                string | null
    booking_amount_paise: number
    razorpay_order_id:    string | null
    razorpay_payment_id:  string | null
    idempotency_key:      string
    status:               ThreeWheelerBookingStatus
    created_at:           string
}

// ── Filters ───────────────────────────────────────────────────

export interface ThreeWheelerFilters {
    type?:        ThreeWheelerType
    brand?:       string
    fuelType?:    ThreeWheelerFuelType
    bodyType?:    ThreeWheelerBodyType
    minPrice?:    number
    maxPrice?:    number
    stockStatus?: ThreeWheelerStockStatus
    permitType?:  ThreeWheelerPermit   // 'all_india' | 'state' | 'city' | 'none'
    minPayload?:  number               // kg
    maxPayload?:  number               // kg
    sortBy?:      'price_asc' | 'price_desc' | 'newest' | 'views'
    page?:        number
    pageSize?:    number
}

export interface ThreeWheelerUsedFilters {
    type?:           ThreeWheelerType
    brand?:          string
    fuelType?:       ThreeWheelerFuelType
    conditionGrade?: ThreeWheelerConditionGrade
    maxKm?:          number
    minPrice?:       number
    maxPrice?:       number
    sortBy?:         'price_asc' | 'price_desc' | 'newest'
    page?:           number
    pageSize?:       number
}

// ── Compare state (used client-side) ─────────────────────────

export interface ThreeWheelerCompareItem {
    id:    string
    brand: string
    model: string
    image: string | null
}
