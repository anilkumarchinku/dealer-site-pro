/**
 * Color contrast utilities for ensuring readable text on brand-colored backgrounds.
 * Uses WCAG 2.0 relative luminance formula.
 */

/**
 * Returns the relative luminance of a hex color (0 = black, 1 = white).
 */
export function getLuminance(hex: string): number {
    const h = normalizeHex(hex);
    const r = parseInt(h.substring(0, 2), 16) / 255;
    const g = parseInt(h.substring(2, 4), 16) / 255;
    const b = parseInt(h.substring(4, 6), 16) / 255;
    const toLinear = (c: number) =>
        c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
    return 0.2126 * toLinear(r) + 0.7152 * toLinear(g) + 0.0722 * toLinear(b);
}

function normalizeHex(hex: string): string {
    const value = hex.trim().replace('#', '');
    if (/^[0-9a-f]{3}$/i.test(value)) {
        return value.split('').map((char) => `${char}${char}`).join('');
    }
    if (/^[0-9a-f]{6}$/i.test(value)) {
        return value;
    }
    return '000000';
}

export function getContrastRatio(foreground: string, background: string): number {
    const fg = getLuminance(foreground);
    const bg = getLuminance(background);
    const lighter = Math.max(fg, bg);
    const darker = Math.min(fg, bg);
    return (lighter + 0.05) / (darker + 0.05);
}

/**
 * Returns a contrasting text color for a given background hex color.
 * Chooses the higher-contrast readable color for the supplied background.
 */
export function getContrastText(hex: string): string {
    return getContrastRatio('#ffffff', hex) >= getContrastRatio('#000000', hex)
        ? '#ffffff'
        : '#000000';
}

/**
 * Returns a brand accent color that stays readable when used as text/icon color
 * on light backgrounds. Light brand colors fall back to a neutral slate tone.
 */
export function getReadableAccent(hex: string, fallback = '#1f2937', background = '#ffffff'): string {
    return getContrastRatio(hex, background) >= 4.5 ? hex : fallback;
}

/** Returns true if the color is dark (needs white text on top). */
export function isDark(hex: string): boolean {
    return getLuminance(hex) < 0.4;
}
