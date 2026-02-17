import { NextResponse } from 'next/server'
import { supabase, isSupabaseReady, getSupabaseConfigError } from '@/lib/supabase'
import { isValidDomain } from '@/lib/services/dns-verification-service'

/**
 * POST /api/domains/connect-custom
 * Initiates custom domain connection (PRO tier)
 */
export async function POST(request: Request) {
    try {
        // Check if Supabase is configured
        if (!isSupabaseReady()) {
            const configError = getSupabaseConfigError()
            console.error('Supabase not configured:', configError)
            return NextResponse.json(
                {
                    success: false,
                    error: 'Database not configured. Please contact support.',
                    details: process.env.NODE_ENV === 'development' ? configError : undefined
                },
                { status: 503 }
            )
        }

        const body = await request.json()
        const { dealerId, customDomain, templateId } = body

        if (!dealerId || !customDomain) {
            return NextResponse.json(
                { success: false, error: 'Dealer ID and custom domain are required' },
                { status: 400 }
            )
        }

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

        return NextResponse.json({
            success: true,
            domain: newDomain,
            message: 'Domain added. Please configure DNS settings to verify.'
        })
    } catch (error) {
        console.error('Error in POST /api/domains/connect-custom:', error)
        return NextResponse.json(
            { success: false, error: 'Internal server error' },
            { status: 500 }
        )
    }
}
