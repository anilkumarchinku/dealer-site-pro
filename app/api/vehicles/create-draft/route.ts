/**
 * POST /api/vehicles/create-draft
 * Creates a draft vehicle from RC lookup data
 * Draft vehicles need dealer to complete price, mileage, photos before publishing
 */

import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient, requireAuth } from '@/lib/supabase-server';
import { addVehicle } from '@/lib/db/vehicles';
import {
    validateRCDataForDraft,
    mapRCToVehiclePayload,
    type RCData,
} from '@/lib/utils/rc-mapper';

function getServiceSupabase() {
    return createAdminClient();
}

/** Resolve the dealer_id that belongs to the authenticated user. */
async function getDealerIdForUser(userId: string): Promise<string | null> {
    const supabase = getServiceSupabase();
    const { data } = await supabase
        .from('dealers')
        .select('id')
        .eq('user_id', userId)
        .single();
    return data?.id ?? null;
}

/** Check if a vehicle with this RC number already exists for this dealer */
async function checkDuplicateRC(
    dealerId: string,
    rcNumber: string
): Promise<{ exists: boolean; vehicleId?: string }> {
    const supabase = getServiceSupabase();
    const { data } = await supabase
        .from('vehicles')
        .select('id, status')
        .eq('dealer_id', dealerId)
        .eq('registration_number', rcNumber)
        .neq('status', 'inactive')
        .maybeSingle();

    return {
        exists: !!data,
        vehicleId: data?.id,
    };
}

export async function POST(request: NextRequest) {
    // 1. Authenticate user
    const { user, errorResponse } = await requireAuth();
    if (errorResponse) return errorResponse;

    // 2. Parse and validate request body
    const body = await request.json().catch(() => null);
    if (!body?.rcData) {
        return NextResponse.json(
            { error: 'RC data is required' },
            { status: 400 }
        );
    }

    const rcData: RCData = body.rcData;

    // 3. Validate RC data has required fields
    const validation = validateRCDataForDraft(rcData);
    if (!validation.valid) {
        return NextResponse.json(
            { error: validation.error },
            { status: 400 }
        );
    }

    // 4. Get dealer ID from authenticated user
    const dealerId = await getDealerIdForUser(user.id);
    if (!dealerId) {
        return NextResponse.json(
            { error: 'Dealer account not found' },
            { status: 404 }
        );
    }

    // 5. Check for duplicate RC number
    const duplicate = await checkDuplicateRC(dealerId, rcData.rc_number);
    if (duplicate.exists) {
        return NextResponse.json(
            {
                error: 'A vehicle with this RC number already exists in your inventory',
                vehicleId: duplicate.vehicleId,
            },
            { status: 409 }
        );
    }

    // 6. Map RC data to vehicle payload
    const vehiclePayload = mapRCToVehiclePayload(rcData, dealerId);

    // 7. Create draft vehicle (price_paise defaults to 0 for drafts)
    const result = await addVehicle({
        ...vehiclePayload,
        price_paise: 0, // Dealer must set price
        status: 'draft',
    });

    if (!result.success) {
        console.error('[create-draft] Failed to create vehicle:', result.error);
        return NextResponse.json(
            { error: result.error || 'Failed to create draft vehicle' },
            { status: 500 }
        );
    }

    return NextResponse.json({
        success: true,
        vehicleId: result.id,
        message: 'Draft vehicle created successfully',
    });
}
