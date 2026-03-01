/**
 * SMS Notification Service — MSG91
 * Sends SMS to dealers when a new lead arrives on their site.
 *
 * Setup:
 *   1. Create a free account at msg91.com
 *   2. Get your Auth Key from Dashboard → API Keys
 *   3. Register a sender ID (e.g. DLRPRO)
 *   4. Add MSG91_AUTH_KEY and MSG91_SENDER_ID to .env.local
 */

const MSG91_API_URL = 'https://api.msg91.com/api/v5/flow/'

export interface LeadSmsParams {
    dealerPhone: string      // Dealer's mobile number (10-digit or with country code)
    dealerName: string       // Dealership name
    customerName: string     // Lead's name
    customerPhone: string    // Lead's phone number
    carName?: string         // Car they enquired about (optional)
    leadSource?: string      // 'car_enquiry' | 'contact_form' | etc.
}

/**
 * Normalises a phone number to E.164 format for India (adds +91 if missing).
 */
function normalisePhone(phone: string): string {
    const digits = phone.replace(/\D/g, '')
    if (digits.startsWith('91') && digits.length === 12) return `+${digits}`
    if (digits.length === 10) return `+91${digits}`
    return `+${digits}`
}

/**
 * Sends a new-lead SMS to the dealer via MSG91 Flow API.
 * Falls back gracefully if credentials are missing (dev / staging).
 */
export async function sendLeadSmsToDealer(params: LeadSmsParams): Promise<void> {
    const authKey  = process.env.MSG91_AUTH_KEY
    const senderId = process.env.MSG91_SENDER_ID ?? 'DLRPRO'
    const templateId = process.env.MSG91_LEAD_TEMPLATE_ID

    // Skip silently in dev if key not configured
    if (!authKey) {
        console.log('[SMS] MSG91_AUTH_KEY not set — skipping SMS notification')
        return
    }

    const { dealerPhone, dealerName, customerName, customerPhone, carName, leadSource } = params
    const to = normalisePhone(dealerPhone)

    // Build a readable message for dealers who haven't set up a Flow template yet
    const plainText = carName
        ? `New lead on ${dealerName}! ${customerName} (${customerPhone}) enquired about ${carName}. Login to DealerSite Pro to respond.`
        : `New lead on ${dealerName}! ${customerName} (${customerPhone}) submitted a ${leadSource ?? 'contact'} enquiry. Login to DealerSite Pro to respond.`

    try {
        if (templateId) {
            // ── MSG91 Flow API (DLT-compliant template) ───────────────────────
            const payload = {
                template_id: templateId,
                sender:      senderId,
                short_url:   '0',
                mobiles:     to.replace('+', ''),   // MSG91 expects number without +
                dealer_name:    dealerName,
                customer_name:  customerName,
                customer_phone: customerPhone,
                car_name:       carName ?? 'a vehicle',
            }

            const res = await fetch(MSG91_API_URL, {
                method:  'POST',
                headers: {
                    'Content-Type':  'application/json',
                    'Authkey':       authKey,
                },
                body: JSON.stringify(payload),
            })

            if (!res.ok) {
                const text = await res.text()
                console.error('[SMS] MSG91 Flow error:', res.status, text)
            }
        } else {
            // ── MSG91 Send OTP / plain SMS API (no template required) ─────────
            const url = new URL('https://api.msg91.com/api/sendhttp.php')
            url.searchParams.set('authkey',  authKey)
            url.searchParams.set('mobiles',  to.replace('+', ''))
            url.searchParams.set('message',  plainText)
            url.searchParams.set('sender',   senderId)
            url.searchParams.set('route',    '4')   // transactional route
            url.searchParams.set('country',  '91')
            url.searchParams.set('unicode',  '0')

            const res = await fetch(url.toString())
            if (!res.ok) {
                const text = await res.text()
                console.error('[SMS] MSG91 plain SMS error:', res.status, text)
            }
        }
    } catch (err) {
        // Never let SMS failure break the lead submission
        console.error('[SMS] Failed to send lead SMS:', err)
    }
}
