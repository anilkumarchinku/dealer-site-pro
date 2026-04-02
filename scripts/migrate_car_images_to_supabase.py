#!/usr/bin/env python3
"""
migrate_car_images_to_supabase.py

Downloads all 4W car images from CardDekho CDN, uploads to Supabase Storage,
and updates car_catalog.image_url in the DB so the frontend is unchanged.

Usage:
  python3 scripts/migrate_car_images_to_supabase.py           # full run
  python3 scripts/migrate_car_images_to_supabase.py --dry-run # preview only, no uploads
  python3 scripts/migrate_car_images_to_supabase.py --skip-download # re-upload from cache
"""

import json
import os
import sys
import time
import argparse
import urllib.request
import urllib.parse
import urllib.error
from pathlib import Path
from concurrent.futures import ThreadPoolExecutor, as_completed
from urllib.parse import urlparse

# ── Config ────────────────────────────────────────────────────────────────────

SUPABASE_URL   = "https://llsvbyeumrfngjvbedbz.supabase.co"
SERVICE_KEY    = (
    os.environ.get("SUPABASE_SERVICE_ROLE_KEY") or
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imxsc3ZieWV1bXJmbmdqdmJlZGJ6Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MTMwODMxNywiZXhwIjoyMDg2ODg0MzE3fQ.NUlqttWkhTpQEcTCLQ7GPLkQvEpoW-6g4UuEPkYJnaE"
)
BUCKET         = "car-images"
DATA_DIR       = Path(__file__).parent.parent / "public" / "data"
CACHE_DIR      = Path(__file__).parent / ".img_cache"
WORKERS        = 10
MAX_RETRIES    = 3
RETRY_DELAY    = 2.0

AUTH_HEADERS = {
    "Authorization": f"Bearer {SERVICE_KEY}",
    "apikey": SERVICE_KEY,
}

# ── File → items extractor ─────────────────────────────────────────────────────

SKIP_FILES = {
    "brand-colors.json", "brand-models.json", "3w-brand-colors.json",
    "bajaj.json", "maruti_suzuki_all_models.json", "carInfo.json",
}

def _get_image_url(item: dict) -> "str | None":
    """Extract image URL from an item dict. Handles multiple formats."""
    # Standard: image_urls: [{value: url}]
    img = item.get("image_urls") or []
    if img and isinstance(img[0], dict):
        return img[0].get("value") or None
    if img and isinstance(img[0], str):
        return img[0] or None
    # Toyota-style: media.image_urls: [{value: url}]
    media = item.get("media") or {}
    img = media.get("image_urls") or []
    if img and isinstance(img[0], dict):
        return img[0].get("value") or None
    return None


def extract_items(fname, data):
    """Given a parsed JSON blob, return a flat list of variant dicts."""
    # citroen: numeric top-level keys, each is a flat dict
    top_keys = list(data.keys())
    if top_keys and all(k.isdigit() for k in top_keys):
        return list(data.values())

    # tata / toyota: top-level 'variants' key
    if "variants" in data and isinstance(data["variants"], list):
        return data["variants"]

    # audi / bmw / hyundai: 'items'
    if "items" in data and isinstance(data["items"], list):
        return data["items"]

    # byd / vinfast: 'cardekho_variants'
    if "cardekho_variants" in data and isinstance(data["cardekho_variants"], list):
        return data["cardekho_variants"]

    # bentley: 'cardekho_cars'
    if "cardekho_cars" in data and isinstance(data["cardekho_cars"], list):
        return data["cardekho_cars"]

    # maruti: 'maruti_suzuki_variants'
    if "maruti_suzuki_variants" in data and isinstance(data["maruti_suzuki_variants"], list):
        return data["maruti_suzuki_variants"]

    # Single wrapper key (lamborghini, ferrari, honda, mercedes, jaguar, …)
    if len(data) == 1:
        wrapper = list(data.values())[0]

        if isinstance(wrapper, dict):
            # mercedes-style: {0: {...}, 1: {...}, …}
            if all(str(k).isdigit() for k in wrapper.keys()):
                return list(wrapper.values())

            # has 'variants' subkey: jaguar / jeep / force / lexus
            if "variants" in wrapper and isinstance(wrapper["variants"], list):
                return wrapper["variants"]

            # has 'models' subkey
            if "models" in wrapper and isinstance(wrapper["models"], list):
                models_list = wrapper["models"]
                # honda-style: models have nested 'variants'
                if models_list and isinstance(models_list[0], dict) and "variants" in models_list[0]:
                    items = []
                    for model_entry in models_list:
                        for variant in model_entry.get("variants") or []:
                            enriched = dict(variant)
                            enriched.setdefault("model", model_entry.get("model", ""))
                            items.append(enriched)
                    return items
                # lamborghini/mini-style: models ARE the variants
                return models_list

        # direct list (ferrari, kia, mg, aston_martin, etc.)
        if isinstance(wrapper, list):
            return wrapper

    return []


def collect_all_urls():
    """
    Walk all 4W JSON files, extract every unique CDN image URL.
    Returns {cdnUrl: storagePath} where storagePath is the relative
    Supabase Storage object key (no leading slash, no bucket prefix).
    """
    url_to_path = {}

    for fpath in sorted(DATA_DIR.glob("*.json")):
        if fpath.name in SKIP_FILES:
            continue
        try:
            data = json.loads(fpath.read_text())
        except Exception as e:
            print(f"  WARN: could not parse {fpath.name}: {e}")
            continue

        items = extract_items(fpath.name, data)
        if not items:
            print(f"  WARN: no items found in {fpath.name}")
            continue

        count = 0
        for item in items:
            url = _get_image_url(item)
            if not url or "stimg.cardekho.com" not in url:
                continue
            # Strip query string (e.g. ?tr=w-300)
            clean_url = url.split("?")[0]
            if clean_url in url_to_path:
                continue

            # Build storage path from CDN URL path:
            # /images/carexteriorimages/630x420/Lamborghini/Revuelto/9770/12345/front-left-side-47.jpg
            # → Lamborghini/Revuelto/9770/12345/front-left-side-47.jpg
            parsed = urlparse(clean_url)
            path_parts = parsed.path.split("/")
            # Drop leading segments up to and including '630x420'
            try:
                idx = path_parts.index("630x420")
                rel_parts = path_parts[idx + 1:]
            except ValueError:
                # fallback: use everything after /images/
                rel_parts = path_parts[2:] if path_parts[1] == "images" else path_parts[1:]
            storage_path = "/".join(p for p in rel_parts if p)

            url_to_path[clean_url] = storage_path
            count += 1

        print(f"  {fpath.name}: {count} images")

    return url_to_path


# ── HTTP helpers ──────────────────────────────────────────────────────────────

def _http(method: str, url: str, headers: dict = {}, data: bytes = None,
          timeout: int = 30) -> tuple[int, bytes]:
    req = urllib.request.Request(url, data=data, method=method)
    for k, v in headers.items():
        req.add_header(k, v)
    try:
        with urllib.request.urlopen(req, timeout=timeout) as r:
            return r.status, r.read()
    except urllib.error.HTTPError as e:
        return e.code, e.read()
    except Exception as e:
        return 0, str(e).encode()


def download_image(cdn_url: str, dest: Path) -> bool:
    """Download cdn_url to dest file. Returns True on success."""
    if dest.exists() and dest.stat().st_size > 0:
        return True  # already cached
    dest.parent.mkdir(parents=True, exist_ok=True)
    cdn_headers = {"User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36"}
    for attempt in range(1, MAX_RETRIES + 1):
        status, body = _http("GET", cdn_url, headers=cdn_headers, timeout=20)
        if status == 200 and body:
            dest.write_bytes(body)
            return True
        if attempt < MAX_RETRIES:
            time.sleep(RETRY_DELAY)
    return False


def create_bucket() -> bool:
    """Create public Supabase Storage bucket. Idempotent."""
    url = f"{SUPABASE_URL}/storage/v1/bucket"
    payload = json.dumps({
        "id": BUCKET,
        "name": BUCKET,
        "public": True,
        "file_size_limit": 10485760,  # 10 MB
        "allowed_mime_types": ["image/jpeg", "image/png", "image/webp"],
    }).encode()
    headers = {**AUTH_HEADERS, "Content-Type": "application/json"}
    status, body = _http("POST", url, headers, payload)
    if status in (200, 201):
        print(f"  Bucket '{BUCKET}' created.")
        return True
    if status == 400 and b"already exists" in body.lower():
        print(f"  Bucket '{BUCKET}' already exists.")
        return True
    print(f"  Bucket creation failed ({status}): {body[:200]}")
    return False


def upload_image(storage_path: str, local_file: Path) -> "str | None":
    """
    Upload file to Supabase Storage. Returns public URL on success, None on failure.
    Uses upsert=true so re-runs are safe.
    """
    url = f"{SUPABASE_URL}/storage/v1/object/{BUCKET}/{storage_path}"
    # Add x-upsert header to overwrite if exists
    headers = {
        **AUTH_HEADERS,
        "Content-Type": "image/jpeg",
        "x-upsert": "true",
        "Cache-Control": "public, max-age=31536000, immutable",
    }
    data = local_file.read_bytes()
    for attempt in range(1, MAX_RETRIES + 1):
        status, body = _http("POST", url, headers, data)
        if status in (200, 201):
            return f"{SUPABASE_URL}/storage/v1/object/public/{BUCKET}/{storage_path}"
        if attempt < MAX_RETRIES:
            time.sleep(RETRY_DELAY)
    return None


def update_db(old_url: str, new_url: str) -> bool:
    """PATCH car_catalog rows where image_url = old_url."""
    encoded = urllib.parse.quote(old_url, safe="")
    url = f"{SUPABASE_URL}/rest/v1/car_catalog?image_url=eq.{encoded}"
    payload = json.dumps({"image_url": new_url}).encode()
    headers = {
        **AUTH_HEADERS,
        "Content-Type": "application/json",
        "Prefer": "return=minimal",
    }
    status, body = _http("PATCH", url, headers, payload)
    return status in (200, 204)


# ── Fetch URLs from DB ────────────────────────────────────────────────────────

def fetch_db_urls():
    """
    Query car_catalog for all unique CardDekho image_url values.
    Returns {cdnUrl: storagePath}.
    """
    all_urls = set()
    offset = 0
    batch = 1000
    while True:
        url = (f"{SUPABASE_URL}/rest/v1/car_catalog"
               f"?select=image_url"
               f"&image_url=not.is.null"
               f"&image_url=like.https%3A%2F%2Fstimg*"
               f"&limit={batch}&offset={offset}")
        status, body = _http("GET", url, headers=AUTH_HEADERS)
        if status != 200:
            print(f"  WARN: DB query failed ({status}): {body[:200]}")
            break
        rows = json.loads(body)
        if not rows:
            break
        for row in rows:
            img_url = row.get("image_url", "")
            if img_url:
                all_urls.add(img_url)
        if len(rows) < batch:
            break
        offset += batch

    url_map = {}
    for cdn_url in all_urls:
        # Strip query string
        clean_url = cdn_url.split("?")[0]
        parsed = urlparse(clean_url)
        path_parts = parsed.path.split("/")
        # Drop leading segments up to and including the size (e.g. '930x620')
        size_seg = None
        for seg in path_parts:
            if "x" in seg and seg.replace("x", "").isdigit():
                size_seg = seg
                break
        if size_seg:
            try:
                idx = path_parts.index(size_seg)
                rel_parts = path_parts[idx + 1:]
            except ValueError:
                rel_parts = path_parts[2:]
        else:
            rel_parts = path_parts[2:]
        storage_path = "/".join(p for p in rel_parts if p)
        url_map[cdn_url] = storage_path

    return url_map


# ── Main migration ────────────────────────────────────────────────────────────

def run(dry_run: bool = False, skip_download: bool = False):
    print("\n=== Dealer Site Pro — Car Image Migration ===\n")
    print(f"  Supabase: {SUPABASE_URL}")
    print(f"  Bucket:   {BUCKET}")
    print(f"  Dry run:  {dry_run}\n")

    # Step 1 — Fetch all CDN image URLs from DB
    print("Step 1: Fetching unique image URLs from car_catalog DB...")
    url_map = fetch_db_urls()
    print(f"  Total unique CDN images in DB: {len(url_map)}\n")

    if dry_run:
        print("[DRY RUN] Stopping here. Would migrate the URLs above.")
        for cdn, path in list(url_map.items())[:5]:
            print(f"  {cdn[:85]}")
            print(f"  → {SUPABASE_URL}/storage/v1/object/public/{BUCKET}/{path}\n")
        return

    # Step 2 — Create Supabase bucket
    print("Step 2: Ensuring Supabase Storage bucket exists...")
    if not create_bucket():
        print("  FATAL: Cannot create/verify bucket. Aborting.")
        sys.exit(1)
    print()

    # Step 3 — Download + upload concurrently
    print(f"Step 3: Downloading & uploading {len(url_map)} images ({WORKERS} workers)...")
    CACHE_DIR.mkdir(parents=True, exist_ok=True)

    # Load resume state
    mapping_file = CACHE_DIR / "url_mapping.json"
    completed = {}
    if mapping_file.exists():
        try:
            completed = json.loads(mapping_file.read_text())
            print(f"  Resuming: {len(completed)} already done.\n")
        except Exception:
            pass

    cdn_urls = [u for u in url_map if u not in completed]
    print(f"  Remaining: {len(cdn_urls)} images\n")

    done = 0
    failed = []

    def process(cdn_url):
        storage_path = url_map[cdn_url]
        local_path = CACHE_DIR / "imgs" / storage_path.replace("/", "_")

        if not skip_download:
            ok = download_image(cdn_url, local_path)
            if not ok:
                return cdn_url, None

        if not local_path.exists() or local_path.stat().st_size == 0:
            return cdn_url, None

        new_url = upload_image(storage_path, local_path)
        return cdn_url, new_url

    with ThreadPoolExecutor(max_workers=WORKERS) as pool:
        futures = {pool.submit(process, u): u for u in cdn_urls}
        for future in as_completed(futures):
            cdn_url, new_url = future.result()
            done += 1
            if new_url:
                completed[cdn_url] = new_url
                # Save progress every 20 completions
                if done % 20 == 0:
                    mapping_file.write_text(json.dumps(completed, indent=2))
                    print(f"  Progress: {done}/{len(cdn_urls)} | saved checkpoint")
            else:
                failed.append(cdn_url)
                print(f"  FAIL [{done}/{len(cdn_urls)}]: {cdn_url[:80]}")

    # Final save
    mapping_file.write_text(json.dumps(completed, indent=2))
    print(f"\n  Done: {len(completed)} uploaded, {len(failed)} failed")

    if failed:
        (CACHE_DIR / "failed_urls.txt").write_text("\n".join(failed))
        print(f"  Failed URLs saved to: {CACHE_DIR}/failed_urls.txt")
    print()

    # Step 4 — Update DB
    print(f"Step 4: Updating car_catalog DB ({len(completed)} rows)...")
    db_ok = 0
    db_fail = 0
    for old_url, new_url in completed.items():
        ok = update_db(old_url, new_url)
        if ok:
            db_ok += 1
        else:
            db_fail += 1
            if db_fail <= 5:
                print(f"  DB FAIL: {old_url[:80]}")

    print(f"\n  DB updated: {db_ok} ok, {db_fail} failed")
    print("\n=== Migration complete ===\n")


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Migrate car images to Supabase Storage")
    parser.add_argument("--dry-run", action="store_true", help="Preview only, no uploads")
    parser.add_argument("--skip-download", action="store_true",
                        help="Skip CDN download, re-upload from cache")
    args = parser.parse_args()
    run(dry_run=args.dry_run, skip_download=args.skip_download)
