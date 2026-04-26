import type { Metadata } from "next";
import FrameworkTutorialLayout from "@/components/blog/FrameworkTutorialLayout";
import { SEO_STRINGS } from "@/constants/strings/seo";
import { vanillaGridColumnPinningPost } from "@/constants/blogPosts";

export const metadata: Metadata = {
  title: vanillaGridColumnPinningPost.title,
  description: vanillaGridColumnPinningPost.description,
  keywords:
    "vanilla js column pinning, freeze columns typescript, sticky columns vanilla, tabulator frozen columns, simple-table-core pinning",
  openGraph: {
    title: vanillaGridColumnPinningPost.title,
    description: vanillaGridColumnPinningPost.description,
    type: "article",
    images: [SEO_STRINGS.site.ogImage],
    siteName: SEO_STRINGS.site.name,
  },
  twitter: {
    card: "summary_large_image",
    title: vanillaGridColumnPinningPost.title,
    description: vanillaGridColumnPinningPost.description,
    creator: SEO_STRINGS.site.creator,
    images: SEO_STRINGS.site.ogImage.url,
  },
  alternates: { canonical: `/blog/${vanillaGridColumnPinningPost.slug}` },
};

export default function Page() {
  return (
    <FrameworkTutorialLayout
      slug={vanillaGridColumnPinningPost.slug}
      title={vanillaGridColumnPinningPost.title}
      subtitle="Pin vanilla TypeScript table columns to the left or right with sticky headers—strict TypeScript examples for simple-table-core and a comparison to Tabulator and Handsontable."
      framework="vanilla"
      heroBadges={["Vanilla TS", "Tutorial", "Column Pinning"]}
      datePublished={vanillaGridColumnPinningPost.createdAt}
      dateModified={vanillaGridColumnPinningPost.updatedAt}
      introParagraphs={[
        "Wide tables with 20+ columns become unusable without pinning. Users lose context as they scroll horizontally—what row am I on? Pin the identifier column on the left and an actions column on the right and the UX clicks back into place.",
        "This tutorial walks through column pinning patterns for the vanilla JS / TS data grid landscape and shows the simple-table-core setup with strict TypeScript.",
        "If you also need virtualization, grouping with aggregations, and inline editing alongside pinning, simple-table-core is the focused MIT pick—~70 kB gzipped, framework-agnostic.",
      ]}
      whyItMatters={[
        { title: "Context anchoring", body: "Users don't lose track of what row they're on as they scroll horizontally." },
        { title: "Action accessibility", body: "Pin Edit / Delete / Open buttons on the right so they're always within reach." },
        { title: "Wide-table support", body: "30+ columns become navigable when key columns stay sticky." },
        { title: "Excel-like ergonomics", body: "Power users expect Freeze Panes; pinning delivers the same affordance." },
      ]}
      libraryRows={[
        { library: "simple-table-core", support: { value: "Built-in (left + right)", tone: "good" }, notes: "pinned: 'left' | 'right' on HeaderObject; sticky on horizontal scroll." },
        { library: "Tabulator", support: { value: "Built-in", tone: "good" }, notes: "frozen: true on column defs; sticky to left or right via column position." },
        { library: "Grid.js", support: { value: "Manual", tone: "bad" }, notes: "No native pinning—use position: sticky CSS on column cells." },
        { library: "Handsontable", support: { value: "Built-in (commercial)", tone: "neutral" }, notes: "Pinning built-in but commercial license required." },
        { library: "jSpreadsheet", support: { value: "Built-in", tone: "good" }, notes: "freezeColumns option; spreadsheet-style." },
      ]}
      simpleTableSection={{
        headline: "Implementation: simple-table-core",
        intro: "Set pinned: 'left' or pinned: 'right' on individual HeaderObjects. simple-table-core handles z-index, sticky positioning, and shadow indicators automatically.",
                notes: <>Keep pinned columns narrow (under ~30% of viewport) so the scrolling area stays usable. Combine with <code>columnResizing</code> if users should be able to resize pinned columns.</>,
      }}
      pitfalls={[
        { title: "Too many pinned columns", problem: "Users pin 8 of 12 columns; the scrolling area becomes useless.", solution: "Cap pinned columns at 2-3 each side, or warn the user beyond a threshold." },
        { title: "Pinned column width mismatch", problem: "Resizing a pinned column doesn't update the sticky offset.", solution: "Pick a library that handles offset recalculation on resize. simple-table-core does this automatically." },
        { title: "Z-index battles in shadow DOM", problem: "Editors / popovers render below the pinned column inside a shadow root.", solution: "Render popovers into the document body via slot-based portals, or use a high z-index inside the shadow tree." },
        { title: "Mobile horizontal scroll feels broken", problem: "Pinned columns over-fill the viewport on small screens.", solution: "Use a window matchMedia listener and call setHeaders to clear pinning at < 768px." },
      ]}
      faqs={[
        { question: "Can users reorder pinned columns?", answer: "Yes—simple-table-core supports column reordering, including across the pinned/unpinned boundary. Set columnReordering: true." },
        { question: "Does it work in a web component?", answer: "Yes. Mount inside the shadow root: pass shadowRoot.querySelector('#host') as the element." },
        { question: "Does pinning work with virtualization?", answer: "Yes. The pinned columns are rendered separately from the virtualized scroll area; performance is unchanged for 1M rows." },
      ]}
      conclusionParagraphs={[
        "Column pinning in vanilla JS / TS is a single property on simple-table-core. Tabulator supports it natively too; Grid.js requires DIY sticky CSS; Handsontable is commercial.",
        "Cap the number of pinned columns and disable pinning on small viewports to keep the scrolling area usable.",
      ]}
      relatedLinks={[
        { href: "/blog/vanilla-typescript-data-grid-simple-table-core", label: "Pillar guide: best free vanilla TypeScript data grid in 2026" },
        { href: "/docs/column-pinning", label: "Column pinning documentation" },
        { href: "/frameworks/vanilla", label: "Vanilla TS integration hub" },
      ]}
      ctaTitle="Add column pinning to your vanilla TS grid"
      ctaDescription="simple-table-core ships left/right pinning, virtualization, and grouping in one MIT package—~70 kB gzipped, strict TypeScript, ESM-first."
      docsHref="/docs/column-pinning"
    />
  );
}
