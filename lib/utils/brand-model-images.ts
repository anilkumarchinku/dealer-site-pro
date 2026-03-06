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
 * Explicit map from lowercase brand name variants → actual image folder ID.
 * Image folders don't always match simple kebab-case of the DB brand name
 * (e.g. "Honda Motorcycle & Scooter India" → folder "honda-hmsi").
 */
const BRAND_FOLDER_MAP_2W: Record<string, string> = {
    "royal enfield": "royal-enfield",
    "hero motocorp": "hero-motocorp",
    "honda motorcycle & scooter india": "honda-hmsi",
    "honda": "honda-hmsi",
    "tvs motor company": "tvs-motor",
    "tvs": "tvs-motor",
    "bajaj auto": "bajaj-auto",
    "bajaj": "bajaj-auto",
    "yamaha india": "yamaha-india",
    "yamaha": "yamaha-india",
    "suzuki motorcycle india": "suzuki-motorcycle",
    "suzuki": "suzuki-motorcycle",
    "ktm india": "ktm-india",
    "ktm": "ktm-india",
    "kawasaki india": "kawasaki-india",
    "kawasaki": "kawasaki-india",
    "ather energy": "ather-energy",
    "ather": "ather-energy",
    "ola electric": "ola-electric",
}

const BRAND_FOLDER_MAP_3W: Record<string, string> = {
    "mahindra": "mahindra-3w",
    "bajaj": "bajaj-auto-3w",
    "bajaj auto": "bajaj-auto-3w",
    "tvs": "tvs-king",
    "tvs motor company": "tvs-king",
    "piaggio": "piaggio-ape",
    "greaves": "greaves-electric-3w",
    "greaves electric": "greaves-electric-3w",
    "kinetic": "kinetic-green",
    "kinetic green": "kinetic-green",
    "euler": "euler-motors",
    "euler motors": "euler-motors",
    "atul": "atul-auto",
    "atul auto": "atul-auto",
    "lohia": "lohia-auto",
    "lohia auto": "lohia-auto",
}

/**
 * Resolves the brandId from a brand display name.
 * Checks explicit folder map first, then falls back to kebab-case conversion.
 * Used when the DB only stores the display name (e.g. "Hero MotoCorp").
 */
export function brandNameToId(brandName: string, category: "2w" | "3w" = "2w"): string {
    const lower = brandName.toLowerCase().trim();
    const map = category === "3w" ? BRAND_FOLDER_MAP_3W : BRAND_FOLDER_MAP_2W;

    if (map[lower]) return map[lower];

    return lower
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "");
}
