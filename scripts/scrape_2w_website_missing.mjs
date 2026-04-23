import fs from 'fs';
import path from 'path';
import http from 'http';
import https from 'https';
import { fileURLToPath } from 'url';
import puppeteer from 'puppeteer';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const AUDIT_PATH = path.join(ROOT, 'scripts', 'missing-2w-website-images.json');
const IMAGE_DIR = path.join(ROOT, 'public', 'data', 'brand-model-images', '2w');
const URL_MAP_PATH = path.join(ROOT, 'public', 'data', 'vehicle-image-urls.json');

function ensureDir(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function parseArgs(argv) {
  const args = { brand: null, limit: null, dryRun: false };

  for (let i = 0; i < argv.length; i += 1) {
    const part = argv[i];
    if (part === '--brand') args.brand = argv[i + 1] ?? null;
    if (part === '--limit') args.limit = Number(argv[i + 1] ?? 0) || null;
    if (part === '--dry-run') args.dryRun = true;
  }

  return args;
}

function loadTargets() {
  if (!fs.existsSync(AUDIT_PATH)) {
    throw new Error(`Audit file not found: ${AUDIT_PATH}`);
  }

  const payload = JSON.parse(fs.readFileSync(AUDIT_PATH, 'utf8'));
  return payload.missing ?? [];
}

function updateUrlMap(brandId, slug, ext) {
  const urlMap = fs.existsSync(URL_MAP_PATH)
    ? JSON.parse(fs.readFileSync(URL_MAP_PATH, 'utf8'))
    : {};

  urlMap[`2w/${brandId}/${slug}.${ext}`] = `/data/brand-model-images/2w/${brandId}/${slug}.${ext}`;
  fs.writeFileSync(URL_MAP_PATH, JSON.stringify(urlMap, null, 2));
}

function downloadFile(url, destination) {
  return new Promise((resolve) => {
    const client = url.startsWith('https') ? https : http;
    const file = fs.createWriteStream(destination);

    const request = client.get(
      url,
      {
        headers: {
          'User-Agent':
            'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
          Accept: 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
        },
      },
      (response) => {
        if (
          [301, 302, 303, 307, 308].includes(response.statusCode ?? 0) &&
          response.headers.location
        ) {
          file.close();
          fs.rmSync(destination, { force: true });
          downloadFile(response.headers.location, destination).then(resolve);
          return;
        }

        if (response.statusCode !== 200) {
          file.close();
          fs.rmSync(destination, { force: true });
          resolve(false);
          return;
        }

        response.pipe(file);
        file.on('finish', () => {
          file.close();
          const stats = fs.statSync(destination);
          if (stats.size < 6_000) {
            fs.rmSync(destination, { force: true });
            resolve(false);
            return;
          }

          resolve(true);
        });
      }
    );

    request.on('error', () => {
      file.close();
      fs.rmSync(destination, { force: true });
      resolve(false);
    });

    request.setTimeout(20_000, () => {
      request.destroy();
      file.close();
      fs.rmSync(destination, { force: true });
      resolve(false);
    });
  });
}

async function extractImageUrls(page) {
  return page.evaluate(() => {
    const candidates = [];
    const seen = new Set();

    const pushCandidate = (url) => {
      if (!url || typeof url !== 'string') return;
      if (!url.startsWith('http')) return;
      if (/logo|favicon|icon|svg/i.test(url)) return;
      if (/bing\.com/i.test(url)) return;
      if (seen.has(url)) return;
      seen.add(url);
      candidates.push(url);
    };

    for (const item of document.querySelectorAll('.iusc')) {
      try {
        const meta = JSON.parse(item.getAttribute('m') || '{}');
        pushCandidate(meta.murl);
      } catch {
        // ignore malformed metadata
      }
    }

    for (const img of document.querySelectorAll('img.mimg')) {
      const src = img.getAttribute('src') || img.getAttribute('data-src') || '';
      pushCandidate(src);
    }

    return candidates.slice(0, 12);
  });
}

async function searchImage(page, brand, model) {
  const queries = [
    `${brand} ${model} bike India official side view`,
    `${brand} ${model} scooter India official side view`,
    `${brand} ${model} motorcycle India official image`,
    `${brand} ${model} India side profile`,
    `${brand} ${model} official image`,
    `${brand} ${model} press photo`,
  ];

  for (const query of queries) {
    try {
      const url = `https://www.bing.com/images/search?q=${encodeURIComponent(
        query
      )}&qft=+filterui:imagesize-large&form=IRFLTR`;
      await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 30_000 });
      await delay(1500);
      const found = await extractImageUrls(page);
      if (found.length > 0) return found;
    } catch {
      // try next query
    }
  }

  return [];
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  let targets = loadTargets();

  if (args.brand) {
    const brandNeedle = args.brand.toLowerCase();
    targets = targets.filter(
      (target) =>
        target.brand.toLowerCase().includes(brandNeedle) ||
        target.brandId.toLowerCase().includes(brandNeedle)
    );
  }

  if (args.limit) {
    targets = targets.slice(0, args.limit);
  }

  console.log(
    JSON.stringify(
      {
        dryRun: args.dryRun,
        count: targets.length,
        brand: args.brand,
        limit: args.limit,
      },
      null,
      2
    )
  );

  if (args.dryRun || targets.length === 0) return;

  let browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage'],
  });
  let page = await browser.newPage();
  await page.setViewport({ width: 1366, height: 900 });
  await page.setUserAgent(
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36'
  );

  let saved = 0;
  let failed = 0;

  for (let index = 0; index < targets.length; index += 1) {
    const target = targets[index];

    if (index > 0 && index % 20 === 0) {
      await page.close();
      await browser.close();
      browser = await puppeteer.launch({
        headless: 'new',
        args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage'],
      });
      page = await browser.newPage();
      await page.setViewport({ width: 1366, height: 900 });
      await page.setUserAgent(
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36'
      );
    }

    console.log(`[${index + 1}/${targets.length}] ${target.brand} :: ${target.model}`);

    const remoteUrls = await searchImage(page, target.brand, target.model);
    if (remoteUrls.length === 0) {
      console.log('  MISS search');
      failed += 1;
      continue;
    }

    const outputDir = path.join(IMAGE_DIR, target.brandId);
    ensureDir(outputDir);
    const outputPath = path.join(outputDir, `${target.slug}.jpg`);
    let ok = false;
    for (const remoteUrl of remoteUrls) {
      ok = await downloadFile(remoteUrl, outputPath);
      if (ok) break;
    }

    if (!ok) {
      console.log('  MISS download');
      failed += 1;
      continue;
    }

    updateUrlMap(target.brandId, target.slug, 'jpg');
    console.log(`  SAVED ${path.relative(ROOT, outputPath)}`);
    saved += 1;
  }

  await page.close();
  await browser.close();

  console.log(
    JSON.stringify(
      {
        attempted: targets.length,
        saved,
        failed,
      },
      null,
      2
    )
  );
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
