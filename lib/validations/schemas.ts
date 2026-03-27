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
    offer_price_paise: z.number().int().min(0).optional().nullable(),
})

export type TwLeadInput = z.infer<typeof twLeadSchema>

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
