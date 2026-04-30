import type { OnboardingData, Service } from '@/lib/types'
import { isValidEmail } from '@/lib/validations/client'

export const ONBOARDING_GSTIN_REGEX = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z][1-9A-Z]Z[0-9A-Z]$/

export const ONBOARDING_SOCIAL_FIELDS = ['facebook', 'instagram', 'twitter', 'youtube', 'linkedin'] as const

export type OnboardingSocialField = (typeof ONBOARDING_SOCIAL_FIELDS)[number]
export type OnboardingSlugStatus = 'idle' | 'checking' | 'available' | 'taken' | 'invalid'
export type OnboardingValidationErrors = Record<string, string>

export type OnboardingContactBranchDraft = {
    city?: string
    state?: string
    address?: string
    phone?: string
    phoneCountryCode?: string
}

export type OnboardingContactDraft = {
    dealershipName: string
    location: string
    phone: string
    email: string
    gstin?: string
    whatsapp?: string
    mapLink?: string
    siteSlug: string
    slugStatus: OnboardingSlugStatus
    slugError?: string
    hasMultipleBranches?: boolean
    branches?: OnboardingContactBranchDraft[]
}

export type OnboardingContactValidationResult = {
    errors: OnboardingValidationErrors
    branchErrors: OnboardingValidationErrors
}

export type OnboardingTemplateConfigDraft = Pick<
    OnboardingData['templateConfig'],
    OnboardingSocialField | 'heroTitle' | 'heroSubtitle' | 'heroCtaText' | 'featuresTitle' | 'workingHours'
>

export function getDigits(value: string): string {
    return value.replace(/\D/g, '')
}

export function toOnboardingPhoneInputValue(value: string): string {
    const digits = getDigits(value)
    if (digits.length <= 10) return digits
    return digits.slice(-10)
}

export function formatOnboardingPhone(value: string): string {
    const localNumber = toOnboardingPhoneInputValue(value)
    return localNumber ? `+91${localNumber}` : ''
}

export function validateOnboardingPhone(
    value: string,
    options: { required?: boolean; label?: string } = {}
): string | null {
    const { required = true, label = 'Phone number' } = options
    const localNumber = toOnboardingPhoneInputValue(value)

    if (!localNumber) return required ? `${label} is required` : null
    if (!/^\d{10}$/.test(localNumber)) return `${label} must be exactly 10 digits`
    if (!/^[6-9]/.test(localNumber)) return `${label} must start with 6, 7, 8, or 9`

    return null
}

export function isValidOptionalHttpUrl(value: string | undefined | null): boolean {
    const trimmed = value?.trim()
    if (!trimmed) return true

    try {
        const url = new URL(trimmed)
        return url.protocol === 'http:' || url.protocol === 'https:'
    } catch {
        return false
    }
}

export function getOptionalHttpUrlError(value: string | undefined | null, message: string): string {
    return isValidOptionalHttpUrl(value) ? '' : message
}

export function validateOnboardingContactStep(input: OnboardingContactDraft): OnboardingContactValidationResult {
    const errors: OnboardingValidationErrors = {}
    const branchErrors: OnboardingValidationErrors = {}

    if (!input.dealershipName.trim()) errors.dealershipName = 'Dealership name is required'
    if (!input.location.trim()) errors.location = 'Location is required'

    const phoneError = validateOnboardingPhone(input.phone)
    if (phoneError) errors.phone = phoneError

    const whatsappError = validateOnboardingPhone(input.whatsapp ?? '', {
        required: false,
        label:    'WhatsApp number',
    })
    if (whatsappError) errors.whatsapp = whatsappError

    if (!input.email.trim()) {
        errors.email = 'Email is required'
    } else if (!isValidEmail(input.email)) {
        errors.email = 'Please enter a valid email'
    }

    if (input.gstin?.trim() && !ONBOARDING_GSTIN_REGEX.test(input.gstin.trim().toUpperCase())) {
        errors.gstin = 'Enter a valid 15-character GSTIN'
    }

    if (!isValidOptionalHttpUrl(input.mapLink)) {
        errors.mapLink = 'Enter a valid map URL starting with http:// or https://'
    }

    if (!input.siteSlug) {
        errors.siteSlug = 'Site name is required'
    } else if (input.slugStatus === 'checking') {
        errors.siteSlug = 'Checking site name. Please wait a moment.'
    } else if (input.slugStatus === 'taken') {
        errors.siteSlug = 'This site name is already taken'
    } else if (input.slugStatus === 'invalid') {
        errors.siteSlug = input.slugError || 'Invalid site name'
    }

    if (input.hasMultipleBranches) {
        input.branches?.forEach((branch, idx) => {
            if (!branch.city?.trim()) branchErrors[`${idx}-city`] = 'City is required'
            if (!branch.state?.trim()) branchErrors[`${idx}-state`] = 'State is required'
            if (!branch.address?.trim()) branchErrors[`${idx}-address`] = 'Address is required'

            const branchPhoneError = validateOnboardingPhone(branch.phone ?? '', {
                label: 'Branch phone',
            })
            if (branchPhoneError) branchErrors[`${idx}-phone`] = branchPhoneError
        })

        if (Object.keys(branchErrors).length > 0) {
            errors._branches = 'Please fix branch errors'
        }
    }

    return { errors, branchErrors }
}

export function hasValidationErrors(errors: OnboardingValidationErrors): boolean {
    return Object.values(errors).some(Boolean)
}

export function validateOnboardingServices(services: Service[]): string {
    return services.length === 0 ? 'Please select at least one service' : ''
}

export function validateTemplateSocialUrls(
    config: Partial<Pick<OnboardingTemplateConfigDraft, OnboardingSocialField>>,
    message = 'Enter a valid URL starting with http:// or https://'
): OnboardingValidationErrors {
    return ONBOARDING_SOCIAL_FIELDS.reduce<OnboardingValidationErrors>((errors, field) => {
        const error = getOptionalHttpUrlError(config[field], message)
        if (error) errors[field] = error
        return errors
    }, {})
}

export function validateOnboardingReadyForSave(data: Partial<OnboardingData>): string[] {
    const errors: string[] = []

    if (!data.dealershipName?.trim()) errors.push('Dealership name is required before completing setup.')
    if (!data.location?.trim()) errors.push('Location is required before completing setup.')

    const phoneError = validateOnboardingPhone(data.phone ?? '')
    if (phoneError) errors.push(phoneError)

    if (!data.email?.trim() || !isValidEmail(data.email)) {
        errors.push('A valid email is required before completing setup.')
    }

    if (!data.slug?.trim()) errors.push('Site URL is required before completing setup.')
    if (!data.services?.length) errors.push('Please select at least one service before completing setup.')
    if (!data.styleTemplate) errors.push('Please select a website style before completing setup.')
    if ((data.sellsNewCars || data.dealerCategory === 'new' || data.dealerCategory === 'both') && !data.brands?.length) {
        errors.push('Please select at least one authorised brand before completing setup.')
    }

    const socialErrors = validateTemplateSocialUrls(data.templateConfig ?? {})
    if (hasValidationErrors(socialErrors)) {
        errors.push('Please fix invalid social media links before completing setup.')
    }

    return errors
}
