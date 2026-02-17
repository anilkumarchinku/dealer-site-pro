
import urllib.request
import os
import ssl

# Brands to download
IMAGES = {
    "maruti-suzuki": "https://www.nexaexperience.com/adobe/assets/urn:aaid:aem:15d5ba20-d055-4b82-b8ef-985d685e9a8a/as/GV-Desktop-Banner.jpg",
    "mahindra": "https://auto.mahindra.com/on/demandware.static/-/Sites-amc-Library/default/dw76953f93/images/suv/xuv700/XUV700_Desktop.jpg",
    "hyundai": "https://www.hyundai.com/content/dam/hyundai/in/en/data/vehicle-thumbnail/Thumbnail/creta-suvpc.png",
    "honda": "https://www.hondacarindia.com/web-data/Influencer/influncer_img.png",
    "toyota": "https://www.toyotabharat.com/images/showroom/urbancruiser-hyryder/hero-banner-new.png",
    "kia": "https://www.kia.com/content/dam/kia2/in/en/our-vehicles/seltos/showroom/kia-seltos-banner-desktop.jpg",
    "renault": "https://www.renault.co.in/content/dam/Renault/India/Vehicles/kiger/hero-banner.jpg",
    "nissan": "https://www.nissan.in/content/dam/Nissan/India/Vehicles/magnite/red-magnite-banner-desktop.jpg",
    "volkswagen": "https://www.volkswagen.co.in/content/dam/vw-ngw/vw_p_in/models/virtus/banner/virtus-hero-banner-desktop.jpg"
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
        ext = url.split('.')[-1].split('?')[0]
        if len(ext) > 4: ext = "jpg" # Default to jpg if extension is weird
        filename = f"{slug}.{ext}"
        filepath = os.path.join(OUTPUT_DIR, filename)
        
        print(f"Downloading {slug} from {url}...")
        
        req = urllib.request.Request(url, headers=headers)
        with urllib.request.urlopen(req, context=ctx, timeout=20) as response:
            data = response.read()
            with open(filepath, 'wb') as f:
                f.write(data)
            print(f"✅ Saved: {filename} ({len(data)//1024} KB)")

    except Exception as e:
        print(f"❌ Failed {slug}: {e}")
