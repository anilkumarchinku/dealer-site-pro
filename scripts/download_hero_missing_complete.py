
import urllib.request
import os
import ssl

# Final Missing Batch: 9 Brands
IMAGES = {
    "tata-motors": "https://imgd.aeplcdn.com/1056x594/n/vokh5ua_1559983.jpg?q=75&wm=1",
    "skoda": "https://imgd.aeplcdn.com/642x336/n/cw/ec/208352/kushaq-exterior-right-front-three-quarter.jpeg?isig=0&art=1&q=80",
    "mg": "https://imgd.aeplcdn.com/0x0/n/cw/ec/45184/hector-plus-exterior-right-front-three-quarter-5.jpeg",
    "isuzu": "https://imgd.aeplcdn.com/0X0/cw/ec/26183/Isuzu-DMax-VCross-Exterior11-85238.jpg?v=201711021421&wm=1&q=85",
    "bmw": "https://imgd.aeplcdn.com/1056x594/n/cw/ec/139177/3-series-gran-limousine-exterior-left-side-view-3.png?isig=0&q=75&wm=1",
    "jaguar": "https://www.hdcarwallpapers.com/download/jaguar_f_pace_r_dynamic_2020_4k-3840x2160.jpg",
    "land-rover": "https://coolwallpapers.me/picsup/2622497-land-rover-defender-110-4k-wallpaper-download.jpg",
    "lamborghini": "https://imgd.aeplcdn.com/642x336/n/cw/ec/146547/urus-s-exterior-right-front-three-quarter-6.jpeg?isig=0&q=80&q=80",
    "tesla": "https://upload.wikimedia.org/wikipedia/commons/9/91/Tesla_Model_3_at_Geneva_Motor_Show_2019_IMG_0586.jpg"
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
