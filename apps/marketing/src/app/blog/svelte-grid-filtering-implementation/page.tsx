import type { Metadata } from "next";
import FrameworkTutorialLayout from "@/components/blog/FrameworkTutorialLayout";
import { SEO_STRINGS } from "@/constants/strings/seo";
import { svelteGridFilteringPost } from "@/constants/blogPosts";

export const metadata: Metadata = {
  title: svelteGridFilteringPost.title,
  description: svelteGridFilteringPost.description,
  keywords:
    "svelte grid filtering, sveltekit table search, svelte 5 runes data grid filter, svelte-headless-table filter, simple table svelte",
  openGraph: {
    title: svelteGridFilteringPost.title,
    description: svelteGridFilteringPost.description,
    type: "article",
    images: [SEO_STRINGS.site.ogImage],
    siteName: SEO_STRINGS.site.name,
  },
  twitter: {
    card: "summary_large_image",
    title: svelteGridFilteringPost.title,
    description: svelteGridFilteringPost.description,
    creator: SEO_STRINGS.site.creator,
    images: SEO_STRINGS.site.ogImage.url,
  },
  alternates: { canonical: `/blog/${svelteGridFilteringPost.slug}` },
};

export default function Page() {
  return (
    <FrameworkTutorialLayout
      slug={svelteGridFilteringPost.slug}
      title={svelteGridFilteringPost.title}
      subtitle="Column filters, quick search, and custom predicates for SvelteKit data grids—idiomatic Svelte 5 / runes examples for Simple Table for Svelte and a comparison to svelte-headless-table, SVAR DataGrid, and Flowbite."
      framework="svelte"
      heroBadges={["Svelte", "Tutorial", "Filtering"]}
      datePublished={svelteGridFilteringPost.createdAt}
      dateModified={svelteGridFilteringPost.updatedAt}
      introParagraphs={[
        "Filtering is the bread-and-butter feature users hit before sorting or even rendering all rows. Get the typing wrong (string vs number vs date) and your filter UX feels broken.",
        "This tutorial walks through column filters, a global quick filter, and custom predicates for the Svelte data grid landscape and shows the Simple Table for Svelte setup with both Svelte 4 stores and Svelte 5 runes.",
        "If you also need pinning, virtualization, and grouping with aggregations alongside filtering, Simple Table for Svelte ships them all in one MIT package.",
      ]}
      whyItMatters={[
        { title: "Faster discovery", body: "Users find rows by typing or selecting; they don't scan thousands of rows visually." },
        { title: "Type-aware filtering", body: "Strings need contains/equals; numbers need >, <, between; dates need calendar pickers." },
        { title: "Combinable with sort/group", body: "Filter, then sort, then group. The order matters for performance and UX." },
        { title: "Server vs client", body: "Small datasets filter client-side; large ones round-trip to the server. Both are common." },
      ]}
      libraryRows={[
        { library: "Simple Table for Svelte", support: { value: "Built-in column filters + quick filter", tone: "good" }, notes: "filterable={true} + type-aware predicates; quickFilter prop for global search." },
        { library: "svelte-headless-table", support: { value: "Plugin (manual)", tone: "neutral" }, notes: "addColumnFilters / addTableFilter plugins; rendering is DIY." },
        { library: "SVAR DataGrid (Svelte)", support: { value: "Built-in (commercial)", tone: "neutral" }, notes: "Filtering built-in but commercial license required." },
        { library: "Flowbite Svelte Table", support: { value: "Manual", tone: "bad" }, notes: "Markup-only—pre-filter rows in your route's load function." },
      ]}
      simpleTableSection={{
        headline: "Implementation: Simple Table for Svelte",
        intro: "Set filterable={true} globally or per-column for built-in filter chips. Add a quick-search input and bind it via quickFilter. Plug in custom predicates for advanced cases.",
                notes: <>For 100k+ rows, debounce the quick-filter input by 150-250ms and consider server-side filtering through SvelteKit's <code>load</code> function—you get URL-shareable filter state for free.</>,
      }}
      pitfalls={[
        { title: "String filtering on numbers", problem: "Sorting and filtering treat \"10\" < \"2\" because they're strings.", solution: "Set the column type='number' so type-aware predicates kick in." },
        { title: "Filter resets on data refetch", problem: "Polling refresh wipes the user's filter input.", solution: "Hold the filter value in $state at the parent, not inside the table; pass it back in via quickFilter prop." },
        { title: "Slow on every keystroke", problem: "Filtering 50k rows on every keystroke janks.", solution: "Debounce input by 150-250ms or filter server-side." },
        { title: "Date strings aren't filterable", problem: "ISO strings sort/filter alphabetically, which breaks for dates.", solution: "Set type='date' (or pass Date objects) so the grid knows to compare temporally." },
      ]}
      faqs={[
        { question: "Can I filter server-side?", answer: "Yes. Use SvelteKit's load function to fetch filtered rows; mirror filter state to URL search params for shareable links." },
        { question: "Does it work with Svelte 4 stores?", answer: "Yes. Replace $state with writable() and bind:value still works." },
        { question: "Does filtering combine with virtualization?", answer: "Yes. The filtered row set is what the virtualizer renders, so 1M-row datasets remain smooth after filtering." },
      ]}
      conclusionParagraphs={[
        "Filtering in Svelte is a single prop on Simple Table. svelte-headless-table requires plugin wiring; SVAR ships it commercially; Flowbite is DIY.",
        "Always set the right column type so type-aware predicates work, debounce on large datasets, and consider server-side filtering for 100k+ rows.",
      ]}
      relatedLinks={[
        { href: "/blog/sveltekit-data-table-simple-table", label: "Pillar guide: best free SvelteKit data table in 2026" },
        { href: "/docs/column-filtering", label: "Column filtering documentation" },
        { href: "/frameworks/svelte", label: "Svelte integration hub" },
      ]}
      ctaTitle="Add filtering to your Svelte grid"
      ctaDescription="Simple Table for Svelte ships column filters, quick filter, and custom predicates in one MIT package—~70 kB gzipped, Svelte 5 runes ready."
      docsHref="/docs/column-filtering"
    />
  );
}
