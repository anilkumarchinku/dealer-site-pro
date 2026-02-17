
import urllib.request
import os
import ssl

# Final Batch: Batch 3 Failures + Batch 4 (EVs)
IMAGES = {
    "land-rover": "https://coolwallpapers.me/picsup/2622497-land-rover-defender-110-4k-wallpaper-download.jpg",
    "volvo": "https://inv.assets.sincrod.com/ChromeColorMatch/us/WHITE_cc_2024VOS020003_02_1280_707.jpg",
    "lexus": "https://stat.overdrive.in/wp-content/odgallery/2021/10/61154_2021_Lexus_ES-300h_2.jpg",
    "porsche": "https://pictures.porsche.com/rtt/iris?COSY-EU-100-1711coMvsi60AAt5FwcmBEgA4qP8iBUDxPE3Cb9pNXkBuNYdMGF4tl3U0%25z8rMHIspbWvanYb%255y%25oq%25vSTmjMXD4qAZeoNBPUSfUx4RmHlCgI7ZB4x7e2HtpQDcFG8bOYnfurntT5yPewyHtCvNzxvJbGXoq1sSOJUPYwgtTB8VuyY0oVk0DB3TGpupQNqjdtAsvyJ5V",
    "bentley": "https://cdn.motor1.com/images/mgl/gYgQ7/s1/2021-bentley-continental-gt-speed-exterior.jpg",
    "lamborghini": "https://images8.alphacoders.com/127/thumb-1920-1276317.jpg",
    "byd": "https://www.carexplore.com.au/content/images/2025/02/2025-BYD-Atto-3-3.webp",
    "tesla": "https://cdn.jdpower.com/JDP_2024%20Tesla%20Model%203%20White%20Side%20Profile%20View%20Plugged%20in%20and%20Charging.jpg",
    "ola": "https://www.scooters4sale.in/pictures/default/ola-s1-pro-gen-2/ola-s1-pro-gen-2-640.jpg",
    "ather": "https://images.carandbike.com/cms/articles/2024/4/3205535/Ather_Rizta_m1_4e563e0e2a.jpg"
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
