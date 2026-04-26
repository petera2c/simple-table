import type { Metadata } from "next";
import FrameworkTutorialLayout from "@/components/blog/FrameworkTutorialLayout";
import { SEO_STRINGS } from "@/constants/strings/seo";
import { solidGridColumnPinningPost } from "@/constants/blogPosts";

export const metadata: Metadata = {
  title: solidGridColumnPinningPost.title,
  description: solidGridColumnPinningPost.description,
  keywords:
    "solidjs column pinning, freeze columns solid, sticky columns solid table, tanstack solid table pinning, simple table solid",
  openGraph: {
    title: solidGridColumnPinningPost.title,
    description: solidGridColumnPinningPost.description,
    type: "article",
    images: [SEO_STRINGS.site.ogImage],
    siteName: SEO_STRINGS.site.name,
  },
  twitter: {
    card: "summary_large_image",
    title: solidGridColumnPinningPost.title,
    description: solidGridColumnPinningPost.description,
    creator: SEO_STRINGS.site.creator,
    images: SEO_STRINGS.site.ogImage.url,
  },
  alternates: { canonical: `/blog/${solidGridColumnPinningPost.slug}` },
};

export default function Page() {
  return (
    <FrameworkTutorialLayout
      slug={solidGridColumnPinningPost.slug}
      title={solidGridColumnPinningPost.title}
      subtitle="Pin SolidJS table columns to the left or right with sticky headers—signals-native examples for Simple Table for Solid and a comparison to TanStack Solid Table."
      framework="solid"
      heroBadges={["SolidJS", "Tutorial", "Column Pinning"]}
      datePublished={solidGridColumnPinningPost.createdAt}
      dateModified={solidGridColumnPinningPost.updatedAt}
      introParagraphs={[
        "Wide tables with 20+ columns become unusable without pinning. Users lose context as they scroll horizontally—what row am I on? Pin the identifier column on the left and an actions column on the right and the UX clicks back into place.",
        "This tutorial walks through column pinning patterns for SolidJS data grids and shows the Simple Table for Solid setup with signals.",
        "If you also need virtualization, grouping with aggregations, and inline editing alongside pinning, Simple Table for Solid is the focused MIT pick.",
      ]}
      whyItMatters={[
        { title: "Context anchoring", body: "Users don't lose track of what row they're on as they scroll horizontally." },
        { title: "Action accessibility", body: "Pin Edit / Delete / Open buttons on the right so they're always within reach." },
        { title: "Wide-table support", body: "30+ columns become navigable when key columns stay sticky." },
        { title: "Excel-like ergonomics", body: "Power users expect Freeze Panes; pinning delivers the same affordance." },
      ]}
      libraryRows={[
        { library: "Simple Table for Solid", support: { value: "Built-in (left + right)", tone: "good" }, notes: "pinned: 'left' | 'right' on HeaderObject; sticky on horizontal scroll." },
        { library: "TanStack Solid Table", support: { value: "Headless", tone: "neutral" }, notes: "Provides pinning state via column.getIsPinned; sticky CSS and rendering are DIY." },
        { library: "Kobalte primitives", support: { value: "Not applicable", tone: "neutral" }, notes: "Kobalte is a primitives library, not a data-grid solution." },
      ]}
      simpleTableSection={{
        headline: "Implementation: Simple Table for Solid",
        intro: "Set pinned: 'left' or pinned: 'right' on individual HeaderObjects. Simple Table handles z-index, sticky positioning, and shadow indicators automatically.",
                notes: <>Keep pinned columns narrow (under ~30% of viewport) so the scrolling area stays usable. Combine with <code>columnResizing</code> if users should be able to resize pinned columns.</>,
      }}
      pitfalls={[
        { title: "Too many pinned columns", problem: "Users pin 8 of 12 columns; the scrolling area becomes useless.", solution: "Cap pinned columns at 2-3 each side, or warn the user beyond a threshold." },
        { title: "Pinned column width mismatch", problem: "Resizing a pinned column doesn't update the sticky offset.", solution: "Pick a library that handles offset recalculation on resize. Simple Table does this automatically." },
        { title: "Z-index battles with editors / dropdowns", problem: "Cell editors render below the pinned column, getting clipped.", solution: "Render editors / popovers in a portal at the document root using <Portal>." },
        { title: "Mobile horizontal scroll feels broken", problem: "Pinned columns over-fill the viewport on small screens.", solution: "Conditionally disable pinning at < 768px using a media-query signal." },
      ]}
      faqs={[
        { question: "Can users reorder pinned columns?", answer: "Yes—Simple Table supports column reordering, including across the pinned/unpinned boundary. Set columnReordering={true}." },
        { question: "Does it pair with createStore?", answer: "Yes. Headers and rows can both live in stores; Solid's fine-grained reactivity handles updates efficiently." },
        { question: "Does pinning work with virtualization?", answer: "Yes. The pinned columns are rendered separately from the virtualized scroll area; performance is unchanged for 1M rows." },
      ]}
      conclusionParagraphs={[
        "Column pinning in SolidJS is a single property on Simple Table. TanStack Solid Table is headless—you build sticky CSS and rendering yourself.",
        "Cap the number of pinned columns and disable pinning on small viewports to keep the scrolling area usable.",
      ]}
      relatedLinks={[
        { href: "/blog/solidjs-data-grid-simple-table", label: "Pillar guide: best free SolidJS data grid in 2026" },
        { href: "/docs/column-pinning", label: "Column pinning documentation" },
        { href: "/frameworks/solid", label: "Solid integration hub" },
      ]}
      ctaTitle="Add column pinning to your Solid grid"
      ctaDescription="Simple Table for Solid ships left/right pinning, virtualization, and grouping in one MIT package—~70 kB gzipped, signals-native."
      docsHref="/docs/column-pinning"
    />
  );
}
