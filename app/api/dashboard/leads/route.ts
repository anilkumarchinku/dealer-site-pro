import { NextRequest, NextResponse } from "next/server"

import { requireAuth, getDealerForUser } from "@/lib/supabase-server"
import { logger } from "@/lib/utils/logger"

/**
 * POST /api/dashboard/leads
 * Dealer-authenticated manual lead capture (walk-in / phone enquiries).
 * Lands the lead in the dealer's inbox with source='walk_in' and an optional
 * follow-up date so it surfaces in the follow-up reminders.
 */

const PRIORITIES = ["hot", "warm", "cold"] as const
const LEAD_TYPES = ["inquiry", "test_drive", "quote", "service", "trade_in", "financing"] as const

export async function POST(request: NextRequest) {
    try {
        const { user, supabase, errorResponse } = await requireAuth()
        if (errorResponse) return errorResponse

        const dealer = await getDealerForUser(supabase, user.id)
        if (!dealer) {
            return NextResponse.json({ error: "Dealer account not found" }, { status: 404 })
        }

        const body = await request.json().catch(() => null)
        if (!body) return NextResponse.json({ error: "Invalid JSON" }, { status: 400 })

        const name = typeof body.customer_name === "string" ? body.customer_name.trim() : ""
        const phone = typeof body.customer_phone === "string" ? body.customer_phone.trim() : ""
        if (!name || !phone) {
            return NextResponse.json({ error: "Customer name and phone are required" }, { status: 400 })
        }

        const priority = PRIORITIES.includes(body.priority) ? body.priority : "warm"
        const leadType = LEAD_TYPES.includes(body.lead_type) ? body.lead_type : "inquiry"
        const followUp =
            typeof body.follow_up_date === "string" && /^\d{4}-\d{2}-\d{2}$/.test(body.follow_up_date)
                ? body.follow_up_date
                : null

        const insert = {
            dealer_id: dealer.id,
            customer_name: name,
            customer_phone: phone,
            customer_email: typeof body.customer_email === "string" ? body.customer_email.trim() || null : null,
            vehicle_interest: typeof body.vehicle_interest === "string" ? body.vehicle_interest.trim() || null : null,
            message: typeof body.message === "string" ? body.message.trim() || null : null,
            notes: typeof body.notes === "string" ? body.notes.trim() || null : null,
            lead_type: leadType,
            priority,
            status: "new" as const,
            source: "walk_in",
            follow_up_date: followUp,
        }

        const { data, error } = await supabase
            .from("leads")
            .insert(insert)
            .select("id")
            .maybeSingle()

        if (error) {
            logger.error("Walk-in lead create error:", error.message)
            return NextResponse.json({ error: "Failed to add lead" }, { status: 500 })
        }

        return NextResponse.json({ success: true, id: data?.id })
    } catch (err) {
        logger.error("Walk-in lead API error:", err)
        return NextResponse.json({ error: "Internal error" }, { status: 500 })
    }
}
