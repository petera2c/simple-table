import type { Metadata } from "next";
import FrameworkTutorialLayout from "@/components/blog/FrameworkTutorialLayout";
import { SEO_STRINGS } from "@/constants/strings/seo";
import { solidGridColumnResizingPost } from "@/constants/blogPosts";

export const metadata: Metadata = {
  title: solidGridColumnResizingPost.title,
  description: solidGridColumnResizingPost.description,
  keywords:
    "solidjs column resizing, solid-start data grid, tanstack solid table column resize, simple table solid, signals data grid",
  openGraph: {
    title: solidGridColumnResizingPost.title,
    description: solidGridColumnResizingPost.description,
    type: "article",
    images: [SEO_STRINGS.site.ogImage],
    siteName: SEO_STRINGS.site.name,
  },
  twitter: {
    card: "summary_large_image",
    title: solidGridColumnResizingPost.title,
    description: solidGridColumnResizingPost.description,
    creator: SEO_STRINGS.site.creator,
    images: SEO_STRINGS.site.ogImage.url,
  },
  alternates: { canonical: `/blog/${solidGridColumnResizingPost.slug}` },
};

export default function Page() {
  return (
    <FrameworkTutorialLayout
      slug={solidGridColumnResizingPost.slug}
      title={solidGridColumnResizingPost.title}
      subtitle="Resizable columns are essential for data-heavy SolidJS apps. This guide walks through implementation, library trade-offs, and pitfalls—with signals-native code samples for Simple Table for Solid and a comparison to TanStack Solid Table."
      framework="solid"
      heroBadges={["SolidJS", "Tutorial", "Column Resizing"]}
      datePublished={solidGridColumnResizingPost.createdAt}
      dateModified={solidGridColumnResizingPost.updatedAt}
      introParagraphs={[
        "Column resizing is one of those features users miss only when it's gone. The moment a content cell truncates with an ellipsis, somebody reaches for the column edge and tries to drag.",
        "This tutorial walks through column resizing patterns for the Solid ecosystem—TanStack Solid Table, Kobalte primitives, and Simple Table for Solid—and shows the signals-native setup.",
        "If you also need pinning, virtualization, and grouping with aggregations, Simple Table for Solid ships them all in one MIT package.",
      ]}
      whyItMatters={[
        { title: "Density vs scannability", body: "Users adjust columns to suit their screen and the row data they're scanning—you don't have to guess for them." },
        { title: "Excel-like ergonomics", body: "Power users expect drag-handle resizing on column edges; without it, the grid feels broken." },
        { title: "Pinned-column compatibility", body: "Resizing a pinned column has to recalc the sticky offset; a quality grid handles this for you." },
        { title: "Persisting widths", body: "Many teams need user-customized layouts persisted to localStorage or the server." },
      ]}
      libraryRows={[
        { library: "Simple Table for Solid", support: { value: "Built-in", tone: "good" }, notes: "columnResizing={true} prop; signals-native, fine-grained reactive." },
        { library: "TanStack Solid Table", support: { value: "Headless (manual)", tone: "neutral" }, notes: "Provides resize state via column.getIsResizing; you build handles + DOM events." },
        { library: "Kobalte primitives", support: { value: "Manual", tone: "bad" }, notes: "No data-grid—Kobalte is a primitives library for popovers, dialogs, etc." },
      ]}
      simpleTableSection={{
        headline: "Implementation: Simple Table for Solid",
        intro: "Enable column resizing with a single prop on the <SimpleTable> component. Pair with auto-expand to keep total width pinned to the container.",
                notes: <>For Solid-Start SSR, guard <code>localStorage</code> access in <code>onMount</code> so it only runs client-side.</>,
      }}
      pitfalls={[
        { title: "SSR breakage on localStorage", problem: "Accessing localStorage during render breaks Solid-Start SSR.", solution: "Guard with onMount, which only runs client-side." },
        { title: "Resize handles too narrow on touch", problem: "Mobile users can't grab the 4px column edge.", solution: "Use a library that auto-widens handles for touch (Simple Table does this)." },
        { title: "Resizing breaks pinned columns", problem: "Sticky offsets get out of sync.", solution: "Use a grid that recalculates pinned offsets on resize—Simple Table does this automatically." },
        { title: "Reactive overhead", problem: "Recreating the entire headers array on each resize triggers excess updates.", solution: "Simple Table batches resize updates and uses fine-grained reactive primitives—only affected cells rerender." },
      ]}
      faqs={[
        { question: "Can I disable resizing per column?", answer: "Yes—set isResizable: false on individual HeaderObject entries." },
        { question: "Does it work with virtualization?", answer: "Yes. Virtualized 1M-row tables resize columns at 60fps." },
        { question: "Does it pair with createStore?", answer: "Yes. Pass a store as the rows source; Solid's fine-grained reactivity makes updates smooth." },
      ]}
      conclusionParagraphs={[
        "Column resizing in SolidJS is a one-line prop on Simple Table. TanStack Solid Table is headless and requires DIY handles; Kobalte doesn't ship a grid.",
        "If you need resize alongside virtualization, pinning, and grouping, Simple Table for Solid is the focused MIT pick—signals-native, ~70 kB gzipped.",
      ]}
      relatedLinks={[
        { href: "/blog/solidjs-data-grid-simple-table", label: "Pillar guide: best free SolidJS data grid in 2026" },
        { href: "/docs/column-resizing", label: "Column resizing documentation" },
        { href: "/frameworks/solid", label: "Solid integration hub" },
      ]}
      ctaTitle="Add column resizing to your Solid grid"
      ctaDescription="Simple Table for Solid ships resize, pinning, grouping, and editing in one MIT package—~70 kB gzipped, signals-native, Solid-Start ready."
      docsHref="/docs/column-resizing"
    />
  );
}
