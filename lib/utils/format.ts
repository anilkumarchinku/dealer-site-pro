/**
 * Shared display formatters used across the dashboard and UI.
 * Consolidated here so relative-time / number / label formatting is consistent
 * (previously duplicated, with slight divergences, across several pages).
 *
 * NOTE: monetary formatting lives in `lib/utils/car-utils.ts`
 * (`formatPrice` expects rupees; `formatPriceInLakhs` expects rupees).
 */

/** Relative "time ago" — e.g. "just now", "5m ago", "3h ago", "2d ago", then a short date. */
export function timeAgo(iso: string): string {
    if (!iso) return "";
    const diff = Date.now() - new Date(iso).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return "just now";
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    const days = Math.floor(hrs / 24);
    if (days < 7) return `${days}d ago`;
    return new Date(iso).toLocaleDateString("en-IN", { day: "numeric", month: "short" });
}

/** Compact number with a k suffix — 1500 → "1.5k", 999 → "999". */
export function formatCompactNumber(n: number): string {
    return n >= 1000 ? `${(n / 1000).toFixed(1)}k` : String(n);
}

/** snake_case → Title Case — "new_car_sales" → "New Car Sales". */
export function titleCaseFromSnake(value: string): string {
    return value.split("_").map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");
}
