# Domain & Hosting Module - Setup Instructions

## Phase 1: FREE Subdomain (Implemented)

### 1. Database Setup

Run the SQL migration to create the necessary tables:

```bash
# Copy the SQL from database/migrations/001_domains_schema.sql
# Run in your Supabase SQL Editor
```

**Key Tables Created:**
- `domains` - Stores all dealer domains
- `domain_verifications` - Tracks DNS verification attempts
- `domain_subscriptions` - Manages PRO/PREMIUM subscriptions

### 2. Environment Variables

Copy `.env.example` to `.env.local` and add your Supabase credentials:

```bash
cp .env.example .env.local
```

Required for Phase 1:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
```

### 3. Testing Subdomain Auto-Generation

The subdomain is automatically created during dealer onboarding. To test manually:

```typescript
import { createSubdomainForDealer } from '@/lib/services/domain-service'

const result = await createSubdomainForDealer({
  dealerId: 'your-dealer-uuid',
  businessName: 'ABC Motors',
  city: 'Hyderabad' // optional
})

console.log(result.domain?.domain) // "abc-motors.dealersitepro.com"
```

### 4. Accessing Dealer Sites

Once a subdomain is created, access it via:
```
http://localhost:3000
```

The middleware will detect the hostname and route to `/sites/[slug]`.

**For Local Development:**
Since localhost doesn't support subdomains, you'll need to test routing by directly visiting:
```
http://localhost:3000/sites/abc-motors
```

**For Production:**
```
https://abc-motors.dealersitepro.com
```

### 5. DNS Configuration (Production Only)

For ` *.dealersitepro.com` subdomains to work:

1. Add wildcard DNS record in your domain registrar:
   ```
   Type: A
   Name: *
   Value: <your-vercel-ip>
   TTL: Auto
   ```

2. Configure SSL wildcard certificate in Cloudflare or Vercel

---

## API Endpoints

### Check Slug Availability
```bash
GET /api/domains/check-slug?name=ABC Motors
```

Response:
```json
{
  "success": true,
  "slug": "abc-motors",
  "available": true,
  "subdomain": "abc-motors.dealersitepro.com"
}
```

### Get Dealer Domains
```bash
GET /api/domains?dealer_id=<uuid>
```

Response:
```json
{
  "success": true,
  "domains": [
    {
      "id": "...",
      "domain": "abc-motors.dealersitepro.com",
      "slug": "abc-motors",
      "type": "subdomain",
      "status": "active",
      "ssl_status": "active",
      "is_primary": true
    }
  ]
}
```

---

## File Structure

```
/app
  /api
    /domains
      route.ts                   # GET all domains
      /check-slug
        route.ts                 # Check slug availability
  /dashboard
    /domains
      page.tsx                   # Domain settings UI
  /sites
    /[slug]
      page.tsx                   # Dealer website
      layout.tsx                 # Site layout

/lib
  /services
    domain-service.ts            # Domain business logic
  /utils
    slug.ts                      # Slug generation
  supabase.ts                    # Supabase client

/database
  /migrations
    001_domains_schema.sql       # Database schema

middleware.ts                    # Multi-tenant routing
```

---

## Next Steps (Phase 2 & 3)

Phase 1 is complete! To continue:

1. **Phase 2: PRO Tier (Custom Domains)**
   - Set up Vercel API credentials
   - Build DNS verification service
   - Create connect domain flow
   - Integrate Razorpay

2. **Phase 3: PREMIUM Tier (Managed Domains)**
   - Set up Cloudflare Registrar
   - Build domain search interface
   - Implement auto-DNS configuration
   - Email forwarding setup

---

## Troubleshooting

### Subdomain Not Working Locally
- Use `/sites/[slug]` route instead
- Or set up local DNS with `/etc/hosts`

### Database Connection Issues
- Check Supabase credentials in `.env.local`
- Verify RLS policies are set correctly
- Ensure `dealers` table exists

### Middleware Not Triggering
- Check `middleware.ts` is in root directory
- Verify matcher patterns
- Check Next.js version (needs 13+)

---

## Support

For issues or questions:
- Check [domain_hosting_plan.md](./domain_hosting_plan.md) for architecture details
- Review SQL schema in `database/migrations/001_domains_schema.sql`
- Test slug generation in `lib/utils/slug.ts`
