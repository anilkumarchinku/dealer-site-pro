/**
 * Email Notification Service
 * Sends domain-related emails via the Resend API.
 *
 * All user-supplied values are HTML-escaped before interpolation
 * to prevent XSS in email clients that render HTML.
 */

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
}

async function sendEmail(payload: SendEmailPayload): Promise<{ success: boolean; error?: string }> {
    const apiKey = process.env.RESEND_API_KEY

    if (!apiKey) {
        // In development, log the email content so it's visible without a real key
        if (process.env.NODE_ENV !== 'production') {
            logger.log(`[Email:DEV] To: ${payload.to} | Subject: ${payload.subject}`)
            return { success: true }
        }
        logger.error('[Email] RESEND_API_KEY is not configured — email not sent')
        return { success: false, error: 'Email service not configured' }
    }

    try {
        const res = await fetch('https://api.resend.com/emails', {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${apiKey}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                from: 'DealerSite Pro <noreply@dealersitepro.com>',
                ...payload,
            }),
        })

        if (!res.ok) {
            const body = await res.text()
            throw new Error(`Resend API error ${res.status}: ${body}`)
        }

        return { success: true }
    } catch (err) {
        const msg = err instanceof Error ? err.message : String(err)
        logger.error('[Email] Send failed:', msg)
        return { success: false, error: msg }
    }
}

// ── Shared types ─────────────────────────────────────────────────────────────

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
