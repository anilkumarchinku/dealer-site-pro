/**
 * Color contrast utilities for ensuring readable text on brand-colored backgrounds.
 * Uses WCAG 2.0 relative luminance formula.
 */

/**
 * Returns the relative luminance of a hex color (0 = black, 1 = white).
 */
export function getLuminance(hex: string): number {
    const h = hex.replace('#', '');
    const r = parseInt(h.substring(0, 2), 16) / 255;
    const g = parseInt(h.substring(2, 4), 16) / 255;
    const b = parseInt(h.substring(4, 6), 16) / 255;
    const toLinear = (c: number) =>
        c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
    return 0.2126 * toLinear(r) + 0.7152 * toLinear(g) + 0.0722 * toLinear(b);
}

/**
 * Returns a contrasting text color for a given background hex color.
 * Dark backgrounds → '#ffffff', light backgrounds → '#1f2937' (gray-800).
 */
export function getContrastText(hex: string): string {
    return getLuminance(hex) < 0.4 ? '#ffffff' : '#1f2937';
}

/** Returns true if the color is dark (needs white text on top). */
export function isDark(hex: string): boolean {
    return getLuminance(hex) < 0.4;
}
