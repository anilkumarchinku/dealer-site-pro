
import urllib.request
import os
import ssl

# Final 2 Missing Brands (Wikipedia Sources)
IMAGES = {
    "jaguar": "https://upload.wikimedia.org/wikipedia/commons/1/1f/Jaguar_F-Pace_AWD_20d_registered_March_2019_1999cc_01_%28cropped%29.jpg",
    "tesla": "https://upload.wikimedia.org/wikipedia/commons/9/91/2019_Tesla_Model_3_Performance_AWD_Front.jpg"
}

OUTPUT_DIR = "public/assets/hero"
os.makedirs(OUTPUT_DIR, exist_ok=True)

# Bypass SSL context
ctx = ssl.create_default_context()
ctx.check_hostname = False
ctx.verify_mode = ssl.CERT_NONE

headers = {
    'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
}

print(f"Downloading final 2 images to {OUTPUT_DIR}...")

for slug, url in IMAGES.items():
    try:
        # Robust extension detection
        filename = f"{slug}.jpg" # Default
        
        # Check if URL ends with common extensions
        lower_url = url.lower().split('?')[0]
        if lower_url.endswith('.png'):
            filename = f"{slug}.png"
        elif lower_url.endswith('.webp'):
            filename = f"{slug}.webp"
        elif lower_url.endswith('.jpeg'):
            filename = f"{slug}.jpg"
            
        filepath = os.path.join(OUTPUT_DIR, filename)
        
        print(f"Downloading {slug} from {url}...")
        
        req = urllib.request.Request(url, headers=headers)
        with urllib.request.urlopen(req, context=ctx, timeout=30) as response:
            data = response.read()
            with open(filepath, 'wb') as f:
                f.write(data)
            print(f"✅ Saved: {filename} ({len(data)//1024} KB)")

    except Exception as e:
        print(f"❌ Failed {slug}: {e}")
