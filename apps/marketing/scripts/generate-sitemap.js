import { SitemapStream, streamToPromise } from "sitemap";
import { createWriteStream } from "fs";
import { fileURLToPath } from "url";
import { dirname, resolve } from "path";
import { glob } from "glob";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const baseUrl = "https://www.simple-table.com";

// Function to get all Next.js routes from the app directory
async function getNextJsRoutes() {
  const appDir = resolve(__dirname, "../src/app");
  const routes = await glob("**/page.{tsx,jsx,js,ts}", { cwd: appDir });

  const processedRoutes = routes
    .map((route) => {
      // Convert file path to URL path
      return route
        .replace(/\/page\.[jt]sx?$/, "") // Remove page.tsx
        .replace(/\/\([^)]+\)/g, "") // Remove route groups
        .replace(/index$/, "") // Remove index from path
        .replace(/^page\.tsx$/, ""); // Handle root page.tsx
    })
    .filter((route) => {
      // Filter out special Next.js routes, dynamic routes, and unwanted pages
      return (
        !route.startsWith("_") &&
        !route.includes("api") &&
        !route.includes("[") && // Filter out dynamic routes
        !route.includes("not-found") && // Filter out error pages
        !route.includes("mobile-unsupported") // Filter out mobile unsupported page
      );
    })
    .sort(); // Sort routes alphabetically

  // Always include the root route
  if (!processedRoutes.includes("")) {
    processedRoutes.unshift(""); // Add root route at the beginning
  }

  return processedRoutes;
}

// Function to format XML with proper indentation
function formatXML(xml) {
  // Remove any existing XML declaration
  const xmlWithoutDeclaration = xml.replace(/<\?xml[^>]*\?>\s*/, "");

  const formatted = xmlWithoutDeclaration
    .replace(/<url>/g, "\n  <url>")
    .replace(/<\/url>/g, "\n  </url>")
    .replace(/<loc>/g, "\n    <loc>")
    .replace(/<\/loc>/g, "</loc>")
    .replace(/<changefreq>/g, "\n    <changefreq>")
    .replace(/<\/changefreq>/g, "</changefreq>")
    .replace(/<priority>/g, "\n    <priority>")
    .replace(/<\/priority>/g, "</priority>")
    .replace(/<lastmod>/g, "\n    <lastmod>")
    .replace(/<\/lastmod>/g, "</lastmod>")
    .replace(/<urlset/g, "<urlset")
    .replace(/<\/urlset>/g, "\n</urlset>");

  // Add XML declaration at the start
  return '<?xml version="1.0" encoding="UTF-8"?>\n' + formatted;
}

async function generateSitemap() {
  try {
    const sitemap = new SitemapStream({
      hostname: baseUrl,
      xmlns: {
        news: true,
        xhtml: true,
        image: true,
        video: true,
      },
    });

    // Get all routes
    const nextJsRoutes = await getNextJsRoutes();

    // Extract route categories for reporting
    const blogRoutes = nextJsRoutes.filter((route) => route.startsWith("blog/")).sort();
    const examplesRoutes = nextJsRoutes.filter((route) => route.startsWith("examples/")).sort();
    const docsRoutes = nextJsRoutes.filter((route) => route.startsWith("docs/")).sort();

    // Create and sort all sitemap entries to ensure consistent order
    const sitemapEntries = [];

    // Add Next.js routes with appropriate priorities
    nextJsRoutes.forEach((route) => {
      const routeConfig = {
        url: route || "/", // Handle root route
        changefreq: "weekly",
        priority: 0.6,
      };

      if (route === "") {
        routeConfig.priority = 1.0;
        routeConfig.changefreq = "daily";
      } else if (route.startsWith("blog/")) {
        routeConfig.priority = 0.8;
        routeConfig.changefreq = "monthly";
      } else if (route.startsWith("comparisons/")) {
        routeConfig.priority = 0.9;
        routeConfig.changefreq = "weekly";
      } else if (route.startsWith("case-studies/")) {
        routeConfig.priority = 0.9;
        routeConfig.changefreq = "monthly";
      } else if (route.startsWith("docs/")) {
        routeConfig.priority = 0.8;
        routeConfig.changefreq = "weekly";
      } else if (route.startsWith("examples/")) {
        routeConfig.priority = 0.7;
        routeConfig.changefreq = "weekly";
      } else if (route.startsWith("legal/")) {
        routeConfig.priority = 0.5;
        routeConfig.changefreq = "monthly";
      }

      sitemapEntries.push(routeConfig);
    });

    // Sort all entries by URL for consistent ordering
    sitemapEntries.sort((a, b) => {
      // Always put homepage first
      if (a.url === "/" || a.url === "") return -1;
      if (b.url === "/" || b.url === "") return 1;

      return a.url.localeCompare(b.url);
    });

    // Write sorted entries to sitemap
    sitemapEntries.forEach((entry) => {
      sitemap.write(entry);
    });

    sitemap.end();

    // Generate the sitemap XML
    const xml = await streamToPromise(sitemap);
    const formattedXML = formatXML(xml.toString());

    // Write the sitemap to the public directory
    const outputPath = resolve(__dirname, "../public/sitemap.xml");
    createWriteStream(outputPath).write(formattedXML);

    console.log("✅ Sitemap generated successfully!");
    console.log(`📊 Found ${nextJsRoutes.length} total routes`);
    console.log(
      `📊 Blog posts: ${blogRoutes.length}, Examples: ${examplesRoutes.length}, Docs: ${docsRoutes.length}`
    );
  } catch (error) {
    console.error("❌ Error generating sitemap:", error);
    process.exit(1);
  }
}

generateSitemap();
