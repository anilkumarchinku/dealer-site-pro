/**
 * Client-side form validation helpers.
 * Mirrors the backend Zod schemas in lib/validations/schemas.ts
 * but zero-dependency for smaller client bundles.
 */

const INDIAN_PHONE_RE = /^[6-9]\d{9}$/
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export type ValidationErrors = Record<string, string>

/** Indian 10-digit mobile (starts with 6-9) */
export function isValidIndianPhone(phone: string): boolean {
    return INDIAN_PHONE_RE.test(phone.trim())
}

/** Basic email format */
export function isValidEmail(email: string): boolean {
    return EMAIL_RE.test(email.trim()) && email.length <= 254
}

/** Name: 2-100 chars, non-empty */
export function isValidName(name: string): boolean {
    const trimmed = name.trim()
    return trimmed.length >= 2 && trimmed.length <= 100
}

/**
 * Validate a lead / enquiry form.
 * Returns an empty object if valid, or { field: errorMessage } if not.
 */
export function validateLeadForm(data: {
    name: string
    phone: string
    email?: string
}): ValidationErrors {
    const errors: ValidationErrors = {}

    if (!isValidName(data.name)) {
        errors.name = 'Name must be 2-100 characters'
    }
    if (!isValidIndianPhone(data.phone)) {
        errors.phone = 'Enter a valid 10-digit Indian mobile number'
    }
    if (data.email && data.email.trim() && !isValidEmail(data.email)) {
        errors.email = 'Enter a valid email address'
    }

    return errors
}

/**
 * Validate a service booking form.
 */
export function validateServiceBookingForm(data: {
    customer_name: string
    phone: string
    service_type: string
    preferred_date: string
}): ValidationErrors {
    const errors: ValidationErrors = {}

    if (!isValidName(data.customer_name)) {
        errors.customer_name = 'Name must be 2-100 characters'
    }
    if (!isValidIndianPhone(data.phone)) {
        errors.phone = 'Enter a valid 10-digit Indian mobile number'
    }
    if (!data.service_type) {
        errors.service_type = 'Please select a service type'
    }
    if (!data.preferred_date) {
        errors.preferred_date = 'Please select a date'
    }

    return errors
}
