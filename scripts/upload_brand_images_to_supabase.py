#!/usr/bin/env python3
"""
upload_brand_images_to_supabase.py

Step 1: Uploads all existing brand-model images from
        public/data/brand-model-images/{2w,3w,4w}/ to
        Supabase Storage bucket 'brand-model-images'.

Run: python3 scripts/upload_brand_images_to_supabase.py
     python3 scripts/upload_brand_images_to_supabase.py --dry-run
     python3 scripts/upload_brand_images_to_supabase.py --cat 4w
"""

import os, sys, time, json, argparse
import urllib.request, urllib.error
from pathlib import Path
from concurrent.futures import ThreadPoolExecutor, as_completed

SUPABASE_URL = "https://llsvbyeumrfngjvbedbz.supabase.co"
SERVICE_KEY  = (
    os.environ.get("SUPABASE_SERVICE_ROLE_KEY") or
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imxsc3ZieWV1bXJmbmdqdmJlZGJ6Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MTMwODMxNywiZXhwIjoyMDg2ODg0MzE3fQ.NUlqttWkhTpQEcTCLQ7GPLkQvEpoW-6g4UuEPkYJnaE"
)
BUCKET   = "brand-model-images"
BASE_DIR = Path(__file__).parent.parent / "public" / "data" / "brand-model-images"
WORKERS  = 15
CHECKPOINT = Path(__file__).parent / ".bmi_upload_done.json"

AUTH = {"Authorization": f"Bearer {SERVICE_KEY}", "apikey": SERVICE_KEY}


def http_post(url, data, headers):
    req = urllib.request.Request(url, data=data, method="POST", headers=headers)
    try:
        with urllib.request.urlopen(req, timeout=30) as r:
            return r.status, r.read()
    except urllib.error.HTTPError as e:
        return e.code, e.read()
    except Exception as ex:
        return 0, str(ex).encode()


def upload(storage_path: str, local_file: Path, mime: str) -> bool:
    url = f"{SUPABASE_URL}/storage/v1/object/{BUCKET}/{storage_path}"
    headers = {**AUTH, "Content-Type": mime, "x-upsert": "true",
               "Cache-Control": "public, max-age=31536000, immutable"}
    data = local_file.read_bytes()
    for attempt in range(3):
        status, body = http_post(url, data, headers)
        if status in (200, 201):
            return True
        if status == 400 and b"already" in body.lower():
            return True  # already exists
        if attempt < 2:
            time.sleep(1.5)
    return False


def public_url(storage_path: str) -> str:
    return f"{SUPABASE_URL}/storage/v1/object/public/{BUCKET}/{storage_path}"


def collect_files(cat_filter=None):
    """Collect all image files → (local_path, storage_path)."""
    files = []
    cats = [cat_filter] if cat_filter else ["2w", "3w", "4w"]
    for cat in cats:
        cat_dir = BASE_DIR / cat
        if not cat_dir.exists():
            continue
        for fpath in sorted(cat_dir.rglob("*")):
            if fpath.suffix.lower() not in (".jpg", ".jpeg", ".png"):
                continue
            # storage_path = "2w/honda/activa.jpg"
            rel = fpath.relative_to(BASE_DIR)
            storage_path = str(rel).replace("\\", "/")
            files.append((fpath, storage_path))
    return files


def run(dry_run=False, cat_filter=None):
    print(f"\n=== Brand-Model Images → Supabase Storage ===")
    print(f"  Bucket: {BUCKET}")
    print(f"  Dry run: {dry_run}\n")

    files = collect_files(cat_filter)
    print(f"  Found {len(files)} image files to upload")

    # Load checkpoint
    done: set = set()
    if CHECKPOINT.exists():
        done = set(json.loads(CHECKPOINT.read_text()))
        print(f"  Resuming: {len(done)} already uploaded\n")

    pending = [(lp, sp) for lp, sp in files if sp not in done]
    print(f"  Pending: {len(pending)}\n")

    if dry_run:
        for lp, sp in pending[:10]:
            print(f"  {sp}  →  {public_url(sp)}")
        print(f"  ... and {max(0, len(pending)-10)} more")
        return

    ok = 0; failed = []; total = len(pending)

    def process(item):
        lp, sp = item
        mime = "image/png" if sp.endswith(".png") else "image/jpeg"
        return sp, upload(sp, lp, mime)

    with ThreadPoolExecutor(max_workers=WORKERS) as pool:
        futures = {pool.submit(process, item): item for item in pending}
        for i, future in enumerate(as_completed(futures), 1):
            sp, success = future.result()
            if success:
                ok += 1
                done.add(sp)
            else:
                failed.append(sp)
                if len(failed) <= 5:
                    print(f"  FAIL: {sp}")
            if i % 50 == 0 or i == total:
                CHECKPOINT.write_text(json.dumps(list(done)))
                pct = round(i / total * 100)
                print(f"  [{pct}%] {i}/{total} — ✓{ok} ✗{len(failed)}")

    CHECKPOINT.write_text(json.dumps(list(done)))
    print(f"\n  Uploaded: {ok}")
    print(f"  Failed:   {len(failed)}")
    if failed:
        Path(CHECKPOINT.parent / "bmi_failed.txt").write_text("\n".join(failed))

    print(f"\n  Base URL: {SUPABASE_URL}/storage/v1/object/public/{BUCKET}/")
    print("  Example:  .../2w/honda/activa.jpg")
    print("\n=== Done ===\n")


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--dry-run", action="store_true")
    parser.add_argument("--cat", choices=["2w", "3w", "4w"])
    args = parser.parse_args()
    run(dry_run=args.dry_run, cat_filter=args.cat)
