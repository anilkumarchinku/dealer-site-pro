const https = require('https');
const http = require('http');
const fs = require('fs');
const path = require('path');

// All scraped image URLs from https://trucks.cardekho.com/
const images = [
  // Spotlight / News Articles
  {
    url: 'https://truckcdn.cardekho.com/news/33121762770281.jpg',
    name: 'eicher-pro-x-diesel-truck-launched.jpg',
    section: 'spotlight'
  },
  {
    url: 'https://truckcdn.cardekho.com/news/33001762260268.jpg',
    name: 'top-5-fruits-vegetables-trucks.jpg',
    section: 'spotlight'
  },
  {
    url: 'https://truckcdn.cardekho.com/news/24971728986352.jpg',
    name: 'secure-load-101.jpg',
    section: 'spotlight'
  },

  // Electric Vehicles
  {
    url: 'https://truckcdn.cardekho.com/in/mahindra/udo/mahindra-udo-32200.jpg',
    name: 'mahindra-udo.jpg',
    section: 'electric-vehicles'
  },
  {
    url: 'https://truckcdn.cardekho.com/in/bajaj/wego-p-9018/bajaj-wego-p-9018.jpg',
    name: 'bajaj-wego-p9018.jpg',
    section: 'electric-vehicles'
  },
  {
    url: 'https://truckcdn.cardekho.com/in/bajaj/gogo-p-5012/bajaj-gogo-p-5012.jpg',
    name: 'bajaj-gogo-p5012.jpg',
    section: 'electric-vehicles'
  },
  {
    url: 'https://truckcdn.cardekho.com/in/montra/super-auto/montra-super-auto-16198.jpg',
    name: 'montra-electric-super-auto.jpg',
    section: 'electric-vehicles'
  },

  // Popular Models
  {
    url: 'https://truckcdn.cardekho.com/in/tata/ace-gold/tata-ace-gold-87579.jpg',
    name: 'tata-ace-gold.jpg',
    section: 'popular-models'
  },
  {
    url: 'https://truckcdn.cardekho.com/in/maruti-suzuki/super-carry/maruti-suzuki-super-carry-88671.jpg',
    name: 'maruti-suzuki-super-carry.jpg',
    section: 'popular-models'
  },
  {
    url: 'https://truckcdn.cardekho.com/in/mahindra/jeeto/mahindra-jeeto-65562.jpg',
    name: 'mahindra-jeeto.jpg',
    section: 'popular-models'
  },
  {
    url: 'https://truckcdn.cardekho.com/in/tata/intra-v30-bs6/tata-intra-v30-bs6-67228.jpg',
    name: 'tata-intra-v30-bs6.jpg',
    section: 'popular-models'
  },

  // Vehicle Segments
  {
    url: 'https://truckcdn.cardekho.com/pwa/img/3-wheeler.jpg',
    name: '3-wheeler-vehicles.jpg',
    section: 'segments'
  },
  {
    url: 'https://truckcdn.cardekho.com/pwa/img/ev.jpg',
    name: 'electric-commercial-vehicles.jpg',
    section: 'segments'
  },
  {
    url: 'https://truckcdn.cardekho.com/pwa/img/Euler-turbo-ev-1000.jpg',
    name: 'scv-vehicles.jpg',
    section: 'segments'
  },

  // Brand Logos
  {
    url: 'https://truckcdn.cardekho.com/pwa/img/brandLogo_168x84/tata.jpg',
    name: 'logo-tata.jpg',
    section: 'brand-logos'
  },
  {
    url: 'https://truckcdn.cardekho.com/pwa/img/brandLogo_168x84/mahindra.jpg',
    name: 'logo-mahindra.jpg',
    section: 'brand-logos'
  },
  {
    url: 'https://truckcdn.cardekho.com/pwa/img/brandLogo_168x84/euler.jpg',
    name: 'logo-euler.jpg',
    section: 'brand-logos'
  },
  {
    url: 'https://truckcdn.cardekho.com/pwa/img/brandLogo_168x84/bajaj.jpg',
    name: 'logo-bajaj.jpg',
    section: 'brand-logos'
  },
  {
    url: 'https://truckcdn.cardekho.com/pwa/img/brandLogo_168x84/eicher.jpg',
    name: 'logo-eicher.jpg',
    section: 'brand-logos'
  },
  {
    url: 'https://truckcdn.cardekho.com/pwa/img/brandLogo_168x84/ashok-leyland.jpg',
    name: 'logo-ashok-leyland.jpg',
    section: 'brand-logos'
  },

  // Latest News
  {
    url: 'https://truckcdn.cardekho.com/news/35931775194972.jpg',
    name: 'mahindra-lmm-electric-news.jpg',
    section: 'news'
  },
  {
    url: 'https://truckcdn.cardekho.com/news/35921775125920.jpg',
    name: 'tata-712-sfc-news.jpg',
    section: 'news'
  },
  {
    url: 'https://truckcdn.cardekho.com/news/35901775048283.jpg',
    name: 'eka-mobility-news.jpg',
    section: 'news'
  },

  // YouTube Video Thumbnails
  {
    url: 'https://i2.ytimg.com/vi/twtRikMlEYQ/hqdefault.jpg',
    name: 'video-thumb-1.jpg',
    section: 'videos'
  },
  {
    url: 'https://i2.ytimg.com/vi/Z91IwRAA4ms/hqdefault.jpg',
    name: 'video-thumb-2.jpg',
    section: 'videos'
  },
  {
    url: 'https://i2.ytimg.com/vi/_jOOrAJPt5U/hqdefault.jpg',
    name: 'video-thumb-3.jpg',
    section: 'videos'
  }
];

const BASE_DIR = path.join(__dirname, '..', 'public', 'scraped', 'trucks-cardekho');

function downloadImage(url, destPath) {
  return new Promise((resolve, reject) => {
    const client = url.startsWith('https') ? https : http;
    const file = fs.createWriteStream(destPath);

    client.get(url, (response) => {
      if (response.statusCode === 301 || response.statusCode === 302) {
        file.close();
        fs.unlink(destPath, () => {});
        return downloadImage(response.headers.location, destPath)
          .then(resolve)
          .catch(reject);
      }

      if (response.statusCode !== 200) {
        file.close();
        fs.unlink(destPath, () => {});
        return reject(new Error(`Failed to download ${url}: status ${response.statusCode}`));
      }

      response.pipe(file);
      file.on('finish', () => {
        file.close(resolve);
      });
    }).on('error', (err) => {
      fs.unlink(destPath, () => {});
      reject(err);
    });
  });
}

async function scrapeAll() {
  console.log('🚛 Starting CarDekho Trucks image scraper...\n');

  // Create section directories
  const sections = [...new Set(images.map(img => img.section))];
  for (const section of sections) {
    const dir = path.join(BASE_DIR, section);
    fs.mkdirSync(dir, { recursive: true });
    console.log(`📁 Created directory: public/scraped/trucks-cardekho/${section}`);
  }

  console.log(`\n📥 Downloading ${images.length} images...\n`);

  let successCount = 0;
  let failCount = 0;

  for (const img of images) {
    const destPath = path.join(BASE_DIR, img.section, img.name);
    try {
      await downloadImage(img.url, destPath);
      console.log(`  ✅ ${img.section}/${img.name}`);
      successCount++;
    } catch (err) {
      console.log(`  ❌ ${img.section}/${img.name} — ${err.message}`);
      failCount++;
    }
  }

  console.log(`\n🎉 Done! ${successCount} downloaded, ${failCount} failed.`);
  console.log(`📂 Saved to: public/scraped/trucks-cardekho/`);
}

scrapeAll();
