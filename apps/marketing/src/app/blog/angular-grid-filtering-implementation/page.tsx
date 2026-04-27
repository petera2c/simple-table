import type { Metadata } from "next";
import FrameworkTutorialLayout from "@/components/blog/FrameworkTutorialLayout";
import { SEO_STRINGS } from "@/constants/strings/seo";
import { angularGridFilteringPost } from "@/constants/blogPosts";

export const metadata: Metadata = {
  title: angularGridFilteringPost.title,
  description: angularGridFilteringPost.description,
  keywords:
    "angular grid filtering, angular table column filter, quick filter angular, custom filter predicate angular, ag grid angular filter, primeng filter, simple table angular",
  openGraph: {
    title: angularGridFilteringPost.title,
    description: angularGridFilteringPost.description,
    type: "article",
    images: [SEO_STRINGS.site.ogImage],
    siteName: SEO_STRINGS.site.name,
  },
  twitter: {
    card: "summary_large_image",
    title: angularGridFilteringPost.title,
    description: angularGridFilteringPost.description,
    creator: SEO_STRINGS.site.creator,
    images: SEO_STRINGS.site.ogImage.url,
  },
  alternates: { canonical: `/blog/${angularGridFilteringPost.slug}` },
};

export default function Page() {
  return (
    <FrameworkTutorialLayout
      slug={angularGridFilteringPost.slug}
      title={angularGridFilteringPost.title}
      subtitle="Column filters, quick search, and custom predicates for Angular data grids—idiomatic standalone-component examples for Simple Table for Angular and a comparison to AG Grid Angular and PrimeNG."
      framework="angular"
      heroBadges={["Angular", "Tutorial", "Filtering"]}
      datePublished={angularGridFilteringPost.createdAt}
      dateModified={angularGridFilteringPost.updatedAt}
      introParagraphs={[
        "Filtering is the bread-and-butter feature users hit before sorting or even rendering all rows. Get the typing wrong (string vs number vs date) and your filter UX feels broken.",
        "This tutorial walks through column filters, a global quick filter, and custom predicates for the Angular data grid landscape—and shows the Simple Table for Angular setup with signals.",
        "If you also need pinning, virtualization, and grouping with aggregations alongside filtering, Simple Table for Angular ships them all in one MIT package.",
      ]}
      whyItMatters={[
        { title: "Faster discovery", body: "Users find rows by typing or selecting; they don't scan thousands of rows visually." },
        { title: "Type-aware filtering", body: "Strings need contains/equals; numbers need >, <, between; dates need calendar pickers." },
        { title: "Combinable with sort/group", body: "Filter, then sort, then group. The order matters for performance and UX." },
        { title: "Server vs client", body: "Small datasets filter client-side; large ones round-trip to the server. Both are common." },
      ]}
      libraryRows={[
        { library: "Simple Table for Angular", support: { value: "Built-in column filters + quick filter", tone: "good" }, notes: "[filterable]=\"true\" + type-aware predicates; quick filter input via [globalFilter]." },
        { library: "AG Grid Angular", support: { value: "Built-in", tone: "good" }, notes: "filter: 'agTextColumnFilter' / 'agNumberColumnFilter'; advanced filters Enterprise-only." },
        { library: "ngx-datatable", support: { value: "Manual", tone: "bad" }, notes: "Bring your own filtering—library renders rows you pre-filter in your component." },
        { library: "PrimeNG Table", support: { value: "Built-in", tone: "good" }, notes: "[filters]=\"...\" with matchMode and <p-columnFilter>." },
        { library: "Angular Material mat-table", support: { value: "Manual", tone: "bad" }, notes: "Wire MatTableDataSource.filter manually with a string + filterPredicate." },
      ]}
      simpleTableSection={{
        headline: "Implementation: Simple Table for Angular",
        intro: "Set filterable=\"true\" globally or per-column for built-in filter chips. Add a quick search input and bind it via globalFilter. Plug in custom predicates for advanced cases.",
                notes: (
          <>
            For 100k+ rows, debounce the input by 150–250ms and consider server-side filtering. Simple Table accepts pre-filtered rows; combine with your service layer to round-trip queries to the API.
          </>
        ),
      }}
      pitfalls={[
        { title: "String filtering on numbers", problem: "Sorting and filtering treat \"10\" < \"2\" because they're strings.", solution: "Set the column type='number' so type-aware predicates kick in." },
        { title: "Filter resets on data refetch", problem: "Polling refresh wipes the user's filter input.", solution: "Hold the filter value in a signal at the parent, not inside the table; pass it back in via [quickFilter]." },
        { title: "Slow on every keystroke", problem: "Filtering 50k rows on every keystroke janks.", solution: "Debounce input by 150–250ms or filter server-side." },
        { title: "Date strings aren't filterable", problem: "ISO strings sort/filter alphabetically, which breaks for dates.", solution: "Set type='date' (or pass Date objects) so the grid knows to compare temporally." },
      ]}
      faqs={[
        { question: "Can I filter server-side?", answer: "Yes. Treat the table as a render layer and pre-filter rows in your service. Bind the user's filter values to your service request and pass the result back in." },
        { question: "What about advanced filters (between, OR, NOT)?", answer: "Simple Table supports comparison operators per column type. For OR / multi-value advanced filters, render a filter UI above the grid and pre-filter rows in your component." },
        { question: "Does filtering combine with virtualization?", answer: "Yes. The filtered row set is what the virtualizer renders, so 1M-row datasets remain smooth after filtering." },
      ]}
      conclusionParagraphs={[
        "Filtering in Angular is a single input on Simple Table. AG Grid covers it with more APIs (and Enterprise-tier advanced filters); mat-table requires DIY.",
        "Always set the right column type so type-aware predicates work, debounce on large datasets, and consider server-side filtering for 100k+ rows.",
      ]}
      relatedLinks={[
        { href: "/blog/angular-data-grid-simple-table", label: "Pillar guide: best free Angular data grid in 2026" },
        { href: "/docs/column-filtering", label: "Column filtering documentation" },
        { href: "/frameworks/angular", label: "Angular integration hub" },
      ]}
      ctaTitle="Add filtering to your Angular grid"
      ctaDescription="Simple Table for Angular ships column filters, quick filter, and custom predicates in one MIT package—~70 kB gzipped, signals-native."
      docsHref="/docs/column-filtering"
    />
  );
}
