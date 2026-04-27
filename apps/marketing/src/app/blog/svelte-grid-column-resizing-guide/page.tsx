import type { Metadata } from "next";
import FrameworkTutorialLayout from "@/components/blog/FrameworkTutorialLayout";
import { SEO_STRINGS } from "@/constants/strings/seo";
import { svelteGridColumnResizingPost } from "@/constants/blogPosts";

export const metadata: Metadata = {
  title: svelteGridColumnResizingPost.title,
  description: svelteGridColumnResizingPost.description,
  keywords:
    "svelte column resizing, sveltekit table resizable columns, svelte 5 runes data grid, svelte-headless-table column resize, simple table svelte",
  openGraph: {
    title: svelteGridColumnResizingPost.title,
    description: svelteGridColumnResizingPost.description,
    type: "article",
    images: [SEO_STRINGS.site.ogImage],
    siteName: SEO_STRINGS.site.name,
  },
  twitter: {
    card: "summary_large_image",
    title: svelteGridColumnResizingPost.title,
    description: svelteGridColumnResizingPost.description,
    creator: SEO_STRINGS.site.creator,
    images: SEO_STRINGS.site.ogImage.url,
  },
  alternates: { canonical: `/blog/${svelteGridColumnResizingPost.slug}` },
};

export default function Page() {
  return (
    <FrameworkTutorialLayout
      slug={svelteGridColumnResizingPost.slug}
      title={svelteGridColumnResizingPost.title}
      subtitle="Resizable columns are essential for data-heavy SvelteKit apps. This guide walks through implementation, library trade-offs, and pitfalls—with Svelte 4 + Svelte 5 / runes code samples for Simple Table for Svelte and a comparison to svelte-headless-table, SVAR DataGrid, and Flowbite."
      framework="svelte"
      heroBadges={["Svelte", "Tutorial", "Column Resizing"]}
      datePublished={svelteGridColumnResizingPost.createdAt}
      dateModified={svelteGridColumnResizingPost.updatedAt}
      introParagraphs={[
        "Column resizing is one of those features users miss only when it's gone. The moment a content cell truncates with an ellipsis, somebody reaches for the column edge and tries to drag.",
        "This tutorial walks through column resizing patterns for the Svelte data grid landscape—svelte-headless-table, SVAR DataGrid, Flowbite—and shows the Simple Table for Svelte setup with both Svelte 4 stores and Svelte 5 runes.",
        "If you also need pinning, virtualization, and grouping with aggregations, Simple Table for Svelte ships them all in one MIT package.",
      ]}
      whyItMatters={[
        { title: "Density vs scannability", body: "Users adjust columns to suit their screen and the row data they're scanning—you don't have to guess for them." },
        { title: "Excel-like ergonomics", body: "Power users expect drag-handle resizing on column edges; without it, the grid feels broken." },
        { title: "Pinned-column compatibility", body: "Resizing a pinned column has to recalc the sticky offset; a quality grid handles this for you." },
        { title: "Persisting widths", body: "Many teams need user-customized layouts persisted to localStorage or the server." },
      ]}
      libraryRows={[
        { library: "Simple Table for Svelte", support: { value: "Built-in", tone: "good" }, notes: "columnResizing={true} prop; works with Svelte 4 stores and Svelte 5 runes." },
        { library: "svelte-headless-table", support: { value: "Manual (plugin)", tone: "neutral" }, notes: "Headless—you build the resize handles and rendering yourself." },
        { library: "SVAR DataGrid (Svelte)", support: { value: "Built-in (commercial)", tone: "neutral" }, notes: "Resize built-in but commercial license required for production." },
        { library: "Flowbite Svelte Table", support: { value: "Manual", tone: "bad" }, notes: "Markup-only utilities; resize is DIY with CSS + drag handlers." },
      ]}
      simpleTableSection={{
        headline: "Implementation: Simple Table for Svelte",
        intro: "Enable column resizing with a single prop on the <SimpleTable> component. Pair with auto-expand to keep total width pinned to the container.",
                notes: <>Use the <code>browser</code> guard from <code>$app/environment</code> when accessing <code>localStorage</code> in SvelteKit so you don't break SSR.</>,
      }}
      pitfalls={[
        { title: "SSR breakage on localStorage access", problem: "Accessing localStorage during render breaks SvelteKit SSR.", solution: "Guard with the browser flag from $app/environment, or use $effect which only runs client-side." },
        { title: "Resize handles too narrow on touch", problem: "Mobile users can't grab the 4px column edge.", solution: "Use a library that auto-widens handles for touch (Simple Table does this)." },
        { title: "Resizing breaks pinned columns", problem: "Sticky offsets get out of sync.", solution: "Use a grid that recalculates pinned offsets on resize—Simple Table does this automatically." },
        { title: "Widths lost on hydration", problem: "Server-rendered widths flicker on hydration.", solution: "Apply persisted widths inside $effect, after hydration completes." },
      ]}
      faqs={[
        { question: "Does this work with Svelte 4 stores?", answer: "Yes. Replace $state with writable() stores and bind:headers still works—Simple Table is store-compatible." },
        { question: "Can I disable resizing per column?", answer: "Yes—set isResizable: false on individual HeaderObject entries." },
        { question: "Does it work with virtualization?", answer: "Yes. Virtualized 1M-row tables resize columns at 60fps." },
      ]}
      conclusionParagraphs={[
        "Column resizing in Svelte / SvelteKit is a one-line prop on Simple Table. svelte-headless-table is fully headless (you build resize yourself); SVAR ships it but is commercial; Flowbite is markup-only.",
        "If you need resize alongside virtualization, pinning, and grouping, Simple Table for Svelte is the focused MIT pick—Svelte 5 runes ready.",
      ]}
      relatedLinks={[
        { href: "/blog/sveltekit-data-table-simple-table", label: "Pillar guide: best free SvelteKit data table in 2026" },
        { href: "/docs/column-resizing", label: "Column resizing documentation" },
        { href: "/frameworks/svelte", label: "Svelte integration hub" },
      ]}
      ctaTitle="Add column resizing to your Svelte grid"
      ctaDescription="Simple Table for Svelte ships resize, pinning, grouping, and editing in one MIT package—~70 kB gzipped, Svelte 5 runes ready."
      docsHref="/docs/column-resizing"
    />
  );
}
