/**
 * POST /api/messages
 * Anonymous — visitors from dealer sites send a general contact message.
 * These surface in the dealer dashboard Messages inbox (+ unread bell).
 *
 * Body: {
 *   dealer_id: string  (required — validated against DB)
 *   sender_name: string (required)
 *   sender_email?: string
 *   sender_phone?: string
 *   subject?: string
 *   content: string    (required — the message body)
 * }
 */

import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { createAdminClient } from '@/lib/supabase-server'
import { rateLimitOrNull } from '@/lib/utils/rate-limiter'
import { logger } from '@/lib/utils/logger'

const messageSchema = z.object({
    dealer_id: z.string().uuid(),
    sender_name: z.string().trim().min(2, 'Please enter your name').max(100),
    sender_email: z.string().trim().email().optional().or(z.literal('')),
    sender_phone: z.string().trim().max(20).optional().or(z.literal('')),
    subject: z.string().trim().max(150).optional().or(z.literal('')),
    content: z.string().trim().min(1, 'Please enter a message').max(2000),
})

export async function POST(request: NextRequest) {
    try {
        const limited = await rateLimitOrNull('message_create', request, 5, 60_000); if (limited) return limited;

        const body = await request.json().catch(() => null)
        const parsed = messageSchema.safeParse(body)
        if (!parsed.success) {
            return NextResponse.json({ error: 'Invalid message' }, { status: 400 })
        }
        const { dealer_id, sender_name, sender_email, sender_phone, subject, content } = parsed.data

        const supabase = createAdminClient()

        // Verify the dealer exists (prevents phantom messages)
        const { data: dealer, error: dealerErr } = await supabase
            .from('dealers')
            .select('id')
            .eq('id', dealer_id)
            .single()

        if (dealerErr || !dealer) {
            return NextResponse.json({ error: 'Invalid dealer' }, { status: 400 })
        }

        const { error } = await supabase
            .from('messages')
            .insert({
                dealer_id,
                sender_name,
                sender_email: sender_email?.trim() || null,
                sender_phone: sender_phone?.trim() || null,
                subject: subject?.trim() || null,
                content,
            })

        if (error) {
            logger.error('Message insert error:', error.message)
            return NextResponse.json({ error: 'Failed to send message' }, { status: 500 })
        }

        return NextResponse.json({ success: true })
    } catch (err) {
        logger.error('Message API error:', err)
        return NextResponse.json({ error: 'Internal error' }, { status: 500 })
    }
}
