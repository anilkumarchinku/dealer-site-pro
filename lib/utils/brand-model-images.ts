/**
 * Utility for resolving scraped brand/model fallback images.
 *
 * Images are hosted in Supabase Storage bucket 'vehicle-images':
 *   {SUPABASE_URL}/storage/v1/object/public/vehicle-images/{vehicleCategory}/{brandId}/{model-slug}.jpg
 *   {SUPABASE_URL}/storage/v1/object/public/vehicle-images/{vehicleCategory}/{brandId}/{model-slug}.png
 *
 * Naming convention: kebab-case, periods removed, spaces → hyphens.
 * e.g. "Splendor Plus Xtec 2.0" → "splendor-plus-xtec-20"
 */

import fourWColorHeroFallbacks from '@/lib/data/generated/4w-color-hero-fallbacks.json';
import twoWColorHeroFallbacks from '@/lib/data/generated/2w-color-hero-fallbacks.json';

const SUPABASE_STORAGE_URL =
    "https://llsvbyeumrfngjvbedbz.supabase.co/storage/v1/object/public/vehicle-images";

const IMAGE_EXTENSIONS = ["jpg", "png", "webp"] as const;

const FOUR_W_GALLERY_ALIASES: Record<string, string> = {
    "bentley/continental-gt": "bentley/continental",
    "bentley/continental-gtc": "bentley/continental",
    "bmw/m8": "bmw/m8-coupe-competition",
    "mahindra/xuv400": "mahindra/xuv400-ev",
    "mahindra/scorpio-classic": "mahindra/scorpio",
    "maruti-suzuki/wagonr": "maruti-suzuki/wagon-r",
    "hyundai/creta-ev": "hyundai/creta-electric",
    "mercedes-benz/eqg": "mercedes-benz/g-class-electric",
    "mercedes-benz/amg-gt-coupe": "mercedes-benz/amg-gt-4-door-coupe",
    "toyota/fortuner": "toyota/Toyota_Fortuner",
    "toyota/urban-cruiser-hyryder": "toyota/hyryder",
    "toyota/rumion": "toyota/Toyota_Rumion",
    "vinfast/vf-6": "vinfast/vf6",
    "vinfast/vf-7": "vinfast/vf7",
};

function get4WColorHeroFallback(brandId: string, model: string): string | null {
    const key = `${brandId}/${modelToSlug(model)}`;
    const manifest = fourWColorHeroFallbacks as Record<string, string>;
    return manifest[key] ?? manifest[FOUR_W_GALLERY_ALIASES[key] ?? ""] ?? null;
}

function get2WColorHeroFallback(brandId: string, model: string): string | null {
    const key = `${brandId}/${modelToSlug(model)}`;
    const manifest = twoWColorHeroFallbacks as Record<string, string>;
    return manifest[key] ?? null;
}

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
 *
 * 2W/3W → Supabase storage (scraped images uploaded there)
 * 4W    → local public/data/brand-model-images/4w/ (committed static files, no Supabase upload)
 */
export function getScrapedImageUrls(
    vehicleCategory: "2w" | "3w" | "4w",
    brandId: string,
    model: string
): string[] {
    const slug = modelToSlug(model);
    if (vehicleCategory === "4w") {
        const base = `/data/brand-model-images/4w/${brandId}/${slug}`;
        const urls = [
            get4WColorHeroFallback(brandId, model),
            ...IMAGE_EXTENSIONS.map((ext) => `${base}.${ext}`),
        ].filter((url): url is string => Boolean(url));
        // Fallback: strip common suffixes (tour, cargo, gen, edition) to
        // try the base model image (e.g. "wagon-r-tour" → "wagon-r")
        const baseSlug = slug
            .replace(/-(tour|cargo|edition|facelift|gen|2nd-gen|3rd-gen)$/i, "")
            .replace(/-\d+(st|nd|rd|th)-gen$/i, "");
        if (baseSlug !== slug) {
            const fallback = `/data/brand-model-images/4w/${brandId}/${baseSlug}`;
            IMAGE_EXTENSIONS.forEach((ext) => urls.push(`${fallback}.${ext}`));
        }
        return urls;
    }
    // 2W and 3W: try local files first, then Supabase storage
    const localBase = `/data/brand-model-images/${vehicleCategory}/${brandId}/${slug}`;
    const urls = [
        ...(vehicleCategory === "2w"
            ? [get2WColorHeroFallback(brandId, model)]
            : []),
        ...IMAGE_EXTENSIONS.map((ext) => `${localBase}.${ext}`),
    ].filter((url): url is string => Boolean(url));

    if (vehicleCategory === "3w") {
        // 3W JSON models have variant suffixes and brand prefixes that don't match image filenames.
        // e.g. "Eltra City 3 Seater" → slug "eltra-city-3-seater" but file is "eltra-city.jpg"
        // e.g. "Ape City Plus" → slug "ape-city-plus" but file is "city-plus.jpg"
        // Generate multiple fallback slugs to try:
        const fallbackSlugs = new Set<string>();

        // Strip variant suffixes: "3 seater", "4 seater", "epl-2-0-r", etc.
        const stripped = slug
            .replace(/-\d+-seater$/i, "")
            .replace(/-(?:epl|std|lx|dx|vx|zx|premium|plus|duo|super|deluxe|special|edition|bs6|bs-vi)(?:-.+)?$/i, "");
        if (stripped !== slug) fallbackSlugs.add(stripped);

        // Strip progressively from the end (try shorter slugs)
        const parts = slug.split("-");
        for (let i = parts.length - 1; i >= 2; i--) {
            fallbackSlugs.add(parts.slice(0, i).join("-"));
        }

        // Strip common brand prefixes
        const prefixes = ["ape-", "re-", "king-", "alfa-", "maxima-", "treo-", "super-auto-"];
        for (const prefix of prefixes) {
            if (slug.startsWith(prefix)) {
                const withoutPrefix = slug.slice(prefix.length);
                if (withoutPrefix) fallbackSlugs.add(withoutPrefix);
                // Also strip suffixes from prefix-stripped version
                const strippedWithout = withoutPrefix.replace(/-\d+-seater$/i, "").replace(/-(?:epl|std|lx|dx|vx)(?:-.+)?$/i, "");
                if (strippedWithout !== withoutPrefix) fallbackSlugs.add(strippedWithout);
            }
        }

        const dir3w = `/data/brand-model-images/3w/${brandId}`;
        for (const fb of fallbackSlugs) {
            IMAGE_EXTENSIONS.forEach((ext) => urls.push(`${dir3w}/${fb}.${ext}`));
        }
    }

    // Supabase storage as final fallback
    const supaBase = `${SUPABASE_STORAGE_URL}/${vehicleCategory}/${brandId}/${slug}`;
    IMAGE_EXTENSIONS.forEach((ext) => urls.push(`${supaBase}.${ext}`));

    return urls;
}

export function getAppAssetImageUrls(
    vehicleCategory: "2w" | "3w" | "4w",
    brandId: string,
    model: string
): string[] {
    const slug = modelToSlug(model);
    if (vehicleCategory !== "4w") return [];

    const base = `/assets/cars/${brandId}/${slug}`;
    return IMAGE_EXTENSIONS.map((ext) => `${base}.${ext}`);
}

export function getVehicleImageUrls(
    vehicleCategory: "2w" | "3w" | "4w",
    brandId: string,
    model: string,
    primaryImage?: string | null,
): string[] {
    const curatedAssets = getAppAssetImageUrls(vehicleCategory, brandId, model);
    const scrapedAssets = getScrapedImageUrls(vehicleCategory, brandId, model);
    const normalizedPrimary = primaryImage && primaryImage !== "/placeholder-car.jpg" ? primaryImage : null;
    const preferredColorHero = vehicleCategory === "2w"
        ? get2WColorHeroFallback(brandId, model)
        : vehicleCategory === "4w"
            ? get4WColorHeroFallback(brandId, model)
            : null;

    return [...new Set([
        ...(vehicleCategory === "4w"
            ? [
                preferredColorHero,
                normalizedPrimary,
                ...curatedAssets,
                ...(normalizedPrimary?.startsWith("/assets/") ? [normalizedPrimary] : []),
                ...scrapedAssets,
            ]
            : [
                preferredColorHero,
                normalizedPrimary,
                ...scrapedAssets,
                ...curatedAssets,
            ]),
    ].filter((url): url is string => Boolean(url)))];
}

/**
 * Returns the primary scraped image URL for a brand/model.
 * Uses jpg extension — the most common in the scraped dataset.
 */
export function getScrapedImageFallback(
    vehicleCategory: "2w" | "3w" | "4w",
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
    "aprilia": "aprilia-india",
    "aprilia india": "aprilia-india",
    "brixton": "brixton-motorcycles",
    "brixton motorcycles": "brixton-motorcycles",
    "norton": "norton-motorcycles",
    "norton motorcycles": "norton-motorcycles",
    "lectrix": "lectrix-ev",
    "lectrix ev": "lectrix-ev",
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
    "tvs iqube": "tvs-iqube",
    "tvs iqube electric": "tvs-iqube",
    "vida (hero motocorp)": "vida-hero",
    "vida": "vida-hero",
    "simple energy": "simple-energy",
    "matter": "matter-ev",
    "okaya ev (opg mobility)": "okaya-ev",
    "okaya": "okaya-ev",
    "odysse electric": "odysse-electric",
    "odysse": "odysse-electric",
    "joy e-bike": "joy-e-bike",
    "komaki": "komaki",
    "bounce infinity": "bounce-infinity",
    "bounce": "bounce-infinity",
    "ampere (greaves electric)": "ampere-greaves",
    "ampere": "ampere-greaves",
    "bajaj chetak": "bajaj-chetak-ev",
    "bajaj chetak electric": "bajaj-chetak-ev",
    "benelli india": "benelli-india",
    "benelli": "benelli-india",
    "bmw motorrad india": "bmw-motorrad-india",
    "bmw motorrad": "bmw-motorrad-india",
    "cfmoto india": "cfmoto-india",
    "cfmoto": "cfmoto-india",
    "ducati india": "ducati-india",
    "ducati": "ducati-india",
    "harley-davidson india": "harley-davidson-india",
    "harley-davidson": "harley-davidson-india",
    "hero electric": "hero-electric",
    "hop electric": "hop-electric",
    "husqvarna motorcycles": "husqvarna-india",
    "husqvarna": "husqvarna-india",
    "indian motorcycle": "indian-motorcycle",
    "indian": "indian-motorcycle",
    "jawa motorcycles": "jawa-motorcycles",
    "jawa": "jawa-motorcycles",
    "kabira mobility": "kabira-mobility",
    "keeway india": "keeway-india",
    "keeway": "keeway-india",
    "mahindra two wheelers": "mahindra-two-wheelers",
    "moto guzzi": "moto-guzzi",
    "oben electric": "oben-electric",
    "oben": "oben-electric",
    "okinawa autotech": "okinawa-autotech",
    "okinawa": "okinawa-autotech",
    "pure ev": "pure-ev",
    "quantum energy": "quantum-energy",
    "revolt motors": "revolt-motors",
    "revolt": "revolt-motors",
    "river": "river-ev",
    "river ev": "river-ev",
    "tork motors": "tork-motors",
    "triumph motorcycles": "triumph-india",
    "triumph": "triumph-india",
    "ultraviolette automotive": "ultraviolette",
    "vespa india": "vespa-india",
    "vespa": "vespa-india",
    "yezdi motorcycles": "yezdi-motorcycles",
    "yezdi": "yezdi-motorcycles",
    "yulu": "yulu",
    "zontes india": "zontes-india",
    "zontes": "zontes-india",
    "bsa motorcycles": "bsa",
    "qj motor india": "qj-motor-india",
    "bgauss": "bgauss",
    "battre electric": "battre-ev",
    "ivoomi": "ivoomi-energy",
    "moto morini": "motomorini",
    "mahindra": "mahindra-two-wheelers",
    "kinetic green": "kinetic",
    "raptee hv": "raptee",
    "yo electric": "yo"
}

const BRAND_FOLDER_MAP_3W: Record<string, string> = {
    "mahindra": "mahindra-3w",
    "mahindra (3w)": "mahindra-3w",
    "bajaj": "bajaj-auto-3w",
    "bajaj auto": "bajaj-auto-3w",
    "bajaj auto (3w)": "bajaj-auto-3w",
    "tvs": "tvs-king",
    "tvs motor company": "tvs-king",
    "tvs king": "tvs-king",
    "piaggio": "piaggio-ape",
    "piaggio ape": "piaggio-ape",
    "greaves": "greaves-electric-3w",
    "greaves electric": "greaves-electric-3w",
    "greaves electric mobility": "greaves-electric-3w",
    "kinetic": "kinetic-green",
    "kinetic green": "kinetic-green",
    "euler": "euler-motors",
    "euler motors": "euler-motors",
    "atul": "atul-auto",
    "atul auto": "atul-auto",
    "lohia": "lohia-auto",
    "lohia auto": "lohia-auto",
    "yc electric": "yc-ev",
    "saera electric (mayuri)": "saera-ev",
    "saera electric": "saera-ev",
    "omega seiki mobility": "omega-seiki-mobility",
    "altigreen": "altigreen",
    "montra electric": "montra-ev",
    "terra motors": "terra-motors",
    "etrio": "etrio",
}

const BRAND_FOLDER_MAP_4W: Record<string, string> = {
    "lamborghini": "lamborghini",
    "aston martin": "aston-martin",
    "audi": "audi",
    "bentley": "bentley",
    "bmw": "bmw",
    "byd": "byd",
    "citroen": "citroen",
    "force": "force",
    "force motors": "force-motors",
    "honda": "honda",
    "hyundai": "hyundai",
    "isuzu": "isuzu",
    "jaguar": "jaguar",
    "jeep": "jeep",
    "kia": "kia",
    "land rover": "land-rover",
    "lexus": "lexus",
    "mahindra": "mahindra",
    "maruti suzuki": "maruti-suzuki",
    "maruti": "maruti-suzuki",
    "suzuki": "maruti-suzuki",
    "mercedes-benz": "mercedes-benz",
    "mercedes": "mercedes-benz",
    "mg": "mg",
    "mg motor": "mg",
    "mini": "mini",
    "nissan": "nissan",
    "porsche": "porsche",
    "renault": "renault",
    "skoda": "skoda",
    "tata": "tata",
    "tata motors": "tata",
    "rolls-royce": "rolls-royce",
    "rolls royce": "rolls-royce",
    "ferrari": "ferrari",
    "maserati": "maserati",
    "toyota": "toyota",
    "vinfast": "vinfast",
    "volkswagen": "volkswagen",
    "vw": "volkswagen",
    "volvo": "volvo",
}

/**
 * Resolves the brandId from a brand display name.
 * Checks explicit folder map first, then falls back to kebab-case conversion.
 * Used when the DB only stores the display name (e.g. "Hero MotoCorp").
 */
export function brandNameToId(brandName: string, category: "2w" | "3w" | "4w" = "2w"): string {
    const lower = brandName.toLowerCase().trim();
    const map = category === "3w" ? BRAND_FOLDER_MAP_3W : category === "4w" ? BRAND_FOLDER_MAP_4W : BRAND_FOLDER_MAP_2W;

    if (map[lower]) return map[lower];

    return lower
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "");
}
