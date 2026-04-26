import type { Metadata } from "next";
import FrameworkTutorialLayout from "@/components/blog/FrameworkTutorialLayout";
import { SEO_STRINGS } from "@/constants/strings/seo";
import { angularGridColumnPinningPost } from "@/constants/blogPosts";

export const metadata: Metadata = {
  title: angularGridColumnPinningPost.title,
  description: angularGridColumnPinningPost.description,
  keywords:
    "angular column pinning, freeze columns angular, sticky columns angular table, ag grid angular pinned columns, primeng frozen columns, simple table angular",
  openGraph: {
    title: angularGridColumnPinningPost.title,
    description: angularGridColumnPinningPost.description,
    type: "article",
    images: [SEO_STRINGS.site.ogImage],
    siteName: SEO_STRINGS.site.name,
  },
  twitter: {
    card: "summary_large_image",
    title: angularGridColumnPinningPost.title,
    description: angularGridColumnPinningPost.description,
    creator: SEO_STRINGS.site.creator,
    images: SEO_STRINGS.site.ogImage.url,
  },
  alternates: { canonical: `/blog/${angularGridColumnPinningPost.slug}` },
};

export default function Page() {
  return (
    <FrameworkTutorialLayout
      slug={angularGridColumnPinningPost.slug}
      title={angularGridColumnPinningPost.title}
      subtitle="Pin Angular table columns to the left or right with sticky headers—idiomatic standalone-component examples for Simple Table for Angular and a comparison to AG Grid Angular and PrimeNG."
      framework="angular"
      heroBadges={["Angular", "Tutorial", "Column Pinning"]}
      datePublished={angularGridColumnPinningPost.createdAt}
      dateModified={angularGridColumnPinningPost.updatedAt}
      introParagraphs={[
        "Wide tables with 20+ columns become unusable without pinning. Users lose context as they scroll horizontally—what row am I on? Pin the identifier column on the left and an actions column on the right and the UX clicks back into place.",
        "This tutorial walks through column pinning patterns for the Angular data grid landscape and shows the Simple Table for Angular setup with signals.",
        "If you also need virtualization, grouping with aggregations, and inline editing alongside pinning, Simple Table for Angular is the focused MIT pick.",
      ]}
      whyItMatters={[
        { title: "Context anchoring", body: "Users don't lose track of what row they're on as they scroll horizontally." },
        { title: "Action accessibility", body: "Pin Edit / Delete / Open buttons on the right so they're always within reach." },
        { title: "Wide-table support", body: "30+ columns become navigable when key columns stay sticky." },
        { title: "Excel-like ergonomics", body: "Power users expect Freeze Panes; pinning delivers the same affordance." },
      ]}
      libraryRows={[
        { library: "Simple Table for Angular", support: { value: "Built-in (left + right)", tone: "good" }, notes: "pinned: 'left' | 'right' on HeaderObject; sticky on horizontal scroll." },
        { library: "AG Grid Angular", support: { value: "Built-in", tone: "good" }, notes: "pinned: 'left' | 'right' on column defs." },
        { library: "PrimeNG Table", support: { value: "Built-in", tone: "good" }, notes: "frozenColumns + scrollable + scrollDirection='horizontal'." },
        { library: "ngx-datatable", support: { value: "Limited", tone: "neutral" }, notes: "[frozenLeft] / [frozenRight] but limited theming and edge cases." },
        { library: "Angular Material mat-table", support: { value: "Manual", tone: "bad" }, notes: "Use sticky directive + position: sticky CSS; corner cases require custom z-index management." },
      ]}
      simpleTableSection={{
        headline: "Implementation: Simple Table for Angular",
        intro: "Set pinned: 'left' or pinned: 'right' on individual HeaderObjects. Simple Table handles z-index, sticky positioning, and shadow indicators automatically.",
                notes: (
          <>
            Keep pinned columns narrow (under ~30% of viewport) so the scrolling area stays usable. Combine with <code>columnResizing</code> if users should be able to resize pinned columns.
          </>
        ),
      }}
      pitfalls={[
        { title: "Too many pinned columns", problem: "Users pin 8 of 12 columns; the scrolling area becomes useless.", solution: "Cap pinned columns at 2–3 each side, or warn the user beyond a threshold." },
        { title: "Pinned column width mismatch", problem: "Resizing a pinned column doesn't update the sticky offset.", solution: "Pick a library that handles offset recalculation on resize. Simple Table does this automatically." },
        { title: "Z-index battles with editors / dropdowns", problem: "Cell editors render below the pinned column, getting clipped.", solution: "Render editors / popovers in a portal at the document root, not inside the cell." },
        { title: "Mobile horizontal scroll feels broken", problem: "Pinned columns over-fill the viewport on small screens.", solution: "Conditionally disable pinning at < 768px (use @angular/cdk/layout BreakpointObserver)." },
      ]}
      faqs={[
        { question: "Can users reorder pinned columns?", answer: "Yes—Simple Table supports column reordering, including across the pinned/unpinned boundary. Set columnReordering=\"true\"." },
        { question: "What about pinning rows (not just columns)?", answer: "Row pinning is on the roadmap. Until then, render pinned rows in a separate header / footer slot." },
        { question: "Does pinning work with virtualization?", answer: "Yes. The pinned columns are rendered separately from the virtualized scroll area; performance is unchanged for 1M rows." },
      ]}
      conclusionParagraphs={[
        "Column pinning in Angular is a single property on Simple Table. AG Grid and PrimeNG support it natively too; mat-table requires manual sticky CSS with z-index management.",
        "Cap the number of pinned columns and disable pinning on small viewports to keep the scrolling area usable.",
      ]}
      relatedLinks={[
        { href: "/blog/angular-data-grid-simple-table", label: "Pillar guide: best free Angular data grid in 2026" },
        { href: "/docs/column-pinning", label: "Column pinning documentation" },
        { href: "/frameworks/angular", label: "Angular integration hub" },
      ]}
      ctaTitle="Add column pinning to your Angular grid"
      ctaDescription="Simple Table for Angular ships left/right pinning, virtualization, and grouping in one MIT package—~70 kB gzipped, signals-native."
      docsHref="/docs/column-pinning"
    />
  );
}
