import fs from "node:fs/promises";
import path from "node:path";

const repoRoot = "/Users/anilkumarkolukulapalli/projects/cyepro/dealersite pro/dealer-site-pro";
const publicDataDir = path.join(repoRoot, "public", "data");
const outputCsv = path.join(
  repoRoot,
  "outputs",
  "catalog-validation-4w-variant-prices",
  "4w-all-model-variant-prices.csv",
);

const brandFiles = [
  "aston_martin.json",
  "audi.json",
  "bentley.json",
  "bmw.json",
  "byd.json",
  "citroen.json",
  "ferrari.json",
  "force.json",
  "honda.json",
  "hyundai.json",
  "isuzu.json",
  "jaguar.json",
  "jeep.json",
  "kia.json",
  "lamborghini.json",
  "land_rover.json",
  "lexus.json",
  "mahindra.json",
  "maruti_suzuki.json",
  "maserati.json",
  "mercedes.json",
  "mg.json",
  "mini.json",
  "nissan.json",
  "porsche.json",
  "renault.json",
  "rolls_royce.json",
  "skoda.json",
  "tata.json",
  "toyota.json",
  "vinfast.json",
  "volkswagen.json",
  "volvo.json",
];

function formatInr(value) {
  return `₹${Number(value).toLocaleString("en-IN")}`;
}

function csvEscape(value) {
  const str = String(value ?? "");
  if (/[",\n]/.test(str)) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

function readPrice(row) {
  if (typeof row?.ex_showroom_price_min_inr === "number") {
    return row.ex_showroom_price_min_inr;
  }
  if (typeof row?.ex_showroom_price_min === "number") {
    return row.ex_showroom_price_min;
  }
  if (typeof row?.ex_showroom_price_max === "number") {
    return row.ex_showroom_price_max;
  }
  if (typeof row?.ex_showroom_price === "number") {
    return row.ex_showroom_price;
  }
  if (typeof row?.ex_showroom_price?.min === "number") {
    return row.ex_showroom_price.min;
  }
  if (typeof row?.ex_showroom_price_range?.min === "number") {
    return row.ex_showroom_price_range.min;
  }
  if (typeof row?.pricing?.ex_showroom?.min === "number") {
    return row.pricing.ex_showroom.min;
  }
  if (typeof row?.pricing?.ex_showroom_min_inr === "number") {
    return row.pricing.ex_showroom_min_inr;
  }
  if (typeof row?.pricing?.ex_showroom === "number") {
    return row.pricing.ex_showroom;
  }
  return null;
}

function readMake(row, fallback) {
  return row?.make ?? fallback;
}

function readModel(row) {
  if (typeof row?.model === "string" && row.model.trim()) {
    return row.model.trim();
  }
  if (typeof row?.variant_name === "string" && row.variant_name.trim()) {
    const variant = row.variant_name.trim();
    const parts = variant.split(/\s+/);
    if (parts.length >= 3 && parts[0].toLowerCase() === "maruti") {
      return parts.slice(1, 3).join(" ");
    }
  }
  return "";
}

function readVariant(row, model) {
  const variant = String(row?.variant_name ?? "").trim();
  if (!variant) {
    return "";
  }
  if (model && variant.startsWith(`${model} `)) {
    return variant.slice(model.length + 1).trim();
  }
  if (row?.make === "Maruti Suzuki" && variant.startsWith("Maruti ")) {
    const parts = variant.split(/\s+/);
    if (parts.length > 3) {
      return parts.slice(3).join(" ").trim();
    }
  }
  return variant;
}

function getRowsFromData(data) {
  const knownKeys = [
    "items",
    "variants",
    "maruti_suzuki_variants",
    "aston_martin",
    "cardekho_cars",
    "cardekho_variants",
    "force",
    "kia",
    "mahindra",
    "mercedes",
    "mg",
    "skoda",
    "volkswagen",
    "volvo",
  ];
  for (const key of knownKeys) {
    if (Array.isArray(data?.[key])) return data[key];
  }
  if (Array.isArray(data)) return data;
  const values = Object.values(data ?? {});
  if (values.length && values.every((value) => value && typeof value === "object" && !Array.isArray(value))) {
    return values;
  }
  for (const value of values) {
    if (Array.isArray(value)) return value;
  }
  return [];
}

const rows = [];

for (const fileName of brandFiles) {
  const filePath = path.join(publicDataDir, fileName);
  const json = JSON.parse(await fs.readFile(filePath, "utf8"));
  const sourceRows = getRowsFromData(json);
  for (const row of sourceRows) {
    const price = readPrice(row);
    if (typeof price !== "number" || Number.isNaN(price)) {
      continue;
    }
    const make = readMake(row, fileName.replace(".json", "").replace(/_/g, " "));
    const model = readModel(row);
    const variant = readVariant(row, model);
    if (!model || !variant) {
      continue;
    }
    rows.push({
      make,
      model,
      variant,
      price,
    });
  }
}

rows.sort((a, b) =>
  a.make.localeCompare(b.make) ||
  a.model.localeCompare(b.model) ||
  a.variant.localeCompare(b.variant),
);

const header = ["Make", "Model", "Variant", "Ex-Showroom INR", "Ex-Showroom Price"];
const lines = [
  header.join(","),
  ...rows.map((row) =>
    [
      csvEscape(row.make),
      csvEscape(row.model),
      csvEscape(row.variant),
      row.price,
      csvEscape(formatInr(row.price)),
    ].join(","),
  ),
];

await fs.writeFile(outputCsv, `${lines.join("\n")}\n`, "utf8");

console.log(`wrote ${rows.length} rows to ${outputCsv}`);
