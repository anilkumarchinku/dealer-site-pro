import { getBrandColors } from '@/lib/colors/automotive-brands';

export const INDRAV_SITE_THEME = {
    // Landing-page accent (warm bronze) used across the public DealerSite Pro
    // marketplace. Per-dealer generated sites keep their own brand colour.
    primary: '#A8793A',
} as const;

export function resolveVehicleDetailAccent(make: string, isDealerWebsite: boolean): string {
    return isDealerWebsite ? getBrandColors(make).primary : INDRAV_SITE_THEME.primary;
}
