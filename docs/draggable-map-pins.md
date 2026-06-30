# Draggable Map Pins — Implementation Plan

## Prerequisites
- Google Cloud project with **Maps JavaScript API** enabled
- API key with domain restrictions (restrict to your production + localhost domains)
- Env variable: `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY`
- Billing enabled on the Google Cloud project ($200/month free tier covers ~28k map loads)

---

## Database Changes

Add `latitude` and `longitude` columns to `dealer_brands`:

```sql
ALTER TABLE public.dealer_brands
  ADD COLUMN IF NOT EXISTS latitude  DOUBLE PRECISION,
  ADD COLUMN IF NOT EXISTS longitude DOUBLE PRECISION;
```

Update the `public_dealer_site_brands` view to include `b.latitude, b.longitude`.

Update TypeScript types: `OutletRow`, `OutletPublicData`, `OutletProfileUpdate`, `OutletData`, `database.types.ts`.

---

## Lat/Lng Extraction from Google Maps URL

Google Maps URLs contain coordinates in predictable patterns:

| URL Pattern | Example |
|-------------|---------|
| `@lat,lng,zoom` | `https://maps.google.com/maps/place/.../@17.4401,78.3489,17z` |
| `ll=lat,lng` | `https://maps.google.com/?ll=17.4401,78.3489` |
| `q=lat,lng` | `https://maps.google.com/?q=17.4401,78.3489` |
| Short link (goo.gl/maps) | Needs server-side redirect follow to resolve |

```ts
// lib/utils/extract-coords.ts
export function extractCoordsFromMapsUrl(
  url: string
): { lat: number; lng: number } | null {
  // Pattern 1: @lat,lng
  const atMatch = url.match(/@(-?\d+\.\d+),(-?\d+\.\d+)/);
  if (atMatch) return { lat: parseFloat(atMatch[1]), lng: parseFloat(atMatch[2]) };

  // Pattern 2: ll= or q= with coordinates
  const paramMatch = url.match(/[?&](?:ll|q)=(-?\d+\.\d+),(-?\d+\.\d+)/);
  if (paramMatch) return { lat: parseFloat(paramMatch[1]), lng: parseFloat(paramMatch[2]) };

  return null;
}
```

---

## Component: `DraggableMapPicker`

**File:** `components/ui/DraggableMapPicker.tsx`

### Props
```ts
interface DraggableMapPickerProps {
  initialLat?: number | null;
  initialLng?: number | null;
  googleMapsUrl?: string | null;  // extract coords as fallback
  onCoordsChange: (lat: number, lng: number) => void;
}
```

### Behavior
1. On mount, determine initial pin position:
   - Use `initialLat`/`initialLng` if available
   - Else extract from `googleMapsUrl` via `extractCoordsFromMapsUrl()`
   - Else default to dealer's city center or India center (20.5937, 78.9629)
2. Render a Google Map with a **draggable marker**
3. On marker `dragend`, call `onCoordsChange(lat, lng)`
4. Show coordinates below the map: `"Pin: 17.4401°N, 78.3489°E"`

### Google Maps JS API Loading
Use `@react-google-maps/api` (or `@vis.gl/react-google-maps`):

```bash
npm install @react-google-maps/api
```

```tsx
import { GoogleMap, Marker, useJsApiLoader } from "@react-google-maps/api";

const { isLoaded } = useJsApiLoader({
  googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!,
});
```

---

## Integration Points

### 1. Onboarding — Step 1b Outlets (`app/onboarding/step-1b-outlets/page.tsx`)

Below the "Google Maps URL" input, add:

```
[Google Maps URL input]  ← existing
[DraggableMapPicker]     ← new: shows preview, lets dealer drag pin
```

Flow:
- Dealer pastes URL → extract coords → show pin on map
- Dealer drags pin to correct spot → update lat/lng in form state
- On submit, save `google_maps_url`, `latitude`, `longitude` to store

### 2. Settings — OutletLocationsCard (`components/dashboard/OutletLocationsCard.tsx`)

In the edit form, add `DraggableMapPicker` below the Google Maps URL field. Same flow — paste URL to seed pin, drag to adjust, save coords.

### 3. Public Site — LocationsMapSection

Update `MapCard` to prefer `latitude`/`longitude` for the embed when available:

```ts
const embedSrc = (lat && lng)
  ? `https://maps.google.com/maps?q=${lat},${lng}&output=embed`
  : pinUrl
    ? `https://maps.google.com/maps?q=${encodeURIComponent(pinUrl)}&output=embed`
    : `https://maps.google.com/maps?q=${mapQuery}&output=embed`;
```

This gives the most precise pin on the public site.

---

## Files to Create/Modify

| # | File | Change |
|---|------|--------|
| 1 | `supabase/migrations/YYYYMMDD_add_lat_lng.sql` | Add latitude, longitude columns; update view |
| 2 | `lib/database.types.ts` | Add latitude, longitude to dealer_brands type |
| 3 | `lib/types/index.ts` | Add to OutletData |
| 4 | `lib/db/dealers.ts` | Add to OutletPublicData, query, mapping |
| 5 | `lib/db/settings.ts` | Add to OutletRow, OutletProfileUpdate, query |
| 6 | `lib/actions/save-dealer.ts` | Include lat/lng in UPSERT |
| 7 | `lib/utils/extract-coords.ts` | **Create** — URL → lat/lng parser |
| 8 | `components/ui/DraggableMapPicker.tsx` | **Create** — draggable map component |
| 9 | `app/onboarding/step-1b-outlets/page.tsx` | Add DraggableMapPicker below URL input |
| 10 | `components/dashboard/OutletLocationsCard.tsx` | Add DraggableMapPicker to edit form |
| 11 | `components/templates/sections/LocationsMapSection.tsx` | Prefer lat/lng for embed |
| 12 | Template prop types (Family, Luxury, Modern, Sporty) | Add lat/lng to outlet type |

---

## API Key Security

- **Client-side key** (`NEXT_PUBLIC_GOOGLE_MAPS_API_KEY`): Restrict to your domains in Google Cloud Console → Credentials → API key → Application restrictions → HTTP referrers
- Add allowed domains: `yourdomain.com/*`, `localhost:3000/*`
- Enable only **Maps JavaScript API** for this key (disable all others)

---

## Cost Estimate

| API | Free Tier | Cost After |
|-----|-----------|------------|
| Maps JavaScript API | 28,000 loads/month | $7 per 1,000 loads |
| Geocoding API (optional) | 40,000 calls/month | $5 per 1,000 calls |

For onboarding + settings usage only (not public site), costs will be minimal.
The public site continues to use iframe embeds which don't consume API quota.
