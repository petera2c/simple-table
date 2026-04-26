import type { Metadata } from "next";
import { faBolt, faCode, faDollarSign, faTrophy } from "@fortawesome/free-solid-svg-icons";
import FrameworkVsCompetitorLayout from "@/components/comparisons/FrameworkVsCompetitorLayout";
import { SEO_STRINGS } from "@/constants/strings/seo";

const TITLE = "simple-table-core vs Tabulator: Vanilla TypeScript Data Grid Comparison";
const DESCRIPTION =
  "Compare simple-table-core (vanilla TypeScript) against Tabulator: features, virtualization, ergonomics, bundle size, TypeScript support, and migration path. Pick the right vanilla JS data grid in 2026.";
const CANONICAL = "/comparisons/simple-table-vs-tabulator-vanilla";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  keywords:
    "simple-table-core vs tabulator, tabulator alternative, vanilla js data grid, vanilla typescript data grid, framework agnostic data grid, web component data grid, mit alternative tabulator",
  openGraph: { title: TITLE, description: DESCRIPTION, type: "article", images: [SEO_STRINGS.site.ogImage], siteName: SEO_STRINGS.site.name },
  twitter: { card: "summary_large_image", title: TITLE, description: DESCRIPTION, creator: SEO_STRINGS.site.creator, images: SEO_STRINGS.site.ogImage.url },
  alternates: { canonical: CANONICAL },
};

export default function SimpleTableVsTabulatorVanillaPage() {
  return (
    <FrameworkVsCompetitorLayout
      title={TITLE}
      subtitle="Tabulator has been the workhorse vanilla-JS data grid for a decade. simple-table-core is the modern, TypeScript-first alternative that also powers React, Vue, Angular, Svelte, and Solid adapters."
      canonicalPath={CANONICAL}
      datePublished="2026-04-26"
      dateModified="2026-04-26"
      framework="vanilla"
      competitorName="Tabulator"
      competitorPackage="tabulator"
      heroBadges={[
        { icon: faTrophy, label: "TypeScript-first" },
        { icon: faBolt, label: "1M+ rows virtualization" },
        { icon: faDollarSign, label: "Free under MIT" },
        { icon: faCode, label: "Framework-agnostic core" },
      ]}
      introParagraphs={[
        "Tabulator is the most-used framework-agnostic data grid: imperative API, plenty of built-in features, plugin ecosystem, and a long history. The trade-off is that its API and types come from a JavaScript-first world: TypeScript definitions are community-maintained and not always strict, and the imperative wiring shows its age.",
        "simple-table-core is the vanilla-TypeScript core engine that powers all @simple-table/* adapters. It ships virtualization for 1M+ rows, column pinning, row grouping with aggregations, and inline editing—written in TypeScript with strict types from day one.",
        "If you want a vanilla / web-component data grid in 2026 with modern TS ergonomics, this is the side-by-side that helps you choose.",
      ]}
      whyChooseSimpleTable={[
        "You're shipping vanilla TypeScript / web components and want strict types out of the box.",
        "You want one engine that scales: today vanilla, tomorrow you adopt React or Vue with the same data shape.",
        "You want a tighter, more predictable bundle and modern ESM-first packaging.",
        "You want batteries-included pinning, grouping with aggregations, and editing in one library.",
      ]}
      whyChooseCompetitor={[
        "You have a large existing Tabulator codebase and your team is comfortable with its imperative API.",
        "You depend on a Tabulator-specific feature (e.g. interactive charts, Tabulator print API, certain reactive-data patterns).",
        "You're comfortable with community-maintained TypeScript definitions and don't need strict types.",
      ]}
      featureRows={[
        { feature: "TypeScript-first types (strict mode)", simpleTable: { verdict: "yes", note: "Authored in TS." }, competitor: { verdict: "partial", note: "Community types; some looseness." } },
        { feature: "Framework adapters (React/Vue/Angular/Svelte/Solid)", simpleTable: { verdict: "yes", note: "Official adapters." }, competitor: { verdict: "partial", note: "tabulator-tables wrappers exist; quality varies." } },
        { feature: "Row + column virtualization (1M+ rows)", simpleTable: { verdict: "yes", note: "Built-in." }, competitor: { verdict: "yes", note: "Virtual DOM rendering." } },
        { feature: "Column pinning (left / right)", simpleTable: { verdict: "yes" }, competitor: { verdict: "yes", note: "Frozen columns." } },
        { feature: "Row grouping with aggregations", simpleTable: { verdict: "yes" }, competitor: { verdict: "yes", note: "groupBy + custom calculations." } },
        { feature: "Inline cell editing", simpleTable: { verdict: "yes" }, competitor: { verdict: "yes" } },
        { feature: "Custom cell / header / footer renderers", simpleTable: { verdict: "yes" }, competitor: { verdict: "yes" } },
        { feature: "ESM-first packaging", simpleTable: { verdict: "yes" }, competitor: { verdict: "partial", note: "ESM available; CommonJS legacy still common." } },
        { feature: "License", simpleTable: { verdict: "yes", note: "MIT." }, competitor: { verdict: "yes", note: "MIT." } },
      ]}
      installCommand="npm install simple-table-core"
      migrationCallout={<>Tabulator&apos;s <code>new Tabulator(el, {`{ columns, data }`})</code> maps to simple-table-core&apos;s <code>new SimpleTableVanilla(el, {`{ defaultHeaders, rows }`})</code>. The data shape is similar; cell formatters become functions returning DOM nodes or framework components.</>}
      faqs={[
        { question: "Can simple-table-core run in any browser environment?", answer: "Yes. simple-table-core has no peer dependencies and works with any modern bundler (Vite, esbuild, Rollup, Webpack) as well as a plain <script type='module'>." },
        { question: "Why publish a vanilla core if there are framework adapters?", answer: "Because the engine is genuinely framework-agnostic. Web-component / vanilla apps use simple-table-core directly; framework apps use the @simple-table/* wrappers, which all share the same core data shape and feature flags." },
        { question: "Is Tabulator going away?", answer: "Not at all. Tabulator is well-maintained and a perfectly valid choice. simple-table-core is the answer for teams that want strict TypeScript types, modern ESM packaging, and a single engine that also covers their React/Vue/Angular/Svelte/Solid surfaces." },
      ]}
      conclusion={
        <>
          <p>If you have an existing Tabulator codebase with a happy team and you don&apos;t need framework adapters, stay on Tabulator. If you&apos;re starting fresh and want strict TypeScript types, ESM-first packaging, and a single engine across stacks, simple-table-core is the modern MIT alternative.</p>
        </>
      }
      relatedLinks={[
        { href: "/blog/vanilla-typescript-data-grid-simple-table-core", label: "Pillar guide: the best free vanilla TS data grid in 2026" },
        { href: "/comparisons/simple-table-vs-tabulator", label: "Simple Table vs Tabulator (cross-stack)" },
        { href: "/frameworks/vanilla", label: "Vanilla TypeScript integration hub" },
      ]}
    />
  );
}
