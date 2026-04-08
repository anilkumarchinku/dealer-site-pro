# Scrape Missing Images - DealerSite Pro

## 📊 Summary

Only **6 models** across the entire platform are missing images:
- **4W Cars:** 0 missing ✅ (100% complete)
- **2W Motorcycles:** 3 missing
- **3W Auto-Rickshaws:** 3 missing

---

## 🏍️ 2W MOTORCYCLES (3 Models)

### 1. Honda Activa 6G
- **Brand:** Honda / Honda Motorcycle & Scooter India (HMSI)
- **Category:** Scooter
- **Type:** 109cc petrol scooter
- **Popularity:** HIGHEST - Most popular scooter in India
- **Save To:** `public/data/brand-model-images/2w/honda-hmsi/activa-6g.jpg`
- **Search Keywords:**
  - "Honda Activa 6G image"
  - "Activa 6G front view"
  - "Honda Activa latest model"
- **Potential Sources:**
  - CardDekho: https://www.cardekho.com/honda/activa-6g
  - Official Honda site
  - Amazon/Flipkart product pages

### 2. Ola Electric S1 Pro
- **Brand:** Ola Electric
- **Category:** Electric Scooter
- **Type:** AI-enabled electric vehicle
- **Popularity:** HIGH - Growing EV market
- **Save To:** `public/data/brand-model-images/2w/ola-electric/s1-pro.jpg`
- **Search Keywords:**
  - "Ola S1 Pro electric scooter"
  - "Ola S1 Pro image"
  - "Ola electric scooter design"
- **Potential Sources:**
  - Ola official website
  - Tech news sites (TechCrunch India, etc)
  - YouTube thumbnails

### 3. Royal Enfield Classic 350
- **Brand:** Royal Enfield
- **Category:** Motorcycle
- **Type:** 350cc cruiser
- **Popularity:** HIGHEST - Iconic retro motorcycle
- **Save To:** `public/data/brand-model-images/2w/royal-enfield/classic-350.jpg`
- **Search Keywords:**
  - "Royal Enfield Classic 350"
  - "RE Classic 350 image"
  - "Royal Enfield 350cc"
- **Potential Sources:**
  - CardDekho
  - Royal Enfield official site
  - BikeDekho
  - Auto magazines

---

## 🚐 3W AUTO-RICKSHAWS (3 Models)

### 1. Bajaj RE Compact
- **Brand:** Bajaj Auto
- **Category:** Compact Auto-Rickshaw
- **Type:** Passenger transport
- **Popularity:** MEDIUM - Compact market segment
- **Save To:** `public/data/brand-model-images/3w/bajaj-auto-3w/re-compact.jpg`
- **Search Keywords:**
  - "Bajaj RE Compact"
  - "Bajaj auto-rickshaw compact"
  - "RE Compact 3W"
- **Potential Sources:**
  - Bajaj official auto-rickshaw pages
  - Dealer websites
  - Industry reports

### 2. Mahindra Treo Zor
- **Brand:** Mahindra
- **Category:** Auto-Rickshaw (Cargo)
- **Type:** 3W cargo vehicle
- **Popularity:** MEDIUM - Commercial segment
- **Save To:** `public/data/brand-model-images/3w/mahindra-3w/treo-zor.jpg`
- **Search Keywords:**
  - "Mahindra Treo Zor"
  - "Mahindra 3W cargo"
  - "Mahindra auto-rickshaw"
- **Potential Sources:**
  - Mahindra commercial vehicles site
  - Commercial vehicle portals
  - Dealer listings

### 3. TVS King EV
- **Brand:** TVS Motor
- **Category:** Electric Auto-Rickshaw
- **Type:** Battery-powered 3W
- **Popularity:** MEDIUM-HIGH - Growing EV segment
- **Save To:** `public/data/brand-model-images/3w/tvs-king/king-ev.jpg`
- **Search Keywords:**
  - "TVS King EV electric"
  - "TVS electric auto-rickshaw"
  - "TVS 3W EV"
- **Potential Sources:**
  - TVS official site
  - EV news sites
  - Auto portals (SIAM, etc)

---

## 📁 Directory Structure

Create these directories before scraping:

```
public/data/brand-model-images/
├── 2w/
│   └── honda-hmsi/
│       └── activa-6g.jpg
│   └── ola-electric/
│       └── s1-pro.jpg
│   └── royal-enfield/
│       └── classic-350.jpg
└── 3w/
    └── bajaj-auto-3w/
        └── re-compact.jpg
    └── mahindra-3w/
        └── treo-zor.jpg
    └── tvs-king/
        └── king-ev.jpg
```

---

## 🎯 Scraping Guidelines

### Image Quality Requirements
- **Minimum size:** 400x300px (recommended: 930x620px)
- **Format:** JPG or PNG
- **Angle:** Front/side view preferred
- **Quality:** Clear, professional product images

### File Naming
- All lowercase
- Use hyphens for spaces/special chars
- Remove brand prefix if redundant
- Examples:
  - `activa-6g.jpg` (not `honda-activa-6g.jpg`)
  - `s1-pro.jpg` (not `ola-electric-s1-pro.jpg`)

### Batch Scraping Command (Example)

```bash
# For 2W motorcycles
antigravity-scraper \
  --urls MISSING_IMAGES_2W_MOTORCYCLES.csv \
  --output public/data/brand-model-images/2w/ \
  --retry 3 \
  --threads 5

# For 3W auto-rickshaws
antigravity-scraper \
  --urls MISSING_IMAGES_3W_AUTO_RICKSHAWS.csv \
  --output public/data/brand-model-images/3w/ \
  --retry 3 \
  --threads 5
```

---

## ✅ Post-Scraping Tasks

1. **Verify files exist:**
   ```bash
   ls -la public/data/brand-model-images/2w/*/
   ls -la public/data/brand-model-images/3w/*/
   ```

2. **Update database** (if using Supabase):
   ```sql
   UPDATE tw_vehicles 
   SET images = ARRAY['file:///path/to/image.jpg']
   WHERE brand = 'Honda' AND model = 'Activa 6G';
   ```

3. **Test in UI:**
   - Navigate to each vehicle page
   - Verify images load correctly
   - Check responsive display

4. **Run build:**
   ```bash
   npm run build
   ```

5. **Deploy to production:**
   ```bash
   npm run deploy
   ```

---

## 📝 Notes

- **2W & 3W** use empty image arrays `[]` instead of image URLs
- **4W** is fully covered with CardDekho images + local files
- All 6 missing models are in active status and need images ASAP
- Honda Activa 6G & Royal Enfield Classic 350 are high-priority due to popularity

---

## 🔗 Files Created

- `MISSING_IMAGES_MODELS.txt` - Summary list
- `MISSING_IMAGES_2W_MOTORCYCLES.csv` - 2W details
- `MISSING_IMAGES_3W_AUTO_RICKSHAWS.csv` - 3W details
- `SCRAPE_MISSING_IMAGES_GUIDE.md` - This file

**Ready to scrape!** 🚀
