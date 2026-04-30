/**
 * Domain Service - Business logic for domain management
 * Phase 1: FREE Subdomain auto-generation
 */

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

type DealerDomainRow = {
    id: string
    dealer_id: string
    custom_domain: string | null
    subdomain: string | null
    subdomain_url: string | null
    domain_type: string | null
    status: string | null
    ssl_status: string | null
    is_primary: boolean | null
    dns_verified_at: string | null
    ssl_provisioned_at: string | null
    ssl_expires_at: string | null
    last_checked_at: string | null
    registrar: string | null
    registration_expires_at: string | null
    auto_renew: boolean | null
    site_slug?: string | null
    created_at: string
    updated_at: string
}

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
        const { data: existingDomains } = await db
            .from('domains')
            .select('slug')

        const existingSlugs = existingDomains?.map(d => d.slug) || []

        // Make slug unique
        const uniqueSlug = makeSlugUnique(baseSlug, city, existingSlugs)

        // Generate full subdomain
        const subdomain = getSubdomainUrl(uniqueSlug)

        // Check if dealer already has a domain
        const { data: existingDomain } = await db
            .from('domains')
            .select('*')
            .eq('dealer_id', dealerId)
            .single()

        if (existingDomain) {
            return {
                success: false,
                error: 'Dealer already has a domain'
            }
        }

        // Create domain record
        const { data: newDomain, error } = await db
            .from('domains')
            .insert({
                dealer_id: dealerId,
                domain: subdomain,
                slug: uniqueSlug,
                type: 'subdomain',
                template_id: templateId || 'family', // Use provided template or default to 'family'
                status: 'active',
                ssl_status: 'active', // Wildcard SSL is pre-configured
                is_primary: true,
                ssl_provisioned_at: new Date().toISOString()
            })
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
        const { data, error } = await db
            .from('domains')
            .select('*')
            .eq('domain', domainName)
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
                .select('id, dealer_id, custom_domain, subdomain, subdomain_url, domain_type, status, ssl_status, is_primary, dns_verified_at, ssl_provisioned_at, ssl_expires_at, last_checked_at, registrar, registration_expires_at, auto_renew, site_slug, created_at, updated_at')
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
        const { data, error } = await db
            .from('domains')
            .select('*')
            .eq('dealer_id', dealerId)
            .eq('is_primary', true)
            .single()

        if (error || !data) {
            return null
        }

        return data as unknown as Domain
    } catch (error) {
        console.error('Error getting primary domain:', error)
        return null
    }
}

/**
 * Checks if a slug is available
 */
export async function isSlugAvailable(slug: string): Promise<boolean> {
    try {
        const db = getDomainClient()
        const { data } = await db
            .from('domains')
            .select('slug')
            .eq('slug', slug)
            .single()

        return !data
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
        const { error } = await db
            .from('domains')
            .update({ status })
            .eq('id', domainId)

        return !error
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
        await db
            .from('domains')
            .update({ is_primary: false })
            .eq('dealer_id', dealerId)

        // Then set the new primary
        const { error } = await db
            .from('domains')
            .update({ is_primary: true })
            .eq('id', domainId)
            .eq('dealer_id', dealerId)

        if (error) {
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
