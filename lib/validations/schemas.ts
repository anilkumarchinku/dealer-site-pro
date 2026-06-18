/**
 * Shared Zod validation schemas for DealerSite Pro
 *
 * All API routes and frontend forms should use these schemas
 * to ensure consistent validation across the stack.
 */

import { z } from 'zod'

// ── Primitives ──────────────────────────────────────────────────

/** Indian mobile number: starts with 6-9, exactly 10 digits */
export const indianPhone = z
    .string()
    .trim()
    .regex(/^[6-9]\d{9}$/, 'Invalid Indian phone number (must be 10 digits starting with 6-9)')

/** Relaxed phone — allows country code prefix like +91, spaces, dashes */
export const flexPhone = z
    .string()
    .trim()
    .min(10, 'Phone number too short')
    .max(15, 'Phone number too long')
    .regex(/^[+]?[\d\s-]{10,15}$/, 'Invalid phone number format')

/** Standard email */
export const email = z
    .string()
    .trim()
    .email('Invalid email address')
    .max(254, 'Email too long')

/** Optional email — accepts empty string or valid email */
export const optionalEmail = z
    .string()
    .trim()
    .email('Invalid email address')
    .max(254, 'Email too long')
    .optional()
    .nullable()
    .or(z.literal(''))

/** Human name (2-100 chars, no digits or special chars) */
export const personName = z
    .string()
    .trim()
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name must be under 100 characters')

/** UUID (Supabase IDs) */
export const uuid = z.string().uuid('Invalid ID format')

/**
 * Safe URL — only http/https allowed.
 * Rejects javascript:, data:, vbscript: and empty/invalid strings.
 */
export const safeUrl = z
    .string()
    .trim()
    .max(2000, 'URL too long')
    .refine(
        (val) => {
            if (!val) return true
            try {
                const url = new URL(val)
                return url.protocol === 'http:' || url.protocol === 'https:'
            } catch {
                return false
            }
        },
        'URL must start with http:// or https://'
    )
    .optional()
    .nullable()
    .or(z.literal(''))

/** Free-text message (capped at 1000 chars) */
export const message = z
    .string()
    .trim()
    .max(1000, 'Message must be under 1000 characters')
    .optional()
    .nullable()

/** Date string in YYYY-MM-DD format */
export const dateString = z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format (expected YYYY-MM-DD)')

/** Time string like "9:00 AM" or "14:00" */
export const timeString = z
    .string()
    .min(1, 'Time is required')
    .max(20, 'Invalid time format')

// ── Lead schemas ────────────────────────────────────────────────

export const VALID_LEAD_SOURCES = [
    'contact_form', 'car_enquiry', 'test_drive', 'whatsapp', 'phone', 'price_alert'
] as const

export const leadSchema = z.object({
    dealer_id:   uuid,
    name:        personName,
    phone:       indianPhone,
    email:       optionalEmail,
    message:     message,
    car_id:      z.string().optional().nullable(),
    car_name:    z.string().max(200).optional().nullable(),
    lead_source: z.enum(VALID_LEAD_SOURCES).optional().default('contact_form'),
})

export type LeadInput = z.infer<typeof leadSchema>

export const sellRequestSchema = z.object({
    dealer_id:             uuid.optional().nullable(),
    seller_name:           personName,
    seller_phone:          indianPhone,
    seller_email:          optionalEmail,
    make:                  z.string().trim().min(1, 'Brand is required').max(100),
    model:                 z.string().trim().max(100).optional().nullable(),
    variant:               z.string().trim().max(100).optional().nullable(),
    year:                  z.number().int().min(1990).max(new Date().getFullYear() + 1),
    fuel_type:             z.string().trim().min(1, 'Fuel type is required').max(50),
    transmission:          z.string().trim().max(50).optional().nullable(),
    registration_number:   z.string().trim().max(20).optional().nullable(),
    mileage_km:            z.number().int().min(0).max(500_000),
    owner_count:           z.string().trim().max(20).optional().nullable(),
    expected_price_paise:  z.number().int().min(0).max(500_000_000).optional().nullable(),
    city:                  z.string().trim().max(100).optional().nullable(),
    address:               z.string().trim().max(500).optional().nullable(),
    preferred_date:        dateString.optional().nullable(),
    preferred_slot:        z.string().trim().max(50).optional().nullable(),
    estimated_low_paise:   z.number().int().min(0).max(500_000_000).optional().nullable(),
    estimated_high_paise:  z.number().int().min(0).max(500_000_000).optional().nullable(),
    photo_urls:            z.array(z.string().trim().url('Invalid photo URL').max(2000)).max(12).optional().default([]),
    notes:                 message,
})

export type SellRequestInput = z.infer<typeof sellRequestSchema>

// ── Test drive schema ───────────────────────────────────────────

export const testDriveSchema = z.object({
    dealer_id:      uuid,
    name:           personName,
    phone:          indianPhone,
    email:          optionalEmail,
    preferred_date: dateString,
    preferred_time: timeString,
    car_id:         z.string().optional().nullable(),
    car_name:       z.string().max(200).optional().nullable(),
    vehicle_type:   z.enum(['2w', '3w', '4w']).optional(),
})

export type TestDriveInput = z.infer<typeof testDriveSchema>

// ── OTP schema ──────────────────────────────────────────────────

export const sendOtpSchema = z.object({
    email:   email,
    purpose: z.enum(['login', 'register']),
})

export type SendOtpInput = z.infer<typeof sendOtpSchema>

// ── Two-wheeler lead schema ─────────────────────────────────────

export const TW_LEAD_TYPES = [
    'test_ride', 'best_price', 'finance', 'exchange', 'callback', 'inspection', 'offer', 'service', 'parts'
] as const

export const twLeadSchema = z.object({
    dealer_id:         uuid,
    lead_type:         z.enum(TW_LEAD_TYPES),
    name:              personName,
    phone:             indianPhone,
    email:             optionalEmail,
    vehicle_id:        z.string().optional().nullable(),
    vehicle_name:      z.string().max(200).optional().nullable(),
    used_vehicle_id:   z.string().optional().nullable(),
    preferred_date:    dateString.optional().nullable(),
    message:           message,
    // ₹1 crore ceiling (100,000 * 100 paise) — prevents absurd offer prices
    offer_price_paise: z.number().int().min(0).max(10_000_000).optional().nullable(),
})

export type TwLeadInput = z.infer<typeof twLeadSchema>

// ── Three-wheeler lead schema ────────────────────────────────────

export const THW_LEAD_TYPES = [
    'test_drive', 'best_price', 'finance', 'exchange', 'callback', 'inspection', 'offer', 'service', 'parts', 'demo'
] as const

export const thwLeadSchema = z.object({
    dealer_id:         uuid,
    lead_type:         z.enum(THW_LEAD_TYPES),
    name:              personName,
    phone:             indianPhone,
    email:             optionalEmail,
    vehicle_id:        z.string().optional().nullable(),
    vehicle_name:      z.string().max(200).optional().nullable(),
    used_vehicle_id:   z.string().optional().nullable(),
    preferred_date:    dateString.optional().nullable(),
    message:           message,
    offer_price_paise: z.number().int().min(0).max(10_000_000).optional().nullable(),
    fleet_size:        z.number().int().min(1).max(10_000).optional().nullable(),
})

export type ThwLeadInput = z.infer<typeof thwLeadSchema>

// ── Two-wheeler service booking schema ──────────────────────────

export const TW_SERVICE_TYPES = [
    'general_service', 'oil_change', 'tyre', 'battery', 'repair', 'amc'
] as const

export const serviceBookingSchema = z.object({
    dealer_id:      uuid,
    customer_name:  personName,
    phone:          indianPhone,
    service_type:   z.enum(TW_SERVICE_TYPES),
    preferred_date: dateString,
    preferred_slot: z.string().min(1, 'Time slot is required'),
    vehicle_make:   z.string().max(100).optional().nullable(),
    vehicle_model:  z.string().max(100).optional().nullable(),
    vehicle_year:   z.number().int().min(1990).max(new Date().getFullYear() + 1).optional().nullable(),
    km_reading:     z.number().int().min(0).optional().nullable(),
})

export type ServiceBookingInput = z.infer<typeof serviceBookingSchema>

export const CAR_SERVICE_TYPES = [
    'periodic_service', 'ac_service', 'tyre_alignment', 'accident_repair', 'inspection', 'battery', 'insurance_claim'
] as const

export const CAR_SERVICE_STATUSES = ['pending', 'confirmed', 'assigned', 'completed', 'cancelled'] as const

export const carServiceBookingSchema = z.object({
    dealer_id:          uuid,
    customer_name:      personName,
    phone:              indianPhone,
    email:              optionalEmail,
    vehicle_reg_no:     z.string().trim().max(20).optional().nullable(),
    vehicle_make:       z.string().trim().max(100).optional().nullable(),
    vehicle_model:      z.string().trim().max(100).optional().nullable(),
    vehicle_year:       z.number().int().min(1990).max(new Date().getFullYear() + 1).optional().nullable(),
    km_reading:         z.number().int().min(0).max(500_000).optional().nullable(),
    service_type:       z.enum(CAR_SERVICE_TYPES),
    service_center_id:  uuid.optional().nullable(),
    service_pricing_tier_id: uuid.optional().nullable(),
    preferred_date:     dateString,
    preferred_slot:     z.string().trim().min(1, 'Time slot is required').max(50),
    service_location:   z.string().trim().max(150).optional().nullable(),
    notes:              message,
})

export type CarServiceBookingInput = z.infer<typeof carServiceBookingSchema>

export const updateCarServiceStatusSchema = z.object({
    id:               uuid,
    status:           z.enum(CAR_SERVICE_STATUSES),
    assigned_partner: z.string().trim().max(150).optional().nullable(),
    referral_url:     z.string().trim().url('Invalid referral URL').max(2000).optional().nullable().or(z.literal('')),
    admin_notes:      z.string().trim().max(1000).optional().nullable(),
})

// ── Payment schema ──────────────────────────────────────────────

export const createSubscriptionSchema = z.object({
    dealerId: uuid,
    tier:     z.enum(['pro', 'premium']),
    domainId: uuid,
})

export type CreateSubscriptionInput = z.infer<typeof createSubscriptionSchema>

// ── Two-wheeler lead status update ──────────────────────────────

export const TW_LEAD_STATUSES = ['new', 'contacted', 'converted', 'lost'] as const

export const updateLeadStatusSchema = z.object({
    id:     uuid,
    status: z.enum(TW_LEAD_STATUSES),
})

// ── Service booking status update ───────────────────────────────

export const TW_SERVICE_STATUSES = ['pending', 'confirmed', 'completed', 'cancelled'] as const

export const updateServiceStatusSchema = z.object({
    id:     uuid,
    status: z.enum(TW_SERVICE_STATUSES),
})

// ── Helper: format Zod errors for API responses ─────────────────

export function formatZodErrors(error: z.ZodError): string {
    return error.issues
        .map((issue) => `${issue.path.join('.')}: ${issue.message}`)
        .join('; ')
}
