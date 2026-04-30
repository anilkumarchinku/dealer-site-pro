import { describe, expect, it } from 'vitest';
import { getBrandColors } from '@/lib/colors/automotive-brands';
import { INDRAV_SITE_THEME, resolveVehicleDetailAccent } from '@/lib/utils/site-theme';

describe('site theme resolution', () => {
    it('uses Indrav colors for public catalog model pages', () => {
        expect(resolveVehicleDetailAccent('BMW', false)).toBe(INDRAV_SITE_THEME.primary);
    });

    it('uses vehicle brand colors for dealer website model pages', () => {
        expect(resolveVehicleDetailAccent('BMW', true)).toBe(getBrandColors('BMW').primary);
    });
});
