import type { Metadata } from "next";
import { faBolt, faCode, faDollarSign, faTrophy } from "@fortawesome/free-solid-svg-icons";
import FrameworkVsCompetitorLayout from "@/components/comparisons/FrameworkVsCompetitorLayout";
import { SEO_STRINGS } from "@/constants/strings/seo";

const TITLE = "svelte-headless-table vs Simple Table: Svelte 5 Feature Matrix";
const DESCRIPTION =
  "Feature-by-feature matrix: svelte-headless-table 0.18.3 (Svelte 4 peer, last release Oct 2024) vs @simple-table/svelte 4.3.2 (Svelte 5, MIT). Virtualization, pinning, grouping, editing, and maintenance status.";
const CANONICAL = "/comparisons/simple-table-vs-svelte-headless-table";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  keywords:
    "svelte-headless-table vs simple table, svelte-headless-table svelte 5, svelte-headless-table feature comparison, svelte 5 data grid, svelte runes data grid, svelte virtualization table",
  openGraph: { title: TITLE, description: DESCRIPTION, type: "article", images: [SEO_STRINGS.site.ogImage], siteName: SEO_STRINGS.site.name },
  twitter: { card: "summary_large_image", title: TITLE, description: DESCRIPTION, creator: SEO_STRINGS.site.creator, images: SEO_STRINGS.site.ogImage.url },
  alternates: { canonical: CANONICAL },
};

export default function SimpleTableVsSvelteHeadlessTablePage() {
  return (
    <FrameworkVsCompetitorLayout
      title={TITLE}
      subtitle="A side-by-side feature matrix, checked against npm on October 28, 2026. svelte-headless-table gives you unstyled primitives and full DOM control on Svelte 4. Simple Table for Svelte ships virtualization, pinning, grouping, and editing for Svelte 5."
      canonicalPath={CANONICAL}
      datePublished="2026-04-26"
      dateModified="2026-10-28"
      framework="svelte"
      competitorName="svelte-headless-table"
      competitorPackage="svelte-headless-table"
      heroBadges={[
        { icon: faTrophy, label: "Built for Svelte 5" },
        { icon: faBolt, label: "1M+ rows virtualization" },
        { icon: faDollarSign, label: "Free for everyone" },
        { icon: faCode, label: "Runes-friendly" },
      ]}
      introParagraphs={[
        "svelte-headless-table is a headless table builder for Svelte. It gives you reactive plugins (sort, filter, group, paginate) and total markup freedom: you write the table HTML yourself, and you own virtualization, pinning, themes, and accessibility.",
        "Maintenance status matters here. As of October 2026, the latest svelte-headless-table release on npm is 0.18.3, published October 28, 2024, and its peer dependency is svelte ^4.0.0. If your app is on Svelte 5 or planning the upgrade, check that before you commit to it.",
        "@simple-table/svelte (4.3.2) takes the opposite trade. It is batteries-included and built for Svelte 5 (peer dependency svelte >=5.0.0): virtualization for 1M+ rows, column pinning, row grouping with aggregations, inline editing, and themes ship in the box, MIT licensed and free for everyone.",
        "This page is the feature matrix. For the step-by-step move, see the migration guide. For the broader headless versus batteries-included trade-off, see the decision guide on the blog.",
      ]}
      whyChooseSimpleTable={[
        "Your app is on Svelte 5 (or moving there) and you want a grid whose peer dependency matches.",
        "You need virtualization for 100k+ rows without integrating a separate virtual list library.",
        "You want column pinning, grouping with aggregations, and inline editing as built-in features.",
        "You want a package with recent releases: @simple-table/svelte 4.3.2 shipped in October 2026.",
        "You also ship React, Vue, Angular, or Solid surfaces and want one shared engine.",
      ]}
      whyChooseCompetitor={[
        "You are staying on Svelte 4 for now and already have svelte-headless-table views that work.",
        "You want full control over every <table>, <tr>, and <td> element.",
        "You're building a custom design system where the visual appearance is bespoke.",
        "Your needs are basic enough that you don't need virtualization, pinning, grouping, or editing.",
      ]}
      featureRows={[
        { feature: "Svelte 5 peer dependency", simpleTable: { verdict: "yes", note: "svelte >=5.0.0." }, competitor: { verdict: "no", note: "0.18.3 declares svelte ^4.0.0." } },
        { feature: "Svelte 4 projects", simpleTable: { verdict: "no", note: "Requires Svelte 5." }, competitor: { verdict: "yes" } },
        { feature: "Latest npm release", simpleTable: { verdict: "yes", note: "4.3.2, October 2026." }, competitor: { verdict: "partial", note: "0.18.3, October 2024." } },
        { feature: "Batteries-included rendering", simpleTable: { verdict: "yes", note: "Default UI ships." }, competitor: { verdict: "no", note: "Headless: write your own table markup." } },
        { feature: "Row + column virtualization", simpleTable: { verdict: "yes", note: "Built-in." }, competitor: { verdict: "no", note: "Bring your own virtualization." } },
        { feature: "Column pinning (left / right)", simpleTable: { verdict: "yes", note: "Built-in." }, competitor: { verdict: "no", note: "Build manually." } },
        { feature: "Row grouping with aggregations", simpleTable: { verdict: "yes", note: "Built-in." }, competitor: { verdict: "partial", note: "addGroupedRows plugin; aggregations DIY." } },
        { feature: "Inline cell editing", simpleTable: { verdict: "yes", note: "Built-in." }, competitor: { verdict: "no", note: "Not provided; build your own." } },
        { feature: "Themeable via CSS variables", simpleTable: { verdict: "yes" }, competitor: { verdict: "yes", note: "Bring your own CSS." } },
        { feature: "TypeScript types", simpleTable: { verdict: "yes" }, competitor: { verdict: "yes" } },
        { feature: "License", simpleTable: { verdict: "yes", note: "MIT." }, competitor: { verdict: "yes", note: "MIT." } },
      ]}
      installCommand="npm install @simple-table/svelte"
      migrationCallout={<>svelte-headless-table&apos;s <code>createTable</code> + plugin pipeline becomes Simple Table&apos;s declarative <code>columns</code> + <code>rows</code>. You give up some plugin extensibility in exchange for a working data grid out of the box.</>}
      faqs={[
        { question: "Does svelte-headless-table support Svelte 5?", answer: "Its latest npm release, 0.18.3 (October 2024), lists svelte ^4.0.0 as its peer dependency, so package managers will warn or fail on a Svelte 5 install. Check the project's GitHub for current status before relying on it in a Svelte 5 app." },
        { question: "Does Simple Table for Svelte work on Svelte 4?", answer: "No. Since 4.1.2, @simple-table/svelte requires Svelte 5 (peer dependency svelte >=5.0.0). It works with $state, $derived, and SvelteKit's data-loading patterns." },
        { question: "Can I still customize the look of Simple Table?", answer: "Yes. Theming is via CSS variables, and you can pass Svelte components as cell, header, and footer renderers for total content control." },
        { question: "Does svelte-headless-table support virtualization?", answer: "Not built-in. You typically integrate it with svelte-virtual or @tanstack/virtual-core, which is doable but adds wiring and edge cases." },
      ]}
      conclusion={
        <>
          <p>If you are on Svelte 4, want maximum DOM control, and your grid needs are simple, svelte-headless-table still does the job. If you are on Svelte 5, or you need virtualization, pinning, grouping, and editing without building them, Simple Table for Svelte is the MIT-licensed alternative.</p>
        </>
      }
      relatedLinks={[
        { href: "/migrations/from-svelte-headless-table", label: "Migration guide: move from svelte-headless-table to Simple Table on Svelte 5" },
        { href: "/blog/simple-table-vs-svelte-headless-table", label: "Decision guide: headless vs batteries-included Svelte grids" },
        { href: "/blog/best-free-svelte-data-grid-2026", label: "Best free Svelte data grids in 2026" },
        { href: "/blog/sveltekit-data-table-simple-table", label: "Pillar guide: the best free SvelteKit data grid in 2026" },
        { href: "/frameworks/svelte", label: "Svelte integration hub" },
      ]}
    />
  );
}
