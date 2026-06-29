/**
 * Lead/contact form validation shared across the public dealer-site templates.
 * Lenient on input formatting (strips spaces / +91) so we never reject a valid
 * number the buyer typed with a country code, but strict on the resulting digits.
 */

import { isValidEmail, isValidName } from '@/lib/validations/client'

export type LeadFormErrors = {
    name?: string
    phone?: string
    email?: string
    consent?: string
}

export interface LeadFormInput {
    name: string
    phone: string
    email?: string
    consent?: boolean
}

export interface LeadFormOptions {
    /** Require a valid email (default: only validate when provided). */
    requireEmail?: boolean
    /** Require the consent checkbox to be ticked (default: true). */
    requireConsent?: boolean
}

const INDIAN_MOBILE_RE = /^[6-9]\d{9}$/

/** Reduce any user-typed phone to its trailing 10 digits (drops +91, spaces, dashes). */
export function normalizeLeadPhone(raw: string): string {
    const digits = (raw ?? '').replace(/\D/g, '')
    return digits.length > 10 ? digits.slice(-10) : digits
}

export function validateLeadForm(input: LeadFormInput, options: LeadFormOptions = {}): LeadFormErrors {
    const { requireEmail = true, requireConsent = true } = options
    const errors: LeadFormErrors = {}

    if (!isValidName(input.name)) {
        errors.name = 'Please enter your name'
    }

    const phone = normalizeLeadPhone(input.phone)
    if (!phone) {
        errors.phone = 'Phone number is required'
    } else if (!INDIAN_MOBILE_RE.test(phone)) {
        errors.phone = 'Enter a valid 10-digit mobile number'
    }

    const email = input.email?.trim()
    if (email) {
        if (!isValidEmail(email)) errors.email = 'Enter a valid email address'
    } else if (requireEmail) {
        errors.email = 'Email is required'
    }

    if (requireConsent && !input.consent) {
        errors.consent = 'Please agree to be contacted'
    }

    return errors
}

export function hasLeadFormErrors(errors: LeadFormErrors): boolean {
    return Object.values(errors).some(Boolean)
}
