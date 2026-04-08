# ANTIGRAVITY SCRAPING TASK - DealerSite Pro

## 📋 Task Overview

**Project:** DealerSite Pro - Image Scraping  
**Total Images:** 255 (4W car images from CardDekho CDN)  
**Status:** Ready for Antigravity  
**Priority:** HIGH  
**Created:** 2026-04-07  

---

## 📁 Available Task Formats

Choose the format that works best with your Antigravity setup:

### 1. **ANTIGRAVITY_SCRAPE_TASK.txt** (Plain Text - Recommended)
- Simple line-by-line URL list with instructions
- Easy to parse and debug
- Includes directory structure guide
- **Use this for:** Simple wget/curl based scrapers

### 2. **ANTIGRAVITY_SCRAPE_TASK.csv** (CSV Format)
- Structured data with metadata
- Columns: URL, BRAND, MODEL, FILENAME, OUTPUT_PATH, SOURCE, PRIORITY
- **Use this for:** Database-driven or batch scrapers

### 3. **cardekho_external_urls.txt** (Plain URLs)
- Just the 255 URLs, one per line
- No metadata or instructions
- **Use this for:** Direct feed to scraping tools

---

## 🎯 Task Details

### What to Scrape
- **Source:** CardDekho CDN (stimg.cardekho.com)
- **Total URLs:** 255 car images
- **Image Type:** 4W passenger cars (930x620 px mostly)
- **Brands:** 31 car brands (Aston Martin, Audi, BMW, Mercedes-Benz, etc.)

### Where to Save
```
public/data/brand-model-images/4w/
├── aston-martin/
│   ├── db12.jpg
│   ├── dbx.jpg
│   └── vantage.jpg
├── audi/
│   ├── a4.jpg
│   ├── a6.jpg
│   └── ...
├── bmw/
├── mercedes-benz/
└── ... (more brands)
```

### Naming Convention
- Brand: lowercase, hyphenated (e.g., `aston-martin`, `mercedes-benz`)
- Model: lowercase, hyphenated (e.g., `db12`, `amg-c-63`)
- Extension: `.jpg` (primary) or `.png` (fallback)

---

## ⚙️ Recommended Settings

```
Concurrent Downloads: 10 threads max
Delay Between Requests: 1-2 seconds
Timeout: 30 seconds per image
Retry Failed: 3 attempts
User-Agent: Mozilla/5.0 (compatible)
```

---

## 📊 Brands Included (255 images)

| Brand | Count | Status |
|---|---|---|
| Mercedes-Benz | 26 | ✅ |
| Tata | 20 | ✅ |
| BMW | 21 | ✅ |
| Maruti Suzuki | 20 | ✅ |
| Mahindra | 18 | ✅ |
| Toyota | 14 | ✅ |
| Hyundai | 16 | ✅ |
| Audi | 14 | ✅ |
| ... | ... | ✅ |

---

## ✅ Post-Scraping Checklist

After Antigravity completes:

1. ✓ Verify all files downloaded successfully
2. ✓ Check file sizes are reasonable (min 50KB)
3. ✓ Verify directory structure matches the guide
4. ✓ Test a few images load correctly
5. ✓ Report any failed URLs to: `ANTIGRAVITY_FAILED_URLS.txt`
6. ✓ Update `vehicle-image-urls.json` with new local paths
7. ✓ Run build/deploy to verify images load in production

---

## 🔄 Integration

Once images are downloaded, update the image URL mapping:

**File:** `public/data/vehicle-image-urls.json`

Replace:
```json
"4w/aston-martin/db12.jpg": "https://stimg.cardekho.com/..."
```

With:
```json
"4w/aston-martin/db12.jpg": "/data/brand-model-images/4w/aston-martin/db12.jpg"
```

---

## 📞 Contact

- **Project:** DealerSite Pro
- **Task Owner:** Claude Code
- **Repo:** https://github.com/anilkumarchinku/dealer-site-pro

---

## 📝 Notes

- Total file size: ~15-20 MB (estimated)
- Scraping time: ~10-15 minutes (at 10 concurrent threads)
- All images are from CardDekho CDN (publicly available)
- No authentication required

**Ready to scrape!** 🚀
