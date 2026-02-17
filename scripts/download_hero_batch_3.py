
import urllib.request
import os
import ssl

# Brands to download (Batch 3: Luxury)
IMAGES = {
    "mercedes-benz": "https://www.mercedes-benz.co.in/content/india/en/passengercars/models/suv/glc/overview/_jcr_content/root/responsivegrid/stage_1489025170/image.inheritance.nosvg.1691478235227.jpg/mercedes-benz-glc-v254-suv-1280x720-01-2023.jpg",
    "bmw": "https://www.bmw.in/content/dam/bmw/marketIN/bmw_in/all-models/3-series/gl/2023/highlights/bmw-3-series-gran-limousine-highlights-desktop.jpg",
    "audi": "https://www.audi.in/content/dam/nemo/in/models/q5/q5/my-2021/1920x1080-images/1920x1080_audio_q5_2021_exterior.jpg",
    "jaguar": "https://www.jaguar.in/content/dam/jaguar/india/vehicles/f-pace/f-pace-overview-hero-desktop.jpg",
    "land-rover": "https://www.landrover.in/content/dam/landrover/india/vehicles/defender/24my/land-rover-defender-110-vanguard-hero-desktop-1600x900.jpg",
    "volvo": "https://www.volvocars.com/images/v/-/media/project/common/shared-assets/images/models/xc60-hybrid/xc60-hybrid-hero-16x9.jpg",
    "lexus": "https://www.lexusindia.co.in/content/dam/lexus-india/models/es/hero-desktop.jpg",
    "porsche": "https://files.porsche.com/filestore/image/multimedia/none/official-website/porsche-og-image.jpg",
    "bentley": "https://www.bentleymotors.com/content/dam/bentley/master/models/continental/continental-gt-v8-hero-desktop.jpg",
    "lamborghini": "https://www.lamborghini.com/sites/it-en/files/DAM/lamborghini/facelift_2022/urus/urus_s/models_og.jpg"
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
