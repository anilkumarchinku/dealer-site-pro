/**
 * Slug Generation Utility for DealerSite Pro
 * Generates URL-safe slugs from business names with conflict resolution
 */

/**
 * Converts a business name to a URL-safe slug
 * 
 * Rules:
 * 1. Convert to lowercase
 * 2. Replace spaces with hyphens
 * 3. Remove special characters (keep letters, numbers, hyphens)
 * 4. Remove consecutive hyphens
 * 5. Trim hyphens from start/end
 * 6. Maximum 63 characters (DNS subdomain limit)
 * 
 * @param businessName - The dealer's business name
 * @returns URL-safe slug
 * 
 * @example
 * generateSlug("ABC Motors") // "abc-motors"
 * generateSlug("Raj's Car World") // "rajs-car-world"
 * generateSlug("BMW & Mercedes Dealer") // "bmw-mercedes-dealer"
 */
export function generateSlug(businessName: string): string {
    return businessName
        .toLowerCase()
        .trim()
        // Replace spaces and underscores with hyphens
        .replace(/[\s_]+/g, '-')
        // Remove special characters (keep alphanumeric and hyphens)
        .replace(/[^a-z0-9-]/g, '')
        // Replace multiple consecutive hyphens with single hyphen
        .replace(/-+/g, '-')
        // Remove leading/trailing hyphens
        .replace(/^-+|-+$/g, '')
        // Limit to 63 characters (DNS subdomain limit)
        .substring(0, 63)
}

/**
 * Generates a unique slug by appending city or number if conflict exists
 * 
 * @param baseSlug - The initial slug
 * @param city - Optional city name to append
 * @param existingSlugs - Array of existing slugs to check against
 * @returns Unique slug
 * 
 * @example
 * makeSlugUnique("abc-motors", "Hyderabad", ["abc-motors"]) 
 * // "abc-motors-hyderabad"
 * 
 * makeSlugUnique("abc-motors", undefined, ["abc-motors", "abc-motors-2"])
 * // "abc-motors-3"
 */
export function makeSlugUnique(
    baseSlug: string,
    city?: string,
    existingSlugs: string[] = []
): string {
    // If slug doesn't exist, return as-is
    if (!existingSlugs.includes(baseSlug)) {
        return baseSlug
    }

    // Try appending city
    if (city) {
        const citySlug = generateSlug(city)
        const slugWithCity = `${baseSlug}-${citySlug}`.substring(0, 63)
        if (!existingSlugs.includes(slugWithCity)) {
            return slugWithCity
        }
    }

    // Fallback: append number
    let counter = 2
    let uniqueSlug = `${baseSlug}-${counter}`

    while (existingSlugs.includes(uniqueSlug)) {
        counter++
        uniqueSlug = `${baseSlug}-${counter}`

        // Safety check: prevent infinite loop
        if (counter > 1000) {
            // Append timestamp as last resort
            uniqueSlug = `${baseSlug}-${Date.now()}`
            break
        }
    }

    return uniqueSlug.substring(0, 63)
}

/**
 * Validates if a slug meets all requirements
 * 
 * @param slug - Slug to validate
 * @returns Object with validation result and error message
 */
export function validateSlug(slug: string): { valid: boolean; error?: string } {
    if (!slug || slug.length === 0) {
        return { valid: false, error: 'Slug cannot be empty' }
    }

    if (slug.length > 63) {
        return { valid: false, error: 'Slug must be 63 characters or less' }
    }

    if (!/^[a-z0-9-]+$/.test(slug)) {
        return { valid: false, error: 'Slug can only contain lowercase letters, numbers, and hyphens' }
    }

    if (slug.startsWith('-') || slug.endsWith('-')) {
        return { valid: false, error: 'Slug cannot start or end with a hyphen' }
    }

    if (slug.includes('--')) {
        return { valid: false, error: 'Slug cannot contain consecutive hyphens' }
    }

    // Reserved slugs
    const reserved = ['admin', 'api', 'www', 'mail', 'ftp', 'localhost', 'dashboard', 'billing']
    if (reserved.includes(slug)) {
        return { valid: false, error: 'This slug is reserved and cannot be used' }
    }

    return { valid: true }
}

/**
 * Generates subdomain URL from slug
 * 
 * @param slug - Dealer's slug
 * @param baseDomain - Base domain (default: dealersitepro.com)
 * @returns Full subdomain URL
 * 
 * @example
 * getSubdomainUrl("abc-motors") // "abc-motors.dealersitepro.com"
 */
export function getSubdomainUrl(slug: string, baseDomain = 'dealersitepro.com'): string {
    return `${slug}.${baseDomain}`
}

/**
 * Extracts slug from subdomain URL
 * 
 * @param hostname - Full hostname
 * @param baseDomain - Base domain (default: dealersitepro.com)
 * @returns Slug or null if not a valid subdomain
 * 
 * @example
 * extractSlugFromHostname("abc-motors.dealersitepro.com") // "abc-motors"
 * extractSlugFromHostname("www.abcmotors.com") // null
 */
export function extractSlugFromHostname(hostname: string, baseDomain = 'dealersitepro.com'): string | null {
    const suffix = `.${baseDomain}`

    if (!hostname.endsWith(suffix)) {
        return null
    }

    const slug = hostname.replace(suffix, '')

    // Validate it's a proper subdomain (not www or empty)
    if (!slug || slug === 'www' || slug.includes('.')) {
        return null
    }

    return slug
}
