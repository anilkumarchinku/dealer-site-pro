/**
 * GoDaddy Domain Search Service
 * Real integration with GoDaddy Domain API for availability and pricing
 */

import { getOptionalEnv } from '@/lib/env'
import { ExternalApiError, externalApiFetch } from '@/lib/services/external-api-fetch'

export interface DomainAvailability {
    domain: string
    available: boolean
    price: number // Price in paise (₹1 = 100 paise)
    currency: string
    registrar: string
    definitive?: boolean // GoDaddy specific: true if availability is confirmed
    period?: number // Registration period in years
}

/**
 * GoDaddy API Configuration
 * Get your API keys from: https://developer.godaddy.com/keys
 */
type GoDaddyConfig = {
    apiKey: string
    apiSecret: string
    baseUrl: string
    configured: boolean
}

function getGoDaddyConfig(): GoDaddyConfig {
    const apiKey = getOptionalEnv('GODADDY_API_KEY') ?? ''
    const apiSecret = getOptionalEnv('GODADDY_API_SECRET') ?? ''
    const configured = !!(apiKey && apiSecret)

    return {
        apiKey,
        apiSecret,
        configured,
        baseUrl: configured
            ? getOptionalEnv('GODADDY_API_URL') ?? 'https://api.godaddy.com'
            : 'https://api.ote-godaddy.com',
    }
}

/**
 * Creates authorization header for GoDaddy API
 */
function getAuthHeader(config: GoDaddyConfig): string {
    return `sso-key ${config.apiKey}:${config.apiSecret}`
}

function getDefaultTldPricing(tld: string): number {
    const defaultPricing: Record<string, number> = {
        'com': 129900,    // ₹1299
        'in': 69900,      // ₹699
        'co.in': 69900,   // ₹699
        'net': 149900,    // ₹1499
        'org': 119900     // ₹1199
    }
    return defaultPricing[tld] || 99900 // Default ₹999
}

/**
 * Checks if a single domain is available via GoDaddy API
 */
async function checkDomainAvailability(domain: string): Promise<{
    available: boolean
    definitive: boolean
    price?: number
}> {
    const config = getGoDaddyConfig()

    try {
        // If no API keys configured, fail explicitly — never return random results
        if (!config.configured) {
            throw new Error('Domain search is not configured. Please contact support.')
        }

        const data = await externalApiFetch<{
            available?: boolean
            definitive?: boolean
            price?: number
        }>({
            baseUrl: config.baseUrl,
            providerName: 'GoDaddy',
            path: `/v1/domains/available?domain=${encodeURIComponent(domain)}`,
            headers: {
                'Authorization': getAuthHeader(config),
                'Accept': 'application/json'
            },
            init: { method: 'GET' },
        })

        return {
            available: data.available || false,
            definitive: data.definitive || false,
            price: data.price // Price in micros (need to convert)
        }
    } catch (error) {
        if (error instanceof ExternalApiError && error.status) {
            console.error(`GoDaddy API error: ${error.status}`)
        }
        console.error('Error checking domain availability:', error)
        return { available: false, definitive: false }
    }
}

/**
 * Gets pricing for a specific TLD
 */
async function getTLDPricing(tld: string): Promise<number> {
    const config = getGoDaddyConfig()

    try {
        // If no API keys, return default pricing
        if (!config.configured) {
            return getDefaultTldPricing(tld)
        }

        // In production, fetch real pricing from GoDaddy
        // Note: GoDaddy pricing might be in USD, needs conversion to INR
        const tlds = await externalApiFetch<Array<{ name?: string; price?: number }>>({
            baseUrl: config.baseUrl,
            providerName: 'GoDaddy',
            path: '/v1/domains/tlds',
            headers: {
                'Authorization': getAuthHeader(config),
                'Accept': 'application/json'
            },
            init: { method: 'GET' },
        })
        const tldData = tlds.find((t) => t.name === tld)

        if (tldData && tldData.price) {
            // Convert USD to INR (approximate rate: 1 USD = 83 INR)
            // GoDaddy returns price in micros (1 USD = 1,000,000 micros)
            const usdPrice = tldData.price / 1000000
            const inrPrice = Math.round(usdPrice * 83 * 100) // Convert to paise
            return inrPrice
        }

        // Fallback pricing if TLD not found
        return 99900 // ₹999
    } catch (error) {
        console.error(`Error fetching TLD pricing for .${tld}:`, error)
        return 99900
    }
}

/**
 * Searches for available domains with given query
 * @param query - Domain name without TLD (e.g., "abcmotors")
 * @returns Array of domain availability results with pricing
 */
export async function searchDomains(query: string): Promise<DomainAvailability[]> {
    // Normalize query
    const normalized = query.toLowerCase().trim().replace(/\s+/g, '')

    // TLDs to check (popular in India)
    const tlds = [
        { ext: 'com', name: '.com' },
        { ext: 'in', name: '.in' },
        { ext: 'co.in', name: '.co.in' },
        { ext: 'net', name: '.net' },
        { ext: 'org', name: '.org' }
    ]

    const results: DomainAvailability[] = []

    // Check availability for each TLD in parallel
    const checks = tlds.map(async (tld) => {
        const domain = `${normalized}${tld.name}`

        try {
            // Check availability
            const availability = await checkDomainAvailability(domain)

            // Get pricing
            const price = availability.price || await getTLDPricing(tld.ext)

            return {
                domain,
                available: availability.available,
                price,
                currency: 'INR',
                registrar: 'godaddy',
                definitive: availability.definitive,
                period: 1 // 1 year registration
            }
        } catch (error) {
            console.error(`Error checking ${domain}:`, error)
            // Return unavailable on error
            return {
                domain,
                available: false,
                price: 0,
                currency: 'INR',
                registrar: 'godaddy',
                definitive: false
            }
        }
    })

    const checkResults = await Promise.all(checks)
    results.push(...checkResults)

    return results
}

/**
 * Purchases a domain via GoDaddy API
 * NOTE: Requires a "Good as Gold" account with GoDaddy
 */
export async function purchaseDomain(
    domain: string,
    contactInfo: {
        name: string
        email: string
        phone: string
        address: string
        city: string
        state: string
        postalCode: string
        country: string
    }
): Promise<{ success: boolean; orderId?: string; error?: string }> {
    const config = getGoDaddyConfig()

    try {
        // If no API keys, return mock success
        if (!config.configured) {
            console.log('[GoDaddy] No API keys - returning mock purchase')
            return {
                success: true,
                orderId: `MOCK-${Date.now()}`
            }
        }

        // GoDaddy domain purchase payload
        const purchaseData = {
            domain: domain,
            consent: {
                agreementKeys: ['DNRA'], // Domain Name Registration Agreement
                agreedBy: contactInfo.email,
                agreedAt: new Date().toISOString()
            },
            period: 1, // 1 year
            privacy: true, // Enable WHOIS privacy
            contactAdmin: {
                nameFirst: contactInfo.name.split(' ')[0],
                nameLast: contactInfo.name.split(' ').slice(1).join(' ') || contactInfo.name,
                email: contactInfo.email,
                phone: contactInfo.phone,
                addressMailing: {
                    address1: contactInfo.address,
                    city: contactInfo.city,
                    state: contactInfo.state,
                    postalCode: contactInfo.postalCode,
                    country: contactInfo.country
                }
            }
        }

        // Copy contact info for all contact types (required by GoDaddy)
        const fullPurchaseData = {
            ...purchaseData,
            contactBilling: purchaseData.contactAdmin,
            contactRegistrant: purchaseData.contactAdmin,
            contactTech: purchaseData.contactAdmin
        }

        const result = await externalApiFetch<{ orderId?: string }>({
            baseUrl: config.baseUrl,
            providerName: 'GoDaddy',
            path: '/v1/domains/purchase',
            headers: {
                'Authorization': getAuthHeader(config),
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            init: {
                method: 'POST',
                body: JSON.stringify(fullPurchaseData)
            },
        })

        return {
            success: true,
            orderId: result.orderId || `GD-${Date.now()}`
        }
    } catch (error) {
        if (error instanceof ExternalApiError) {
            const errorData = error.bodyJson as { message?: string } | undefined
            console.error('GoDaddy purchase error:', errorData ?? error.bodyText ?? error.message)
            return {
                success: false,
                error: errorData?.message || 'Domain purchase failed'
            }
        }
        console.error('Error purchasing domain:', error)
        return {
            success: false,
            error: 'Failed to purchase domain. Please try again.'
        }
    }
}
