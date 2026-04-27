import type { Metadata } from "next";
import CompetitorBlogLayout from "@/components/blog/CompetitorBlogLayout";
import { SEO_STRINGS } from "@/constants/strings/seo";
import { simpleTableVsElementPlusTablePost } from "@/constants/blogPosts";

export const metadata: Metadata = {
  title: simpleTableVsElementPlusTablePost.title,
  description: simpleTableVsElementPlusTablePost.description,
  keywords:
    "element plus table alternative, el-table replacement, vue 3 data grid, element plus alternative, simple table vue, mit vue table, composition api data grid",
  openGraph: {
    title: simpleTableVsElementPlusTablePost.title,
    description: simpleTableVsElementPlusTablePost.description,
    type: "article",
    images: [SEO_STRINGS.site.ogImage],
    siteName: SEO_STRINGS.site.name,
  },
  twitter: {
    card: "summary_large_image",
    title: simpleTableVsElementPlusTablePost.title,
    description: simpleTableVsElementPlusTablePost.description,
    creator: SEO_STRINGS.site.creator,
    images: SEO_STRINGS.site.ogImage.url,
  },
  alternates: { canonical: `/blog/${simpleTableVsElementPlusTablePost.slug}` },
};

export default function Page() {
  return (
    <CompetitorBlogLayout
      slug={simpleTableVsElementPlusTablePost.slug}
      title={simpleTableVsElementPlusTablePost.title}
      subtitle="Element Plus's el-table is a fine grid if Element Plus is your design system. If you're pulling Element Plus in just for el-table, Simple Table for Vue is a smaller, focused MIT alternative for Vue 3 / Nuxt."
      competitorName="Element Plus el-table"
      framework="vue"
      heroBadges={["Comparison", "Bundle size", "Decision Guide"]}
      datePublished={simpleTableVsElementPlusTablePost.createdAt}
      dateModified={simpleTableVsElementPlusTablePost.updatedAt}
      introParagraphs={[
        "Element Plus is a popular Vue 3 component library, especially in Asia and across enterprise Vue teams. el-table is its data grid component—mature, feature-rich, and tightly integrated with the rest of Element Plus.",
        "If Element Plus is your design system, you'll keep el-table. If you pulled in Element Plus mainly for el-table, Simple Table for Vue is the focused alternative: an MIT-licensed Vue 3 data grid that runs in Composition API + <script setup>, Nuxt 3, and Nuxt 4 without a design system tax.",
        "This article walks through the trade-offs—bundle, virtualization, grouping, editing, and idiomatic Vue 3 ergonomics.",
      ]}
      comparisonRows={[
        { feature: "License", competitor: { value: "MIT", tone: "good" }, simpleTable: { value: "MIT", tone: "good" } },
        { feature: "Bundle size (gzipped)", competitor: { value: "200–400+ kB (suite + theme + icons)", tone: "bad" }, simpleTable: { value: "~70 kB", tone: "good" } },
        { feature: "Vue 3 + Composition API", competitor: { value: "Yes", tone: "good" }, simpleTable: { value: "Yes (idiomatic)", tone: "good" } },
        { feature: "Nuxt 3 / Nuxt 4 SSR", competitor: { value: "Yes", tone: "good" }, simpleTable: { value: "Yes", tone: "good" } },
        { feature: "Row virtualization", competitor: { value: "el-table-v2 (separate component)", tone: "neutral" }, simpleTable: { value: "Built-in", tone: "good" } },
        { feature: "Frozen columns / pinning", competitor: { value: "fixed='left' / 'right'", tone: "good" }, simpleTable: { value: "Yes", tone: "good" } },
        { feature: "Row grouping with aggregations", competitor: { value: "Manual via summary-method", tone: "neutral" }, simpleTable: { value: "Built-in", tone: "good" } },
        { feature: "Inline cell editing", competitor: { value: "Slot-based", tone: "neutral" }, simpleTable: { value: "Built-in", tone: "good" } },
        { feature: "Theming", competitor: { value: "Element Plus theme system", tone: "neutral" }, simpleTable: { value: "CSS variables, BYO", tone: "good" } },
      ]}
      whyChoose={{
        competitor: {
          title: "Stay with el-table when…",
          items: [
            "Element Plus is your design system across forms, dialogs, layout.",
            "Your team is invested in Element Plus slot patterns and Element icons.",
            "You depend on Element Plus-specific components (form integration, dialog patterns).",
            "Standardized theming across the suite is more important than bundle size.",
          ],
        },
        simpleTable: {
          title: "Switch to Simple Table for Vue when…",
          items: [
            "Element Plus el-table is the only Element Plus piece you actually use heavily.",
            "You want true row + column virtualization in the same component as the rest of your features.",
            "You want grouping with aggregations and inline editing as built-in primitives.",
            "Bundle size matters—target ~70 kB instead of 200–400+ kB.",
            "You also build React / Angular / Svelte / Solid surfaces and want a shared engine.",
          ],
        },
      }}
      scenarios={[
        {
          emoji: "🎨",
          title: "Element Plus design system",
          body: "Element Plus is the design system; el-table fits visually with the rest.",
          recommendation: "competitor",
          recommendationLabel: "Stay with el-table—keep the design system coherent.",
        },
        {
          emoji: "📦",
          title: "Element Plus pulled in just for el-table",
          body: "Other components are plain Vue + Tailwind; you added Element Plus for the table only.",
          recommendation: "simpleTable",
          recommendationLabel: "Switch to Simple Table—simplify the build and cut 200–400 kB.",
        },
        {
          emoji: "📈",
          title: "Reporting view with grouping + virtualization",
          body: "You currently use el-table-v2 for virtualization and a different component for grouping. They're separate.",
          recommendation: "simpleTable",
          recommendationLabel: "Switch to Simple Table—both features in one component.",
        },
      ]}
      faqs={[
        { question: "Can I keep Element Plus for forms?", answer: "Yes. Many teams keep Element Plus for forms and dialogs and switch only the data grid." },
        { question: "Will el-table-v2 work for my use case?", answer: "el-table-v2 is virtualization-only and a different API surface than el-table. If you need both grouping and virtualization, you're juggling two components. Simple Table covers both in one." },
        { question: "How big is the migration?", answer: "Usually a few hours per table. Map el-table-column children to HeaderObject entries; convert slot templates to cellRenderer Vue components." },
      ]}
      conclusionParagraphs={[
        "Element Plus el-table is the right choice if Element Plus is your design system. Simple Table for Vue is the better trade when el-table is the only Element Plus piece you actually need.",
        "You skip the suite + theme + icons cost and get true virtualization + grouping in one component.",
      ]}
      relatedLinks={[
        { href: "/blog/vue-nuxt-data-grid-simple-table", label: "Pillar guide: the best free Vue / Nuxt data grid in 2026" },
        { href: "/blog/ag-grid-alternatives-free-vue-data-grids-2026", label: "Best free Vue 3 data grids in 2026" },
        { href: "/frameworks/vue", label: "Vue integration hub" },
      ]}
      ctaTitle="Outgrowing el-table?"
      ctaDescription="Simple Table for Vue ships virtualization, pinning, grouping, and editing in one MIT package—~70 kB gzipped, idiomatic Vue 3."
    />
  );
}
