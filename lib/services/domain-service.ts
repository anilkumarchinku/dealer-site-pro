/**
 * Domain Service - Business logic for domain management
 * Phase 1: FREE Subdomain auto-generation
 */

import type { DealerDomainRow, Database } from '@/lib/database.types'
import type { Domain } from '../supabase'
import { createAdminClient, type RouteSupabaseClient } from '@/lib/supabase-server'
import { generateSlug, makeSlugUnique, validateSlug, getSubdomainUrl } from '../utils/slug'

type DomainSupabaseClient = Pick<ReturnType<typeof createAdminClient> | RouteSupabaseClient, 'from'>

function getDomainClient(supabase?: DomainSupabaseClient): DomainSupabaseClient {
    return supabase ?? createAdminClient()
}

export interface CreateSubdomainParams {
    dealerId: string
    businessName: string
    city?: string
    templateId?: string  // Optional template selection
}

export interface CreateSubdomainResult {
    success: boolean
    domain?: Domain
    error?: string
}

type DealerDomainInsert = Database['public']['Tables']['dealer_domains']['Insert']

const DEALER_DOMAIN_SELECT =
    'id, dealer_id, custom_domain, subdomain, subdomain_url, domain_type, status, ssl_status, is_primary, dns_verified_at, ssl_provisioned_at, ssl_expires_at, last_checked_at, registrar, registration_expires_at, auto_renew, site_slug, created_at, updated_at'

function toDomainStatus(status: string | null): Domain['status'] {
    if (status === 'pending' || status === 'active' || status === 'failed' || status === 'expired') {
        return status
    }
    return status === 'suspended' ? 'failed' : 'pending'
}

function toSslStatus(status: string | null): Domain['ssl_status'] {
    if (status === 'pending' || status === 'provisioning' || status === 'active' || status === 'expired' || status === 'failed') {
        return status
    }
    return 'pending'
}

function mapDealerDomain(row: DealerDomainRow): Domain {
    const domain = row.custom_domain ?? row.subdomain_url ?? (row.subdomain ? getSubdomainUrl(row.subdomain) : '')
    return {
        id: row.id,
        dealer_id: row.dealer_id,
        domain,
        slug: row.site_slug ?? row.subdomain ?? domain.split('.')[0] ?? '',
        type: row.domain_type === 'custom' || row.domain_type === 'managed' ? row.domain_type : 'subdomain',
        status: toDomainStatus(row.status),
        ssl_status: toSslStatus(row.ssl_status),
        is_primary: row.is_primary ?? false,
        dns_verified_at: row.dns_verified_at ?? undefined,
        ssl_provisioned_at: row.ssl_provisioned_at ?? undefined,
        ssl_expires_at: row.ssl_expires_at ?? undefined,
        last_checked_at: row.last_checked_at ?? undefined,
        registrar: row.registrar ?? undefined,
        registration_expires_at: row.registration_expires_at ?? undefined,
        auto_renew: row.auto_renew ?? true,
        created_at: row.created_at,
        updated_at: row.updated_at,
    }
}

function toDealerDomainInsert(
    domain: Pick<Domain, 'dealer_id' | 'domain' | 'slug' | 'type' | 'status' | 'ssl_status' | 'is_primary' | 'auto_renew'> &
        Partial<Pick<Domain, 'dns_verified_at' | 'ssl_provisioned_at' | 'ssl_expires_at' | 'last_checked_at' | 'registrar' | 'registration_expires_at'>>
): DealerDomainInsert {
    const isSubdomain = domain.type === 'subdomain'
    return {
        dealer_id: domain.dealer_id,
        subdomain: isSubdomain ? domain.slug : null,
        subdomain_url: isSubdomain ? domain.domain : null,
        custom_domain: isSubdomain ? null : domain.domain,
        domain_type: domain.type,
        status: domain.status === 'verifying' ? 'pending' : domain.status,
        ssl_status: domain.ssl_status,
        is_primary: domain.is_primary,
        dns_verified: !!domain.dns_verified_at,
        dns_verified_at: domain.dns_verified_at ?? null,
        ssl_provisioned_at: domain.ssl_provisioned_at ?? null,
        ssl_expires_at: domain.ssl_expires_at ?? null,
        last_checked_at: domain.last_checked_at ?? null,
        registrar: domain.registrar ?? null,
        registration_expires_at: domain.registration_expires_at ?? null,
        auto_renew: domain.auto_renew,
    }
}

async function getExistingSlugs(db: DomainSupabaseClient): Promise<string[]> {
    const [legacyResult, routingResult] = await Promise.all([
        db.from('domains').select('slug'),
        db.from('dealer_domains').select('subdomain, site_slug'),
    ])

    const legacySlugs = ((legacyResult.data || []) as Array<{ slug?: string | null }>)
        .map(row => row.slug)
        .filter((slug): slug is string => !!slug)
    const routingSlugs = ((routingResult.data || []) as Array<{ subdomain?: string | null; site_slug?: string | null }>)
        .flatMap(row => [row.subdomain, row.site_slug])
        .filter((slug): slug is string => !!slug)

    return [...new Set([...legacySlugs, ...routingSlugs])]
}

/**
 * Creates a FREE subdomain for a dealer
 * Automatically called during dealer onboarding
 */
export async function createSubdomainForDealer(
    params: CreateSubdomainParams,
    supabase?: DomainSupabaseClient
): Promise<CreateSubdomainResult> {
    try {
        const db = getDomainClient(supabase)
        const { dealerId, businessName, city, templateId } = params

        // Generate base slug from business name
        const baseSlug = generateSlug(businessName)

        // Validate base slug
        const validation = validateSlug(baseSlug)
        if (!validation.valid) {
            return {
                success: false,
                error: `Invalid business name: ${validation.error}`
            }
        }

        // Get existing slugs to check for conflicts
        const existingSlugs = await getExistingSlugs(db)

        // Make slug unique
        const uniqueSlug = makeSlugUnique(baseSlug, city, existingSlugs)

        // Generate full subdomain
        const subdomain = getSubdomainUrl(uniqueSlug)

        // Check if dealer already has a free subdomain in either domain model
        const [legacyExisting, routingExisting] = await Promise.all([
            db
                .from('domains')
                .select('id')
                .eq('dealer_id', dealerId)
                .eq('type', 'subdomain')
                .single(),
            db
                .from('dealer_domains')
                .select('id')
                .eq('dealer_id', dealerId)
                .eq('domain_type', 'subdomain')
                .single(),
        ])

        if (legacyExisting.data || routingExisting.data) {
            return {
                success: false,
                error: 'Dealer already has a domain'
            }
        }

        const now = new Date().toISOString()
        const template = (templateId || 'family') as Domain['template_id']
        const domainRecord = {
            dealer_id: dealerId,
            domain: subdomain,
            slug: uniqueSlug,
            type: 'subdomain' as const,
            template_id: template,
            status: 'active' as const,
            ssl_status: 'active' as const, // Wildcard SSL is pre-configured
            is_primary: true,
            dns_verified_at: now,
            ssl_provisioned_at: now,
            auto_renew: true,
        }

        // Create canonical routing record first
        const { data: routingDomain, error: routingError } = await db
            .from('dealer_domains')
            .insert(toDealerDomainInsert(domainRecord))
            .select(DEALER_DOMAIN_SELECT)
            .single()

        if (routingError) {
            console.error('Error creating dealer_domains subdomain:', routingError)
        }

        if (routingDomain) {
            // Keep the older dashboard-facing table populated for compatibility.
            const { error: legacyCompatError } = await db
                .from('domains')
                .insert(domainRecord)
                .select()
                .single()

            if (legacyCompatError) {
                console.error('Error creating compatibility domain:', legacyCompatError)
            }

            return {
                success: true,
                domain: mapDealerDomain(routingDomain as unknown as DealerDomainRow)
            }
        }

        // Fallback for older databases that only have the legacy domains table.
        const { data: newDomain, error } = await db
            .from('domains')
            .insert(domainRecord)
            .select()
            .single()

        if (error) {
            console.error('Error creating subdomain:', error)
            return {
                success: false,
                error: 'Failed to create subdomain. Please try again.'
            }
        }

        return {
            success: true,
            domain: newDomain as unknown as Domain
        }
    } catch (error) {
        console.error('Unexpected error in createSubdomainForDealer:', error)
        return {
            success: false,
            error: 'An unexpected error occurred'
        }
    }
}

/**
 * Gets a domain by slug (for middleware routing)
 */
export async function getDomainBySlug(slug: string): Promise<Domain | null> {
    try {
        const db = getDomainClient()
        const { data: routingDomain } = await db
            .from('dealer_domains')
            .select(DEALER_DOMAIN_SELECT)
            .eq('subdomain', slug)
            .eq('status', 'active')
            .single()

        if (routingDomain) {
            return mapDealerDomain(routingDomain as unknown as DealerDomainRow)
        }

        const { data: siteDomain } = await db
            .from('dealer_domains')
            .select(DEALER_DOMAIN_SELECT)
            .eq('site_slug', slug)
            .eq('status', 'active')
            .single()

        if (siteDomain) {
            return mapDealerDomain(siteDomain as unknown as DealerDomainRow)
        }

        const { data, error } = await db
            .from('domains')
            .select('*')
            .eq('slug', slug)
            .eq('status', 'active')
            .single()

        if (error || !data) {
            return null
        }

        return data as unknown as Domain
    } catch (error) {
        console.error('Error getting domain by slug:', error)
        return null
    }
}

/**
 * Gets a domain by full domain name
 */
export async function getDomainByName(domainName: string): Promise<Domain | null> {
    try {
        const db = getDomainClient()
        const normalizedDomain = domainName
            .trim()
            .toLowerCase()
            .replace(/^https?:\/\//, '')
            .replace(/^www\./, '')
            .replace(/\/.*$/, '')
        const { data: customDomain } = await db
            .from('dealer_domains')
            .select(DEALER_DOMAIN_SELECT)
            .eq('custom_domain', normalizedDomain)
            .eq('status', 'active')
            .single()

        if (customDomain) {
            return mapDealerDomain(customDomain as unknown as DealerDomainRow)
        }

        const { data: subdomain } = await db
            .from('dealer_domains')
            .select(DEALER_DOMAIN_SELECT)
            .eq('subdomain_url', normalizedDomain)
            .eq('status', 'active')
            .single()

        if (subdomain) {
            return mapDealerDomain(subdomain as unknown as DealerDomainRow)
        }

        const { data, error } = await db
            .from('domains')
            .select('*')
            .eq('domain', normalizedDomain)
            .eq('status', 'active')
            .single()

        if (error || !data) {
            return null
        }

        return data as unknown as Domain
    } catch (error) {
        console.error('Error getting domain by name:', error)
        return null
    }
}

/**
 * Gets all domains for a dealer
 */
export async function getDealerDomains(
    dealerId: string,
    supabase?: DomainSupabaseClient
): Promise<Domain[]> {
    try {
        const db = getDomainClient(supabase)
        const [legacyResult, routingResult] = await Promise.all([
            db
                .from('domains')
                .select('*')
                .eq('dealer_id', dealerId)
                .order('is_primary', { ascending: false })
                .order('created_at', { ascending: false }),
            db
                .from('dealer_domains')
                .select(DEALER_DOMAIN_SELECT)
                .eq('dealer_id', dealerId)
                .order('is_primary', { ascending: false })
                .order('created_at', { ascending: false }),
        ])

        if (legacyResult.error && routingResult.error) {
            console.error('Error getting dealer domains:', legacyResult.error, routingResult.error)
            return []
        }

        if (legacyResult.error) console.error('Error getting legacy domains:', legacyResult.error)
        if (routingResult.error) console.error('Error getting dealer_domains:', routingResult.error)

        const routingDomains = ((routingResult.data || []) as unknown as DealerDomainRow[]).map(mapDealerDomain)
        const seenDomains = new Set(routingDomains.map(domain => domain.domain.toLowerCase()))
        const legacyDomains = ((legacyResult.data || []) as unknown as Domain[])
            .filter(domain => !seenDomains.has(domain.domain.toLowerCase()))

        return [...routingDomains, ...legacyDomains].sort((a, b) => {
            if (a.is_primary !== b.is_primary) return a.is_primary ? -1 : 1
            return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        })
    } catch (error) {
        console.error('Unexpected error in getDealerDomains:', error)
        return []
    }
}

/**
 * Gets dealer's primary domain
 */
export async function getPrimaryDomain(dealerId: string): Promise<Domain | null> {
    try {
        const db = getDomainClient()
        const { data: routingDomain } = await db
            .from('dealer_domains')
            .select(DEALER_DOMAIN_SELECT)
            .eq('dealer_id', dealerId)
            .eq('is_primary', true)
            .single()

        if (routingDomain) {
            return mapDealerDomain(routingDomain as unknown as DealerDomainRow)
        }

        const { data: legacyDomain } = await db
            .from('domains')
            .select('*')
            .eq('dealer_id', dealerId)
            .eq('is_primary', true)
            .single()

        if (!legacyDomain) {
            return null
        }

        return legacyDomain as unknown as Domain
    } catch (error) {
        console.error('Error getting primary domain:', error)
        return null
    }
}

/**
 * Checks if a slug is available
 */
export async function isSlugAvailable(
    slug: string,
    supabase?: DomainSupabaseClient
): Promise<boolean> {
    try {
        const db = getDomainClient(supabase)
        const [legacyResult, routingResult, siteResult] = await Promise.all([
            db
                .from('domains')
                .select('slug')
                .eq('slug', slug)
                .single(),
            db
                .from('dealer_domains')
                .select('subdomain, site_slug')
                .eq('subdomain', slug)
                .single(),
            db
                .from('dealer_domains')
                .select('site_slug')
                .eq('site_slug', slug)
                .single(),
        ])

        return !legacyResult.data && !routingResult.data && !siteResult.data
    } catch (error) {
        // If no data found, slug is available
        return true
    }
}

/**
 * Updates domain status
 */
export async function updateDomainStatus(
    domainId: string,
    status: 'pending' | 'verifying' | 'active' | 'failed' | 'expired'
): Promise<boolean> {
    try {
        const db = getDomainClient()
        const routingStatus = status === 'verifying' ? 'pending' : status
        const [routingResult, legacyResult] = await Promise.all([
            db
                .from('dealer_domains')
                .update({ status: routingStatus, last_checked_at: new Date().toISOString() })
                .eq('id', domainId),
            db
                .from('domains')
                .update({ status, last_checked_at: new Date().toISOString() })
                .eq('id', domainId),
        ])

        return !routingResult.error || !legacyResult.error
    } catch (error) {
        console.error('Error updating domain status:', error)
        return false
    }
}

/**
 * Sets a domain as primary
 */
export async function setPrimaryDomain(
    dealerId: string,
    domainId: string
): Promise<{ success: boolean; error?: string }> {
    try {
        const db = getDomainClient()
        // First, unset all primary domains for this dealer
        await Promise.all([
            db
                .from('dealer_domains')
                .update({ is_primary: false })
                .eq('dealer_id', dealerId),
            db
                .from('domains')
                .update({ is_primary: false })
                .eq('dealer_id', dealerId),
        ])

        // Then set the new primary
        const [routingResult, legacyResult] = await Promise.all([
            db
                .from('dealer_domains')
                .update({ is_primary: true })
                .eq('id', domainId)
                .eq('dealer_id', dealerId),
            db
                .from('domains')
                .update({ is_primary: true })
                .eq('id', domainId)
                .eq('dealer_id', dealerId),
        ])

        if (routingResult.error && legacyResult.error) {
            return {
                success: false,
                error: 'Failed to set primary domain'
            }
        }

        return { success: true }
    } catch (error) {
        console.error('Error setting primary domain:', error)
        return {
            success: false,
            error: 'An unexpected error occurred'
        }
    }
}
