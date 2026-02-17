
import urllib.request
import os
import ssl

# Final 3 Missing Brands
IMAGES = {
    "jaguar": "https://imgd.aeplcdn.com/1056x594/n/cw/ec/51446/f-pace-exterior-right-front-three-quarter-3.jpeg?q=75",
    "land-rover": "https://imgd.aeplcdn.com/1056x594/n/cw/ec/55215/defender-exterior-right-front-three-quarter-3.jpeg?q=75",
    "tesla": "https://upload.wikimedia.org/wikipedia/commons/8/82/Tesla_Model_3_at_Geneva_International_Motor_Show_2018_01.jpg"
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

print(f"Downloading final 3 images to {OUTPUT_DIR}...")

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
