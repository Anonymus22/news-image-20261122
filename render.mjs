// Render poster.html into entry.png with headless Chrome (via Puppeteer).
// Usage: node render.mjs [poster.html] [entry.png]
// The page is a fixed 1024x1024 sheet and the viewport matches it, so
// repeated renders of the same page come out byte-identical.
import { createRequire } from "node:module";
import { resolve } from "node:path";
import { statSync } from "node:fs";

const load = createRequire(import.meta.url);
const puppeteer = load(
  "/home/hatch/workspace/makefun/radar/shots-tool/node_modules/puppeteer",
);

const pagePath = resolve(process.argv[2] ?? "poster.html");
const shotPath = resolve(process.argv[3] ?? "entry.png");

async function shoot() {
  const browser = await puppeteer.launch({
    headless: true,
    args: [
      "--no-sandbox",
      "--disable-dev-shm-usage",
      "--hide-scrollbars",
      "--enable-unsafe-swiftshader",
      "--use-angle=swiftshader",
      "--force-color-profile=srgb",
    ],
  });
  try {
    const tab = await browser.newPage();
    await tab.setViewport({ width: 1024, height: 1024, deviceScaleFactor: 1 });
    await tab.goto(`file://${pagePath}`, {
      waitUntil: "load",
      timeout: 60000,
    });
    await new Promise((done) => setTimeout(done, 1200));
    await tab.screenshot({ path: shotPath });
  } finally {
    await browser.close();
  }
  const bytes = statSync(shotPath).size;
  console.log(`rendered ${shotPath} from ${pagePath} (${bytes} bytes)`);
}

await shoot();
