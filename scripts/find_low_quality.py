import os
import json
try:
    from PIL import Image
except ImportError:
    print("Please install Pillow")
    exit(1)

dirs = ["public/data/brand-model-images/2w", "public/data/brand-model-images/3w"]

low_quality = []
total = 0

print("Scanning images for low quality (resolution < 600x400 or size < 30KB)...")
for d in dirs:
    if not os.path.exists(d):
        continue
    for root, _, files in os.walk(d):
        for f in files:
            if f.lower().endswith(('.png', '.jpg', '.jpeg', '.webp')):
                path = os.path.join(root, f)
                total += 1
                try:
                    size_kb = os.path.getsize(path) / 1024
                    img = Image.open(path)
                    w, h = img.size
                    
                    if w < 600 or h < 400 or size_kb < 30:
                        low_quality.append({
                            "path": path.replace(os.getcwd() + '/', ''),
                            "width": w,
                            "height": h,
                            "size_kb": round(size_kb, 2)
                        })
                except Exception as e:
                    print(f"Error reading {path}: {e}")

print(f"Scanned {total} images.")
print(f"Found {len(low_quality)} low quality images.")

# Group by brand
grouped = {}
for item in low_quality:
    parts = item['path'].split('/')
    if len(parts) >= 5:
        brand = parts[4] # public/data/brand-model-images/2w/brand/...
        if brand not in grouped:
            grouped[brand] = []
        grouped[brand].append(item['path'])

with open("scripts/low_quality_images.json", "w") as f:
    json.dump(grouped, f, indent=2)

print("\nSaved low quality paths to scripts/low_quality_images.json")
if len(low_quality) > 0:
    print("\nSample low quality images:")
    for item in low_quality[:10]:
        print(f"  {item['path']} ({item['width']}x{item['height']}, {item['size_kb']}KB)")
