#!/usr/bin/env python3.11
# -*- coding: utf-8 -*-
# Requires Python 3.10+ for union type hints (bytes | None)
"""
fix_3w_missing_images.py
========================
Three-wheeler image audit + fix script.

Steps:
1. Finds slug-alias mismatches (images exist in Supabase but wrong key in vehicle-image-urls.json)
2. Scrapes missing images from trucks.cardekho.com
3. Uploads scraped images to Supabase vehicle-images bucket
4. Updates vehicle-image-urls.json with all new keys
5. Saves local copies of dynamic-brand images to public/data/brand-model-images/3w/

Usage:
  python3 scripts/fix_3w_missing_images.py
"""

from __future__ import annotations

import json
import os
import re
import sys
import time
import tempfile
import urllib.request
import urllib.parse
import urllib.error
from pathlib import Path
from typing import Optional

# ── Config ────────────────────────────────────────────────────────────────────
PROJECT_ROOT = Path(__file__).parent.parent
URLS_JSON    = PROJECT_ROOT / "public/data/vehicle-image-urls.json"
BRAND_MODEL_IMAGES_3W = PROJECT_ROOT / "public/data/brand-model-images/3w"

SUPABASE_URL = "https://llsvbyeumrfngjvbedbz.supabase.co"
SUPABASE_SERVICE_KEY = (
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9."
    "eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imxsc3ZieWV1bXJmbmdqdmJlZGJ6Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MTMwODMxNywiZXhwIjoyMDg2ODg0MzE3fQ."
    "NUlqttWkhTpQEcTCLQ7GPLkQvEpoW-6g4UuEPkYJnaE"
)
BUCKET = "vehicle-images"
MIN_IMAGE_BYTES = 20_000  # 20 KB minimum

# ── Slug helpers ──────────────────────────────────────────────────────────────

def to_slug_ts(s: str) -> str:
    """Replicate three-wheelers.ts toSlug function exactly."""
    s = s.lower()
    s = re.sub(r'[^a-z0-9\s-]', '', s)
    s = re.sub(r'\s+', '-', s)
    s = re.sub(r'-+', '-', s)
    return s


def model_to_slug(model: str) -> str:
    """Replicate brand-model-images.ts modelToSlug function exactly."""
    s = model.lower()
    s = re.sub(r'\.', '', s)
    s = re.sub(r'[^a-z0-9]+', '-', s)
    s = re.sub(r'^-|-$', '', s)
    return s

# ── Supabase helpers ──────────────────────────────────────────────────────────

def supabase_upload(path_in_bucket: str, image_bytes: bytes) -> str:
    """Upload bytes to Supabase Storage, return public URL."""
    url = f"{SUPABASE_URL}/storage/v1/object/{BUCKET}/{path_in_bucket}"
    req = urllib.request.Request(
        url,
        data=image_bytes,
        method="POST",
        headers={
            "Authorization": f"Bearer {SUPABASE_SERVICE_KEY}",
            "Content-Type": "image/jpeg",
            "x-upsert": "true",
        },
    )
    try:
        with urllib.request.urlopen(req) as resp:
            pass
    except urllib.error.HTTPError as e:
        body = e.read().decode()
        raise RuntimeError(f"Upload failed ({e.code}): {body}")
    return f"{SUPABASE_URL}/storage/v1/object/public/{BUCKET}/{path_in_bucket}"


def supabase_exists(path_in_bucket: str) -> bool:
    url = f"{SUPABASE_URL}/storage/v1/object/public/{BUCKET}/{path_in_bucket}"
    req = urllib.request.Request(url, method="HEAD")
    try:
        with urllib.request.urlopen(req):
            return True
    except urllib.error.HTTPError:
        return False

# ── Scraping helpers ──────────────────────────────────────────────────────────

HEADERS = {
    "User-Agent": (
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) "
        "AppleWebKit/537.36 (KHTML, like Gecko) "
        "Chrome/120.0.0.0 Safari/537.36"
    ),
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
    "Accept-Language": "en-US,en;q=0.5",
}

CARDEKHO_BRAND_SLUGS = {
    "lohia": "lohia",
    "euler": "euler-motors",
    "altigreen": "altigreen",
    "montra": "montra-electric",
    "osm": "omega-seiki-mobility",
    "youdha": "youdha",
    "bajaj": "bajaj",
    "piaggio": "piaggio",
    "tvs": "tvs",
    "mahindra": "mahindra",
    "atul": "atul-auto",
    "kinetic": "kinetic-green",
    "greaves": "greaves",
}

def scrape_cardekho_image(brand_folder: str, model_slug_cardekho: str) -> Optional[bytes]:
    """
    Try to scrape an image from trucks.cardekho.com for a 3W model.
    Returns image bytes if found and valid (>20KB), else None.
    """
    brand_slug = CARDEKHO_BRAND_SLUGS.get(brand_folder, brand_folder)
    url = f"https://trucks.cardekho.com/en/trucks/{brand_slug}/{model_slug_cardekho}"
    print(f"    Trying CardDekho: {url}")

    try:
        req = urllib.request.Request(url, headers=HEADERS)
        with urllib.request.urlopen(req, timeout=15) as resp:
            html = resp.read().decode("utf-8", errors="replace")
    except Exception as e:
        print(f"      Fetch failed: {e}")
        return None

    # Extract __NEXT_DATA__ JSON
    m = re.search(r'<script id="__NEXT_DATA__"[^>]*>(.*?)</script>', html, re.DOTALL)
    if not m:
        print("      No __NEXT_DATA__ found")
        return None

    try:
        next_data = json.loads(m.group(1))
    except json.JSONDecodeError:
        print("      Failed to parse __NEXT_DATA__")
        return None

    # Search for image URLs in the JSON (CDN images)
    raw = json.dumps(next_data)
    img_matches = re.findall(
        r'https?://(?:imgd\.aeplcdn\.com|truckcdn\.cardekho\.com|[^"]*cardekho[^"]*)/[^"]*\.(?:jpg|jpeg|webp)',
        raw,
    )

    if not img_matches:
        print("      No CDN image URLs found in __NEXT_DATA__")
        return None

    # Prefer larger/higher-quality ones (sort by URL length as proxy)
    seen = list(dict.fromkeys(img_matches))  # dedupe preserving order
    # Try to find a "main" image (not thumbnail/icon)
    preferred = [u for u in seen if not any(x in u for x in ['/th/', '/icon', '32x32', '50x50', '100x100'])]
    candidates = preferred if preferred else seen

    for img_url in candidates[:5]:
        print(f"      Trying image URL: {img_url[:80]}...")
        try:
            img_req = urllib.request.Request(img_url, headers=HEADERS)
            with urllib.request.urlopen(img_req, timeout=15) as r:
                data = r.read()
            if len(data) >= MIN_IMAGE_BYTES:
                print(f"      OK ({len(data):,} bytes)")
                return data
            else:
                print(f"      Too small ({len(data):,} bytes), skipping")
        except Exception as e:
            print(f"      Image fetch failed: {e}")

    return None


def try_fetch_image(url: str) -> Optional[bytes]:
    """Try to fetch any image URL, return bytes if valid or None."""
    try:
        req = urllib.request.Request(url, headers=HEADERS)
        with urllib.request.urlopen(req, timeout=15) as r:
            data = r.read()
        if len(data) >= MIN_IMAGE_BYTES:
            return data
    except Exception:
        pass
    return None

# ── Main ──────────────────────────────────────────────────────────────────────

def main():
    with open(URLS_JSON) as f:
        urls: dict = json.load(f)

    changed = False
    results = {
        "aliases_added": [],
        "scraped_uploaded": [],
        "dynamic_local_saved": [],
        "failed": [],
    }

    # ── Step 1: Fix slug alias mismatches ─────────────────────────────────────
    print("\n=== Step 1: Adding alias keys for slug mismatches ===")

    # OSM: model names contain "OSM " prefix; stored slugs don't; also "+" → nothing in slug
    osm_aliases = {
        "3w/osm/osm-rage-frost.jpg":   "3w/osm/rage-plus-frost.jpg",
        "3w/osm/osm-rage-flame.jpg":   "3w/osm/rage-plus-flame.jpg",
        "3w/osm/osm-rage-blaze.jpg":   "3w/osm/rage-plus-blaze.jpg",
        "3w/osm/osm-stream-city.jpg":  "3w/osm/stream-city.jpg",
        "3w/osm/osm-stream-highway.jpg": "3w/osm/stream-highway.jpg",
    }

    # YOUDHA: model names contain "YOUDHA " prefix; stored slugs don't
    youdha_aliases = {
        "3w/youdha/youdha-trevo-cargo.jpg":                    "3w/youdha/trevo-cargo.jpg",
        "3w/youdha/youdha-trevo-cargo-plus.jpg":               "3w/youdha/trevo-cargo.jpg",  # same image, plus variant
        "3w/youdha/youdha-epod-cargo.jpg":                     "3w/youdha/epod-cargo.jpg",
        "3w/youdha/youdha-epod-cargo-plus.jpg":                "3w/youdha/epod-cargo.jpg",   # same image, plus variant
        "3w/youdha/youdha-g-van-cargo.jpg":                    "3w/youdha/g-van.jpg",
        "3w/youdha/youdha-g-van-cargo-plus.jpg":               "3w/youdha/g-van.jpg",
        "3w/youdha/youdha-passenger-e-rickshaw-standard.jpg":  "3w/youdha/passenger-e-rickshaw.jpg",
        "3w/youdha/youdha-passenger-e-rickshaw-deluxe.jpg":    "3w/youdha/passenger-e-rickshaw.jpg",
    }

    # Montra Eviator: stored as "eviator-e350l" but computed slug is "eviator-e-350l"
    montra_aliases = {
        "3w/montra/eviator-e-350l.jpg": "3w/montra/eviator-e350l.jpg",
        "3w/montra/eviator-e-350x.jpg": "3w/montra/eviator-e350x.jpg",
    }

    for alias_key, source_key in {**osm_aliases, **youdha_aliases, **montra_aliases}.items():
        if source_key in urls and alias_key not in urls:
            urls[alias_key] = urls[source_key]
            changed = True
            results["aliases_added"].append(alias_key)
            print(f"  + Added alias: {alias_key}")
        elif alias_key in urls:
            print(f"  = Already exists: {alias_key}")
        else:
            print(f"  ! Source missing: {source_key}")

    # ── Step 2: Scrape truly missing CATALOG_BY_BRAND images ─────────────────
    print("\n=== Step 2: Scraping missing catalog images ===")

    # Maps: (folder, computed_slug, [cardekho_model_slug_variations])
    missing_catalog = [
        # Lohia
        ("lohia", "e-tipper", ["e-tipper", "e-tipper-electric", "e-tipper-3w"]),
        # Euler
        ("euler", "storm-ev-longrange-200", ["storm-ev-longrange-200", "storm-ev", "storm-ev-1200"]),
        ("euler", "neo-hirange-plus",       ["neo-hirange-plus", "neo-hirange"]),
        ("euler", "neo-hirange-maxx",       ["neo-hirange-maxx", "neo-hirange"]),
        # Altigreen
        ("altigreen", "neev-bhai-low-deck",  ["neev-bhai-low-deck", "neev-bhai", "neev"]),
        ("altigreen", "neev-bhai-flatbed",   ["neev-bhai-flatbed", "neev-bhai", "neev"]),
        # OSM swayamgati
        ("osm", "osm-swayamgati-cargo",      ["swayamgati-cargo", "swayamgati", "rage-swayamgati-cargo"]),
        ("osm", "osm-swayamgati-cargo-plus", ["swayamgati-cargo-plus", "swayamgati-cargo", "swayamgati"]),
        # YOUDHA (plus variants - use base image)
        # YOUDHA g-van-cargo  (stored as g-van, needs to be uploaded as g-van-cargo too)
    ]

    for folder, slug, cardekho_slugs in missing_catalog:
        full_key = f"3w/{folder}/{slug}.jpg"
        if full_key in urls:
            print(f"  = Already in urls.json: {full_key}")
            continue

        print(f"\n  > Searching for: {full_key}")
        image_bytes = None

        # Try cardekho for each slug variation
        for cd_slug in cardekho_slugs:
            image_bytes = scrape_cardekho_image(folder, cd_slug)
            if image_bytes:
                break
            time.sleep(1)

        if image_bytes:
            print(f"    Uploading to Supabase: {full_key}")
            try:
                pub_url = supabase_upload(full_key, image_bytes)
                urls[full_key] = pub_url
                changed = True
                results["scraped_uploaded"].append(full_key)
                print(f"    Uploaded: {pub_url}")
            except RuntimeError as e:
                print(f"    Upload failed: {e}")
                results["failed"].append({"key": full_key, "reason": str(e)})
        else:
            print(f"    Could not find image for {full_key}")
            results["failed"].append({"key": full_key, "reason": "no image found via scraping"})

        time.sleep(1)

    # ── Step 3: Dynamic brand missing local images ────────────────────────────
    print("\n=== Step 3: Saving missing dynamic brand images locally ===")

    dynamic_missing = [
        # (brandId, model, cardekho_brand_slug, [cardekho_model_slugs])
        ("yc-ev",       "Yatri Cart",          "yc-electric", ["yatri-cart", "yatri"]),
        ("yc-ev",       "E Loader",            "yc-electric", ["e-loader", "loader"]),
        ("saera-ev",    "Mayuri E Cart Loader", "saera-electric", ["mayuri-e-cart-loader", "mayuri-e-cart", "e-cart-loader"]),
        ("saera-ev",    "Mayuri DV",            "saera-electric", ["mayuri-dv", "mayuri"]),
        ("terra-motors","Kyoto",               "terra-motors",  ["kyoto", "terra-kyoto"]),
        ("terra-motors","Sumo",                "terra-motors",  ["sumo", "terra-sumo"]),
        ("terra-motors","Kyoro L5",            "terra-motors",  ["kyoro-l5", "kyoro"]),
    ]

    for brand_id, model, cd_brand, cd_slugs in dynamic_missing:
        slug = model_to_slug(model)
        local_path = BRAND_MODEL_IMAGES_3W / brand_id / f"{slug}.jpg"

        if local_path.exists():
            print(f"  = Already exists locally: {local_path.name}")
            continue

        print(f"\n  > Searching for: {brand_id}/{slug}.jpg (model='{model}')")
        image_bytes = None

        # Try cardekho
        for cd_slug in cd_slugs:
            # Try the brand name as-is for trucks.cardekho
            try:
                req = urllib.request.Request(
                    f"https://trucks.cardekho.com/en/trucks/{cd_brand}/{cd_slug}",
                    headers=HEADERS
                )
                with urllib.request.urlopen(req, timeout=15) as resp:
                    html = resp.read().decode("utf-8", errors="replace")
                m = re.search(r'<script id="__NEXT_DATA__"[^>]*>(.*?)</script>', html, re.DOTALL)
                if m:
                    next_data = json.loads(m.group(1))
                    raw = json.dumps(next_data)
                    imgs = re.findall(
                        r'https?://(?:imgd\.aeplcdn\.com|truckcdn\.cardekho\.com)[^"]*\.(?:jpg|jpeg|webp)',
                        raw
                    )
                    for img_url in imgs[:5]:
                        data = try_fetch_image(img_url)
                        if data:
                            image_bytes = data
                            break
            except Exception:
                pass
            if image_bytes:
                break
            time.sleep(1)

        if image_bytes:
            local_path.parent.mkdir(parents=True, exist_ok=True)
            local_path.write_bytes(image_bytes)
            print(f"    Saved locally: {local_path}")
            results["dynamic_local_saved"].append(str(local_path))
        else:
            print(f"    Could not find image for {brand_id}/{slug}")
            results["failed"].append({"key": f"dynamic:{brand_id}/{slug}.jpg", "reason": "no image found"})

        time.sleep(1)

    # ── Save updated vehicle-image-urls.json ──────────────────────────────────
    if changed:
        with open(URLS_JSON, "w") as f:
            json.dump(urls, f, indent=2, ensure_ascii=False)
            f.write("\n")
        print(f"\nSaved updated vehicle-image-urls.json")
    else:
        print("\nNo changes to vehicle-image-urls.json")

    # ── Summary ───────────────────────────────────────────────────────────────
    print("\n" + "="*60)
    print("SUMMARY")
    print("="*60)
    print(f"  Alias keys added:         {len(results['aliases_added'])}")
    for k in results["aliases_added"]:
        print(f"    + {k}")
    print(f"  Scraped + uploaded:       {len(results['scraped_uploaded'])}")
    for k in results["scraped_uploaded"]:
        print(f"    + {k}")
    print(f"  Dynamic local saved:      {len(results['dynamic_local_saved'])}")
    for k in results["dynamic_local_saved"]:
        print(f"    + {k}")
    print(f"  Failed / needs manual:    {len(results['failed'])}")
    for item in results["failed"]:
        print(f"    ! {item['key']}: {item['reason']}")

    return results


if __name__ == "__main__":
    main()
