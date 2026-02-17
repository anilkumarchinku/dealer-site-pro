/**
 * Domain Service - Business logic for domain management
 * Phase 1: FREE Subdomain auto-generation
 */

import { supabase, type Domain } from '../supabase'
import { generateSlug, makeSlugUnique, validateSlug, getSubdomainUrl } from '../utils/slug'

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

/**
 * Creates a FREE subdomain for a dealer
 * Automatically called during dealer onboarding
 */
export async function createSubdomainForDealer(
    params: CreateSubdomainParams
): Promise<CreateSubdomainResult> {
    try {
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
        const { data: existingDomains } = await supabase
            .from('domains')
            .select('slug')

        const existingSlugs = existingDomains?.map(d => d.slug) || []

        // Make slug unique
        const uniqueSlug = makeSlugUnique(baseSlug, city, existingSlugs)

        // Generate full subdomain
        const subdomain = getSubdomainUrl(uniqueSlug)

        // Check if dealer already has a domain
        const { data: existingDomain } = await supabase
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
        const { data: newDomain, error } = await supabase
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
            domain: newDomain
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
        const { data, error } = await supabase
            .from('domains')
            .select('*')
            .eq('slug', slug)
            .eq('status', 'active')
            .single()

        if (error || !data) {
            return null
        }

        return data
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
        const { data, error } = await supabase
            .from('domains')
            .select('*')
            .eq('domain', domainName)
            .eq('status', 'active')
            .single()

        if (error || !data) {
            return null
        }

        return data
    } catch (error) {
        console.error('Error getting domain by name:', error)
        return null
    }
}

/**
 * Gets all domains for a dealer
 */
export async function getDealerDomains(dealerId: string): Promise<Domain[]> {
    try {
        const { data, error } = await supabase
            .from('domains')
            .select('*')
            .eq('dealer_id', dealerId)
            .order('is_primary', { ascending: false })
            .order('created_at', { ascending: false })

        if (error) {
            console.error('Error getting dealer domains:', error)
            return []
        }

        return data || []
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
        const { data, error } = await supabase
            .from('domains')
            .select('*')
            .eq('dealer_id', dealerId)
            .eq('is_primary', true)
            .single()

        if (error || !data) {
            return null
        }

        return data
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
        const { data } = await supabase
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
        const { error } = await supabase
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
        // First, unset all primary domains for this dealer
        await supabase
            .from('domains')
            .update({ is_primary: false })
            .eq('dealer_id', dealerId)

        // Then set the new primary
        const { error } = await supabase
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
