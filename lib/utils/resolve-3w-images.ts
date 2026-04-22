/**
 * Server-side 3W image resolver.
 * Scans actual image files on disk and matches them to model slugs
 * using fuzzy matching instead of guessing URLs.
 *
 * This file uses `fs` and must only be imported from server-side code
 * (API routes, server components).
 */

import fs from 'fs';
import path from 'path';
import { modelToSlug, getVehicleImageUrls } from './brand-model-images';

const IMAGE_EXTENSIONS = ['jpg', 'png', 'webp'] as const;

// Cache: brandId → Map of image stem → source directory prefix
// Source prefix: '/data/brand-model-images/3w' or '/images/3w'
interface StemInfo {
    stems: Set<string>;
    stemToPrefix: Map<string, string>;
}
let cachedImageMap: Map<string, StemInfo> | null = null;

/** Scan BOTH 3W image directories and build a map of brandId → available image stems */
function getImageMap(): Map<string, StemInfo> {
    if (cachedImageMap) return cachedImageMap;

    const map = new Map<string, StemInfo>();

    // Scan both directories: data/brand-model-images/3w (scraped) and images/3w (complete)
    const dirs = [
        { base: path.join(process.cwd(), 'public', 'images', '3w'), prefix: '/images/3w' },
        { base: path.join(process.cwd(), 'public', 'data', 'brand-model-images', '3w'), prefix: '/data/brand-model-images/3w' },
    ];

    for (const { base, prefix } of dirs) {
        try {
            const brandDirs = fs.readdirSync(base, { withFileTypes: true })
                .filter(d => d.isDirectory())
                .map(d => d.name);

            for (const brandId of brandDirs) {
                const brandDir = path.join(base, brandId);

                if (!map.has(brandId)) {
                    map.set(brandId, { stems: new Set(), stemToPrefix: new Map() });
                }
                const info = map.get(brandId)!;

                const files = fs.readdirSync(brandDir);
                for (const file of files) {
                    const ext = file.split('.').pop()?.toLowerCase();
                    if (ext && (IMAGE_EXTENSIONS as readonly string[]).includes(ext)) {
                        const stem = file.substring(0, file.length - ext.length - 1);
                        info.stems.add(stem);
                        // First directory wins (images/3w has priority — more complete)
                        if (!info.stemToPrefix.has(stem)) {
                            info.stemToPrefix.set(stem, prefix);
                        }
                    }
                }
            }
        } catch {
            // Directory doesn't exist
        }
    }

    cachedImageMap = map;
    return map;
}

/** Find matching image stems for a model slug within a brand's image directory */
function findMatchingStems(brandId: string, modelSlug: string): string[] {
    const imageMap = getImageMap();
    const info = imageMap.get(brandId);
    if (!info || info.stems.size === 0) return [];
    const stems = info.stems;

    const matches: string[] = [];

    // 1. Exact match
    if (stems.has(modelSlug)) {
        matches.push(modelSlug);
        return matches;
    }

    // 2. Slug is a prefix of an image stem (e.g., "treo-yaari" matches "treo-yaari-hrt")
    for (const stem of stems) {
        if (stem.startsWith(modelSlug + '-')) {
            matches.push(stem);
        }
    }
    if (matches.length > 0) return matches;

    // 3. Image stem is a prefix of slug (e.g., "neev" matches "neev-high-deck")
    //    Pick the longest matching stem
    let bestPrefix = '';
    for (const stem of stems) {
        if (modelSlug.startsWith(stem + '-') || modelSlug === stem) {
            if (stem.length > bestPrefix.length) bestPrefix = stem;
        }
    }
    if (bestPrefix) {
        matches.push(bestPrefix);
        return matches;
    }

    // 4. Strip known brand prefixes from the slug and retry
    //    e.g., "ape-auto-plus" → "auto-plus", "yc-electric-yatri" → "yatri"
    const prefixes = [
        'ape-', 're-', 'king-', 'alfa-', 'maxima-', 'treo-', 'super-auto-',
        'yc-electric-', 'osm-', 'youdha-', 'mayuri-', 'neev-',
    ];
    for (const prefix of prefixes) {
        if (!modelSlug.startsWith(prefix)) continue;
        const stripped = modelSlug.slice(prefix.length);
        if (!stripped) continue;

        if (stems.has(stripped)) {
            matches.push(stripped);
            return matches;
        }
        // Also check if stripped slug is a prefix of any stem
        for (const stem of stems) {
            if (stem.startsWith(stripped + '-') || stem.startsWith(stripped)) {
                matches.push(stem);
            }
        }
        if (matches.length > 0) return matches;

        // Progressive shortening of the stripped slug
        const strippedParts = stripped.split('-');
        for (let len = strippedParts.length - 1; len >= 1; len--) {
            const shorter = strippedParts.slice(0, len).join('-');
            if (stems.has(shorter)) {
                matches.push(shorter);
                return matches;
            }
            for (const stem of stems) {
                if (stem.startsWith(shorter + '-')) matches.push(stem);
            }
            if (matches.length > 0) return matches;
        }
    }

    // 5. Progressive shortening: try removing segments from the end
    const parts = modelSlug.split('-');
    for (let len = parts.length - 1; len >= 2; len--) {
        const shorter = parts.slice(0, len).join('-');
        if (stems.has(shorter)) {
            matches.push(shorter);
            return matches;
        }
        // Check if shorter slug is prefix of any stem
        for (const stem of stems) {
            if (stem.startsWith(shorter + '-')) {
                matches.push(stem);
            }
        }
        if (matches.length > 0) return matches;
    }

    // 5b. First-segment fallback: try just the first word if slug has 2+ parts
    //     e.g., "rik-3-seater" → "rik" matches "rik-auto.jpg"
    //     e.g., "narain-plus" → "narain" matches "narain-dx.jpg"
    if (parts.length >= 2) {
        const first = parts[0];
        for (const stem of stems) {
            if (stem === first || stem.startsWith(first + '-')) {
                matches.push(stem);
            }
        }
        if (matches.length > 0) return matches;
    }

    // 6. Check if any image stem contains the model slug or vice versa
    for (const stem of stems) {
        if (stem.includes(modelSlug) || modelSlug.includes(stem)) {
            matches.push(stem);
        }
    }

    // 7. Word overlap: check if the first word of the slug matches the first word of any stem
    if (parts.length >= 2) {
        const firstWord = parts[0];
        for (const stem of stems) {
            const stemFirst = stem.split('-')[0];
            if (stemFirst === firstWord) {
                matches.push(stem);
            }
        }
    }

    return matches;
}

/**
 * Resolve 3W image URLs by scanning actual files on disk.
 * Returns an array of local image paths that actually exist.
 */
export function resolve3wImageUrls(brandId: string, model: string): string[] {
    const slug = modelToSlug(model);
    const matchedStems = findMatchingStems(brandId, slug);

    if (matchedStems.length === 0) return [];

    const imageMap = getImageMap();
    const info = imageMap.get(brandId);
    if (!info) return [];

    const urls: string[] = [];
    const seen = new Set<string>();

    for (const stem of matchedStems) {
        // Use the correct directory prefix for this stem
        const prefix = info.stemToPrefix.get(stem) ?? '/data/brand-model-images/3w';
        for (const ext of IMAGE_EXTENSIONS) {
            const url = `${prefix}/${brandId}/${stem}.${ext}`;
            if (!seen.has(url)) {
                seen.add(url);
                urls.push(url);
            }
        }
    }

    return urls;
}

/**
 * Get all image URLs for a 3W vehicle, combining filesystem scan with fallbacks.
 * Use this in API routes instead of getVehicleImageUrls for 3W.
 */
/**
 * Get all image URLs for a 3W vehicle, combining filesystem scan with fallbacks.
 * Use this in API routes instead of getVehicleImageUrls for 3W.
 *
 * Priority:
 * 1. primaryImage (if provided)
 * 2. Filesystem-matched local images (accurate, confirmed on disk)
 * 3. Fallback to heuristic URL generation (Supabase storage etc.) when no local match
 */
export function get3wVehicleImageUrls(
    brandId: string,
    model: string,
    primaryImage?: string | null,
): string[] {
    const fsUrls = resolve3wImageUrls(brandId, model);
    const normalizedPrimary = primaryImage && primaryImage !== '/placeholder-car.jpg' ? primaryImage : null;

    // If filesystem scan found images, use those (most accurate)
    if (fsUrls.length > 0) {
        return [...new Set([
            normalizedPrimary,
            ...fsUrls,
        ].filter((url): url is string => Boolean(url)))];
    }

    // No local images found — fall back to heuristic URL generation
    // (includes Supabase storage URLs as last resort)
    return getVehicleImageUrls('3w', brandId, model, primaryImage);
}
