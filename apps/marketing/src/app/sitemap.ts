import { readdirSync, statSync } from "fs";
import { join } from "path";
import type { MetadataRoute } from "next";
import { BLOG_POSTS } from "@/constants/blogPosts";
import { EXAMPLE_SLUGS, FRAMEWORK_HUB_IDS } from "@/constants/frameworkIntegrationHub";
import { SEO_STRINGS } from "@/constants/strings/seo";

const SITE_URL = SEO_STRINGS.site.url.replace(/\/$/, "");

type ChangeFreq = NonNullable<MetadataRoute.Sitemap[number]["changeFrequency"]>;

const PAGE_FILE_NAMES = new Set(["page.tsx", "page.ts", "page.jsx", "page.js"]);

/**
 * Walk src/app and collect every route segment that has a page file.
 * - Skips Next.js route groups: (group)
 * - Skips API routes (/api/**)
 * - Returns dynamic segments verbatim (e.g. "[framework]") so callers can expand them.
 */
function collectAppRoutes(appDir: string, currentSegments: string[] = []): string[] {
  const collected: string[] = [];
  let names: string[];
  try {
    names = readdirSync(appDir);
  } catch {
    return collected;
  }

  const hasPage = names.some((name) => PAGE_FILE_NAMES.has(name));
  if (hasPage) {
    collected.push("/" + currentSegments.join("/"));
  }

  for (const name of names) {
    if (name.startsWith("_")) continue;
    if (name === "api") continue;

    const childPath = join(appDir, name);
    let isDir = false;
    try {
      isDir = statSync(childPath).isDirectory();
    } catch {
      continue;
    }
    if (!isDir) continue;

    if (name.startsWith("(") && name.endsWith(")")) {
      const nested = collectAppRoutes(childPath, currentSegments);
      collected.push(...nested);
      continue;
    }

    const nested = collectAppRoutes(childPath, [...currentSegments, name]);
    collected.push(...nested);
  }

  return collected;
}

function expandDynamicRoutes(routes: string[]): string[] {
  const expanded: string[] = [];

  for (const route of routes) {
    if (!route.includes("[")) {
      expanded.push(route);
      continue;
    }

    if (route === "/blog/topic/[framework]" || route === "/frameworks/[framework]") {
      for (const id of FRAMEWORK_HUB_IDS) {
        expanded.push(route.replace("[framework]", id));
      }
      continue;
    }

    if (route === "/examples/[framework]/[example]") {
      for (const id of FRAMEWORK_HUB_IDS) {
        for (const slug of EXAMPLE_SLUGS) {
          expanded.push(`/examples/${id}/${slug}`);
        }
      }
      continue;
    }

    if (route === "/examples/[framework]") {
      for (const id of FRAMEWORK_HUB_IDS) {
        expanded.push(`/examples/${id}`);
      }
      continue;
    }

    console.warn(
      `[sitemap] Unhandled dynamic route "${route}". Add an expansion branch in expandDynamicRoutes.`
    );
  }

  return expanded;
}

function categorize(route: string): { priority: number; changeFrequency: ChangeFreq } {
  if (route === "/") return { priority: 1.0, changeFrequency: "daily" };
  if (route.startsWith("/blog/")) return { priority: 0.8, changeFrequency: "monthly" };
  if (route.startsWith("/comparisons/")) return { priority: 0.9, changeFrequency: "weekly" };
  if (route.startsWith("/case-studies/")) return { priority: 0.9, changeFrequency: "monthly" };
  if (route.startsWith("/docs/")) return { priority: 0.8, changeFrequency: "weekly" };
  if (route === "/frameworks" || route.startsWith("/frameworks/")) {
    return { priority: 0.8, changeFrequency: "weekly" };
  }
  if (route.startsWith("/examples/")) return { priority: 0.7, changeFrequency: "weekly" };
  if (route.startsWith("/migrations/")) return { priority: 0.6, changeFrequency: "weekly" };
  if (route.startsWith("/legal/")) return { priority: 0.5, changeFrequency: "monthly" };
  return { priority: 0.6, changeFrequency: "weekly" };
}

const NON_INDEXABLE_SEGMENTS = new Set([
  "/not-found",
  "/mobile-unsupported",
]);

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const appDir = join(process.cwd(), "src", "app");

  const rawRoutes = collectAppRoutes(appDir);
  const expandedRoutes = expandDynamicRoutes(rawRoutes);

  const blogUpdatedAt = new Map<string, string>();
  for (const post of BLOG_POSTS) {
    if (post.updatedAt) blogUpdatedAt.set(`/blog/${post.slug}`, post.updatedAt);
  }

  const seen = new Set<string>();
  const entries: MetadataRoute.Sitemap = [];

  for (const route of expandedRoutes) {
    if (NON_INDEXABLE_SEGMENTS.has(route)) continue;
    if (seen.has(route)) continue;
    seen.add(route);

    const { priority, changeFrequency } = categorize(route);
    const updatedAt = blogUpdatedAt.get(route);
    entries.push({
      url: `${SITE_URL}${route === "/" ? "" : route}` || SITE_URL,
      lastModified: updatedAt ? new Date(updatedAt) : now,
      changeFrequency,
      priority,
    });
  }

  entries.sort((a, b) => {
    if (a.url === SITE_URL) return -1;
    if (b.url === SITE_URL) return 1;
    return a.url.localeCompare(b.url);
  });

  return entries;
}
