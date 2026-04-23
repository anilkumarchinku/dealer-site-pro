import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const DATA_DIR = path.join(ROOT, 'public', 'data', '2w');
const IMAGE_DIR = path.join(ROOT, 'public', 'data', 'brand-model-images', '2w');
const URL_MAP_PATH = path.join(ROOT, 'public', 'data', 'vehicle-image-urls.json');
const OUTPUT_JSON = path.join(ROOT, 'scripts', 'missing-2w-website-images.json');
const OUTPUT_MD = path.join(ROOT, 'docs', '2w-website-image-audit.md');

const IMAGE_EXTENSIONS = ['jpg', 'png', 'webp'];

function modelToSlug(model) {
  return model
    .toLowerCase()
    .replace(/\./g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

function loadUrlMap() {
  if (!fs.existsSync(URL_MAP_PATH)) return {};
  return JSON.parse(fs.readFileSync(URL_MAP_PATH, 'utf8'));
}

function getModelsFromWebsiteCatalog() {
  const files = fs.readdirSync(DATA_DIR).filter((file) => file.endsWith('.json')).sort();
  const grouped = new Map();

  for (const file of files) {
    const raw = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
    for (const vehicle of raw.vehicles ?? []) {
      const model = vehicle.model ?? vehicle.variant_name?.split('/')[0]?.trim();
      if (!model) continue;

      const key = `${raw.brandId}::${model.toLowerCase()}`;
      if (!grouped.has(key)) {
        grouped.set(key, {
          brand: raw.brand,
          brandId: raw.brandId,
          model,
          slug: modelToSlug(model),
        });
      }
    }
  }

  return Array.from(grouped.values()).sort((a, b) => {
    if (a.brand !== b.brand) return a.brand.localeCompare(b.brand);
    return a.model.localeCompare(b.model);
  });
}

function findExistingImage(brandId, slug) {
  for (const ext of IMAGE_EXTENSIONS) {
    const absolutePath = path.join(IMAGE_DIR, brandId, `${slug}.${ext}`);
    if (fs.existsSync(absolutePath)) {
      return {
        ext,
        absolutePath,
        publicPath: `/data/brand-model-images/2w/${brandId}/${slug}.${ext}`,
      };
    }
  }

  return null;
}

function main() {
  const models = getModelsFromWebsiteCatalog();
  const urlMap = loadUrlMap();
  const missing = [];
  const present = [];
  const byBrand = new Map();

  for (const entry of models) {
    const image = findExistingImage(entry.brandId, entry.slug);
    const keyPrefix = `2w/${entry.brandId}/${entry.slug}`;
    const manifestUrl =
      urlMap[`${keyPrefix}.jpg`] ??
      urlMap[`${keyPrefix}.png`] ??
      urlMap[`${keyPrefix}.webp`] ??
      null;

    const record = {
      ...entry,
      imagePath: image?.publicPath ?? null,
      manifestUrl,
    };

    if (image) {
      present.push(record);
    } else {
      missing.push(record);
    }

    if (!byBrand.has(entry.brand)) {
      byBrand.set(entry.brand, {
        brand: entry.brand,
        brandId: entry.brandId,
        total: 0,
        present: 0,
        missing: 0,
        missingModels: [],
      });
    }

    const bucket = byBrand.get(entry.brand);
    bucket.total += 1;
    if (image) {
      bucket.present += 1;
    } else {
      bucket.missing += 1;
      bucket.missingModels.push(entry.model);
    }
  }

  const brandRows = Array.from(byBrand.values()).sort((a, b) => {
    if (b.missing !== a.missing) return b.missing - a.missing;
    return a.brand.localeCompare(b.brand);
  });

  const payload = {
    generatedAt: new Date().toISOString(),
    source: 'public/data/2w/*.json',
    totalModels: models.length,
    presentCount: present.length,
    missingCount: missing.length,
    brands: brandRows,
    missing,
  };

  fs.writeFileSync(OUTPUT_JSON, JSON.stringify(payload, null, 2));

  const lines = [
    '# 2W Website Image Audit',
    '',
    `Source dataset: \`public/data/2w/*.json\``,
    '',
    `Generated: \`${payload.generatedAt}\``,
    '',
    `- Total grouped models on \`/bikes\`: \`${payload.totalModels}\``,
    `- Models with local hero image: \`${payload.presentCount}\``,
    `- Models missing local hero image: \`${payload.missingCount}\``,
    '',
    '## Missing By Brand',
    '',
    '| Brand | Brand ID | Missing | Present | Total |',
    '| --- | --- | ---: | ---: | ---: |',
    ...brandRows
      .filter((row) => row.missing > 0)
      .map(
        (row) =>
          `| ${row.brand} | \`${row.brandId}\` | ${row.missing} | ${row.present} | ${row.total} |`
      ),
    '',
    '## Missing Models',
    '',
    ...brandRows
      .filter((row) => row.missing > 0)
      .flatMap((row) => [
        `### ${row.brand} (${row.missing})`,
        '',
        ...row.missingModels.map((model) => `- ${model}`),
        '',
      ]),
  ];

  fs.writeFileSync(OUTPUT_MD, `${lines.join('\n').trim()}\n`);

  console.log(
    JSON.stringify(
      {
        totalModels: payload.totalModels,
        presentCount: payload.presentCount,
        missingCount: payload.missingCount,
        topMissingBrands: brandRows.filter((row) => row.missing > 0).slice(0, 10),
      },
      null,
      2
    )
  );
}

main();
