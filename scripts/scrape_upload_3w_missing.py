#!/usr/bin/env python3
"""
scrape_upload_3w_missing.py
============================
Scrape missing 3W vehicle images from trucks.cardekho.com (truckcdn CDN)
and upload to Supabase vehicle-images bucket.

Also saves dynamic brand images locally to public/data/brand-model-images/3w/

Run: python3 scripts/scrape_upload_3w_missing.py
"""

from __future__ import annotations

import json
import re
import time
import urllib.request
import urllib.error
from pathlib import Path
from typing import Optional, List

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
MIN_IMAGE_BYTES = 20_000

HEADERS = {
    "User-Agent": (
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) "
        "AppleWebKit/537.36 (KHTML, like Gecko) "
        "Chrome/120.0.0.0 Safari/537.36"
    ),
}


def fetch_page_images(page_url: str) -> List[str]:
    """Fetch a trucks.cardekho.com page and extract all truckcdn.cardekho.com image URLs."""
    try:
        req = urllib.request.Request(page_url, headers=HEADERS)
        with urllib.request.urlopen(req, timeout=20) as resp:
            html = resp.read().decode("utf-8", errors="replace")
        imgs = re.findall(
            r'https://truckcdn\.cardekho\.com/in/[^"\'<>\s]+\.jpg',
            html
        )
        return list(dict.fromkeys(imgs))  # dedupe preserving order
    except Exception as e:
        print(f"      fetch_page_images failed for {page_url}: {e}")
        return []


def try_fetch_image(url: str) -> Optional[bytes]:
    """Fetch an image URL, return bytes if >=MIN_IMAGE_BYTES, else None."""
    try:
        req = urllib.request.Request(url, headers=HEADERS)
        with urllib.request.urlopen(req, timeout=20) as r:
            data = r.read()
        if len(data) >= MIN_IMAGE_BYTES:
            return data
        else:
            print(f"      Too small ({len(data):,} bytes): {url}")
    except Exception as e:
        print(f"      Fetch image failed: {e}")
    return None


def supabase_upload(path_in_bucket: str, image_bytes: bytes) -> str:
    """Upload bytes to Supabase Storage (upsert), return public URL."""
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


def get_first_brand_image(all_imgs: List[str], brand_frag: str) -> Optional[str]:
    """Get the first image from all_imgs that contains brand_frag in its path."""
    for img in all_imgs:
        parts = img.split("/in/")
        if len(parts) > 1 and brand_frag in parts[1].lower():
            return img
    return None


def main():
    with open(URLS_JSON) as f:
        urls: dict = json.load(f)

    results = {
        "uploaded_to_supabase": [],
        "saved_locally": [],
        "failed": [],
    }

    # ─────────────────────────────────────────────────────────────────────────
    # CATALOG_BY_BRAND — truly missing images (need scraping + Supabase upload)
    # Format: (bucket_key, [candidate_page_url_and_img_fragment_pairs])
    # Each candidate: (page_url, brand_frag_to_match_in_img_path)
    # ─────────────────────────────────────────────────────────────────────────
    catalog_missing = [
        # Lohia E-Tipper
        {
            "key": "3w/lohia/e-tipper.jpg",
            "candidates": [
                ("https://trucks.cardekho.com/en/trucks/lohia/lohia-narain-e-tipper", "lohia/e-tipper"),
                ("https://trucks.cardekho.com/en/trucks/lohia/lohia-e-tipper", "lohia/e-tipper"),
            ]
        },
        # Euler Storm EV LongRange 200
        {
            "key": "3w/euler/storm-ev-longrange-200.jpg",
            "candidates": [
                ("https://trucks.cardekho.com/en/trucks/euler-motors/euler-storm-ev", "euler/storm-ev"),
                ("https://trucks.cardekho.com/en/trucks/euler-motors/euler-storm-ev-longrange", "euler/storm-ev"),
            ]
        },
        # Euler NEO HiRANGE PLUS (same image as NEO HiRANGE base)
        {
            "key": "3w/euler/neo-hirange-plus.jpg",
            "candidates": [
                ("https://trucks.cardekho.com/en/trucks/euler-motors/euler-neo-hirange", "euler/neo-hirange"),
                ("https://trucks.cardekho.com/en/trucks/euler-motors/euler-neo-hirange-plus", "euler/neo-hirange"),
            ]
        },
        # Euler NEO HiRANGE MAXX
        {
            "key": "3w/euler/neo-hirange-maxx.jpg",
            "candidates": [
                ("https://trucks.cardekho.com/en/trucks/euler-motors/euler-neo-hirange", "euler/neo-hirange"),
                ("https://trucks.cardekho.com/en/trucks/euler-motors/euler-neo-hirange-maxx", "euler/neo-hirange"),
            ]
        },
        # Altigreen neEV Bhai Low Deck
        {
            "key": "3w/altigreen/neev-bhai-low-deck.jpg",
            "candidates": [
                ("https://trucks.cardekho.com/en/trucks/altigreen/altigreen-neev-bhai", "altigreen/neev-bhai"),
                ("https://trucks.cardekho.com/en/trucks/altigreen/altigreen-neev-bhai-low-deck", "altigreen/neev-bhai"),
            ]
        },
        # Altigreen neEV Bhai Flatbed
        {
            "key": "3w/altigreen/neev-bhai-flatbed.jpg",
            "candidates": [
                ("https://trucks.cardekho.com/en/trucks/altigreen/altigreen-neev-bhai", "altigreen/neev-bhai-flat"),
                ("https://trucks.cardekho.com/en/trucks/altigreen/altigreen-neev-bhai-flatbed", "altigreen/neev-bhai"),
            ]
        },
        # OSM Swayamgati Cargo — use Omega Seiki swayamgati image
        {
            "key": "3w/osm/osm-swayamgati-cargo.jpg",
            "candidates": [
                ("https://trucks.cardekho.com/en/trucks/omega-seiki-mobility/omega-seiki-swayamgati", "omega-seiki/swayam"),
                ("https://trucks.cardekho.com/en/trucks/omega-seiki/omega-seiki-swayamgati-cargo", "omega/swayam"),
            ]
        },
        # OSM Swayamgati Cargo Plus — same as above
        {
            "key": "3w/osm/osm-swayamgati-cargo-plus.jpg",
            "candidates": [
                ("https://trucks.cardekho.com/en/trucks/omega-seiki-mobility/omega-seiki-swayamgati", "omega-seiki/swayam"),
                ("https://trucks.cardekho.com/en/trucks/omega-seiki/omega-seiki-swayamgati-cargo", "omega/swayam"),
            ]
        },
    ]

    print("\n=== Scraping + Uploading Missing Catalog Images ===")
    for item in catalog_missing:
        key = item["key"]
        if key in urls:
            print(f"  = Already in urls.json: {key}")
            continue

        print(f"\n  > {key}")
        image_bytes = None
        found_url = None

        for page_url, brand_frag in item["candidates"]:
            print(f"    Checking: {page_url.split('/')[-1]} (frag={brand_frag})")
            imgs = fetch_page_images(page_url)
            # Try to find best matching image
            match = get_first_brand_image(imgs, brand_frag)
            if not match and imgs:
                # Fall back to first relevant image
                match = imgs[0]
            if match:
                print(f"    Found CDN URL: {match[:80]}")
                image_bytes = try_fetch_image(match)
                if image_bytes:
                    found_url = match
                    break
            time.sleep(1)

        if image_bytes:
            print(f"    Uploading ({len(image_bytes):,} bytes) to Supabase: {key}")
            try:
                pub_url = supabase_upload(key, image_bytes)
                urls[key] = pub_url
                results["uploaded_to_supabase"].append(key)
                print(f"    Done: {pub_url[:60]}...")
            except RuntimeError as e:
                print(f"    Upload error: {e}")
                results["failed"].append({"key": key, "reason": str(e)})
        else:
            print(f"    No valid image found")
            results["failed"].append({"key": key, "reason": "no image found"})

        time.sleep(1)

    # ─────────────────────────────────────────────────────────────────────────
    # DYNAMIC BRANDS — missing local files
    # ─────────────────────────────────────────────────────────────────────────
    # modelToSlug: lower, remove periods, non-alphanumeric → hyphen, trim hyphens
    def model_to_slug(m: str) -> str:
        s = m.lower()
        s = re.sub(r'\.', '', s)
        s = re.sub(r'[^a-z0-9]+', '-', s)
        return s.strip('-')

    dynamic_missing = [
        # (brand_id, model_name, [(page_url, img_frag)])
        ("yc-ev", "Yatri Cart", [
            ("https://trucks.cardekho.com/en/trucks/yc-electric/yc-yatri-cart", "yc-electric/yatri"),
            ("https://trucks.cardekho.com/en/trucks/yc-electric/yc-e-loader", "yc-electric/yatri"),
        ]),
        ("yc-ev", "E Loader", [
            ("https://trucks.cardekho.com/en/trucks/yc-electric/yc-e-loader", "yc-electric/e-loader"),
        ]),
        ("saera-ev", "Mayuri E Cart Loader", [
            ("https://trucks.cardekho.com/en/trucks/saera/saera-electric-mayuri-cart-loader", "saera/mayuri-e-cart"),
            ("https://trucks.cardekho.com/en/trucks/saera/saera-mayuri-cart-loader", "saera/mayuri"),
        ]),
        ("saera-ev", "Mayuri DV", [
            ("https://trucks.cardekho.com/en/trucks/saera/saera-mayuri-dv", "saera/mayuri-dv"),
            ("https://trucks.cardekho.com/en/trucks/saera/saera-mayuri-dv", "saera/mayuri"),
        ]),
        ("terra-motors", "Kyoto", [
            ("https://trucks.cardekho.com/en/trucks/terra-motors/terra-kyoto", "terra-motors/kyoto"),
        ]),
        ("terra-motors", "Sumo", [
            ("https://trucks.cardekho.com/en/trucks/terra-motors/terra-sumo", "terra-motors/sumo"),
        ]),
        ("terra-motors", "Kyoro L5", [
            ("https://trucks.cardekho.com/en/trucks/terra-motors/terra-kyoro", "terra-motors/kyoro-l5"),
            ("https://trucks.cardekho.com/en/trucks/terra-motors/terra-kyoro-l5", "terra-motors/kyoro"),
        ]),
    ]

    print("\n=== Saving Missing Dynamic Brand Images Locally ===")
    for brand_id, model, candidates in dynamic_missing:
        slug = model_to_slug(model)
        local_path = BRAND_MODEL_IMAGES_3W / brand_id / f"{slug}.jpg"

        if local_path.exists():
            print(f"  = Exists: {brand_id}/{slug}.jpg")
            continue

        print(f"\n  > {brand_id}/{slug}.jpg (model='{model}')")
        image_bytes = None

        for page_url, img_frag in candidates:
            print(f"    Checking: {page_url.split('/')[-1]} (frag={img_frag})")
            imgs = fetch_page_images(page_url)
            match = get_first_brand_image(imgs, img_frag)
            if not match and img_frag:
                # fallback: any image from this brand
                brand_prefix = img_frag.split('/')[0]
                match = get_first_brand_image(imgs, brand_prefix)
            if match:
                print(f"    Found: {match[:80]}")
                image_bytes = try_fetch_image(match)
                if image_bytes:
                    break
            time.sleep(1)

        if image_bytes:
            local_path.parent.mkdir(parents=True, exist_ok=True)
            local_path.write_bytes(image_bytes)
            print(f"    Saved locally: {local_path} ({len(image_bytes):,} bytes)")
            results["saved_locally"].append(str(local_path.relative_to(PROJECT_ROOT)))
        else:
            print(f"    No valid image found")
            results["failed"].append({
                "key": f"dynamic:{brand_id}/{slug}.jpg",
                "reason": "no image found"
            })

        time.sleep(1)

    # ── Save updated vehicle-image-urls.json ─────────────────────────────────
    with open(URLS_JSON, "w") as f:
        json.dump(urls, f, indent=2, ensure_ascii=False)
        f.write("\n")
    print(f"\nSaved updated vehicle-image-urls.json")

    # ── Summary ───────────────────────────────────────────────────────────────
    print("\n" + "=" * 60)
    print("SUMMARY")
    print("=" * 60)
    print(f"  Uploaded to Supabase: {len(results['uploaded_to_supabase'])}")
    for k in results["uploaded_to_supabase"]:
        print(f"    + {k}")
    print(f"  Saved locally:        {len(results['saved_locally'])}")
    for k in results["saved_locally"]:
        print(f"    + {k}")
    print(f"  Failed:               {len(results['failed'])}")
    for item in results["failed"]:
        print(f"    ! {item['key']}: {item['reason']}")


if __name__ == "__main__":
    main()
