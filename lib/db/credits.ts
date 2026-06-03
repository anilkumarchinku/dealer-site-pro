/**
 * Credit Tracking System
 * Tracks API usage and costs for dealers (Plan 1 pricing)
 */

import { createClient } from '@supabase/supabase-js';

// Plan 1 pricing (default for all dealers)
const API_COSTS = {
    rc_verification: 3.00,    // ₹3 per RC lookup
    rc_challan: 5.00,         // ₹5 per challan check
    pan_verification: 2.00,    // ₹2 per PAN verification
    dl_verification: 2.50,     // ₹2.50 per DL verification
};

export type ApiType = keyof typeof API_COSTS;

export interface DealerCredits {
    dealer_id: string;
    total_calls: number;
    total_spent_inr: number;
    plan_type: string;
    created_at: string;
    updated_at: string;
}

export interface ApiUsageLog {
    id: string;
    dealer_id: string;
    api_type: string;
    request_params: Record<string, unknown>;
    response_success: boolean;
    cost_inr: number;
    error_message?: string;
    ip_address?: string;
    created_at: string;
}

function getServiceSupabase() {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY
        ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    if (!url || !key || url.includes('placeholder')) return null;
    return createClient(url, key);
}

/**
 * Get the cost for an API type (Plan 1 pricing)
 */
export function getApiCost(apiType: ApiType): number {
    return API_COSTS[apiType] || 0;
}

/**
 * Log API usage and update dealer credits
 */
export async function logApiUsage(params: {
    dealerId: string;
    apiType: ApiType;
    requestParams?: Record<string, unknown>;
    responseSuccess: boolean;
    errorMessage?: string;
    ipAddress?: string;
}): Promise<{ success: boolean; error?: string }> {
    const supabase = getServiceSupabase();
    if (!supabase) {
        return { success: false, error: 'Supabase not configured' };
    }

    const cost = getApiCost(params.apiType);

    try {
        // 1. Insert usage log
        const { error: logError } = await supabase
            .from('api_usage_logs')
            .insert({
                dealer_id: params.dealerId,
                api_type: params.apiType,
                request_params: params.requestParams || {},
                response_success: params.responseSuccess,
                cost_inr: cost,
                error_message: params.errorMessage,
                ip_address: params.ipAddress,
            });

        if (logError) {
            console.error('[logApiUsage] Failed to insert log:', logError);
            return { success: false, error: logError.message };
        }

        // 2. Update dealer credits summary
        const { error: creditError } = await supabase.rpc('log_api_usage', {
            p_dealer_id: params.dealerId,
            p_cost: cost,
        });

        if (creditError) {
            console.error('[logApiUsage] Failed to update credits:', creditError);
            return { success: false, error: creditError.message };
        }

        return { success: true };
    } catch (err) {
        console.error('[logApiUsage] Unexpected error:', err);
        return {
            success: false,
            error: err instanceof Error ? err.message : 'Unknown error'
        };
    }
}

/**
 * Get dealer's total usage stats
 */
export async function getDealerCredits(
    dealerId: string
): Promise<{ credits: DealerCredits | null; error?: string }> {
    const supabase = getServiceSupabase();
    if (!supabase) {
        return { credits: null, error: 'Supabase not configured' };
    }

    const { data, error } = await supabase
        .from('dealer_credits')
        .select('*')
        .eq('dealer_id', dealerId)
        .maybeSingle();

    if (error) {
        console.error('[getDealerCredits]', error);
        return { credits: null, error: error.message };
    }

    return { credits: data as DealerCredits | null };
}

/**
 * Get recent API usage logs for a dealer
 */
export async function getRecentUsageLogs(
    dealerId: string,
    limit = 10
): Promise<{ logs: ApiUsageLog[]; error?: string }> {
    const supabase = getServiceSupabase();
    if (!supabase) {
        return { logs: [], error: 'Supabase not configured' };
    }

    const { data, error } = await supabase
        .from('api_usage_logs')
        .select('*')
        .eq('dealer_id', dealerId)
        .order('created_at', { ascending: false })
        .limit(limit);

    if (error) {
        console.error('[getRecentUsageLogs]', error);
        return { logs: [], error: error.message };
    }

    return { logs: (data as ApiUsageLog[]) || [] };
}

/**
 * Get usage stats for a specific date range
 */
export async function getUsageStats(
    dealerId: string,
    startDate?: Date,
    endDate?: Date
): Promise<{
    totalCalls: number;
    totalCost: number;
    byType: Record<string, { calls: number; cost: number }>;
}> {
    const supabase = getServiceSupabase();
    if (!supabase) {
        return { totalCalls: 0, totalCost: 0, byType: {} };
    }

    let query = supabase
        .from('api_usage_logs')
        .select('api_type, cost_inr, response_success')
        .eq('dealer_id', dealerId);

    if (startDate) {
        query = query.gte('created_at', startDate.toISOString());
    }
    if (endDate) {
        query = query.lte('created_at', endDate.toISOString());
    }

    const { data } = await query;

    if (!data) {
        return { totalCalls: 0, totalCost: 0, byType: {} };
    }

    const stats = {
        totalCalls: data.length,
        totalCost: data.reduce((sum, log) => sum + (log.cost_inr || 0), 0),
        byType: {} as Record<string, { calls: number; cost: number }>,
    };

    // Group by API type
    data.forEach(log => {
        if (!stats.byType[log.api_type]) {
            stats.byType[log.api_type] = { calls: 0, cost: 0 };
        }
        stats.byType[log.api_type].calls++;
        stats.byType[log.api_type].cost += log.cost_inr || 0;
    });

    return stats;
}
