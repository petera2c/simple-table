import { chromium } from "playwright";

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1100, height: 700 } });
await page.goto(
  "http://localhost:6006/iframe.html?id=tests-46-auto-size-columns--auto-size-async-renderer-internal-truncation",
  { waitUntil: "domcontentloaded" },
);
await page.waitForSelector(".simple-table-root", { timeout: 30000 });
await page.waitForTimeout(2000);

const info = await page.evaluate(() => {
  const text = document.querySelector('.st-cell[data-accessor="note"] .trunc-text');
  const s = text ? getComputedStyle(text) : null;
  return {
    clientWidth: text?.clientWidth,
    scrollWidth: text?.scrollWidth,
    display: s?.display,
    overflow: s?.overflow,
    textOverflow: s?.textOverflow,
    whiteSpace: s?.whiteSpace,
    visibleText: text?.textContent?.slice(0, 30),
  };
});
console.log(JSON.stringify(info, null, 2));

await page.screenshot({ path: "capped-story.png", clip: { x: 0, y: 0, width: 900, height: 400 } });
await browser.close();
