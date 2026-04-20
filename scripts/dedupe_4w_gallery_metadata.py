#!/usr/bin/env python3

import hashlib
import json
from pathlib import Path

from PIL import Image


ROOT = Path("/Users/anilkumarkolukulapalli/projects/cyepro/dealersite pro/dealer-site-pro")
GALLERY_ROOT = ROOT / "public" / "data" / "brand-model-images" / "4w-galleries"
REPORT_JSON = ROOT / "docs" / "4w-gallery-dedupe-report.json"
REPORT_MD = ROOT / "docs" / "4w-gallery-dedupe-report.md"


def average_hash(file_path: Path, hash_size: int = 16) -> str:
    with Image.open(file_path) as image:
        grayscale = image.convert("L").resize((hash_size, hash_size))
        pixels = list(grayscale.getdata())
    avg = sum(pixels) / len(pixels)
    bits = "".join("1" if pixel >= avg else "0" for pixel in pixels)
    return f"{int(bits, 2):0{hash_size * hash_size // 4}x}"


def sha256(file_path: Path) -> str:
    digest = hashlib.sha256()
    with file_path.open("rb") as handle:
        while True:
            chunk = handle.read(1024 * 1024)
            if not chunk:
                break
            digest.update(chunk)
    return digest.hexdigest()


def load_image_signature(public_path: str):
    relative_path = public_path.lstrip("/")
    file_path = ROOT / "public" / relative_path.replace("data/", "data/", 1)
    if not file_path.exists():
        return None
    return {
        "path": public_path,
        "sha256": sha256(file_path),
        "ahash": average_hash(file_path),
    }


def dedupe_paths(paths):
    kept = []
    removed = []
    seen_sha = {}

    for public_path in paths:
        signature = load_image_signature(public_path)
        if signature is None:
            kept.append(public_path)
            continue

        same_sha = seen_sha.get(signature["sha256"])
        if same_sha:
            removed.append(
                {
                    "path": public_path,
                    "duplicate_of": same_sha,
                    "reason": "same_sha256",
                }
            )
            continue

        kept.append(public_path)
        seen_sha[signature["sha256"]] = public_path

    return kept, removed


def dedupe_colors(color_names, color_images):
    kept_names = []
    kept_images = []
    removed = []
    seen_sha = {}

    for index, public_path in enumerate(color_images):
        signature = load_image_signature(public_path)
        color_name = color_names[index] if index < len(color_names) else ""
        if signature is None:
            kept_images.append(public_path)
            kept_names.append(color_name)
            continue

        same_sha = seen_sha.get(signature["sha256"])
        if same_sha:
            removed.append(
                {
                    "name": color_name,
                    "path": public_path,
                    "duplicate_of": same_sha,
                    "reason": "same_sha256",
                }
            )
            continue

        kept_images.append(public_path)
        kept_names.append(color_name)
        seen_sha[signature["sha256"]] = public_path

    return kept_names, kept_images, removed


def main():
    report = []
    changed_count = 0

    for metadata_path in sorted(GALLERY_ROOT.glob("**/metadata.json")):
        with metadata_path.open("r", encoding="utf-8") as handle:
            metadata = json.load(handle)

        original = {
            "exterior": list(metadata.get("exterior", [])),
            "interior": list(metadata.get("interior", [])),
            "feature": list(metadata.get("feature", [])),
            "colorNames": list(metadata.get("colorNames", [])),
            "colorImages": list(metadata.get("colorImages", [])),
        }

        exterior, exterior_removed = dedupe_paths(original["exterior"])
        interior, interior_removed = dedupe_paths(original["interior"])
        feature, feature_removed = dedupe_paths(original["feature"])
        color_names, color_images, color_removed = dedupe_colors(
            original["colorNames"], original["colorImages"]
        )

        changed = (
            exterior != original["exterior"]
            or interior != original["interior"]
            or feature != original["feature"]
            or color_names != original["colorNames"]
            or color_images != original["colorImages"]
        )

        if not changed:
            continue

        metadata["exterior"] = exterior
        metadata["interior"] = interior
        metadata["feature"] = feature
        metadata["colorNames"] = color_names
        metadata["colorImages"] = color_images
        metadata["hero"] = exterior[0] if exterior else (feature[0] if feature else (color_images[0] if color_images else None))
        metadata["counts"] = {
            "exterior": len(exterior),
            "interior": len(interior),
            "feature": len(feature),
            "colors": len(color_images),
            "total": len(exterior) + len(interior) + len(feature) + len(color_images),
        }

        with metadata_path.open("w", encoding="utf-8") as handle:
            json.dump(metadata, handle, indent=2)
            handle.write("\n")

        changed_count += 1
        report.append(
            {
                "metadata": str(metadata_path.relative_to(ROOT)),
                "make": metadata.get("make", ""),
                "model": metadata.get("model", ""),
                "removed": {
                    "exterior": exterior_removed,
                    "interior": interior_removed,
                    "feature": feature_removed,
                    "colors": color_removed,
                },
                "counts": metadata["counts"],
            }
        )

    with REPORT_JSON.open("w", encoding="utf-8") as handle:
        json.dump(report, handle, indent=2)
        handle.write("\n")

    lines = [
        "# 4W Gallery Dedupe Report",
        "",
        f"- Models updated: {changed_count}",
        "",
    ]

    for item in report:
        lines.append(f"## {item['make']} {item['model']}")
        lines.append("")
        lines.append(f"- Metadata: `{item['metadata']}`")
        lines.append(
            f"- New counts: exterior {item['counts']['exterior']}, interior {item['counts']['interior']}, feature {item['counts']['feature']}, colors {item['counts']['colors']}, total {item['counts']['total']}"
        )
        lines.append("")
        for category in ("exterior", "interior", "feature", "colors"):
            removed = item["removed"][category]
            if not removed:
                continue
            lines.append(f"### Removed {category}")
            lines.append("")
            for entry in removed:
                lines.append(
                    f"- `{entry['path']}` -> duplicate of `{entry['duplicate_of']}` ({entry['reason']})"
                )
            lines.append("")

    REPORT_MD.write_text("\n".join(lines), encoding="utf-8")
    print(json.dumps({"models_updated": changed_count, "report_json": str(REPORT_JSON.relative_to(ROOT)), "report_md": str(REPORT_MD.relative_to(ROOT))}, indent=2))


if __name__ == "__main__":
    main()
