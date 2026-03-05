/**
 * Utility for resolving scraped brand/model fallback images.
 *
 * Scraped images live at:
 *   /public/data/brand-model-images/{vehicleCategory}/{brandId}/{model-slug}.jpg  (try first)
 *   /public/data/brand-model-images/{vehicleCategory}/{brandId}/{model-slug}.png  (fallback)
 *
 * Naming convention: kebab-case, periods removed, spaces → hyphens.
 * e.g. "Splendor Plus Xtec 2.0" → "splendor-plus-xtec-20"
 */

/** Convert a model name to the file-system slug used during scraping */
export function modelToSlug(model: string): string {
    return model
        .toLowerCase()
        .replace(/\./g, "")          // remove periods
        .replace(/[^a-z0-9]+/g, "-") // spaces / special chars → hyphen
        .replace(/^-|-$/g, "");      // trim leading/trailing hyphens
}

/**
 * Returns the public URL(s) to try for a scraped model image.
 * Always returns jpg first, then png — callers should use the first
 * one that loads (or pass both as fallback chain).
 */
export function getScrapedImageUrls(
    vehicleCategory: "2w" | "3w",
    brandId: string,
    model: string
): [string, string] {
    const slug = modelToSlug(model);
    const base = `/data/brand-model-images/${vehicleCategory}/${brandId}/${slug}`;
    return [`${base}.jpg`, `${base}.png`];
}

/**
 * Returns the primary scraped image URL for a brand/model.
 * Uses jpg extension — the most common in the scraped dataset.
 */
export function getScrapedImageFallback(
    vehicleCategory: "2w" | "3w",
    brandId: string,
    model: string
): string {
    return getScrapedImageUrls(vehicleCategory, brandId, model)[0];
}

/**
 * Resolves the brandId from a brand display name by normalising to kebab-case.
 * Used when the DB only stores the display name (e.g. "Hero MotoCorp").
 */
export function brandNameToId(brandName: string): string {
    return brandName
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "");
}
