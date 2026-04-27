import fs from "node:fs/promises";
import path from "node:path";
import { Workbook, SpreadsheetFile } from "@oai/artifact-tool";

const repoRoot = "/Users/anilkumarkolukulapalli/projects/cyepro/dealersite pro/dealer-site-pro";
const csvPath = path.join(
  repoRoot,
  "outputs/catalog-validation-4w-variant-prices/4w-all-model-variant-prices.csv",
);
const outputPath = path.join(
  repoRoot,
  "outputs/catalog-validation-4w-variant-prices/4w-all-model-variant-prices.xlsx",
);

const csvText = await fs.readFile(csvPath, "utf8");
const workbook = await Workbook.fromCSV(csvText, { sheetName: "4W Prices" });

await workbook.render({
  sheetName: "4W Prices",
  range: "A1:E20",
  scale: 1.5,
});

const output = await SpreadsheetFile.exportXlsx(workbook);
await output.save(outputPath);

console.log(outputPath);
