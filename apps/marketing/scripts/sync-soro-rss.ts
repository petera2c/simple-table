/**
 * Fetch Soro RSS and write article JSON under content/articles/.
 * Synced posts are served at /blog/{slug} (see app/blog/[slug]/page.tsx).
 *
 * Usage: pnpm run sync-soro-rss
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import * as cheerio from "cheerio";
import type { SoroArticle } from "../src/lib/soroArticles/types";
import { SORO_RSS_FEED_URL } from "../src/lib/soroArticles/types";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ARTICLES_DIR = path.join(__dirname, "..", "content", "articles");

function slugFromLink(link: string): string {
  try {
    const pathname = new URL(link).pathname.replace(/\/+$/, "");
    const segment = pathname.split("/").filter(Boolean).pop();
    if (segment) return decodeURIComponent(segment);
  } catch {
    // fall through
  }
  throw new Error(`Could not derive slug from link: ${link}`);
}

function toIsoDate(rssDate: string): string {
  const date = new Date(rssDate);
  if (Number.isNaN(date.getTime())) return new Date().toISOString();
  return date.toISOString();
}

function sanitizeHtml(html: string): string {
  const $ = cheerio.load(html);
  $("script, iframe, object, embed, form").remove();
  $("*").each((_, el) => {
    if (!("attribs" in el) || !el.attribs) return;
    for (const name of Object.keys(el.attribs)) {
      const lower = name.toLowerCase();
      if (lower.startsWith("on") || lower === "srcdoc") {
        $(el).removeAttr(name);
      }
      const value = el.attribs[name] ?? "";
      if ((lower === "href" || lower === "src") && /^\s*javascript:/i.test(value)) {
        $(el).removeAttr(name);
      }
    }
  });
  return $("body").html() ?? "";
}

function extractEncodedHtml($: cheerio.CheerioAPI, el: any): string {
  const $item = $(el);
  let encoded =
    $item.find("content\\:encoded").html() || $item.find("encoded").html() || "";
  encoded = encoded
    .replace(/^<!\[CDATA\[/, "")
    .replace(/\]\]>$/, "")
    .trim();

  if (!encoded) {
    const itemXml = $.html(el);
    const match = itemXml.match(
      /<content:encoded><!\[CDATA\[([\s\S]*?)\]\]><\/content:encoded>/
    );
    if (match?.[1]) encoded = match[1].trim();
  }

  return encoded;
}

function readExisting(slug: string): SoroArticle | null {
  const outPath = path.join(ARTICLES_DIR, `${slug}.json`);
  if (!fs.existsSync(outPath)) return null;
  try {
    return JSON.parse(fs.readFileSync(outPath, "utf8")) as SoroArticle;
  } catch {
    return null;
  }
}

async function main() {
  console.log(`Fetching ${SORO_RSS_FEED_URL}`);
  const response = await fetch(SORO_RSS_FEED_URL, {
    headers: { Accept: "application/rss+xml, application/xml, text/xml" },
  });
  if (!response.ok) {
    throw new Error(`RSS fetch failed: ${response.status} ${response.statusText}`);
  }
  const xml = await response.text();
  if (xml.trim() === "Feed is disabled") {
    throw new Error("Soro RSS feed is disabled. Enable it in Settings → Other Platform.");
  }

  const $ = cheerio.load(xml, { xml: true });
  const parsed: SoroArticle[] = [];

  $("item").each((_, el) => {
    const $item = $(el);
    const title = $item.find("title").first().text().trim();
    const link = $item.find("link").first().text().trim();
    const description = $item.find("description").first().text().trim();
    const guid = $item.find("guid").first().text().trim() || link;
    const pubDate = $item.find("pubDate").first().text().trim();
    const encoded = extractEncodedHtml($, el);

    const enclosureUrl =
      $item.find("enclosure").attr("url") ||
      $item.find("media\\:content").attr("url") ||
      null;
    const enclosureType = $item.find("enclosure").attr("type") || undefined;

    if (!title || !link) {
      console.warn("Skipping RSS item missing title or link");
      return;
    }

    const slug = slugFromLink(link);
    const publishedAt = toIsoDate(pubDate);
    const previous = readExisting(slug);
    const contentHtml = sanitizeHtml(encoded || `<p>${description}</p>`);
    const featuredImage = enclosureUrl
      ? { url: enclosureUrl, type: enclosureType }
      : null;

    const nextArticle: SoroArticle = {
      id: guid,
      slug,
      title,
      description,
      contentHtml,
      featuredImage,
      link,
      publishedAt: previous?.publishedAt ?? publishedAt,
      updatedAt: previous?.updatedAt ?? publishedAt,
      source: "soro-rss",
    };

    if (previous && articleContentEqual(previous, nextArticle)) {
      console.log(`Unchanged ${slug}`);
      return;
    }

    if (previous) {
      nextArticle.updatedAt = new Date().toISOString();
    }

    parsed.push(nextArticle);
  });

  fs.mkdirSync(ARTICLES_DIR, { recursive: true });

  if (parsed.length === 0) {
    console.log("No new or updated articles.");
    return;
  }

  for (const article of parsed) {
    const outPath = path.join(ARTICLES_DIR, `${article.slug}.json`);
    fs.writeFileSync(outPath, `${JSON.stringify(article, null, 2)}\n`, "utf8");
    console.log(`Wrote ${path.relative(path.join(__dirname, ".."), outPath)}`);
  }

  console.log(`Synced ${parsed.length} article(s).`);
}

function articleContentEqual(a: SoroArticle, b: SoroArticle): boolean {
  return (
    a.id === b.id &&
    a.slug === b.slug &&
    a.title === b.title &&
    a.description === b.description &&
    a.contentHtml === b.contentHtml &&
    a.link === b.link &&
    JSON.stringify(a.featuredImage) === JSON.stringify(b.featuredImage)
  );
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
