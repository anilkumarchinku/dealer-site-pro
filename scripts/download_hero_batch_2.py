
import urllib.request
import os
import ssl

# Brands to download (Batch 2: Premium & Utility)
IMAGES = {
    "tata-motors": "https://cars.tatamotors.com/images/harrier/nitro-crimson-og.jpg",
    "skoda": "https://www.skoda-auto.co.in/models/kushaq/kushaq-og-image.jpg",
    "mg": "https://www.mgmotor.co.in/content/dam/mgmotor/india/hector-plus/MG-Hector-Plus-Social-Share.jpg",
    "jeep": "https://www.jeep-india.com/content/dam/jeep-india/compass/og-image.jpg",
    "citroen": "https://www.citroen.in/content/dam/citroen/india/aircross/og-image.jpg",
    "force-motors": "https://www.forcemotors.com/wp-content/uploads/2025/02/Urbania.png",
    "isuzu": "https://www.isuzu.in/assets/images/v-cross-og.jpg"
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

print(f"Downloading {len(IMAGES)} images to {OUTPUT_DIR}...")

for slug, url in IMAGES.items():
    try:
        # Determine extension
        ext = url.split('.')[-1].split('?')[0]
        if len(ext) > 4: ext = "jpg" 
        filename = f"{slug}.{ext}"
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
