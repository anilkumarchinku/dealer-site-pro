/**
 * DNS Verification Service
 * Validates custom domain DNS configuration for PRO tier
 * Note: DNS resolution only works server-side, not in browser
 */

export interface DNSRecord {
    type: 'A' | 'CNAME' | 'TXT'
    name: string
    expectedValue: string
    actualValue?: string
    isVerified: boolean
    error?: string
}

export interface VerificationResult {
    success: boolean
    records: DNSRecord[]
    allVerified: boolean
    message: string
}

/**
 * Verifies that a custom domain points to our hosting
 * Checks both A and CNAME records
 * NOTE: This function only works in Node.js environment (API routes)
 */
export async function verifyCustomDomain(
    domain: string
): Promise<VerificationResult> {
    const records: DNSRecord[] = []

    // Expected values (replace with your actual Vercel IP or CNAME)
    const EXPECTED_CNAME = 'cname.vercel-dns.com'
    const EXPECTED_A_RECORD = '76.76.21.21' // Vercel's IP (example)

    // Only run DNS verification on server-side
    if (typeof window !== 'undefined') {
        return {
            success: false,
            records: [],
            allVerified: false,
            message: 'DNS verification must be performed server-side'
        }
    }

    try {
        // Dynamic import of Node.js dns module (server-side only)
        // eslint-disable-next-line @typescript-eslint/no-require-imports
        const dns = (await import(/* webpackIgnore: true */ 'dns/promises')).default

        // Check CNAME for root domain
        const cnameRecord: DNSRecord = {
            type: 'CNAME',
            name: domain,
            expectedValue: EXPECTED_CNAME,
            isVerified: false
        }

        try {
            const cnameResults = await dns.resolveCname(domain)
            cnameRecord.actualValue = cnameResults[0]
            cnameRecord.isVerified = cnameResults[0] === EXPECTED_CNAME
        } catch (error: any) {
            cnameRecord.error = 'CNAME record not found'
        }

        records.push(cnameRecord)

        // Check A record as alternative
        const aRecord: DNSRecord = {
            type: 'A',
            name: domain,
            expectedValue: EXPECTED_A_RECORD,
            isVerified: false
        }

        try {
            const aResults = await dns.resolve4(domain)
            aRecord.actualValue = aResults[0]
            aRecord.isVerified = aResults[0] === EXPECTED_A_RECORD
        } catch (error: any) {
            aRecord.error = 'A record not found'
        }

        records.push(aRecord)

        // Domain is verified if either CNAME or A record is correct
        const allVerified = cnameRecord.isVerified || aRecord.isVerified

        return {
            success: true,
            records,
            allVerified,
            message: allVerified
                ? 'Domain verified successfully!'
                : 'DNS records not configured correctly. Please update your DNS settings.'
        }
    } catch (error) {
        console.error('DNS verification error:', error)
        return {
            success: false,
            records,
            allVerified: false,
            message: 'Failed to verify DNS records. Please try again.'
        }
    }
}

/**
 * Checks if a domain is available (not pointing to another service)
 */
export async function isDomainAvailable(domain: string): Promise<boolean> {
    if (typeof window !== 'undefined') return true // Client-side always returns true

    try {
        // eslint-disable-next-line @typescript-eslint/no-require-imports
        const dns = (await import(/* webpackIgnore: true */ 'dns/promises')).default
        // Try to resolve the domain
        await dns.resolve(domain)
        // If it resolves, domain is already in use
        return false
    } catch (error) {
        // If it doesn't resolve, it might be available
        return true
    }
}

/**
 * Gets DNS instructions for dealer to configure their domain
 */
export function getDNSInstructions(domain: string): {
    records: Array<{ type: string; name: string; value: string; ttl: string }>
    steps: string[]
} {
    // Remove www if present to get root domain
    const rootDomain = domain.replace(/^www\./, '')

    return {
        records: [
            {
                type: 'A',
                name: '@',
                value: '76.76.21.21',
                ttl: 'Auto or 3600'
            },
            {
                type: 'CNAME',
                name: 'www',
                value: 'cname.vercel-dns.com',
                ttl: 'Auto or 3600'
            }
        ],
        steps: [
            `Log in to your domain registrar (GoDaddy, Namecheap, etc.)`,
            `Navigate to DNS Management or DNS Settings`,
            `Add or update the A record for @ (root) to point to 76.76.21.21`,
            `Add or update the CNAME record for www to point to cname.vercel-dns.com`,
            `Save your changes and wait 5-30 minutes for DNS to propagate`,
            `Come back here and click "Verify Domain" to complete setup`
        ]
    }
}

/**
 * Validates domain format
 */
export function isValidDomain(domain: string): { valid: boolean; error?: string } {
    // Remove protocol if present
    domain = domain.replace(/^https?:\/\//, '')

    // Remove trailing slash
    domain = domain.replace(/\/$/, '')

    // Basic domain regex
    const domainRegex = /^(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z0-9][a-z0-9-]{0,61}[a-z0-9]$/i

    if (!domain) {
        return { valid: false, error: 'Domain cannot be empty' }
    }

    if (!domainRegex.test(domain)) {
        return { valid: false, error: 'Invalid domain format. Use format: example.com' }
    }

    if (domain.endsWith('.dealersitepro.com')) {
        return { valid: false, error: 'This is already a subdomain. Use PRO tier for custom domains only.' }
    }

    return { valid: true }
}
