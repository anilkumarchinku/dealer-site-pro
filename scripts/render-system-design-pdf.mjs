import path from "node:path";
import { pathToFileURL } from "node:url";
import puppeteer from "puppeteer";

const root = process.cwd();
const htmlPath = path.join(root, "docs", "dealersite-pro-system-design.html");
const pdfPath = path.join(root, "docs", "dealersite-pro-system-design.pdf");

const browser = await puppeteer.launch({
  headless: "new",
  args: ["--no-sandbox", "--disable-setuid-sandbox"],
});

try {
  const page = await browser.newPage();
  await page.goto(pathToFileURL(htmlPath).href, { waitUntil: "networkidle0" });
  await page.pdf({
    path: pdfPath,
    format: "A4",
    printBackground: true,
    preferCSSPageSize: true,
  });
  console.log(pdfPath);
} finally {
  await browser.close();
}
