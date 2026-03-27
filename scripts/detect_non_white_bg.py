"""
detect_non_white_bg.py
Scans all car images and detects which ones do NOT have a white/light background.
Checks corner and edge pixels — if they're not close to white, the image is flagged.

Run: python3 scripts/detect_non_white_bg.py
Run single category: python3 scripts/detect_non_white_bg.py 4w
"""

import os
import sys
import json
from pathlib import Path
from PIL import Image

PROJECT_ROOT = Path(__file__).parent.parent

# Image directories to scan
DIRS = {
    "4w": PROJECT_ROOT / "public" / "assets" / "cars",
    "4w-new": PROJECT_ROOT / "public" / "data" / "brand-model-images" / "4w",
    "2w": PROJECT_ROOT / "public" / "data" / "brand-model-images" / "2w",
    "3w": PROJECT_ROOT / "public" / "data" / "brand-model-images" / "3w",
}

# White threshold — RGB values above this are considered "white-ish"
WHITE_THRESHOLD = 220  # Each channel must be >= 220
DARK_THRESHOLD = 180   # Below this is definitely non-white

def get_corner_pixels(img, sample_size=15):
    """Sample pixels from all 4 corners and edges of the image."""
    w, h = img.size
    pixels = []

    # Ensure RGB mode
    if img.mode != "RGB":
        img = img.convert("RGB")

    # Sample from corners (top-left, top-right, bottom-left, bottom-right)
    for x_start, y_start in [(0, 0), (w - sample_size, 0), (0, h - sample_size), (w - sample_size, h - sample_size)]:
        for dx in range(min(sample_size, w)):
            for dy in range(min(sample_size, h)):
                x = max(0, min(x_start + dx, w - 1))
                y = max(0, min(y_start + dy, h - 1))
                pixels.append(img.getpixel((x, y)))

    # Sample from edge midpoints (top-center, bottom-center, left-center, right-center)
    mid_x, mid_y = w // 2, h // 2
    for x, y in [(mid_x, 0), (mid_x, h - 1), (0, mid_y), (w - 1, mid_y)]:
        for offset in range(-sample_size, sample_size):
            px = max(0, min(x + offset, w - 1))
            py = max(0, min(y + offset, h - 1))
            pixels.append(img.getpixel((px, py)))

    return pixels


def is_white_background(img_path):
    """Check if image has a white/light background by analyzing corner and edge pixels."""
    try:
        img = Image.open(img_path)
        if img.size[0] < 10 or img.size[1] < 10:
            return False, "too_small", (0, 0, 0)

        pixels = get_corner_pixels(img)

        if not pixels:
            return False, "no_pixels", (0, 0, 0)

        # Calculate average RGB of sampled pixels
        avg_r = sum(p[0] for p in pixels) / len(pixels)
        avg_g = sum(p[1] for p in pixels) / len(pixels)
        avg_b = sum(p[2] for p in pixels) / len(pixels)

        # Check if average is white-ish (all channels above threshold)
        is_white = avg_r >= WHITE_THRESHOLD and avg_g >= WHITE_THRESHOLD and avg_b >= WHITE_THRESHOLD

        # Also check what percentage of pixels are white-ish
        white_count = sum(1 for p in pixels if p[0] >= WHITE_THRESHOLD and p[1] >= WHITE_THRESHOLD and p[2] >= WHITE_THRESHOLD)
        white_pct = white_count / len(pixels) * 100

        # Light gray backgrounds (like studio shots) are also acceptable
        is_light = avg_r >= 200 and avg_g >= 200 and avg_b >= 200 and white_pct >= 40

        if is_white or is_light:
            return True, "white", (avg_r, avg_g, avg_b)
        else:
            return False, f"non-white (avg RGB: {avg_r:.0f},{avg_g:.0f},{avg_b:.0f}, {white_pct:.0f}% white pixels)", (avg_r, avg_g, avg_b)

    except Exception as e:
        return False, f"error: {str(e)}", (0, 0, 0)


def scan_directory(dir_path, category):
    """Scan a directory for non-white background images."""
    results = []

    if not dir_path.exists():
        return results

    for brand_dir in sorted(dir_path.iterdir()):
        if not brand_dir.is_dir():
            continue

        brand = brand_dir.name
        for img_file in sorted(brand_dir.iterdir()):
            if img_file.suffix.lower() not in ('.jpg', '.jpeg', '.png'):
                continue

            is_white, reason, avg_rgb = is_white_background(img_file)

            if not is_white and "error" not in reason:
                results.append({
                    "category": category,
                    "brand": brand,
                    "file": img_file.name,
                    "slug": img_file.stem,
                    "path": str(img_file),
                    "reason": reason,
                    "avg_rgb": list(avg_rgb),
                })

    return results


def main():
    filter_cat = sys.argv[1] if len(sys.argv) > 1 else None

    print("=" * 60)
    print("  Non-White Background Image Detector")
    print("=" * 60)

    all_flagged = []
    total_scanned = 0

    for cat, dir_path in DIRS.items():
        if filter_cat and filter_cat not in cat:
            continue

        if not dir_path.exists():
            print(f"\n⚠ {cat}: Directory not found")
            continue

        # Count total images
        img_count = sum(1 for _ in dir_path.rglob("*.jpg")) + sum(1 for _ in dir_path.rglob("*.png"))
        print(f"\n📂 Scanning {cat} ({img_count} images)...")
        total_scanned += img_count

        flagged = scan_directory(dir_path, cat)
        all_flagged.extend(flagged)

        if flagged:
            # Group by brand
            brands = {}
            for item in flagged:
                brands.setdefault(item["brand"], []).append(item)

            for brand, items in sorted(brands.items()):
                print(f"\n  📦 {brand} ({len(items)} non-white)")
                for item in items:
                    print(f"     ❌ {item['file']} — {item['reason']}")
        else:
            print(f"  ✅ All images have white backgrounds")

    print(f"\n{'=' * 60}")
    print(f"  Total scanned: {total_scanned}")
    print(f"  Non-white background: {len(all_flagged)}")
    print(f"{'=' * 60}")

    # Save results for the scraper
    # Deduplicate — if same brand+slug appears in both 4w and 4w-new, keep only 4w
    seen = set()
    deduped = []
    for item in all_flagged:
        key = f"{item['brand']}/{item['slug']}"
        if key not in seen:
            seen.add(key)
            deduped.append(item)

    output_file = Path(__file__).parent / "non_white_bg_images.json"
    with open(output_file, "w") as f:
        json.dump(deduped, f, indent=2)

    print(f"\n  Results saved to: scripts/non_white_bg_images.json")
    print(f"  Unique images to re-scrape: {len(deduped)}")


if __name__ == "__main__":
    main()
