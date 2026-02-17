
import urllib.request
import re
import json
import ssl

# Bypass SSL verification for scraping (simple approach)
ctx = ssl.create_default_context()
ctx.check_hostname = False
ctx.verify_mode = ssl.CERT_NONE

TARGETS = [
    ("Mahindra", "https://auto.mahindra.com/suv/xuv700"),
    ("Hyundai", "https://www.hyundai.com/in/en/find-a-car/creta"),
    ("Renault", "https://www.renault.co.in/cars/kiger.html"),
    ("Nissan", "https://www.nissan.in/vehicles/new/magnite.html"),
    ("Volkswagen", "https://www.volkswagen.co.in/en/models/virtus.html")
]

results = {}

headers = {
    'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
}

print("Testing OG Image Scraping (Standard Libs)...")

for brand, url in TARGETS:
    try:
        print(f"Fetching {brand}...")
        req = urllib.request.Request(url, headers=headers)
        with urllib.request.urlopen(req, context=ctx, timeout=10) as response:
            html = response.read().decode('utf-8', errors='ignore')
            
            # Regex for og:image
            # <meta property="og:image" content="URL" />
            og_match = re.search(r'<meta\s+property=["\']og:image["\']\s+content=["\']([^"\']+)["\']', html, re.IGNORECASE)
            
            if og_match:
                img_url = og_match.group(1)
                print(f"✅ Found {brand}: {img_url}")
                results[brand] = img_url
            else:
                # Try twitter:image
                tw_match = re.search(r'<meta\s+name=["\']twitter:image["\']\s+content=["\']([^"\']+)["\']', html, re.IGNORECASE)
                if tw_match:
                    print(f"✅ Found {brand} (Twitter): {tw_match.group(1)}")
                    results[brand] = tw_match.group(1)
                else:
                    print(f"❌ No og:image found for {brand}")

    except Exception as e:
        print(f"❌ Error fetching {brand}: {e}")

print("\n--- Results ---")
print(json.dumps(results, indent=2))
