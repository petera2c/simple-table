import type { Metadata } from "next";
import FrameworkTutorialLayout from "@/components/blog/FrameworkTutorialLayout";
import { SEO_STRINGS } from "@/constants/strings/seo";
import { solidGridFilteringPost } from "@/constants/blogPosts";

export const metadata: Metadata = {
  title: solidGridFilteringPost.title,
  description: solidGridFilteringPost.description,
  keywords:
    "solidjs grid filtering, solid table column filter, tanstack solid table filter, simple table solid, signals data grid",
  openGraph: {
    title: solidGridFilteringPost.title,
    description: solidGridFilteringPost.description,
    type: "article",
    images: [SEO_STRINGS.site.ogImage],
    siteName: SEO_STRINGS.site.name,
  },
  twitter: {
    card: "summary_large_image",
    title: solidGridFilteringPost.title,
    description: solidGridFilteringPost.description,
    creator: SEO_STRINGS.site.creator,
    images: SEO_STRINGS.site.ogImage.url,
  },
  alternates: { canonical: `/blog/${solidGridFilteringPost.slug}` },
};

export default function Page() {
  return (
    <FrameworkTutorialLayout
      slug={solidGridFilteringPost.slug}
      title={solidGridFilteringPost.title}
      subtitle="Column filters, quick search, and custom predicates for SolidJS data grids—signals-native examples for Simple Table for Solid and a comparison to TanStack Solid Table."
      framework="solid"
      heroBadges={["SolidJS", "Tutorial", "Filtering"]}
      datePublished={solidGridFilteringPost.createdAt}
      dateModified={solidGridFilteringPost.updatedAt}
      introParagraphs={[
        "Filtering is the bread-and-butter feature users hit before sorting or even rendering all rows. Get the typing wrong (string vs number vs date) and your filter UX feels broken.",
        "This tutorial walks through column filters, a global quick filter, and custom predicates for the SolidJS data grid landscape and shows the Simple Table for Solid setup with signals.",
        "If you also need pinning, virtualization, and grouping with aggregations alongside filtering, Simple Table for Solid ships them all in one MIT package.",
      ]}
      whyItMatters={[
        { title: "Faster discovery", body: "Users find rows by typing or selecting; they don't scan thousands of rows visually." },
        { title: "Type-aware filtering", body: "Strings need contains/equals; numbers need >, <, between; dates need calendar pickers." },
        { title: "Combinable with sort/group", body: "Filter, then sort, then group. The order matters for performance and UX." },
        { title: "Server vs client", body: "Small datasets filter client-side; large ones round-trip to the server. Both are common." },
      ]}
      libraryRows={[
        { library: "Simple Table for Solid", support: { value: "Built-in column filters + quick filter", tone: "good" }, notes: "filterable={true} + type-aware predicates; quickFilter prop for global search." },
        { library: "TanStack Solid Table", support: { value: "Headless", tone: "neutral" }, notes: "Provides filter state via column.getFilterValue; you build the inputs and rendering." },
        { library: "Kobalte primitives", support: { value: "Not applicable", tone: "neutral" }, notes: "Kobalte is a primitives library, not a data-grid solution." },
      ]}
      simpleTableSection={{
        headline: "Implementation: Simple Table for Solid",
        intro: "Set filterable={true} globally or per-column for built-in filter chips. Add a quick-search input and bind it via quickFilter. Plug in custom predicates for advanced cases.",
                notes: <>For 100k+ rows, debounce the quick-filter input by 150-250ms and consider server-side filtering via <code>createResource</code>—you get loading state for free.</>,
      }}
      pitfalls={[
        { title: "String filtering on numbers", problem: "Sorting and filtering treat \"10\" < \"2\" because they're strings.", solution: "Set the column type='number' so type-aware predicates kick in." },
        { title: "Filter resets on data refetch", problem: "Polling refresh wipes the user's filter input.", solution: "Hold the filter signal at the parent, not inside the table; pass it back in via quickFilter prop." },
        { title: "Slow on every keystroke", problem: "Filtering 50k rows on every keystroke janks.", solution: "Debounce input by 150-250ms or filter server-side." },
        { title: "Date strings aren't filterable", problem: "ISO strings sort/filter alphabetically, which breaks for dates.", solution: "Set type='date' (or pass Date objects) so the grid knows to compare temporally." },
      ]}
      faqs={[
        { question: "Can I filter server-side?", answer: "Yes. Use createResource keyed on your query signal so refetch happens automatically when filters change." },
        { question: "Does it pair with createStore?", answer: "Yes. Pass a store-backed rows source; Solid's fine-grained reactivity makes updates smooth." },
        { question: "Does filtering combine with virtualization?", answer: "Yes. The filtered row set is what the virtualizer renders, so 1M-row datasets remain smooth after filtering." },
      ]}
      conclusionParagraphs={[
        "Filtering in SolidJS is a single prop on Simple Table. TanStack Solid Table is headless—you wire inputs and rendering manually.",
        "Always set the right column type so type-aware predicates work, debounce on large datasets, and consider server-side filtering for 100k+ rows.",
      ]}
      relatedLinks={[
        { href: "/blog/solidjs-data-grid-simple-table", label: "Pillar guide: best free SolidJS data grid in 2026" },
        { href: "/docs/column-filtering", label: "Column filtering documentation" },
        { href: "/frameworks/solid", label: "Solid integration hub" },
      ]}
      ctaTitle="Add filtering to your Solid grid"
      ctaDescription="Simple Table for Solid ships column filters, quick filter, and custom predicates in one MIT package—~70 kB gzipped, signals-native."
      docsHref="/docs/column-filtering"
    />
  );
}
