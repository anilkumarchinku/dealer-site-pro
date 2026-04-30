import { getBrandColors } from '@/lib/colors/automotive-brands';

export const INDRAV_SITE_THEME = {
    primary: '#2563EB',
} as const;

export function resolveVehicleDetailAccent(make: string, isDealerWebsite: boolean): string {
    return isDealerWebsite ? getBrandColors(make).primary : INDRAV_SITE_THEME.primary;
}
