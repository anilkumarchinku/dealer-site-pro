/**
 * DNS Verification Service
 * Validates custom domain DNS configuration for PRO tier
 * Note: DNS resolution only works server-side, not in browser
 */

import { env } from '@/lib/env'

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

function normalizeDnsValue(value: string): string {
    return value.trim().toLowerCase().replace(/\.$/, '')
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

    const EXPECTED_CNAME = env.cnameTarget
    const EXPECTED_A_RECORD = '76.76.21.21'
    const rootDomain = domain.replace(/^www\./, '')
    const wwwDomain = `www.${rootDomain}`

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

        const aRecord: DNSRecord = {
            type: 'A',
            name: rootDomain,
            expectedValue: EXPECTED_A_RECORD,
            isVerified: false
        }

        try {
            const aResults = await dns.resolve4(rootDomain)
            aRecord.actualValue = aResults.join(', ')
            aRecord.isVerified = aResults.includes(EXPECTED_A_RECORD)
        } catch {
            aRecord.error = 'A record not found'
        }

        records.push(aRecord)

        const cnameRecord: DNSRecord = {
            type: 'CNAME',
            name: wwwDomain,
            expectedValue: EXPECTED_CNAME,
            isVerified: false
        }

        try {
            const cnameResults = await dns.resolveCname(wwwDomain)
            cnameRecord.actualValue = cnameResults.join(', ')
            const expectedCname = normalizeDnsValue(EXPECTED_CNAME)
            cnameRecord.isVerified = cnameResults.some(result => normalizeDnsValue(result) === expectedCname)
        } catch {
            cnameRecord.error = 'CNAME record not found'
        }

        records.push(cnameRecord)

        const allVerified = aRecord.isVerified && cnameRecord.isVerified

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
                value: env.cnameTarget,
                ttl: 'Auto or 3600'
            }
        ],
        steps: [
            `Log in to your domain registrar (GoDaddy, Namecheap, etc.)`,
            `Navigate to DNS Management or DNS Settings`,
            `Add or update the A record for @ (root) to point to 76.76.21.21`,
            `Add or update the CNAME record for www to point to ${env.cnameTarget}`,
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
