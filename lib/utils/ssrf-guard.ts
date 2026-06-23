/**
 * SSRF guard for outbound fetches to user-supplied hostnames (e.g. domain verification).
 *
 * Resolves the hostname and rejects loopback / private / link-local addresses and
 * known internal names. Pair with `redirect: 'manual'` on the fetch so a public host
 * can't 30x-redirect into an internal resource. Not rebinding-proof (single lookup),
 * but blocks the common SSRF targets (cloud metadata, localhost, RFC1918).
 */
import { lookup } from 'dns/promises'

const PRIVATE_V4 = [
    /^0\./,
    /^10\./,
    /^127\./,
    /^169\.254\./,
    /^192\.168\./,
    /^172\.(1[6-9]|2\d|3[01])\./,
    /^100\.(6[4-9]|[7-9]\d|1[01]\d|12[0-7])\./, // 100.64.0.0/10 CGNAT
]

function isPrivateIPv4(ip: string): boolean {
    return PRIVATE_V4.some((re) => re.test(ip))
}

function isPrivateIPv6(ip: string): boolean {
    const lower = ip.toLowerCase()
    return (
        lower === '::1' ||
        lower === '::' ||
        lower.startsWith('fc') ||
        lower.startsWith('fd') ||
        lower.startsWith('fe80') ||
        lower.startsWith('::ffff:') // IPv4-mapped — be conservative
    )
}

/**
 * Returns true only if the hostname resolves exclusively to public, routable addresses.
 * Returns false on lookup failure or any private/internal address.
 */
export async function isPubliclyRoutableHost(hostname: string): Promise<boolean> {
    const host = hostname.toLowerCase().trim()
    if (
        !host ||
        host === 'localhost' ||
        host.endsWith('.local') ||
        host.endsWith('.internal') ||
        host === 'metadata.google.internal'
    ) {
        return false
    }

    try {
        const results = await lookup(host, { all: true })
        if (results.length === 0) return false
        for (const { address, family } of results) {
            if (family === 4 && isPrivateIPv4(address)) return false
            if (family === 6 && isPrivateIPv6(address)) return false
        }
        return true
    } catch {
        return false
    }
}
