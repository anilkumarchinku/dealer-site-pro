# Resend Email Setup

DealerSite Pro uses one platform Resend account and one server-side API key for all generated dealer websites.

## Environment Variables

Add these in production after the Resend account and sending domain are ready:

```env
RESEND_API_KEY=re_xxxxxxxxxxxxxxxxx
EMAIL_FROM=DealerSite Pro <noreply@notify.yourdomain.com>
```

`EMAIL_FROM` must use a domain or subdomain verified in Resend. For example, verify `notify.cyepro.com` and send from `noreply@notify.cyepro.com`.

## Lead Routing Rule

Dealer website forms must not trust a recipient email from the browser. The API routes save the submission under the supplied `dealer_id`, load that dealer from Supabase, and send notifications only to that dealer email.

Dealer-scoped sell requests do not fall back to admin email. Admin fallback is used only for general sell requests that are not attached to a dealer.

## Current Email Flows

- Buyer inquiry: dealer notification plus optional customer confirmation.
- Test drive or test ride: dealer notification plus optional customer confirmation.
- Car service booking: dealer notification plus optional customer confirmation.
- Sell request: dealer notification for dealer-scoped requests, admin notification for general requests, plus optional seller confirmation.

## Resend Domain Checklist

1. Create or open the Resend account.
2. Add and verify the sending domain or subdomain.
3. Add the DNS records Resend provides for SPF, DKIM, and DMARC.
4. Create a production API key.
5. Add `RESEND_API_KEY` and `EMAIL_FROM` to the deployment environment.
6. Submit one test lead from a dealer website and confirm the notification reaches only that dealer.
