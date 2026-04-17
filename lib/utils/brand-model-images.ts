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

const SUPABASE_STORAGE_URL =
    "https://llsvbyeumrfngjvbedbz.supabase.co/storage/v1/object/public/vehicle-images";

const IMAGE_EXTENSIONS = ["jpg", "png", "webp"] as const;

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
        return IMAGE_EXTENSIONS.map((ext) => `${base}.${ext}`);
    }
    const base = `${SUPABASE_STORAGE_URL}/${vehicleCategory}/${brandId}/${slug}`;
    return IMAGE_EXTENSIONS.map((ext) => `${base}.${ext}`);
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

    return [...new Set([
        ...(vehicleCategory === "4w"
            ? [
                ...curatedAssets,
                ...(normalizedPrimary?.startsWith("/assets/") ? [normalizedPrimary] : []),
                normalizedPrimary,
                ...scrapedAssets,
            ]
            : [
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
    "ampere (greaves electric)": "ampere-greaves",
    "ampere": "ampere-greaves",
    "bajaj chetak": "bajaj-chetak-ev",
    "bajaj chetak electric": "bajaj-chetak-ev",
    "benelli india": "benelli-india",
    "bmw motorrad india": "bmw-motorrad-india",
    "cfmoto india": "cfmoto-india",
    "ducati india": "ducati-india",
    "harley-davidson india": "harley-davidson-india",
    "hero electric": "hero-electric",
    "hop electric": "hop-electric",
    "husqvarna motorcycles": "husqvarna-india",
    "indian motorcycle": "indian-motorcycle",
    "jawa motorcycles": "jawa-motorcycles",
    "kabira mobility": "kabira-mobility",
    "keeway india": "keeway-india",
    "mahindra two wheelers": "mahindra-two-wheelers",
    "moto guzzi": "moto-guzzi",
    "oben electric": "oben-electric",
    "okinawa autotech": "okinawa-autotech",
    "pure ev": "pure-ev",
    "quantum energy": "quantum-energy",
    "revolt motors": "revolt-motors",
    "river": "river-ev",
    "river ev": "river-ev",
    "tork motors": "tork-motors",
    "triumph motorcycles": "triumph-india",
    "ultraviolette automotive": "ultraviolette",
    "vespa india": "vespa-india",
    "vespa": "vespa-india",
    "yezdi motorcycles": "yezdi-motorcycles",
    "yulu": "yulu",
    "zontes india": "zontes-india",
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
