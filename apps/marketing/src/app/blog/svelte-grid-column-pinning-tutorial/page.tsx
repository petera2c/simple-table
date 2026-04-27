import type { Metadata } from "next";
import FrameworkTutorialLayout from "@/components/blog/FrameworkTutorialLayout";
import { SEO_STRINGS } from "@/constants/strings/seo";
import { svelteGridColumnPinningPost } from "@/constants/blogPosts";

export const metadata: Metadata = {
  title: svelteGridColumnPinningPost.title,
  description: svelteGridColumnPinningPost.description,
  keywords:
    "svelte column pinning, freeze columns sveltekit, sticky columns svelte, svelte 5 runes data grid, svelte-headless-table pinning, simple table svelte",
  openGraph: {
    title: svelteGridColumnPinningPost.title,
    description: svelteGridColumnPinningPost.description,
    type: "article",
    images: [SEO_STRINGS.site.ogImage],
    siteName: SEO_STRINGS.site.name,
  },
  twitter: {
    card: "summary_large_image",
    title: svelteGridColumnPinningPost.title,
    description: svelteGridColumnPinningPost.description,
    creator: SEO_STRINGS.site.creator,
    images: SEO_STRINGS.site.ogImage.url,
  },
  alternates: { canonical: `/blog/${svelteGridColumnPinningPost.slug}` },
};

export default function Page() {
  return (
    <FrameworkTutorialLayout
      slug={svelteGridColumnPinningPost.slug}
      title={svelteGridColumnPinningPost.title}
      subtitle="Pin Svelte table columns to the left or right with sticky headers—idiomatic Svelte 5 / runes examples for Simple Table for Svelte and a comparison to svelte-headless-table, SVAR DataGrid, and Flowbite."
      framework="svelte"
      heroBadges={["Svelte", "Tutorial", "Column Pinning"]}
      datePublished={svelteGridColumnPinningPost.createdAt}
      dateModified={svelteGridColumnPinningPost.updatedAt}
      introParagraphs={[
        "Wide tables with 20+ columns become unusable without pinning. Users lose context as they scroll horizontally—what row am I on? Pin the identifier column on the left and an actions column on the right and the UX clicks back into place.",
        "This tutorial walks through column pinning patterns for Svelte data grids and shows the Simple Table for Svelte setup with both Svelte 4 stores and Svelte 5 runes.",
        "If you also need virtualization, grouping with aggregations, and inline editing alongside pinning, Simple Table for Svelte is the focused MIT pick.",
      ]}
      whyItMatters={[
        { title: "Context anchoring", body: "Users don't lose track of what row they're on as they scroll horizontally." },
        { title: "Action accessibility", body: "Pin Edit / Delete / Open buttons on the right so they're always within reach." },
        { title: "Wide-table support", body: "30+ columns become navigable when key columns stay sticky." },
        { title: "Excel-like ergonomics", body: "Power users expect Freeze Panes; pinning delivers the same affordance." },
      ]}
      libraryRows={[
        { library: "Simple Table for Svelte", support: { value: "Built-in (left + right)", tone: "good" }, notes: "pinned: 'left' | 'right' on HeaderObject; sticky on horizontal scroll." },
        { library: "svelte-headless-table", support: { value: "Manual", tone: "bad" }, notes: "Headless—you build sticky positioning with CSS yourself." },
        { library: "SVAR DataGrid (Svelte)", support: { value: "Built-in (commercial)", tone: "neutral" }, notes: "Pinning built-in but commercial license required." },
        { library: "Flowbite Svelte Table", support: { value: "Manual", tone: "bad" }, notes: "Markup-only utilities; sticky columns are DIY with CSS." },
      ]}
      simpleTableSection={{
        headline: "Implementation: Simple Table for Svelte",
        intro: "Set pinned: 'left' or pinned: 'right' on individual HeaderObjects. Simple Table handles z-index, sticky positioning, and shadow indicators automatically.",
                notes: <>Keep pinned columns narrow (under ~30% of viewport) so the scrolling area stays usable. Combine with <code>columnResizing</code> if users should be able to resize pinned columns.</>,
      }}
      pitfalls={[
        { title: "Too many pinned columns", problem: "Users pin 8 of 12 columns; the scrolling area becomes useless.", solution: "Cap pinned columns at 2-3 each side, or warn the user beyond a threshold." },
        { title: "Pinned column width mismatch", problem: "Resizing a pinned column doesn't update the sticky offset.", solution: "Pick a library that handles offset recalculation on resize. Simple Table does this automatically." },
        { title: "Z-index battles with editors / dropdowns", problem: "Cell editors render below the pinned column, getting clipped.", solution: "Render editors / popovers in a portal at the document root." },
        { title: "Mobile horizontal scroll feels broken", problem: "Pinned columns over-fill the viewport on small screens.", solution: "Conditionally disable pinning at < 768px (use a media-query store)." },
      ]}
      faqs={[
        { question: "Can users reorder pinned columns?", answer: "Yes—Simple Table supports column reordering, including across the pinned/unpinned boundary. Set columnReordering={true}." },
        { question: "Does this work with Svelte 4 stores?", answer: "Yes. Replace $state with writable() and the pinning logic still works." },
        { question: "Does pinning work with virtualization?", answer: "Yes. The pinned columns are rendered separately from the virtualized scroll area; performance is unchanged for 1M rows." },
      ]}
      conclusionParagraphs={[
        "Column pinning in Svelte is a single property on Simple Table. svelte-headless-table is fully headless (you build sticky CSS); SVAR ships it commercially; Flowbite is DIY.",
        "Cap the number of pinned columns and disable pinning on small viewports to keep the scrolling area usable.",
      ]}
      relatedLinks={[
        { href: "/blog/sveltekit-data-table-simple-table", label: "Pillar guide: best free SvelteKit data table in 2026" },
        { href: "/docs/column-pinning", label: "Column pinning documentation" },
        { href: "/frameworks/svelte", label: "Svelte integration hub" },
      ]}
      ctaTitle="Add column pinning to your Svelte grid"
      ctaDescription="Simple Table for Svelte ships left/right pinning, virtualization, and grouping in one MIT package—~70 kB gzipped, Svelte 5 runes ready."
      docsHref="/docs/column-pinning"
    />
  );
}
