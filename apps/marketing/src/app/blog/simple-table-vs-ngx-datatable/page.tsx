import type { Metadata } from "next";
import CompetitorBlogLayout from "@/components/blog/CompetitorBlogLayout";
import { SEO_STRINGS } from "@/constants/strings/seo";
import { simpleTableVsNgxDatatablePost } from "@/constants/blogPosts";

export const metadata: Metadata = {
  title: simpleTableVsNgxDatatablePost.title,
  description: simpleTableVsNgxDatatablePost.description,
  keywords:
    "ngx-datatable alternative, swimlane datatable replacement, angular data grid, angular standalone components grid, angular 17 data grid, angular 18 data grid, simple table angular, mit angular table",
  openGraph: {
    title: simpleTableVsNgxDatatablePost.title,
    description: simpleTableVsNgxDatatablePost.description,
    type: "article",
    images: [SEO_STRINGS.site.ogImage],
    siteName: SEO_STRINGS.site.name,
  },
  twitter: {
    card: "summary_large_image",
    title: simpleTableVsNgxDatatablePost.title,
    description: simpleTableVsNgxDatatablePost.description,
    creator: SEO_STRINGS.site.creator,
    images: SEO_STRINGS.site.ogImage.url,
  },
  alternates: { canonical: `/blog/${simpleTableVsNgxDatatablePost.slug}` },
};

export default function Page() {
  return (
    <CompetitorBlogLayout
      slug={simpleTableVsNgxDatatablePost.slug}
      title={simpleTableVsNgxDatatablePost.title}
      subtitle="ngx-datatable was the de facto Angular grid for years, but its release cadence has slowed and its NgModule-era API feels dated next to standalone components and signals. Simple Table for Angular is a modern, signals-friendly MIT alternative."
      competitorName="ngx-datatable"
      framework="angular"
      heroBadges={["Comparison", "Migration", "Decision Guide"]}
      datePublished={simpleTableVsNgxDatatablePost.createdAt}
      dateModified={simpleTableVsNgxDatatablePost.updatedAt}
      introParagraphs={[
        "@swimlane/ngx-datatable was a first choice for Angular data grids for nearly a decade. It works, it's familiar, and it's installed in thousands of production Angular apps. But two things have changed: Angular's standalone components and signals have shifted what 'idiomatic' means, and ngx-datatable's release cadence has slowed enough that teams are routinely waiting on Angular-version compatibility patches.",
        "Simple Table for Angular is the MIT-licensed alternative built specifically for modern Angular. @simple-table/angular is a standalone component that supports Angular 17, 18, and 19, plays well with signals, and ships virtualization, pinning, grouping with aggregations, and inline editing in one ~70 kB gzipped package.",
        "This article walks through the real differences between ngx-datatable and Simple Table for Angular—API ergonomics, feature parity, performance, and migration cost—so you can decide whether your existing ngx-datatable app should keep upgrading or jump.",
      ]}
      comparisonRows={[
        { feature: "License", competitor: { value: "MIT", tone: "good" }, simpleTable: { value: "MIT", tone: "good" } },
        { feature: "Active maintenance cadence", competitor: { value: "Slower", tone: "bad" }, simpleTable: { value: "Active", tone: "good" } },
        { feature: "Standalone components", competitor: { value: "Workable, NgModule legacy", tone: "neutral" }, simpleTable: { value: "First-class", tone: "good" } },
        { feature: "Signals-native API", competitor: { value: "No", tone: "bad" }, simpleTable: { value: "Yes", tone: "good" } },
        { feature: "Row virtualization", competitor: { value: "Yes (scrollbarV)", tone: "good" }, simpleTable: { value: "Yes (built-in)", tone: "good" } },
        { feature: "Column virtualization", competitor: { value: "No", tone: "bad" }, simpleTable: { value: "Yes", tone: "good" } },
        { feature: "Column pinning (left / right)", competitor: { value: "No", tone: "bad" }, simpleTable: { value: "Built-in", tone: "good" } },
        { feature: "Row grouping with aggregations", competitor: { value: "Manual / DIY", tone: "bad" }, simpleTable: { value: "Built-in", tone: "good" } },
        { feature: "Inline cell editing", competitor: { value: "Template-based", tone: "neutral" }, simpleTable: { value: "Built-in", tone: "good" } },
        { feature: "Bundle size (gzipped)", competitor: { value: "~140 kB", tone: "neutral" }, simpleTable: { value: "~70 kB", tone: "good" } },
      ]}
      whyChoose={{
        competitor: {
          title: "Stay on ngx-datatable when…",
          items: [
            "You have a large, stable ngx-datatable codebase and the team is happy with its template-projection patterns.",
            "Your features are basic (sort, paginate, virtual scroll, custom cells) and you don't need pinning or grouping.",
            "Your team prefers ngx-datatable's specific theming or feels invested in custom CSS overrides.",
          ],
        },
        simpleTable: {
          title: "Switch to Simple Table for Angular when…",
          items: [
            "You're migrating to Angular 17/18/19 standalone components and signals.",
            "You need column pinning, row grouping with aggregations, or inline editing without writing a renderer pipeline.",
            "You're tired of waiting for the next ngx-datatable Angular-version compatibility release.",
            "You want a smaller bundle (~70 kB vs ~140 kB).",
            "You also build React / Vue / Svelte / Solid surfaces and want one shared engine.",
          ],
        },
      }}
      scenarios={[
        {
          emoji: "🚧",
          title: "Existing Angular 14 app with ngx-datatable, planning the v17+ jump",
          body: "Migration to standalone components is on the roadmap. ngx-datatable works today but feels weighty next to signals.",
          recommendation: "simpleTable",
          recommendationLabel: "Switch to Simple Table for Angular as part of the standalone migration—handle two big changes in one PR series.",
        },
        {
          emoji: "📊",
          title: "Internal reporting tool needing grouping + aggregations",
          body: "You need expanded/collapsed groups with sum, avg, and count footers. ngx-datatable doesn't ship this directly.",
          recommendation: "simpleTable",
          recommendationLabel: "Choose Simple Table—grouping with aggregations is built-in and MIT.",
        },
        {
          emoji: "🧱",
          title: "Stable ngx-datatable surface, basic features only",
          body: "Three internal admin tables; basic sort, paginate, custom cells. No grouping or pinning. Team is comfortable.",
          recommendation: "competitor",
          recommendationLabel: "Stay on ngx-datatable—the migration cost isn't worth it for basic feature usage.",
        },
        {
          emoji: "🚀",
          title: "Brand-new Angular 18 SaaS",
          body: "Greenfield. Standalone components, signals, lean bundle.",
          recommendation: "simpleTable",
          recommendationLabel: "Choose Simple Table for Angular from day one.",
        },
      ]}
      faqs={[
        { question: "Is ngx-datatable abandoned?", answer: "Not formally, but its release cadence has slowed enough that production teams routinely wait for Angular-version compatibility releases. If you're worried, the safer long-term bet is a more actively maintained alternative." },
        { question: "How long does the migration take?", answer: "Usually a few days for a single feature area. Map ngx-datatable columns to Simple Table HeaderObjects, adapt your rows to Simple Table's row shape, and convert template-projection columns to cellRenderer components. See the migration guide linked below." },
        { question: "Will I keep custom cell templates?", answer: "Yes. ngx-datatable's <ng-template> projection becomes Simple Table's cell renderer pattern. You pass an Angular component instead of inline template projection." },
        { question: "Does Simple Table support tree data?", answer: "Yes. Tree data, expandable rows, and lazy loading are all first-class in Simple Table." },
      ]}
      conclusionParagraphs={[
        "ngx-datatable is fine if you're happy where you are and your needs are basic. If your Angular app is migrating to standalone components and signals—or you've outgrown ngx-datatable's basic feature set—Simple Table for Angular is the natural upgrade path.",
        "It's a half-day to a week of migration work depending on how many tables you have, and the result is a smaller, more idiomatic Angular grid that ships pinning, grouping with aggregations, and inline editing in MIT.",
      ]}
      relatedLinks={[
        { href: "/comparisons/simple-table-vs-ngx-datatable", label: "Detailed comparison: Simple Table vs ngx-datatable" },
        { href: "/migrations/from-ngx-datatable", label: "Migration guide: from ngx-datatable" },
        { href: "/blog/angular-data-grid-simple-table", label: "Pillar guide: the best free Angular data grid in 2026" },
        { href: "/frameworks/angular", label: "Angular integration hub" },
      ]}
      ctaTitle="Move from ngx-datatable to a modern Angular grid"
      ctaDescription="Simple Table for Angular is signals-friendly, MIT-licensed, ~70 kB gzipped, and ships pinning, grouping, and inline editing. Try it in StackBlitz or follow the migration guide."
    />
  );
}
