import { NextResponse } from 'next/server'
import { isValidDomain } from '@/lib/services/dns-verification-service'
import { registerDomainOnMainProject } from '@/lib/services/vercel-service'
import { requireAuth, requireDealerOwnership } from '@/lib/supabase-server'

/**
 * POST /api/domains/connect-custom
 * Initiates custom domain connection (PRO tier)
 * Requires authentication — dealer ownership is verified server-side.
 */
export async function POST(request: Request) {
    try {
        // ── Auth: require signed-in user ──────────────────────────────────────
        const { user, supabase, errorResponse: authErr } = await requireAuth()
        if (authErr) return authErr

        const body = await request.json()
        const { dealerId, customDomain, templateId } = body

        if (!dealerId || !customDomain) {
            return NextResponse.json(
                { success: false, error: 'Dealer ID and custom domain are required' },
                { status: 400 }
            )
        }

        // ── Ownership: verify user owns this dealer ───────────────────────────
        const { errorResponse: ownerErr } = await requireDealerOwnership(supabase, user.id, dealerId)
        if (ownerErr) return ownerErr

        // Default to 'family' template if not provided
        const template = templateId || 'family'

        // Validate domain format
        const validation = isValidDomain(customDomain)
        if (!validation.valid) {
            return NextResponse.json(
                { success: false, error: validation.error },
                { status: 400 }
            )
        }

        // Check if domain already exists
        const { data: existingDomain } = await supabase
            .from('domains')
            .select('*')
            .eq('domain', customDomain)
            .single()

        if (existingDomain) {
            return NextResponse.json(
                { success: false, error: 'This domain is already connected to another dealer' },
                { status: 400 }
            )
        }

        // Create domain record with pending status
        const { data: newDomain, error } = await supabase
            .from('domains')
            .insert({
                dealer_id: dealerId,
                domain: customDomain,
                slug: customDomain.replace(/\./g, '-'), // example-com
                type: 'custom',
                template_id: template, // Save selected template
                status: 'pending',
                ssl_status: 'pending',
                is_primary: false // Don't make primary until verified
            })
            .select()
            .single()

        if (error) {
            console.error('Error creating custom domain:', error)

            // Provide more specific error messages
            let errorMessage = 'Failed to initiate domain connection'

            if (error.message?.includes('relation') || error.message?.includes('does not exist')) {
                errorMessage = 'Database table not found. Please run database migrations.'
            } else if (error.message?.includes('permission') || error.message?.includes('policy')) {
                errorMessage = 'Database permission denied. Please check RLS policies.'
            } else if (error.message?.includes('unique')) {
                errorMessage = 'This domain is already registered.'
            } else if (error.code === 'PGRST116') {
                errorMessage = 'Database connection failed. Please check your Supabase configuration.'
            }

            return NextResponse.json(
                {
                    success: false,
                    error: errorMessage,
                    details: process.env.NODE_ENV === 'development' ? error.message : undefined
                },
                { status: 500 }
            )
        }

        // Attempt to register domain on the main Vercel project.
        // Errors here are non-fatal — domain is already saved in DB.
        let vercelRegistered = false
        try {
            await registerDomainOnMainProject(customDomain)
            vercelRegistered = true
        } catch (vercelError) {
            console.error('Vercel domain registration failed (non-fatal):', vercelError)
        }

        return NextResponse.json({
            success: true,
            domain: newDomain,
            dns: {
                type:  'CNAME',
                host:  '@',
                value: 'cname.vercel-dns.com',
                ttl:   600,
                note:  'For www: add CNAME with host "www" pointing to cname.vercel-dns.com',
            },
            vercelRegistered,
        })
    } catch (error) {
        console.error('Error in POST /api/domains/connect-custom:', error)
        return NextResponse.json(
            { success: false, error: 'Internal server error' },
            { status: 500 }
        )
    }
}
