import { NextResponse } from 'next/server'
import { requireAuth, requireDealerOwnership } from '@/lib/supabase-server'
import { removeDomainFromMainProject } from '@/lib/services/vercel-service'

/**
 * POST /api/domains/remove-custom
 * Removes a custom domain from the dealer's account.
 * Deletes from dealer_domains table and removes from Vercel project.
 */
export async function POST(request: Request) {
    try {
        const { user, supabase, errorResponse: authErr } = await requireAuth()
        if (authErr) return authErr

        const body = await request.json()
        const { domainId, domain, dealerId } = body

        if (!domainId || !domain || !dealerId) {
            return NextResponse.json(
                { success: false, error: 'domainId, domain, and dealerId are required' },
                { status: 400 }
            )
        }

        // Verify the calling user owns this dealer
        const { errorResponse: ownerErr } = await requireDealerOwnership(supabase, user.id, dealerId)
        if (ownerErr) return ownerErr

        // Delete from dealer_domains — scoped to both id + dealer_id for safety
        const { error: dbErr } = await supabase
            .from('dealer_domains')
            .delete()
            .eq('id', domainId)
            .eq('dealer_id', dealerId)

        if (dbErr) {
            return NextResponse.json({ success: false, error: dbErr.message }, { status: 500 })
        }

        // Remove from Vercel — non-fatal if it fails
        try {
            await removeDomainFromMainProject(domain)
        } catch (vercelErr) {
            console.warn('[remove-custom] Vercel removal failed (non-fatal):', vercelErr)
        }

        return NextResponse.json({ success: true })

    } catch (err) {
        console.error('[remove-custom] error:', err)
        return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 })
    }
}
