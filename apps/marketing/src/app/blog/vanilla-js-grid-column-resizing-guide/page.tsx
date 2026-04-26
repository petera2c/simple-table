import type { Metadata } from "next";
import FrameworkTutorialLayout from "@/components/blog/FrameworkTutorialLayout";
import { SEO_STRINGS } from "@/constants/strings/seo";
import { vanillaGridColumnResizingPost } from "@/constants/blogPosts";

export const metadata: Metadata = {
  title: vanillaGridColumnResizingPost.title,
  description: vanillaGridColumnResizingPost.description,
  keywords:
    "vanilla js column resizing, typescript data grid resize, tabulator column resize, grid.js resize, simple-table-core column resize",
  openGraph: {
    title: vanillaGridColumnResizingPost.title,
    description: vanillaGridColumnResizingPost.description,
    type: "article",
    images: [SEO_STRINGS.site.ogImage],
    siteName: SEO_STRINGS.site.name,
  },
  twitter: {
    card: "summary_large_image",
    title: vanillaGridColumnResizingPost.title,
    description: vanillaGridColumnResizingPost.description,
    creator: SEO_STRINGS.site.creator,
    images: SEO_STRINGS.site.ogImage.url,
  },
  alternates: { canonical: `/blog/${vanillaGridColumnResizingPost.slug}` },
};

export default function Page() {
  return (
    <FrameworkTutorialLayout
      slug={vanillaGridColumnResizingPost.slug}
      title={vanillaGridColumnResizingPost.title}
      subtitle="Resizable columns are essential for data-heavy vanilla TypeScript apps. This guide walks through implementation, library trade-offs, and pitfalls—with strict TypeScript code samples for simple-table-core and a comparison to Tabulator, Grid.js, and Handsontable."
      framework="vanilla"
      heroBadges={["Vanilla TS", "Tutorial", "Column Resizing"]}
      datePublished={vanillaGridColumnResizingPost.createdAt}
      dateModified={vanillaGridColumnResizingPost.updatedAt}
      introParagraphs={[
        "Column resizing is one of those features users miss only when it's gone. The moment a content cell truncates with an ellipsis, somebody reaches for the column edge and tries to drag.",
        "This tutorial walks through column resizing patterns for the vanilla JavaScript / TypeScript data grid landscape—Tabulator, Grid.js, Handsontable, jSpreadsheet—and shows the simple-table-core setup for framework-agnostic apps.",
        "If you want a strict-TypeScript, ESM-first, MIT-licensed core grid that you can mount in any framework or no framework, simple-table-core is ~70 kB gzipped with built-in resize, pinning, and virtualization.",
      ]}
      whyItMatters={[
        { title: "Density vs scannability", body: "Users adjust columns to suit their screen and the row data they're scanning—you don't have to guess for them." },
        { title: "Excel-like ergonomics", body: "Power users expect drag-handle resizing on column edges; without it, the grid feels broken." },
        { title: "Pinned-column compatibility", body: "Resizing a pinned column has to recalc the sticky offset; a quality grid handles this for you." },
        { title: "Framework-agnostic mounting", body: "Vanilla grids ship in any host: web components, micro-frontends, server-rendered pages." },
      ]}
      libraryRows={[
        { library: "simple-table-core", support: { value: "Built-in", tone: "good" }, notes: "columnResizing: true in options; strict TypeScript types out of the box." },
        { library: "Tabulator", support: { value: "Built-in", tone: "good" }, notes: "resizableColumns: true; full-featured but heavier (~250 kB gzipped)." },
        { library: "Grid.js", support: { value: "Manual", tone: "bad" }, notes: "No native resize—use plugins or DIY CSS handles." },
        { library: "Handsontable", support: { value: "Built-in (commercial)", tone: "neutral" }, notes: "Resize built-in but commercial license required for non-personal use." },
        { library: "jSpreadsheet", support: { value: "Built-in", tone: "good" }, notes: "Spreadsheet-style resize; less suited for typed data grids." },
      ]}
      simpleTableSection={{
        headline: "Implementation: simple-table-core",
        intro: "Construct a SimpleTableVanilla instance, point it at a host element, and pass columnResizing in options. Strict TypeScript types make headers and rows safe at compile time.",
                notes: <>Mount once on page load and call <code>table.dispose()</code> if your host element is removed (e.g. SPA route changes) to avoid event-listener leaks.</>,
      }}
      pitfalls={[
        { title: "Memory leaks on SPA navigation", problem: "Mounting in a SPA without disposing leaks listeners.", solution: "Always call table.dispose() on cleanup; in micro-frontends, hook this to your unmount lifecycle." },
        { title: "Resize handles too narrow on touch", problem: "Mobile users can't grab the 4px column edge.", solution: "Use a library that auto-widens handles for touch (simple-table-core does this)." },
        { title: "Bundle size", problem: "Tabulator and Handsontable add 200-400 kB to your bundle.", solution: "If you don't need every feature, simple-table-core is ~70 kB gzipped with the same core capabilities." },
        { title: "TypeScript types missing", problem: "Some grids ship loose any-typed APIs.", solution: "simple-table-core is strict-TypeScript-first; HeaderObject, Row, and event payloads are all typed." },
      ]}
      faqs={[
        { question: "Can I use this in a web component?", answer: "Yes. Mount inside the shadow root: pass shadowRoot.querySelector('#host') as the element. simple-table-core uses CSS variables for theming, so it inherits styles you set inside the shadow tree." },
        { question: "Does it work without a build step?", answer: "Yes. simple-table-core ships ESM via a CDN like esm.sh; you can <script type=\"module\"> in plain HTML." },
        { question: "How do I handle SSR?", answer: "Render an empty host on the server, then mount the grid client-side after hydration. simple-table-core only touches the DOM in the constructor." },
      ]}
      conclusionParagraphs={[
        "Column resizing in vanilla JS / TS is a single option on simple-table-core. Tabulator and Handsontable ship it but at much larger bundle sizes; Grid.js requires DIY.",
        "If you need a framework-agnostic, strict-TypeScript core grid with resize, pinning, and virtualization, simple-table-core is the focused MIT pick—~70 kB gzipped.",
      ]}
      relatedLinks={[
        { href: "/blog/vanilla-typescript-data-grid-simple-table-core", label: "Pillar guide: best free vanilla TypeScript data grid in 2026" },
        { href: "/docs/column-resizing", label: "Column resizing documentation" },
        { href: "/frameworks/vanilla", label: "Vanilla TS integration hub" },
      ]}
      ctaTitle="Add column resizing to your vanilla TS grid"
      ctaDescription="simple-table-core ships resize, pinning, grouping, and editing in one MIT package—~70 kB gzipped, strict TypeScript, ESM-first."
      docsHref="/docs/column-resizing"
    />
  );
}
