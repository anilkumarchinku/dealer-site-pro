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
import fourWAppAssets from '@/lib/data/generated/4w-app-assets.json';
import twoWColorHeroFallbacks from '@/lib/data/generated/2w-color-hero-fallbacks.json';

const SUPABASE_STORAGE_URL =
    "https://llsvbyeumrfngjvbedbz.supabase.co/storage/v1/object/public/vehicle-images";

const IMAGE_EXTENSIONS = ["jpg", "png", "webp"] as const;
const FOUR_W_APP_ASSETS = new Set(fourWAppAssets as string[]);

const BAD_IMAGE_URL_MARKERS = [
    "bikedekho-logo",
    "bike-dekho-logo",
    "cardekho-logo",
    "image-not-available",
    "no-image",
    "no_image",
    "not-available",
    "placeholder",
    "coming-soon",
];

const BAD_IMAGE_PATHS = new Set([
    "/data/brand-model-images/2w/battre-ev/battre-electric-em.jpg",
    "/data/brand-model-images/2w/battre-ev/battre-electric-one.jpg",
    "/data/brand-model-images/2w/battre-ev/battre-electric-smart.jpg",
    "/data/brand-model-images/2w/battre-ev/battre-electric-yelo.jpg",
    "/data/brand-model-images/2w/battre-ev/yelo.jpg",
    "/data/brand-model-images/2w/bgauss/bg-ruv-350.jpg",
    "/data/brand-model-images/2w/bgauss/c12.jpg",
    "/data/brand-model-images/2w/bounce-infinity/infinity-e1.jpg",
    "/data/brand-model-images/2w-colors/ducati-india/xdiavel-v4/black-lava.jpg",
    "/data/brand-model-images/2w-colors/ducati-india/xdiavel-v4/burning-red.jpg",
    "/data/brand-model-images/2w/evolet/pony.jpg",
    "/data/brand-model-images/2w/ferrato/disruptor.jpg",
    "/data/brand-model-images/2w/joy-e-bike/gen-nxt.jpg",
    "/data/brand-model-images/2w/kinetic/dx.jpg",
    "/data/brand-model-images/2w/kinetic/kinetic-dx.jpg",
    "/data/brand-model-images/2w/okaya-ev/classiq-pro.jpg",
    "/data/brand-model-images/2w/okaya-ev/ferrato-connect.jpg",
    "/data/brand-model-images/2w/okaya-ev/hunk-h1.jpg",
    "/data/brand-model-images/2w/okaya-ev/okaya-ev-classiq-pro.jpg",
    "/data/brand-model-images/2w/okaya-ev/okaya-ev-faast-f4.jpg",
    "/data/brand-model-images/2w/okaya-ev/okaya-ev-ferrato-connect.jpg",
    "/data/brand-model-images/2w/okaya-ev/okaya-ev-hunk-h1.jpg",
    "/data/brand-model-images/2w/opg-mobility/faast-f3.jpg",
    "/data/brand-model-images/2w/pure-ev/ecodryft.jpg",
    "/data/brand-model-images/2w/raptee/t30.jpg",
    "/data/brand-model-images/2w/river-ev/indie.jpg",
    "/data/brand-model-images/2w/simple-energy/one-gen-2.jpg",
    "/data/brand-model-images/2w/simple-energy/one-s-gen-2.jpg",
    "/data/brand-model-images/2w/simple-energy/ones-gen-2.jpg",
    "/data/brand-model-images/2w/vespa-india/s-125.jpg",
    "/data/brand-model-images/2w/vespa-india/s-150.jpg",
    "/data/brand-model-images/2w/vlf/mobster.jpg",
    "/data/brand-model-images/2w/yo/drift.jpg",
    "/data/brand-model-images/2w/yo/yo-drift.jpg",
    "/data/brand-model-images/2w/yulu/bike-d.jpg",
    "/data/brand-model-images/2w/yulu/miracle-gr.jpg",
    "/data/brand-model-images/2w/yulu/yulu-bike-d.jpg",
    "/data/brand-model-images/2w/yulu/yulu-miracle-gr.jpg",
]);

const TWO_W_CLEAN_HERO_OVERRIDES: Record<string, string> = {
    "pure-ev/ecodryft": "https://imgd.aeplcdn.com/1280x720/n/ov5ateb_1777553.png?q=100",
    "bounce-infinity/infinity-e1": "/data/brand-model-images/2w/bounce-infinity/e1.jpg",
};

const TWO_W_MODEL_IMAGE_ALIASES: Record<string, string[]> = {
    "bounce-infinity/infinity-e1": ["e1", "e1-plus"],
    "hero-motocorp/motocorp-ltd-karizma-bsiii": ["karizma-xmr"],
};

const FOUR_W_GALLERY_ALIASES: Record<string, string> = {
    "bentley/continental-gt": "bentley/continental",
    "bentley/continental-gtc": "bentley/continental",
    "bmw/m340i": "bmw/m340i",
    "bmw/3-series-long-wheelbase": "bmw/m340i",
    "bmw/m8": "bmw/m8-coupe-competition",
    "aston-martin/dbs-superleggera": "aston-martin/vanquish",
    "mahindra/xuv400": "mahindra/xuv400-ev",
    "mahindra/scorpio-classic": "mahindra/scorpio",
    "maruti-suzuki/wagonr": "maruti-suzuki/wagon-r",
    "hyundai/creta-ev": "hyundai/creta-electric",
    "hyundai/prime-hb": "hyundai/prime-hb",
    "hyundai/prime-sd": "hyundai/prime-sd",
    "mercedes-benz/amg-cle-53": "mercedes-benz/amg-cle-53",
    "mercedes-benz/cle": "mercedes-benz/cle",
    "mercedes-benz/v-class": "mercedes-benz/v-class",
    "mercedes-benz/eqg": "mercedes-benz/g-class-electric",
    "mercedes-benz/amg-gt-coupe": "mercedes-benz/amg-gt-4-door-coupe",
    "ferrari/12cilindri": "ferrari/amalfi",
    "ferrari/ferrari-12cilindri": "ferrari/amalfi",
    "toyota/fortuner": "toyota/Toyota_Fortuner",
    "toyota/urban-cruiser-hyryder": "toyota/hyryder",
    "toyota/rumion": "toyota/Toyota_Rumion",
    "vinfast/vf-6": "vinfast/vf6",
    "vinfast/vf-7": "vinfast/vf7",
    "vinfast/vf-8": "vinfast/vf8",
    "vinfast/vf-9": "vinfast/vf9",
};

const FOUR_W_COLOR_HERO_FALLBACKS = Object.fromEntries(
    Object.entries(fourWColorHeroFallbacks as Record<string, string>).map(([key, value]) => [
        key.toLowerCase(),
        value,
    ])
);

const KNOWN_FOUR_W_BRAND_IDS = new Set([
    ...Object.keys(FOUR_W_COLOR_HERO_FALLBACKS).map((key) => key.split("/")[0]),
    ...Object.keys(FOUR_W_GALLERY_ALIASES).map((key) => key.split("/")[0]),
    ...Object.values(FOUR_W_GALLERY_ALIASES).map((key) => key.split("/")[0]),
]);

function normalize4WGalleryUrl(url: string, brandId: string): string {
    return url.replace(
        /^\/data\/brand-model-images\/4w-galleries\/[^/]+\//,
        `/data/brand-model-images/4w-galleries/${brandId}/`
    );
}

function get4WModelSlugCandidates(brandId: string, model: string): string[] {
    const slug = modelToSlug(model);
    const brandSlug = brandId.toLowerCase();
    const candidates = [slug];

    if (slug.startsWith(`${brandSlug}-`)) {
        candidates.push(slug.slice(brandSlug.length + 1));
    } else {
        candidates.push(`${brandSlug}-${slug}`);
    }

    return Array.from(new Set(candidates.filter(Boolean)));
}

function get4WColorHeroFallback(brandId: string, model: string): string | null {
    for (const modelSlug of get4WModelSlugCandidates(brandId, model)) {
        const key = `${brandId}/${modelSlug}`.toLowerCase();
        const aliasKey = (FOUR_W_GALLERY_ALIASES[key] ?? "").toLowerCase();
        const rawUrl = FOUR_W_COLOR_HERO_FALLBACKS[key] ?? FOUR_W_COLOR_HERO_FALLBACKS[aliasKey] ?? null;
        if (rawUrl) return normalize4WGalleryUrl(rawUrl, brandId);
    }
    return null;
}

export function build2WColorMetadataSlugCandidates(model: string): string[] {
    const base = modelToSlug(model);
    return Array.from(new Set([
        base,
        base.replace(/-20$/g, ""),
        base.replace(/-202\d$/g, ""),
        base.replace(/-fi/g, ""),
        base.replace(/-v(\d)$/g, "-$1"),
        base.replace(/-xc$/g, "-x"),
        base.replace(/-x$/g, "-xc"),
        base.replace(/-plus$/g, ""),
        base.replace(/-/g, ""),
        base.replace(/^pulsar-/, ""),
    ].filter(Boolean)));
}

function get2WColorHeroFallback(brandId: string, model: string): string | null {
    const manifest = twoWColorHeroFallbacks as Record<string, string>;
    for (const modelSlug of build2WColorMetadataSlugCandidates(model)) {
        const override = TWO_W_CLEAN_HERO_OVERRIDES[`${brandId}/${modelSlug}`];
        if (override) return override;

        const fallback = manifest[`${brandId}/${modelSlug}`];
        // The scraped 2W color dataset contains many AVIF files saved with a
        // .png extension, which the browser receives as image/png and rejects.
        if (fallback && !fallback.endsWith(".png")) return fallback;
    }
    return null;
}

export function isUsableVehicleImageUrl(url: string | null | undefined): url is string {
    if (!url || url === "/placeholder-car.jpg") return false;

    const normalized = url.toLowerCase();
    const pathOnly = normalized.split("?")[0];
    if (BAD_IMAGE_PATHS.has(pathOnly)) return false;

    return !BAD_IMAGE_URL_MARKERS.some((marker) => normalized.includes(marker));
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
        if (!KNOWN_FOUR_W_BRAND_IDS.has(brandId.toLowerCase())) return [];

        const urls: string[] = [];
        const colorHero = get4WColorHeroFallback(brandId, model);
        if (colorHero) urls.push(colorHero);

        for (const modelSlug of get4WModelSlugCandidates(brandId, model)) {
            const base = `/data/brand-model-images/4w/${brandId}/${modelSlug}`;
            IMAGE_EXTENSIONS.forEach((ext) => urls.push(`${base}.${ext}`));
        }

        // Fallback: strip common suffixes (tour, cargo, gen, edition) to
        // try the base model image (e.g. "wagon-r-tour" → "wagon-r")
        for (const modelSlug of get4WModelSlugCandidates(brandId, model)) {
            const baseSlug = modelSlug
                .replace(/-(tour|cargo|edition|facelift|gen|2nd-gen|3rd-gen)$/i, "")
                .replace(/-\d+(st|nd|rd|th)-gen$/i, "");
            if (baseSlug !== modelSlug) {
                const fallback = `/data/brand-model-images/4w/${brandId}/${baseSlug}`;
                IMAGE_EXTENSIONS.forEach((ext) => urls.push(`${fallback}.${ext}`));
            }
        }
        return Array.from(new Set(urls));
    }
    // 2W and 3W: try clean color/model files first, then Supabase storage.
    // Some scraped files are provider logos or promo collages, so known-bad
    // slugs are replaced by verified model-photo aliases before fallback.
    const cleanHero = vehicleCategory === "2w" ? get2WColorHeroFallback(brandId, model) : null;
    const aliasKey = `${brandId}/${slug}`;
    const localSlugs = vehicleCategory === "2w" && TWO_W_MODEL_IMAGE_ALIASES[aliasKey]
        ? TWO_W_MODEL_IMAGE_ALIASES[aliasKey]
        : [slug];
    const urls = [
        cleanHero,
        ...localSlugs.flatMap((localSlug) => {
            const localBases = vehicleCategory === "3w"
                ? [
                    `/images/3w/${brandId}/${localSlug}`,
                    `/data/brand-model-images/3w/${brandId}/${localSlug}`,
                ]
                : [`/data/brand-model-images/${vehicleCategory}/${brandId}/${localSlug}`];
            return localBases.flatMap((localBase) => IMAGE_EXTENSIONS.map((ext) => `${localBase}.${ext}`));
        }),
    ].filter(isUsableVehicleImageUrl);

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

        const dirs3w = [
            `/images/3w/${brandId}`,
            `/data/brand-model-images/3w/${brandId}`,
        ];
        for (const fb of fallbackSlugs) {
            dirs3w.forEach((dir3w) => {
                IMAGE_EXTENSIONS.forEach((ext) => {
                    const url = `${dir3w}/${fb}.${ext}`;
                    if (isUsableVehicleImageUrl(url)) urls.push(url);
                });
            });
        }
    }

    // Supabase storage as final fallback
    const supaBase = `${SUPABASE_STORAGE_URL}/${vehicleCategory}/${brandId}/${slug}`;
    IMAGE_EXTENSIONS.forEach((ext) => {
        const url = `${supaBase}.${ext}`;
        if (isUsableVehicleImageUrl(url)) urls.push(url);
    });

    return urls;
}

export function getAppAssetImageUrls(
    vehicleCategory: "2w" | "3w" | "4w",
    brandId: string,
    model: string
): string[] {
    if (vehicleCategory !== "4w") return [];

    return get4WModelSlugCandidates(brandId, model).flatMap((slug) => {
        const base = `/assets/cars/${brandId}/${slug}`;
        return IMAGE_EXTENSIONS
            .map((ext) => `${base}.${ext}`)
            .filter((url) => FOUR_W_APP_ASSETS.has(url));
    });
}

export function getVehicleImageUrls(
    vehicleCategory: "2w" | "3w" | "4w",
    brandId: string,
    model: string,
    primaryImage?: string | null,
): string[] {
    const curatedAssets = getAppAssetImageUrls(vehicleCategory, brandId, model);
    const scrapedAssets = getScrapedImageUrls(vehicleCategory, brandId, model);
    const normalizedPrimary = isUsableVehicleImageUrl(primaryImage) ? primaryImage : null;
    const preferredPrimary = normalizedPrimary;
    const preferredColorHero = vehicleCategory === "2w"
        ? get2WColorHeroFallback(brandId, model)
        : vehicleCategory === "4w"
            ? get4WColorHeroFallback(brandId, model)
            : null;

    if (vehicleCategory === "4w") {
        const localRepoAssets = scrapedAssets.filter((url) =>
            url.startsWith('/data/brand-model-images/4w/')
        );
        const remoteFallbackAssets = scrapedAssets.filter((url) =>
            !url.startsWith('/data/brand-model-images/4w/')
        );

        return [...new Set([
            ...[
                preferredPrimary,
                ...curatedAssets,
                ...localRepoAssets,
                preferredColorHero,
                ...remoteFallbackAssets,
            ].filter(isUsableVehicleImageUrl),
        ])];
    }

    return [...new Set([
        ...[
            preferredPrimary,
            preferredColorHero,
            ...scrapedAssets,
            ...curatedAssets,
        ].filter(isUsableVehicleImageUrl),
    ])];
}

/**
 * Returns the primary scraped image URL for a brand/model.
 * Uses jpg extension — the most common in the scraped dataset.
 */
export function getScrapedImageFallback(
    vehicleCategory: "2w" | "3w" | "4w",
    brandId: string,
    model: string
): string | null {
    return getScrapedImageUrls(vehicleCategory, brandId, model).find(isUsableVehicleImageUrl) ?? null;
}

/**
 * Explicit map from lowercase brand name variants → actual image folder ID.
 * Image folders don't always match simple kebab-case of the DB brand name
 * (e.g. "Honda Motorcycle & Scooter India" → folder "honda-hmsi").
 */
const BRAND_FOLDER_MAP_2W: Record<string, string> = {
    "royal enfield": "royal-enfield",
    "hero": "hero-motocorp",
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
    "okaya ev": "okaya-ev",
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
    "bmw": "bmw-motorrad-india",
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
    "qj motor": "qj-motor-india",
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
    "honda city": "honda",
    "hyundai": "hyundai",
    "hyundai creta": "hyundai",
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
