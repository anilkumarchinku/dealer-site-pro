/**
 * GET /api/credits/usage-stats
 * Returns API usage statistics for the authenticated dealer
 */

import { NextRequest, NextResponse } from 'next/server';
import { requireAuth, createAdminClient } from '@/lib/supabase-server';
import { getDealerCredits, getRecentUsageLogs } from '@/lib/db/credits';

/** Get dealer ID from authenticated user */
async function getDealerIdForUser(userId: string): Promise<string | null> {
    const supabase = createAdminClient();
    const { data } = await supabase
        .from('dealers')
        .select('id')
        .eq('user_id', userId)
        .single();
    return data?.id ?? null;
}

export async function GET(request: NextRequest) {
    const { user, errorResponse } = await requireAuth();
    if (errorResponse) return errorResponse;

    const dealerId = await getDealerIdForUser(user.id);
    if (!dealerId) {
        return NextResponse.json(
            { error: 'Dealer account not found' },
            { status: 404 }
        );
    }

    // Get total stats
    const { credits } = await getDealerCredits(dealerId);

    // Get recent logs
    const { logs } = await getRecentUsageLogs(dealerId, 10);

    return NextResponse.json({
        totalCalls: credits?.total_calls || 0,
        totalSpent: credits?.total_spent_inr || 0,
        recentCalls: logs,
    });
}
