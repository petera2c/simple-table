import type { Metadata } from "next";
import CompetitorBlogLayout from "@/components/blog/CompetitorBlogLayout";
import { SEO_STRINGS } from "@/constants/strings/seo";
import { agGridAlternativesAngularPost } from "@/constants/blogPosts";

export const metadata: Metadata = {
  title: agGridAlternativesAngularPost.title,
  description: agGridAlternativesAngularPost.description,
  keywords:
    "ag grid alternatives angular, free angular data grid, angular data grid 2026, angular standalone components grid, ngx-datatable alternative, primeng table alternative, simple table angular",
  openGraph: {
    title: agGridAlternativesAngularPost.title,
    description: agGridAlternativesAngularPost.description,
    type: "article",
    images: [SEO_STRINGS.site.ogImage],
    siteName: SEO_STRINGS.site.name,
  },
  twitter: {
    card: "summary_large_image",
    title: agGridAlternativesAngularPost.title,
    description: agGridAlternativesAngularPost.description,
    creator: SEO_STRINGS.site.creator,
    images: SEO_STRINGS.site.ogImage.url,
  },
  alternates: { canonical: `/blog/${agGridAlternativesAngularPost.slug}` },
};

export default function Page() {
  return (
    <CompetitorBlogLayout
      slug={agGridAlternativesAngularPost.slug}
      title={agGridAlternativesAngularPost.title}
      subtitle="Hunting for AG Grid Angular alternatives in 2026? Compare Simple Table for Angular, ngx-datatable, PrimeNG Table, Angular Material mat-table, and Kendo Grid—free, MIT, signals-friendly options without enterprise licensing."
      competitorName="AG Grid (and the field)"
      framework="angular"
      heroBadges={["Roundup", "Decision Guide", "2026"]}
      datePublished={agGridAlternativesAngularPost.createdAt}
      dateModified={agGridAlternativesAngularPost.updatedAt}
      introParagraphs={[
        "AG Grid is dominant for a reason: it's powerful, well-documented, and feature-complete. But the Enterprise tier ($999+/dev/year) puts the most-used features—grouping with aggregations, pivoting, master/detail, tree data, integrated charts—behind a paywall. For Angular teams looking for a free or lighter-weight alternative in 2026, here's the field.",
        "We'll compare the best free Angular data grids in 2026: Simple Table for Angular, ngx-datatable, PrimeNG Table, Angular Material's mat-table, and the commercial Kendo Grid for context. Each has a sweet spot. The right pick depends on your bundle constraints, feature mix, design system, and willingness to pay for commercial support.",
        "Spoiler: Simple Table for Angular is what we ship and the focused MIT alternative we recommend for most new Angular projects. But every Angular team's situation is a little different, so we'll walk through who each library is for.",
      ]}
      comparisonRows={[
        { feature: "License", competitor: { value: "Mixed (MIT + commercial Enterprise)", tone: "neutral" }, simpleTable: { value: "MIT (Simple Table)", tone: "good" } },
        { feature: "Per-developer fees", competitor: { value: "AG Enterprise: $999+; Kendo: $649+", tone: "bad" }, simpleTable: { value: "$0", tone: "good" } },
        { feature: "Standalone components", competitor: { value: "All viable options support it", tone: "good" }, simpleTable: { value: "First-class", tone: "good" } },
        { feature: "Signals-native API", competitor: { value: "Mixed", tone: "neutral" }, simpleTable: { value: "Yes", tone: "good" } },
        { feature: "Built-in virtualization", competitor: { value: "AG / Kendo: yes; mat-table: via CDK", tone: "neutral" }, simpleTable: { value: "Yes", tone: "good" } },
        { feature: "Built-in column pinning", competitor: { value: "AG / Kendo / PrimeNG: yes; mat-table: manual", tone: "neutral" }, simpleTable: { value: "Yes", tone: "good" } },
        { feature: "Built-in grouping + aggregations", competitor: { value: "AG: Enterprise; Kendo: yes; PrimeNG/mat-table: manual", tone: "neutral" }, simpleTable: { value: "Yes (MIT)", tone: "good" } },
        { feature: "Built-in inline editing", competitor: { value: "All viable options support it", tone: "good" }, simpleTable: { value: "Yes", tone: "good" } },
        { feature: "Bundle size (gzipped)", competitor: { value: "50–400+ kB depending on choice", tone: "neutral" }, simpleTable: { value: "~70 kB", tone: "good" } },
      ]}
      whyChoose={{
        competitor: {
          title: "Pick another option when…",
          items: [
            "You already have a major investment in AG Grid Enterprise and use Enterprise-only features.",
            "PrimeNG / Material is your design system and the data grid should match.",
            "You need commercial support contracts (Kendo, AG Grid Enterprise).",
            "Your needs are basic enough that mat-table is enough.",
          ],
        },
        simpleTable: {
          title: "Pick Simple Table for Angular when…",
          items: [
            "You want grouping with aggregations free under MIT.",
            "You're starting greenfield with Angular 17/18/19, standalone components, and signals.",
            "You want a single engine across React / Vue / Svelte / Solid / Vanilla.",
            "Bundle size matters—~70 kB gzipped beats every commercial option.",
            "You don't want to manage license renewals.",
          ],
        },
      }}
      scenarios={[
        {
          emoji: "🏆",
          title: "Greenfield Angular 19 SaaS, no legacy",
          body: "Brand-new project, signals-first, lean bundle is critical.",
          recommendation: "simpleTable",
          recommendationLabel: "Pick Simple Table for Angular—best fit for modern Angular and lightest bundle.",
        },
        {
          emoji: "🎨",
          title: "Angular Material design system",
          body: "Material is the design system; data grid needs to match Material density and tokens.",
          recommendation: "simpleTable",
          recommendationLabel: "Use Simple Table with Material-tuned CSS variables, or stay on mat-table for native fidelity.",
        },
        {
          emoji: "💼",
          title: "Existing AG Grid Enterprise with pivoting",
          body: "Pivoting and master/detail are core; renewal is committed.",
          recommendation: "competitor",
          recommendationLabel: "Stay with AG Grid Enterprise—Simple Table doesn't bundle pivoting.",
        },
        {
          emoji: "📈",
          title: "Internal admin tools across stacks (Angular + React)",
          body: "Platform team wants one shared grid engine for both apps.",
          recommendation: "simpleTable",
          recommendationLabel: "Pick Simple Table—same engine ships in @simple-table/react and @simple-table/angular.",
        },
        {
          emoji: "🧱",
          title: "Stable ngx-datatable codebase, basic features",
          body: "Three internal tables, sort + paginate only.",
          recommendation: "competitor",
          recommendationLabel: "Stay on ngx-datatable—migration cost isn't worth it for basic usage.",
        },
      ]}
      faqs={[
        { question: "What's the best free Angular data grid in 2026?", answer: "For most new Angular projects, Simple Table for Angular—it's MIT, signals-native, ~70 kB gzipped, and ships virtualization, pinning, grouping, and editing in one package. PrimeNG Table is the better fit if you've already adopted PrimeNG; mat-table is fine for basic features." },
        { question: "Is AG Grid Community enough?", answer: "It depends. AG Grid Community covers virtualization, pinning, sort, and filter—but row grouping with aggregations, pivoting, and tree data are Enterprise-only. Many teams discover the gap mid-project." },
        { question: "Which alternative has the best signals support?", answer: "Simple Table for Angular is built around signals as a primary input pattern. PrimeNG and Kendo support signals; ngx-datatable's support is workable but not idiomatic." },
        { question: "Should I switch from ngx-datatable?", answer: "If you're modernizing to standalone components and signals or you've outgrown ngx-datatable's basic feature set, yes. If you're stable and your needs are basic, the migration cost may not be worth it." },
      ]}
      conclusionParagraphs={[
        "There's no single right answer for every Angular team. The fastest decision: if your needs include grouping with aggregations or pinning, you don't have a Kendo / PrimeNG dependency, and you don't want to pay AG Grid Enterprise—pick Simple Table for Angular.",
        "If you're committed to a design system (Material, PrimeNG) or enterprise vendor (Kendo, AG Grid Enterprise), stay where you are and let your teammates know what's possible elsewhere when they hit a feature wall.",
      ]}
      relatedLinks={[
        { href: "/blog/simple-table-vs-ag-grid-angular", label: "Simple Table vs AG Grid Angular" },
        { href: "/blog/simple-table-vs-ngx-datatable", label: "Simple Table vs ngx-datatable" },
        { href: "/blog/simple-table-vs-primeng-table", label: "Simple Table vs PrimeNG Table" },
        { href: "/blog/simple-table-vs-angular-material-table", label: "Simple Table vs Angular Material mat-table" },
        { href: "/blog/simple-table-vs-kendo-grid-angular", label: "Simple Table vs Kendo Grid for Angular" },
        { href: "/frameworks/angular", label: "Angular integration hub" },
      ]}
      ctaTitle="Pick the right Angular data grid for 2026"
      ctaDescription="Simple Table for Angular ships virtualization, pinning, grouping, and editing in one MIT package—~70 kB gzipped, signals-native, no license keys."
    />
  );
}
