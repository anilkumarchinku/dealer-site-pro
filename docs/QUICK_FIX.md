# 🚨 Quick Fix: Domain Connection Error

## The Problem

You're seeing **"Failed to initiate domain connection"** because Supabase (the database) is not configured.

## The Quick Fix (5 minutes)

### Option 1: Set Up Supabase (Recommended)

Follow the detailed guide in [SUPABASE_SETUP.md](./SUPABASE_SETUP.md)

**Quick Steps:**
1. Create free account at [supabase.com](https://supabase.com)
2. Create a new project
3. Copy your Project URL and API key
4. Update `.env.local` with real credentials
5. Run the SQL script to create tables
6. Restart your dev server

### Option 2: Use Mock Data (Temporary - for testing UI only)

If you just want to test the UI without setting up Supabase:

1. Create a file `lib/mock-mode.ts`:
```typescript
export const MOCK_MODE = true
```

2. Update the API routes to return mock data when in mock mode
   - This won't actually save data but will let you test the flow

**Note:** This is only for UI testing. You'll need real Supabase for production.

## What Changed

I've improved the error handling to show clearer messages:

✅ **Better error messages** - Now tells you exactly what's wrong
✅ **Development details** - Shows technical details in dev mode
✅ **Configuration checks** - Validates Supabase setup before operations
✅ **Setup documentation** - Complete guide in SUPABASE_SETUP.md

## Files Modified

- `lib/supabase.ts` - Added configuration validation
- `app/api/domains/connect-custom/route.ts` - Better error handling
- `app/api/domains/verify-dns/route.ts` - Added config checks
- `components/ConnectCustomDomainModal.tsx` - Improved error display

## Need Help?

Check [SUPABASE_SETUP.md](./SUPABASE_SETUP.md) for detailed step-by-step instructions with screenshots.

---

**Estimated setup time:** 5-10 minutes
**Cost:** Free (using Supabase free tier)
