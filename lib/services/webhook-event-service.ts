import type { createAdminClient } from '@/lib/supabase-server'
import { toJsonValue } from '@/lib/utils/json-value'

export type WebhookProvider = 'razorpay'
export type WebhookEventStatus = 'processing' | 'processed' | 'failed'
type AdminSupabaseClient = ReturnType<typeof createAdminClient>

export type WebhookEventClaim =
    | { duplicate: false; storageAvailable: boolean }
    | { duplicate: true; storageAvailable: boolean; status?: WebhookEventStatus }

type WebhookEventInput = {
    provider: WebhookProvider
    eventId: string | null
    eventType: string
    payload?: unknown
}

const missingTableCodes = new Set(['42P01', 'PGRST205', 'PGRST204'])

function isDuplicateError(error: { code?: string; message?: string } | null | undefined): boolean {
    return error?.code === '23505' || /duplicate key/i.test(error?.message ?? '')
}

function isMissingWebhookTable(error: { code?: string; message?: string } | null | undefined): boolean {
    return !!error && (
        missingTableCodes.has(error.code ?? '') ||
        /webhook_events/i.test(error.message ?? '') && /does not exist|not found|schema cache/i.test(error.message ?? '')
    )
}

export async function claimWebhookEvent(
    supabase: AdminSupabaseClient,
    input: WebhookEventInput
): Promise<WebhookEventClaim> {
    if (!input.eventId) {
        return { duplicate: false, storageAvailable: false }
    }

    const { error } = await supabase
        .from('webhook_events')
        .insert({
            provider: input.provider,
            event_id: input.eventId,
            event_type: input.eventType,
            status: 'processing',
            payload: toJsonValue(input.payload),
        })

    if (!error) {
        return { duplicate: false, storageAvailable: true }
    }

    if (isMissingWebhookTable(error)) {
        console.warn('[Webhook] webhook_events table is missing; falling back to in-process dedupe')
        return { duplicate: false, storageAvailable: false }
    }

    if (!isDuplicateError(error)) {
        throw error
    }

    const { data: existing } = await supabase
        .from('webhook_events')
        .select('status')
        .eq('provider', input.provider)
        .eq('event_id', input.eventId)
        .single()

    if (existing?.status === 'failed') {
        await supabase
            .from('webhook_events')
            .update({
                status: 'processing',
                error_message: null,
                event_type: input.eventType,
                payload: toJsonValue(input.payload),
                received_at: new Date().toISOString(),
                processed_at: null,
            })
            .eq('provider', input.provider)
            .eq('event_id', input.eventId)
        return { duplicate: false, storageAvailable: true }
    }

    return {
        duplicate: true,
        storageAvailable: true,
        status: existing?.status as WebhookEventStatus | undefined,
    }
}

export async function markWebhookEventProcessed(
    supabase: AdminSupabaseClient,
    provider: WebhookProvider,
    eventId: string | null
): Promise<void> {
    if (!eventId) return

    await supabase
        .from('webhook_events')
        .update({
            status: 'processed',
            processed_at: new Date().toISOString(),
            error_message: null,
        })
        .eq('provider', provider)
        .eq('event_id', eventId)
}

export async function markWebhookEventFailed(
    supabase: AdminSupabaseClient,
    provider: WebhookProvider,
    eventId: string | null,
    error: unknown
): Promise<void> {
    if (!eventId) return

    await supabase
        .from('webhook_events')
        .update({
            status: 'failed',
            processed_at: new Date().toISOString(),
            error_message: error instanceof Error ? error.message : String(error),
        })
        .eq('provider', provider)
        .eq('event_id', eventId)
}
