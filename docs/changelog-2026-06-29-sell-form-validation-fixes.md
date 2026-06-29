# Changelog: Sell Form, Validation & Approval Fixes

**Date:** 2026-06-29

---

## Summary

Fixed 6 issues across the sell request flow, customer-facing forms, and dealer dashboard approval page. Key changes: hidden seller-facing pricing fields, mandatory email/phone/name across all forms, client-side focus-on-error validation, and dashboard approval bugs.

---

## Files Modified (10 files)

### 1. `lib/validations/client.ts`
- `validateLeadForm()` — email changed from "validate only if provided" to **always required**
- `validateServiceBookingForm()` — added `email` parameter, now validates and requires it
- Added new helper: `focusFirstInvalidField()` — scrolls to and focuses the first invalid field in a form

### 2. `lib/validations/lead.ts`
- `requireEmail` default changed from `false` to `true` (affects InquiryDetailsSheet which uses this validator)

### 3. `components/tools/SellCarFlow.tsx`
- **Removed**: "Expected selling price (Rs.)" input field from Step 1
- **Removed**: "Instant Valuation" sidebar card (showed estimated value range) from Step 1
- **Removed**: "Expected Price" and "Valuation Range" rows from Step 2 request summary
- **Removed**: "Estimated Offer" row from Step 3 confirmation page
- Email field changed from optional to **required** (added to `canProceedStep2` check)
- Added `*` markers to required field labels (Brand, Model, Name, Phone, Email, City, Address)
- Added focus-on-error: clicking "Continue" or "Submit" with missing fields scrolls/focuses the first invalid one
- Cleaned up unused imports (`Sparkles`, `Separator`)

### 4. `components/sites/ContactMessageForm.tsx`
- Phone changed from **optional** to **required** (10-digit validation, "(optional)" placeholder removed)
- Email changed from **optional** to **required** (email format validation, "(optional)" placeholder removed)
- Labels updated: `Phone` -> `Phone *`, `Email` -> `Email *`
- Added focus-on-error on submit

### 5. `components/two-wheelers/LeadFormModal.tsx`
- Email changed from **optional** to **required**
- Label: `Email` -> `Email *`, placeholder: `Optional` -> `you@example.com`
- Added focus-on-error on validation failure

### 6. `components/three-wheelers/LeadFormModal.tsx`
- Same changes as the 2W LeadFormModal above

### 7. `components/two-wheelers/ServiceBookingForm.tsx`
- **Added new Email field** (this form previously had no email at all)
- Email is required with validation
- Added focus-on-error on submit
- Email sent in the POST body to the API

### 8. `components/three-wheelers/ServiceBookingForm.tsx`
- Same changes as the 2W ServiceBookingForm above

### 9. `components/InquiryDetailsSheet.tsx`
- **Added Email field to all 4 tabs**: Test Drive, Service, Callback, Accessories
- All email fields are required
- Email passed to the `submitLead()` function and included in the API POST body
- Labels updated to show `*` for Name, Phone, Email

### 10. `app/dashboard/sell-requests/page.tsx`
- Listing price placeholder changed from `Listing Rs. X,XX,XXX` (leaked valuation) to `Enter listing price (Rs.)`
- "Approve & List" button now **disabled** until a valid positive price is entered
- Status filter: selecting "approved" now also shows items with `listed` status (fixes the empty list bug)

---

## Issue-by-Issue Breakdown

### Issue 1: Hide "Expected selling price" from public sell form
The seller no longer sees the expected price input. The valuation midpoint is still used internally as the fallback expected price sent to the backend.

### Issue 2: Hide "Valuation range" from public sell form
The valuation card, range display in summary, and estimated offer in confirmation are all removed from the seller's view. The valuation is still calculated and stored in `estimated_low_paise` / `estimated_high_paise` for dealer use.

### Issue 3: Name, Email, Mobile mandatory across all forms
Every customer-facing form now requires all three fields. Previously, email was optional on most forms and phone was optional on the contact form. Service booking forms had no email field at all.

### Issue 4: Focus on missing field (client-side validation)
When a user submits a form with missing required fields, the page scrolls to and focuses the first invalid field. Uses `data-field` attributes on inputs and a shared `focusFirstInvalidField()` helper.

### Issue 5: Sell request approval — price mandatory, no placeholder
The listing price input no longer shows a pre-filled placeholder amount (which leaked the internal valuation to the dealer). The "Approve & List" button is disabled until the dealer explicitly enters a price.

### Issue 6: Approved vehicles not showing in approved list
The API normalizes `approved` status to `listed` (line 437-439 of `app/api/sell-requests/route.ts`). The dashboard filter for "approved" now also matches `listed` status items, so approved vehicles appear correctly.

---

## Not Changed
- Backend API routes (`app/api/sell-requests/route.ts`) — no changes
- Database schema / migrations — no changes
- Zod validation schemas (`lib/validations/schemas.ts`) — no changes
- The valuation algorithm still runs and data is stored for dealer use

## Known Pre-existing Issue
- `xlsx` module missing in `app/onboarding/step-2-inventory/bulk-upload/page.tsx` — unrelated to these changes, causes build failure
