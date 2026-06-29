import type { LucideIcon } from "lucide-react"

export type SectionId =
    | "dashboard"
    | "inquiries"
    | "test-drives"
    | "sell-requests"
    | "service-bookings"
    | "dealer-info"

export type Dealer = {
    dealership_name: string
    location: string
    full_address?: string | null
    phone: string
    whatsapp?: string | null
    email: string
    branches?: Array<{ city?: string; state?: string; address?: string; phone?: string }> | null
    tagline?: string | null
}

export type Lead = {
    id: string
    lead_type: string
    status: string
    vehicle_interest?: string | null
    message?: string | null
    created_at: string
}

export type TestDrive = {
    id: string
    vehicle_interest?: string | null
    preferred_date?: string | null
    preferred_time?: string | null
    status: string
    created_at: string
}

export type SellRequest = {
    id: string
    make: string
    model?: string | null
    variant?: string | null
    year?: number | null
    expected_price_paise?: number | null
    status: string
    preferred_date?: string | null
    created_at: string
}

export type ServiceBooking = {
    id: string
    customer_name: string
    phone?: string | null
    email?: string | null
    vehicle_reg_no?: string | null
    vehicle_make?: string | null
    vehicle_model?: string | null
    service_type: string
    preferred_date: string
    preferred_slot: string
    status: string
    created_at: string
}

export type Vehicle = {
    id: string
    make: string
    model: string
    variant?: string | null
    year: number
    price_paise: number
    fuel_type?: string | null
    transmission?: string | null
    mileage_km?: number | null
}

export type Offer = {
    id: string
    title: string
    description?: string | null
    tag?: string | null
    valid_until?: string | null
}

export type PanelData = {
    dealer: Dealer
    history: {
        inquiries: Lead[]
        test_drives: TestDrive[]
        sell_requests: SellRequest[]
        service_bookings: ServiceBooking[]
    }
    new_arrivals: Vehicle[]
    offers: Offer[]
}

export interface NavItem {
    id: SectionId
    label: string
    icon: LucideIcon
}
