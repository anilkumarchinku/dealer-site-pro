/**
 * DELETE /api/auth/delete-account
 * Authenticated dealer: delete their own account and all associated data.
 *
 * Sequence (all-or-nothing within reason):
 *  1. Verify auth
 *  2. Soft-delete: mark dealer row as deleted (anonymises PII)
 *  3. Delete the Supabase Auth user (permanent — triggers cascade deletes via DB FK)
 */

import { NextResponse } from 'next/server'
import { requireAuth } from '@/lib/supabase-server'
import { createClient } from '@supabase/supabase-js'

function getServiceClient() {
    return createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!,
    )
}

export async function DELETE() {
    const { user, errorResponse } = await requireAuth()
    if (errorResponse) return errorResponse

    const supabase = getServiceClient()

    // 1. Anonymise PII in the dealers row before deleting the auth user
    //    (preserves lead/analytics rows without personal data)
    await supabase
        .from('dealers')
        .update({
            dealership_name: '[deleted]',
            phone:           null,
            email:           null,
            logo_url:        null,
            cyepro_api_key:  null,
        })
        .eq('user_id', user.id)

    // 2. Delete the Supabase Auth user — cascades to all user-owned rows
    const { error } = await supabase.auth.admin.deleteUser(user.id)

    if (error) {
        console.error('[delete-account] Failed to delete auth user:', error.message)
        return NextResponse.json(
            { error: 'Failed to delete account. Please contact support.' },
            { status: 500 }
        )
    }

    return NextResponse.json({ success: true })
}
