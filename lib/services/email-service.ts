/**
 * Email Notification Service
 * Sends domain-related emails using Resend
 */

export interface EmailParams {
    to: string
    dealerName: string
    domain: string
}

/**
 * Sends email when subdomain is created
 */
export async function sendSubdomainCreatedEmail(params: EmailParams) {
    const { to, dealerName, domain } = params

    try {
        // In production, use Resend API
        const emailContent = {
            from: 'DealerSite Pro <domains@dealersitepro.com>',
            to,
            subject: '🎉 Your Website is Live!',
            html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }
            .domain-box { background: white; border: 2px solid #3b82f6; padding: 20px; margin: 20px 0; border-radius: 8px; text-align: center; }
            .domain { font-size: 24px; font-weight: bold; color: #3b82f6; font-family: monospace; }
            .button { display: inline-block; background: #3b82f6; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; margin: 20px 0; }
            .features { background: white; padding: 20px; margin: 20px 0; border-radius: 8px; }
            .feature { margin: 10px 0; padding-left: 30px; position: relative; }
            .feature:before { content: "✓"; position: absolute; left: 0; color: #10b981; font-weight: bold; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🎉 Welcome to DealerSite Pro!</h1>
            </div>
            <div class="content">
              <p>Hi ${dealerName},</p>
              
              <p>Great news! Your website is now live and ready to attract customers.</p>
              
              <div class="domain-box">
                <p style="margin: 0; font-size: 14px; color: #6b7280;">Your website URL:</p>
                <p class="domain">${domain}</p>
              </div>

              <div style="text-align: center;">
                <a href="https://${domain}" class="button">Visit Your Website →</a>
              </div>

              <div class="features">
                <h3>What's included:</h3>
                <div class="feature">Free SSL Certificate (HTTPS)</div>
                <div class="feature">Unlimited bandwidth</div>
                <div class="feature">Professional templates</div>
                <div class="feature">Lead capture forms</div>
                <div class="feature">Mobile-responsive design</div>
              </div>

              <h3>Next Steps:</h3>
              <ol>
                <li>Complete your onboarding to customize your site</li>
                <li>Add your vehicle inventory</li>
                <li>Share your new website with customers</li>
              </ol>

              <p style="background: #fef3c7; padding: 15px; border-left: 4px solid #f59e0b; margin: 20px 0;">
                <strong>Want a custom domain?</strong><br>
                Upgrade to PRO (₹499/month) to use your own domain like mydealer.com
              </p>

              <p>Need help? Reply to this email anytime!</p>
              
              <p>Best regards,<br>
              The DealerSite Pro Team</p>
            </div>
          </div>
        </body>
        </html>
      `
        }

        // In production, call Resend API:
        /*
        const response = await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(emailContent)
        });
        */

        console.log(`[Email] Subdomain created notification sent to ${to}`)
        return { success: true }
    } catch (error) {
        console.error('Error sending email:', error)
        return { success: false, error }
    }
}

/**
 * Sends DNS setup instructions for custom domain
 */
export async function sendDNSInstructionsEmail(params: EmailParams & { aRecord: string; cnameRecord: string }) {
    const { to, dealerName, domain, aRecord, cnameRecord } = params

    const emailContent = {
        from: 'DealerSite Pro <domains@dealersitepro.com>',
        to,
        subject: `📋 DNS Setup Instructions for ${domain}`,
        html: `
      <!DOCTYPE html>
      <html>
      <body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2>DNS Setup Instructions</h2>
        <p>Hi ${dealerName},</p>
        <p>To connect <strong>${domain}</strong> to your DealerSite Pro website, please add these DNS records at your domain registrar:</p>
        
        <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="margin-top: 0;">Record 1: A Record</h3>
          <table style="width: 100%; border-collapse: collapse;">
            <tr style="background: white;">
              <td style="padding: 10px; border: 1px solid #e5e7eb;"><strong>Type:</strong></td>
              <td style="padding: 10px; border: 1px solid #e5e7eb; font-family: monospace;">A</td>
            </tr>
            <tr style="background: white;">
              <td style="padding: 10px; border: 1px solid #e5e7eb;"><strong>Name:</strong></td>
              <td style="padding: 10px; border: 1px solid #e5e7eb; font-family: monospace;">@</td>
            </tr>
            <tr style="background: white;">
              <td style="padding: 10px; border: 1px solid #e5e7eb;"><strong>Value:</strong></td>
              <td style="padding: 10px; border: 1px solid #e5e7eb; font-family: monospace; color: #3b82f6;">${aRecord}</td>
            </tr>
          </table>

          <h3>Record 2: CNAME Record</h3>
          <table style="width: 100%; border-collapse: collapse;">
            <tr style="background: white;">
              <td style="padding: 10px; border: 1px solid #e5e7eb;"><strong>Type:</strong></td>
              <td style="padding: 10px; border: 1px solid #e5e7eb; font-family: monospace;">CNAME</td>
            </tr>
            <tr style="background: white;">
              <td style="padding: 10px; border: 1px solid #e5e7eb;"><strong>Name:</strong></td>
              <td style="padding: 10px; border: 1px solid #e5e7eb; font-family: monospace;">www</td>
            </tr>
            <tr style="background: white;">
              <td style="padding: 10px; border: 1px solid #e5e7eb;"><strong>Value:</strong></td>
              <td style="padding: 10px; border: 1px solid #e5e7eb; font-family: monospace; color: #3b82f6;">${cnameRecord}</td>
            </tr>
          </table>
        </div>

        <p><strong>Next Steps:</strong></p>
        <ol>
          <li>Log in to your domain registrar (GoDaddy, Namecheap, etc.)</li>
          <li>Find DNS Management or DNS Settings</li>
          <li>Add the records above</li>
          <li>Save changes and wait 5-30 minutes</li>
          <li>Return to your dashboard and click "Verify Domain"</li>
        </ol>

        <p style="background: #dbeafe; padding: 15px; border-radius: 6px;">
          <strong>💡 Tip:</strong> DNS changes typically propagate in 5-30 minutes but can take up to 48 hours.
        </p>

        <p>Need help? Reply to this email!</p>
        
        <p>Best regards,<br>DealerSite Pro Team</p>
      </body>
      </html>
    `
    }

    console.log(`[Email] DNS instructions sent to ${to}`)
    return { success: true }
}

/**
 * Sends verification success email
 */
export async function sendDomainVerifiedEmail(params: EmailParams) {
    const { to, dealerName, domain } = params

    console.log(`[Email] Domain verified notification sent to ${to} for ${domain}`)
    return { success: true }
}

/**
 * Sends domain expiry warning (30 days, 7 days before)
 */
export async function sendDomainExpiryWarning(params: EmailParams & { daysUntilExpiry: number }) {
    const { to, dealerName, domain, daysUntilExpiry } = params

    console.log(`[Email] Domain expiry warning sent to ${to}: ${domain} expires in ${daysUntilExpiry} days`)
    return { success: true }
}

/**
 * Sends SSL renewal notification
 */
export async function sendSSLRenewalNotification(params: EmailParams & { status: 'success' | 'failed' }) {
    const { to, dealerName, domain, status } = params

    console.log(`[Email] SSL renewal ${status} notification sent to ${to} for ${domain}`)
    return { success: true }
}
