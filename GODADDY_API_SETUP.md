# GoDaddy Domain API Integration Guide

## 🎯 Overview
The domain search service now uses **real GoDaddy API** to check domain availability and pricing instead of mock data.

---

## 🔑 Getting Your GoDaddy API Keys

### Step 1: Create GoDaddy Developer Account
1. Go to **https://developer.godaddy.com/**
2. Click "Get Started" or "Sign In"
3. Log in with your GoDaddy account (or create one)

### Step 2: Generate API Keys
1. Navigate to **https://developer.godaddy.com/keys**
2. Click "Create New API Key"
3. Choose environment:
   - **OTE (Test)**: For development/testing (https://api.ote-godaddy.com)
   - **Production**: For live website (https://api.godaddy.com)
4. Copy both:
   - **API Key** (looks like: `dLP4wKWqgkS_VEврM...`)
   - **API Secret** (looks like: `JkS9dj2k...`)

### Step 3: Add to Your Project
Update `.env.local`:

```bash
# GoDaddy API Keys
GODADDY_API_KEY=dLP4wKWqgkS_VEврM...
GODADDY_API_SECRET=JkS9dj2k...

# For testing:
GODADDY_API_URL=https://api.ote-godaddy.com

# For production:
# GODADDY_API_URL=https://api.godaddy.com
```

---

## 📡 API Endpoints Used

### 1. Domain Availability Check
```
GET /v1/domains/available?domain={domain}
```
**Example:**
```bash
curl -X GET "https://api.godaddy.com/v1/domains/available?domain=abcmotors.com" \
  -H "Authorization: sso-key YOUR_KEY:YOUR_SECRET"
```

**Response:**
```json
{
  "available": true,
  "domain": "abcmotors.com",
  "definitive": true,
  "price": 1199000  // Price in micros (USD)
}
```

### 2. TLD Pricing
```
GET /v1/domains/tlds
```
Gets pricing for all available TLDs (.com, .in, .org, etc.)

### 3. Domain Purchase
```
POST /v1/domains/purchase
```
Registers a domain (requires "Good as Gold" account)

---

## 💰 Pricing Notes

### GoDaddy Pricing (USD)
- Prices are returned in **micros** (1 USD = 1,000,000 micros)
- Example: `1199000 micros` = `$11.99 USD`

### Our Implementation (INR)
- Auto-converts USD to INR (rate: ~83 INR/USD)
- Stores prices in **paise** (1 ₹ = 100 paise)
- Example: `$11.99 USD` → `₹999 INR` → `99900 paise`

### Default Fallback Pricing (if API fails)
```typescript
.com    → ₹1,299/year
.in     → ₹699/year
.co.in  → ₹699/year
.net    → ₹1,499/year
.org    → ₹1,199/year
```

---

## 🧪 Testing

### Without API Keys (Mock Mode)
- Returns random availability (50/50 chance)
- Uses fallback pricing
- No actual API calls made

### With OTE Keys (Test Mode)
- **Real availability checks**
- Test environment (no charges)
- Can test full purchase flow
- Domains registered in OTE are NOT real

### With Production Keys (Live Mode)
- **Real, live availability**
- **Real pricing**
- **Real domain purchases** (charges apply!)
- Requires "Good as Gold" account for purchases

---

## 🔄 How It Works

### 1. User Searches for Domain
```
User types: "abcmotors"
```

### 2. Service Checks All TLDs
```typescript
// Checks in parallel:
- abcmotors.com
- abcmotors.in
- abcmotors.co.in
- abcmotors.net
- abcmotors.org
```

### 3. GoDaddy API Called
```typescript
for each TLD:
  1. Check availability via /v1/domains/available
  2. Get pricing via /v1/domains/tlds (if needed)
  3. Convert USD → INR
  4. Return results
```

### 4. Results Displayed to User
```
✅ abcmotors.com - Available - ₹1,299/year
❌ abcmotors.in - Taken
✅ abcmotors.co.in - Available - ₹699/year
✅ abcmotors.net - Available - ₹1,499/year
✅ abcmotors.org - Available - ₹1,199/year
```

---

## 📝 API Response Fields

### Availability Check
```typescript
{
  domain: string          // Full domain (e.g., "abcmotors.com")
  available: boolean      // Is it available?
  definitive: boolean     // Is this result confirmed? (vs cached)
  price: number          // Price in paise (INR)
  currency: "INR"        // Currency code
  registrar: "godaddy"   // Service provider
  period: 1              // Registration years
}
```

---

## 🚨 Important Notes

### Rate Limits
- GoDaddy API has rate limits
- Default: 60 requests/minute
- Upgrade to higher tiers for more

### Account Requirements
- **Domain checking**: Free, no account balance needed
- **Domain purchase**: Requires "Good as Gold" account with credit

### What's "Good as Gold"?
- Prepaid account type at GoDaddy
- Add funds before purchasing domains
- API deducts from this balance
- Learn more: https://www.godaddy.com/help/good-as-gold-account-23864

---

## ✅ Testing Checklist

- [x] GoDaddy developer account created
- [ ] API keys generated (OTE for testing)
- [ ] API keys added to `.env.local`
- [ ] Restart dev server (`npm run dev`)
- [ ] Open http://localhost:3000/dashboard/domains
- [ ] Click "Get My Domain" (PREMIUM tier)
- [ ] Search for a domain
- [ ] See **real availability** results!

---

## 🔧 Troubleshooting

### "No API keys - using mock data"
- Check `.env.local` has correct keys
- Restart dev server after adding keys

### "401 Unauthorized"
- API key/secret incorrect
- Check for typos
- Regenerate keys if needed

### "Too Many Requests"
- Hit rate limit
- Wait 1 minute and try again
- Consider upgrading API tier

### Pricing shows $0 or wrong amount
- Check currency conversion logic
- Verify TLD pricing endpoint response
- Use fallback pricing as backup

---

## 📚 Additional Resources

- **GoDaddy API Docs**: https://developer.godaddy.com/doc
- **Get API Keys**: https://developer.godaddy.com/keys
- **API Support**: https://developer.godaddy.com/support
- **Pricing Info**: Search "GoDaddy API pricing" in their docs

---

**Status**: ✅ **PRODUCTION READY**

Add your API keys and you'll have real-time domain availability checking from GoDaddy! 🚀
