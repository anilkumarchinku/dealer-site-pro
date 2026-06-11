/**
 * Email Notification Service
 * Sends domain-related emails via the Resend API.
 *
 * All user-supplied values are HTML-escaped before interpolation
 * to prevent XSS in email clients that render HTML.
 */

import { getOptionalEnv } from '@/lib/env'
import { ExternalApiError, externalApiFetch } from '@/lib/services/external-api-fetch'
import { logger } from '@/lib/utils/logger'

// ── HTML escaping ───────────────────────────────────────────────────────────

function esc(str: string): string {
    return str
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;')
}

// ── Core send helper ────────────────────────────────────────────────────────

interface SendEmailPayload {
    to: string
    subject: string
    html: string
    replyTo?: string
}

async function sendEmail(payload: SendEmailPayload): Promise<{ success: boolean; error?: string }> {
    const apiKey = getOptionalEnv('RESEND_API_KEY')
    const { replyTo, ...emailPayload } = payload

    if (!apiKey) {
        // In development, log the email content so it's visible without a real key
        if (process.env.NODE_ENV !== 'production') {
            logger.log(`[Email:DEV] To: ${emailPayload.to} | Subject: ${emailPayload.subject}`)
            return { success: true }
        }
        logger.error('[Email] RESEND_API_KEY is not configured — email not sent')
        return { success: false, error: 'Email service not configured' }
    }

    try {
        await externalApiFetch({
            baseUrl: 'https://api.resend.com',
            providerName: 'Resend',
            path: '/emails',
            headers: {
                Authorization: `Bearer ${apiKey}`,
                'Content-Type': 'application/json',
            },
            init: {
                method: 'POST',
                body: JSON.stringify({
                    from: getOptionalEnv('EMAIL_FROM') ?? 'DealerSite Pro <noreply@dealersitepro.com>',
                    ...emailPayload,
                    ...(replyTo ? { reply_to: replyTo } : {}),
                }),
            },
            responseType: 'void',
        })

        return { success: true }
    } catch (err) {
        const msg = err instanceof ExternalApiError && err.status
            ? `Resend API error ${err.status}: ${err.bodyText ?? ''}`
            : err instanceof Error ? err.message : String(err)
        logger.error('[Email] Send failed:', msg)
        return { success: false, error: msg }
    }
}

// ── Shared types ─────────────────────────────────────────────────────────────

export async function sendLeadNotificationEmail(params: {
    to: string
    dealerName: string
    customerName: string
    customerPhone: string
    customerEmail?: string
    vehicleName?: string
    message?: string
    leadSource?: string
    replyTo?: string
}) {
    const vehicle = params.vehicleName ? `<li><strong>Vehicle:</strong> ${esc(params.vehicleName)}</li>` : ''
    const email = params.customerEmail ? `<li><strong>Email:</strong> ${esc(params.customerEmail)}</li>` : ''
    const message = params.message ? `<p><strong>Message:</strong><br/>${esc(params.message)}</p>` : ''

    return sendEmail({
        to: params.to,
        subject: `New ${params.leadSource ?? 'buyer'} inquiry - ${params.dealerName}`,
        replyTo: params.replyTo,
        html: `<!DOCTYPE html>
<html>
<body style="font-family:Arial,sans-serif;line-height:1.6;color:#333;max-width:600px;margin:0 auto;padding:20px">
  <h2>New buyer inquiry</h2>
  <p>A customer submitted an inquiry on <strong>${esc(params.dealerName)}</strong>.</p>
  <ul>
    <li><strong>Name:</strong> ${esc(params.customerName)}</li>
    <li><strong>Phone:</strong> ${esc(params.customerPhone)}</li>
    ${email}
    ${vehicle}
    <li><strong>Source:</strong> ${esc(params.leadSource ?? 'website')}</li>
  </ul>
  ${message}
  <p>Follow up from the Leads dashboard or contact the customer directly.</p>
</body>
</html>`,
    })
}

export async function sendLeadConfirmationEmail(params: {
    to: string
    dealerName: string
    customerName: string
    vehicleName?: string
}) {
    const vehicle = params.vehicleName
        ? ` about <strong>${esc(params.vehicleName)}</strong>`
        : ''

    return sendEmail({
        to: params.to,
        subject: `We received your inquiry - ${params.dealerName}`,
        html: `<!DOCTYPE html>
<html>
<body style="font-family:Arial,sans-serif;line-height:1.6;color:#333;max-width:600px;margin:0 auto;padding:20px">
  <h2>Inquiry received</h2>
  <p>Hi ${esc(params.customerName)},</p>
  <p>Your inquiry${vehicle} has been sent to <strong>${esc(params.dealerName)}</strong>.</p>
  <p>The dealership team will contact you soon.</p>
  <p>Best regards,<br/><strong>DealerSite Pro</strong></p>
</body>
</html>`,
    })
}

export async function sendSellRequestNotificationEmail(params: {
    to: string
    sellerName: string
    sellerPhone: string
    sellerEmail?: string
    vehicleName: string
    city?: string
    replyTo?: string
}) {
    const email = params.sellerEmail ? `<li><strong>Email:</strong> ${esc(params.sellerEmail)}</li>` : ''
    const city = params.city ? `<li><strong>City:</strong> ${esc(params.city)}</li>` : ''

    return sendEmail({
        to: params.to,
        subject: `New sell request - ${params.vehicleName}`,
        replyTo: params.replyTo,
        html: `<!DOCTYPE html>
<html>
<body style="font-family:Arial,sans-serif;line-height:1.6;color:#333;max-width:600px;margin:0 auto;padding:20px">
  <h2>New sell request</h2>
  <p>A seller submitted a vehicle for admin review.</p>
  <ul>
    <li><strong>Seller:</strong> ${esc(params.sellerName)}</li>
    <li><strong>Phone:</strong> ${esc(params.sellerPhone)}</li>
    ${email}
    <li><strong>Vehicle:</strong> ${esc(params.vehicleName)}</li>
    ${city}
  </ul>
  <p>Review it from the Sell Requests dashboard.</p>
</body>
</html>`,
    })
}

export async function sendTestDriveNotificationEmail(params: {
    to: string
    dealerName: string
    customerName: string
    customerPhone: string
    customerEmail?: string
    vehicleName?: string
    preferredDate: string
    preferredTime: string
    vehicleType?: '2w' | '3w' | '4w'
    replyTo?: string
}) {
    const label = params.vehicleType === '2w'
        ? 'test ride'
        : params.vehicleType === '3w'
            ? 'trial run'
            : 'test drive'
    const email = params.customerEmail ? `<li><strong>Email:</strong> ${esc(params.customerEmail)}</li>` : ''
    const vehicle = params.vehicleName ? `<li><strong>Vehicle:</strong> ${esc(params.vehicleName)}</li>` : ''

    return sendEmail({
        to: params.to,
        subject: `New ${label} booking - ${params.dealerName}`,
        replyTo: params.replyTo,
        html: `<!DOCTYPE html>
<html>
<body style="font-family:Arial,sans-serif;line-height:1.6;color:#333;max-width:600px;margin:0 auto;padding:20px">
  <h2>New ${esc(label)} booking</h2>
  <p>A customer requested a ${esc(label)} on <strong>${esc(params.dealerName)}</strong>.</p>
  <ul>
    <li><strong>Name:</strong> ${esc(params.customerName)}</li>
    <li><strong>Phone:</strong> ${esc(params.customerPhone)}</li>
    ${email}
    ${vehicle}
    <li><strong>Preferred:</strong> ${esc(params.preferredDate)} at ${esc(params.preferredTime)}</li>
  </ul>
  <p>Follow up from the Leads dashboard or contact the customer directly.</p>
</body>
</html>`,
    })
}

export async function sendTestDriveConfirmationEmail(params: {
    to: string
    dealerName: string
    customerName: string
    vehicleName?: string
    preferredDate: string
    preferredTime: string
    vehicleType?: '2w' | '3w' | '4w'
}) {
    const label = params.vehicleType === '2w'
        ? 'test ride'
        : params.vehicleType === '3w'
            ? 'trial run'
            : 'test drive'
    const vehicle = params.vehicleName ? ` for <strong>${esc(params.vehicleName)}</strong>` : ''

    return sendEmail({
        to: params.to,
        subject: `Your ${label} request was received - ${params.dealerName}`,
        html: `<!DOCTYPE html>
<html>
<body style="font-family:Arial,sans-serif;line-height:1.6;color:#333;max-width:600px;margin:0 auto;padding:20px">
  <h2>${esc(label[0].toUpperCase() + label.slice(1))} request received</h2>
  <p>Hi ${esc(params.customerName)},</p>
  <p>Your ${esc(label)} request${vehicle} has been sent to <strong>${esc(params.dealerName)}</strong>.</p>
  <p>Preferred slot: <strong>${esc(params.preferredDate)} at ${esc(params.preferredTime)}</strong>.</p>
  <p>The dealership team will contact you soon to confirm availability.</p>
</body>
</html>`,
    })
}

export async function sendCarServiceBookingNotificationEmail(params: {
    to: string
    dealerName: string
    customerName: string
    customerPhone: string
    customerEmail?: string
    vehicleRegNo?: string
    vehicleName?: string
    serviceType: string
    preferredDate: string
    preferredSlot: string
    notes?: string
    replyTo?: string
}) {
    const email = params.customerEmail ? `<li><strong>Email:</strong> ${esc(params.customerEmail)}</li>` : ''
    const vehicle = params.vehicleName ? `<li><strong>Vehicle:</strong> ${esc(params.vehicleName)}</li>` : ''
    const regNo = params.vehicleRegNo ? `<li><strong>Registration:</strong> ${esc(params.vehicleRegNo)}</li>` : ''
    const notes = params.notes ? `<p><strong>Notes:</strong><br/>${esc(params.notes)}</p>` : ''

    return sendEmail({
        to: params.to,
        subject: `New service booking - ${params.dealerName}`,
        replyTo: params.replyTo,
        html: `<!DOCTYPE html>
<html>
<body style="font-family:Arial,sans-serif;line-height:1.6;color:#333;max-width:600px;margin:0 auto;padding:20px">
  <h2>New service booking</h2>
  <p>A customer requested service on <strong>${esc(params.dealerName)}</strong>.</p>
  <ul>
    <li><strong>Name:</strong> ${esc(params.customerName)}</li>
    <li><strong>Phone:</strong> ${esc(params.customerPhone)}</li>
    ${email}
    ${vehicle}
    ${regNo}
    <li><strong>Service:</strong> ${esc(params.serviceType)}</li>
    <li><strong>Preferred:</strong> ${esc(params.preferredDate)} at ${esc(params.preferredSlot)}</li>
  </ul>
  ${notes}
  <p>Follow up from the Service Bookings dashboard or contact the customer directly.</p>
</body>
</html>`,
    })
}

export async function sendCarServiceBookingConfirmationEmail(params: {
    to: string
    dealerName: string
    customerName: string
    serviceType: string
    preferredDate: string
    preferredSlot: string
}) {
    return sendEmail({
        to: params.to,
        subject: `Your service request was received - ${params.dealerName}`,
        html: `<!DOCTYPE html>
<html>
<body style="font-family:Arial,sans-serif;line-height:1.6;color:#333;max-width:600px;margin:0 auto;padding:20px">
  <h2>Service request received</h2>
  <p>Hi ${esc(params.customerName)},</p>
  <p>Your <strong>${esc(params.serviceType)}</strong> request has been sent to <strong>${esc(params.dealerName)}</strong>.</p>
  <p>Preferred slot: <strong>${esc(params.preferredDate)} at ${esc(params.preferredSlot)}</strong>.</p>
  <p>The dealership team will contact you soon to confirm the booking.</p>
</body>
</html>`,
    })
}

export async function sendSellRequestConfirmationEmail(params: {
    to: string
    sellerName: string
    vehicleName: string
}) {
    return sendEmail({
        to: params.to,
        subject: `We received your ${params.vehicleName} sell request`,
        html: `<!DOCTYPE html>
<html>
<body style="font-family:Arial,sans-serif;line-height:1.6;color:#333;max-width:600px;margin:0 auto;padding:20px">
  <h2>Sell request received</h2>
  <p>Hi ${esc(params.sellerName)},</p>
  <p>We received your request to sell <strong>${esc(params.vehicleName)}</strong>.</p>
  <p>The dealership team will review your details and contact you for the next step. If the listing is approved, it can be made live by the admin.</p>
  <p>Best regards,<br/><strong>DealerSite Pro</strong></p>
</body>
</html>`,
    })
}

export interface EmailParams {
    to: string
    dealerName: string
    domain: string
}

// ── 1. Subdomain created ─────────────────────────────────────────────────────

export async function sendSubdomainCreatedEmail(params: EmailParams) {
    const { to, dealerName, domain } = params
    const safeName = esc(dealerName)
    const safeDomain = esc(domain)

    return sendEmail({
        to,
        subject: '🎉 Your Dealership Website is Live!',
        html: `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <style>
    body{font-family:Arial,sans-serif;line-height:1.6;color:#333;margin:0;padding:0}
    .wrap{max-width:600px;margin:0 auto;padding:20px}
    .hdr{background:linear-gradient(135deg,#667eea,#764ba2);color:#fff;padding:30px;text-align:center;border-radius:10px 10px 0 0}
    .body{background:#f9fafb;padding:30px;border-radius:0 0 10px 10px}
    .url-box{background:#fff;border:2px solid #3b82f6;padding:20px;margin:20px 0;border-radius:8px;text-align:center;font-family:monospace;font-size:18px;font-weight:bold;color:#3b82f6;word-break:break-all}
    .btn{display:inline-block;background:#3b82f6;color:#fff;padding:12px 30px;text-decoration:none;border-radius:6px;margin:10px 0}
    .tip{background:#fef3c7;padding:15px;border-left:4px solid #f59e0b;margin:20px 0;border-radius:0 4px 4px 0}
  </style>
</head>
<body>
  <div class="wrap">
    <div class="hdr"><h1 style="margin:0">🎉 Welcome to DealerSite Pro!</h1></div>
    <div class="body">
      <p>Hi ${safeName},</p>
      <p>Your dealership website is now <strong>live</strong> and ready to attract customers.</p>
      <div class="url-box">${safeDomain}</div>
      <div style="text-align:center">
        <a href="https://${safeDomain}" class="btn">Visit Your Website →</a>
      </div>
      <h3>Next Steps</h3>
      <ol>
        <li>Log in to your <strong>dashboard</strong> and add your vehicle inventory</li>
        <li>Share your new website URL with customers and on WhatsApp</li>
        <li>Check back for leads submitted through your site</li>
      </ol>
      <div class="tip">
        <strong>Want a custom domain?</strong><br/>
        Upgrade to PRO (₹499/month) to connect your own domain like <em>mydealer.com</em>
      </div>
      <p>Need help? Reply to this email anytime.</p>
      <p>Best regards,<br/><strong>The DealerSite Pro Team</strong></p>
    </div>
  </div>
</body>
</html>`,
    })
}

// ── 2. DNS setup instructions ─────────────────────────────────────────────────

export async function sendDNSInstructionsEmail(
    params: EmailParams & { aRecord: string; cnameRecord: string }
) {
    const { to, dealerName, domain, aRecord, cnameRecord } = params
    const safeName   = esc(dealerName)
    const safeDomain = esc(domain)
    const safeA      = esc(aRecord)
    const safeCname  = esc(cnameRecord)

    return sendEmail({
        to,
        subject: `📋 DNS Setup Instructions for ${safeDomain}`,
        html: `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <style>
    body{font-family:Arial,sans-serif;line-height:1.6;color:#333;max-width:600px;margin:0 auto;padding:20px}
    table{width:100%;border-collapse:collapse;margin:10px 0}
    td,th{padding:10px;border:1px solid #e5e7eb;font-size:14px}
    th{background:#f3f4f6;font-weight:600;text-align:left}
    code{font-family:monospace;background:#f3f4f6;padding:2px 6px;border-radius:3px;color:#1d4ed8}
    .tip{background:#dbeafe;padding:15px;border-radius:6px;margin:20px 0}
  </style>
</head>
<body>
  <h2>DNS Setup Instructions</h2>
  <p>Hi ${safeName},</p>
  <p>To connect <strong>${safeDomain}</strong> to your DealerSite Pro website, add these two DNS records at your domain registrar (GoDaddy, Namecheap, etc.).</p>

  <h3>Record 1 — A Record (root domain)</h3>
  <table>
    <tr><th>Type</th><td><code>A</code></td></tr>
    <tr><th>Name / Host</th><td><code>@</code></td></tr>
    <tr><th>Value / Points to</th><td><code>${safeA}</code></td></tr>
    <tr><th>TTL</th><td>3600 (or "Automatic")</td></tr>
  </table>

  <h3>Record 2 — CNAME Record (www)</h3>
  <table>
    <tr><th>Type</th><td><code>CNAME</code></td></tr>
    <tr><th>Name / Host</th><td><code>www</code></td></tr>
    <tr><th>Value / Points to</th><td><code>${safeCname}</code></td></tr>
    <tr><th>TTL</th><td>3600 (or "Automatic")</td></tr>
  </table>

  <h3>Steps</h3>
  <ol>
    <li>Log in to your domain registrar</li>
    <li>Go to <strong>DNS Management</strong> or <strong>DNS Settings</strong></li>
    <li>Add both records above and save</li>
    <li>Wait 5–30 minutes for propagation</li>
    <li>Return to your DealerSite Pro dashboard and click <strong>"Verify Domain"</strong></li>
  </ol>

  <div class="tip">
    💡 <strong>Tip:</strong> DNS changes usually propagate in 5–30 minutes but can take up to 48 hours.
    If verification fails, wait a bit and try again.
  </div>

  <p>Need help? Reply to this email!</p>
  <p>Best regards,<br/><strong>DealerSite Pro Team</strong></p>
</body>
</html>`,
    })
}

// ── 3. Domain verified ────────────────────────────────────────────────────────

export async function sendDomainVerifiedEmail(params: EmailParams) {
    const { to, dealerName, domain } = params
    const safeName   = esc(dealerName)
    const safeDomain = esc(domain)

    return sendEmail({
        to,
        subject: `✅ Domain Verified — ${safeDomain} is Live!`,
        html: `<!DOCTYPE html>
<html>
<head><meta charset="utf-8" /></head>
<body style="font-family:Arial,sans-serif;line-height:1.6;color:#333;max-width:600px;margin:0 auto;padding:20px">
  <h2 style="color:#10b981">✅ Your Custom Domain is Verified!</h2>
  <p>Hi ${safeName},</p>
  <p>Great news — <strong>${safeDomain}</strong> is now connected to your DealerSite Pro website.</p>
  <p>Your SSL certificate is being provisioned automatically and will be active within a few minutes.</p>
  <p>Customers can now reach your website at <a href="https://${safeDomain}">${safeDomain}</a>.</p>
  <p>Best regards,<br/><strong>DealerSite Pro Team</strong></p>
</body>
</html>`,
    })
}

// ── 4. Domain expiry warning ──────────────────────────────────────────────────

export async function sendDomainExpiryWarning(
    params: EmailParams & { daysUntilExpiry: number }
) {
    const { to, dealerName, domain, daysUntilExpiry } = params
    const safeName        = esc(dealerName)
    const safeDomain      = esc(domain)
    const urgency         = daysUntilExpiry <= 7 ? '🚨 Urgent' : '⚠️ Action Required'
    const borderColor     = daysUntilExpiry <= 7 ? '#ef4444' : '#f59e0b'

    return sendEmail({
        to,
        subject: `${urgency}: ${safeDomain} expires in ${daysUntilExpiry} days`,
        html: `<!DOCTYPE html>
<html>
<head><meta charset="utf-8" /></head>
<body style="font-family:Arial,sans-serif;line-height:1.6;color:#333;max-width:600px;margin:0 auto;padding:20px">
  <div style="border-left:4px solid ${borderColor};padding:15px;background:#fff7ed;margin-bottom:20px">
    <h2 style="margin:0;color:${borderColor}">${urgency}: Domain Expiring Soon</h2>
  </div>
  <p>Hi ${safeName},</p>
  <p>Your domain <strong>${safeDomain}</strong> is set to expire in <strong>${daysUntilExpiry} day${daysUntilExpiry === 1 ? '' : 's'}</strong>.</p>
  <p>If it expires, your dealership website will go offline and customers will not be able to reach you.</p>
  <p>
    <a href="https://app.dealersitepro.com/dashboard/domains"
       style="display:inline-block;background:#3b82f6;color:#fff;padding:12px 30px;text-decoration:none;border-radius:6px">
      Renew My Domain →
    </a>
  </p>
  <p>Need help? Reply to this email.</p>
  <p>Best regards,<br/><strong>DealerSite Pro Team</strong></p>
</body>
</html>`,
    })
}

// ── 5. SSL renewal notification ───────────────────────────────────────────────

export async function sendSSLRenewalNotification(
    params: EmailParams & { status: 'success' | 'failed' }
) {
    const { to, dealerName, domain, status } = params
    const safeName   = esc(dealerName)
    const safeDomain = esc(domain)

    const isSuccess   = status === 'success'
    const emoji       = isSuccess ? '🔒' : '⚠️'
    const heading     = isSuccess ? 'SSL Certificate Renewed' : 'SSL Renewal Failed — Action Required'
    const bodyText    = isSuccess
        ? `Your SSL certificate for <strong>${safeDomain}</strong> has been renewed automatically. Your website continues to be secure with HTTPS.`
        : `We were unable to automatically renew the SSL certificate for <strong>${safeDomain}</strong>. Your website may show a security warning to visitors. Please log in to your dashboard and check your domain settings.`

    return sendEmail({
        to,
        subject: `${emoji} ${heading} — ${safeDomain}`,
        html: `<!DOCTYPE html>
<html>
<head><meta charset="utf-8" /></head>
<body style="font-family:Arial,sans-serif;line-height:1.6;color:#333;max-width:600px;margin:0 auto;padding:20px">
  <h2>${emoji} ${esc(heading)}</h2>
  <p>Hi ${safeName},</p>
  <p>${bodyText}</p>
  ${!isSuccess ? `<p><a href="https://app.dealersitepro.com/dashboard/domains" style="display:inline-block;background:#ef4444;color:#fff;padding:12px 24px;text-decoration:none;border-radius:6px">Fix Domain Settings →</a></p>` : ''}
  <p>Best regards,<br/><strong>DealerSite Pro Team</strong></p>
</body>
</html>`,
    })
}

// ── 6. OTP email (already working — preserved as-is) ─────────────────────────

export async function sendOtpEmail(
    to: string,
    subject: string,
    html: string
): Promise<{ success: boolean; error?: string }> {
    return sendEmail({ to, subject, html })
}
