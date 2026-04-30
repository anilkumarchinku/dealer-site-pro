import type { OnboardingData } from '@/lib/types'
import { toOnboardingPhoneInputValue } from '@/lib/validations/onboarding'

export type OnboardingVehicleType = 'car' | 'two-wheeler' | 'three-wheeler'

type Branch = NonNullable<OnboardingData['branches']>[number]

export type OnboardingTemplateConfigPrefill = {
    heroTitle: string
    heroSubtitle: string
    heroCtaText: string
    featuresTitle: string
    workingHours: string
    facebook: string
    instagram: string
    twitter: string
    youtube: string
    linkedin: string
}

export type OnboardingAccountPrefillSource = {
    userEmail?: string | null
    metadata?: Record<string, unknown> | null
    dealer?: {
        dealership_name?: string | null
        tagline?: string | null
        location?: string | null
        full_address?: string | null
        map_link?: string | null
        google_maps_url?: string | null
        years_in_business?: number | null
        phone?: string | null
        whatsapp?: string | null
        email?: string | null
        gstin?: string | null
        slug?: string | null
    } | null
}

export type OnboardingContactFormPrefill = {
    dealershipName: string
    tagline: string
    location: string
    fullAddress: string
    mapLink: string
    yearsInBusiness: string
    phone: string
    phoneCountryCode: string
    whatsapp: string
    whatsappCountryCode: string
    email: string
    gstin: string
}

const GENERIC_CTA = 'View Inventory'

const DEFAULT_CTA_BY_VEHICLE_TYPE: Record<OnboardingVehicleType, string> = {
    car:             GENERIC_CTA,
    'two-wheeler':   'View Our Bikes',
    'three-wheeler': 'View Our Vehicles',
}

const DEFAULT_HERO_TITLE_BY_VEHICLE_TYPE: Record<OnboardingVehicleType, string> = {
    car:             'Find Your Dream Car Today',
    'two-wheeler':   'Find Your Perfect Ride Today',
    'three-wheeler': 'Your Trusted Auto Partner',
}

const DEFAULT_HERO_SUBTITLE_BY_VEHICLE_TYPE: Record<OnboardingVehicleType, string> = {
    car:             'Explore new and used cars from a dealership you can trust.',
    'two-wheeler':   'Explore new and used bikes and scooters from a dealership you can trust.',
    'three-wheeler': 'Explore reliable passenger and cargo three-wheelers from a dealership you can trust.',
}

function clean(value: unknown) {
    return typeof value === 'string' ? value.trim() : ''
}

function copyStringField<T extends keyof OnboardingData>(
    target: Partial<OnboardingData>,
    source: Partial<OnboardingData>,
    field: T,
) {
    const value = clean(source[field])
    if (value) target[field] = value as OnboardingData[T]
}

export function getOnboardingResetPrefill(data: Partial<OnboardingData>): Partial<OnboardingData> {
    const prefill: Partial<OnboardingData> = {}

    copyStringField(prefill, data, 'dealershipName')
    copyStringField(prefill, data, 'tagline')
    copyStringField(prefill, data, 'location')
    copyStringField(prefill, data, 'fullAddress')
    copyStringField(prefill, data, 'mapLink')
    copyStringField(prefill, data, 'phone')
    copyStringField(prefill, data, 'whatsapp')
    copyStringField(prefill, data, 'email')
    copyStringField(prefill, data, 'gstin')
    copyStringField(prefill, data, 'slug')

    if (typeof data.yearsInBusiness === 'number') {
        prefill.yearsInBusiness = data.yearsInBusiness
    }

    if (data.templateConfig) {
        prefill.templateConfig = {
            heroTitle:     clean(data.templateConfig.heroTitle),
            heroSubtitle:  clean(data.templateConfig.heroSubtitle),
            heroCtaText:   clean(data.templateConfig.heroCtaText),
            featuresTitle: clean(data.templateConfig.featuresTitle),
            workingHours:  clean(data.templateConfig.workingHours),
            facebook:      clean(data.templateConfig.facebook),
            instagram:     clean(data.templateConfig.instagram),
            twitter:       clean(data.templateConfig.twitter),
            youtube:       clean(data.templateConfig.youtube),
            linkedin:      clean(data.templateConfig.linkedin),
        }
    }

    return prefill
}

function firstFilled(...values: Array<string | undefined>) {
    return values.map(clean).find(Boolean) ?? ''
}

function metadataString(metadata: Record<string, unknown> | null | undefined, field: string) {
    return clean(metadata?.[field])
}

function assignIfMissing(
    target: Partial<OnboardingData>,
    current: string | null | undefined,
    field: keyof OnboardingData,
    value: string,
) {
    if (!clean(current) && value) {
        target[field] = value as never
    }
}

function defaultHeroTitle(data: Partial<OnboardingData>, vehicleType: OnboardingVehicleType) {
    return firstFilled(
        data.dealershipName ? `Welcome to ${data.dealershipName}` : undefined,
        DEFAULT_HERO_TITLE_BY_VEHICLE_TYPE[vehicleType],
    )
}

function defaultHeroSubtitle(data: Partial<OnboardingData>, vehicleType: OnboardingVehicleType) {
    return firstFilled(
        data.tagline,
        data.location ? `Your trusted dealership in ${data.location}` : undefined,
        DEFAULT_HERO_SUBTITLE_BY_VEHICLE_TYPE[vehicleType],
    )
}

function configuredCta(value: string | undefined, vehicleType: OnboardingVehicleType) {
    const next = clean(value)
    if (!next) return DEFAULT_CTA_BY_VEHICLE_TYPE[vehicleType]
    if (next === GENERIC_CTA && vehicleType !== 'car') return DEFAULT_CTA_BY_VEHICLE_TYPE[vehicleType]
    return next
}

export function getPrefilledTemplateConfig(
    data: Partial<OnboardingData>,
    vehicleType: OnboardingVehicleType,
): OnboardingTemplateConfigPrefill {
    const config = data.templateConfig

    return {
        heroTitle:     firstFilled(config?.heroTitle, defaultHeroTitle(data, vehicleType)),
        heroSubtitle:  firstFilled(config?.heroSubtitle, defaultHeroSubtitle(data, vehicleType)),
        heroCtaText:   configuredCta(config?.heroCtaText, vehicleType),
        featuresTitle: firstFilled(config?.featuresTitle, 'Why Choose Us'),
        workingHours:  clean(config?.workingHours),
        facebook:      clean(config?.facebook),
        instagram:     clean(config?.instagram),
        twitter:       clean(config?.twitter),
        youtube:       clean(config?.youtube),
        linkedin:      clean(config?.linkedin),
    }
}

export function getOnboardingContactFormPrefill(data: Partial<OnboardingData>): OnboardingContactFormPrefill {
    return {
        dealershipName:      clean(data.dealershipName),
        tagline:             clean(data.tagline),
        location:            clean(data.location),
        fullAddress:         clean(data.fullAddress),
        mapLink:             clean(data.mapLink),
        yearsInBusiness:     typeof data.yearsInBusiness === 'number' ? String(data.yearsInBusiness) : '',
        phone:               toOnboardingPhoneInputValue(clean(data.phone)),
        phoneCountryCode:    '+91',
        whatsapp:            toOnboardingPhoneInputValue(clean(data.whatsapp)),
        whatsappCountryCode: '+91',
        email:               clean(data.email),
        gstin:               clean(data.gstin),
    }
}

export function getOnboardingBranchPrefill(branches: OnboardingData['branches'] | undefined): Branch[] {
    const rows = branches?.length ? branches : [{ city: '', state: '', address: '', phone: '', phoneCountryCode: '+91' }]

    return rows.map((branch) => ({
        ...branch,
        city:             clean(branch.city),
        state:            clean(branch.state),
        address:          clean(branch.address),
        phone:            toOnboardingPhoneInputValue(clean(branch.phone)),
        phoneCountryCode: '+91',
    }))
}

export function getOnboardingAccountPrefill(
    current: Partial<OnboardingData>,
    source: OnboardingAccountPrefillSource,
): Partial<OnboardingData> {
    const prefill: Partial<OnboardingData> = {}
    const dealer = source.dealer
    const metadata = source.metadata

    assignIfMissing(prefill, current.dealershipName, 'dealershipName', firstFilled(
        dealer?.dealership_name ?? undefined,
        metadataString(metadata, 'dealership_name'),
    ))
    assignIfMissing(prefill, current.tagline, 'tagline', clean(dealer?.tagline))
    assignIfMissing(prefill, current.location, 'location', clean(dealer?.location))
    assignIfMissing(prefill, current.fullAddress, 'fullAddress', clean(dealer?.full_address))
    assignIfMissing(prefill, current.mapLink, 'mapLink', firstFilled(
        dealer?.map_link ?? undefined,
        dealer?.google_maps_url ?? undefined,
    ))
    assignIfMissing(prefill, current.phone, 'phone', firstFilled(
        dealer?.phone ?? undefined,
        metadataString(metadata, 'phone'),
    ))
    assignIfMissing(prefill, current.whatsapp, 'whatsapp', clean(dealer?.whatsapp))
    assignIfMissing(prefill, current.email, 'email', firstFilled(
        dealer?.email ?? undefined,
        source.userEmail ?? undefined,
    ))
    assignIfMissing(prefill, current.gstin, 'gstin', clean(dealer?.gstin))
    assignIfMissing(prefill, current.slug, 'slug', clean(dealer?.slug))

    if (typeof current.yearsInBusiness !== 'number' && typeof dealer?.years_in_business === 'number') {
        prefill.yearsInBusiness = dealer.years_in_business
    }

    return prefill
}
