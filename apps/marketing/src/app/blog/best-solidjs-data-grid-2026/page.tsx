import type { Metadata } from "next";
import CompetitorBlogLayout from "@/components/blog/CompetitorBlogLayout";
import { SEO_STRINGS } from "@/constants/strings/seo";
import { bestSolidJsDataGridPost } from "@/constants/blogPosts";

export const metadata: Metadata = {
  title: bestSolidJsDataGridPost.title,
  description: bestSolidJsDataGridPost.description,
  keywords:
    "best solidjs data grid, solid-start data table, solid signals data grid, tanstack solid table alternative, kobalte alternative, simple table solid",
  openGraph: {
    title: bestSolidJsDataGridPost.title,
    description: bestSolidJsDataGridPost.description,
    type: "article",
    images: [SEO_STRINGS.site.ogImage],
    siteName: SEO_STRINGS.site.name,
  },
  twitter: {
    card: "summary_large_image",
    title: bestSolidJsDataGridPost.title,
    description: bestSolidJsDataGridPost.description,
    creator: SEO_STRINGS.site.creator,
    images: SEO_STRINGS.site.ogImage.url,
  },
  alternates: { canonical: `/blog/${bestSolidJsDataGridPost.slug}` },
};

export default function Page() {
  return (
    <CompetitorBlogLayout
      slug={bestSolidJsDataGridPost.slug}
      title={bestSolidJsDataGridPost.title}
      subtitle="The best free SolidJS data grids in 2026 compared: Simple Table for Solid, TanStack Solid Table, Kobalte, AG Grid Solid, and more—bundle, virtualization, signals support, and licensing."
      competitorName="Solid data grid landscape"
      framework="solid"
      heroBadges={["Roundup", "Decision Guide", "2026"]}
      datePublished={bestSolidJsDataGridPost.createdAt}
      dateModified={bestSolidJsDataGridPost.updatedAt}
      introParagraphs={[
        "Solid's data grid landscape is the smallest of the major frameworks—but quality is high. Three real options: TanStack Solid Table (headless), Simple Table for Solid (batteries-included), and AG Grid Solid (commercial Enterprise tier).",
        "We'll compare the contenders on bundle, virtualization, grouping with aggregations, editing, signals support, and licensing—so you can pick the right grid for your Solid-Start app in 2026.",
        "Quick takeaway: Simple Table for Solid is the best free option for most teams who want a focused, batteries-included data grid built on Solid signals.",
      ]}
      comparisonRows={[
        { feature: "License", competitor: { value: "MIT (TanStack/Kobalte) / Mixed (AG Grid)", tone: "neutral" }, simpleTable: { value: "MIT", tone: "good" } },
        { feature: "Per-developer fees", competitor: { value: "AG Enterprise: $999+", tone: "bad" }, simpleTable: { value: "$0", tone: "good" } },
        { feature: "Approach", competitor: { value: "Headless / primitives / commercial", tone: "neutral" }, simpleTable: { value: "Batteries-included", tone: "good" } },
        { feature: "Solid signals integration", competitor: { value: "Yes (most options)", tone: "good" }, simpleTable: { value: "First-class", tone: "good" } },
        { feature: "Bundle size (gzipped)", competitor: { value: "14–400+ kB depending on choice", tone: "neutral" }, simpleTable: { value: "~70 kB", tone: "good" } },
        { feature: "Built-in row virtualization", competitor: { value: "Mixed (none/yes)", tone: "neutral" }, simpleTable: { value: "Yes", tone: "good" } },
        { feature: "Built-in column pinning", competitor: { value: "Mixed", tone: "neutral" }, simpleTable: { value: "Yes", tone: "good" } },
        { feature: "Built-in grouping + aggregations", competitor: { value: "Enterprise / DIY / no", tone: "bad" }, simpleTable: { value: "Yes (MIT)", tone: "good" } },
        { feature: "Built-in inline editing", competitor: { value: "Mixed", tone: "neutral" }, simpleTable: { value: "Yes", tone: "good" } },
      ]}
      whyChoose={{
        competitor: {
          title: "Pick another option when…",
          items: [
            "You want full UI control: stay on TanStack Solid Table.",
            "You're using Kobalte primitives broadly: keep them, use Kobalte for non-grid UI.",
            "You already use AG Grid Enterprise heavily and depend on Enterprise-only features.",
          ],
        },
        simpleTable: {
          title: "Pick Simple Table for Solid when…",
          items: [
            "You want batteries-included virtualization, pinning, grouping, and editing.",
            "You're building Solid-Start projects and want a forward-looking grid.",
            "You also build React / Vue / Angular / Svelte / Vanilla surfaces and want one engine.",
            "You want signals-native reactivity without writing the UI primitives.",
          ],
        },
      }}
      scenarios={[
        {
          emoji: "🏆",
          title: "Greenfield Solid-Start app",
          body: "Lean bundle, signals-first, batteries-included.",
          recommendation: "simpleTable",
          recommendationLabel: "Pick Simple Table for Solid—best fit for new Solid apps.",
        },
        {
          emoji: "🛠️",
          title: "Custom design system, headless preferred",
          body: "Want pixel-level control over markup.",
          recommendation: "competitor",
          recommendationLabel: "Stay on TanStack Solid Table—best fit for hand-built UI.",
        },
        {
          emoji: "💼",
          title: "Existing AG Grid Enterprise + Solid",
          body: "Pivoting and master/detail are core; renewal committed.",
          recommendation: "competitor",
          recommendationLabel: "Stay with AG Grid Enterprise—Simple Table doesn't bundle pivoting.",
        },
        {
          emoji: "📊",
          title: "Reporting tool, 100k rows, grouping required",
          body: "Sum/avg footers, virtualization, time-to-feature matters.",
          recommendation: "simpleTable",
          recommendationLabel: "Pick Simple Table for Solid—heavy lifting is built in.",
        },
      ]}
      faqs={[
        { question: "What's the best Solid data grid in 2026?", answer: "For most teams, Simple Table for Solid. It's MIT, batteries-included, signals-native, and ~70 kB gzipped. Stay headless if you want full UI control; use AG Grid Enterprise if you depend on its Enterprise-only features." },
        { question: "Is AG Grid Community enough?", answer: "It depends. AG Grid Community covers virtualization, pinning, sort, and filter—but row grouping with aggregations, pivoting, and tree data are Enterprise-only. Many teams hit the gap mid-project." },
        { question: "Does Simple Table for Solid support Solid-Start SSR?", answer: "Yes. ESM-first, SSR-friendly, works with Solid-Start out of the box." },
      ]}
      conclusionParagraphs={[
        "Solid's data grid options are well-defined: headless (TanStack), batteries-included (Simple Table), or commercial (AG Grid). For most teams, Simple Table for Solid is the right MIT pick.",
        "Pick TanStack if you want full UI control. Pick AG Grid Enterprise if you depend on pivoting / master-detail. Pick Simple Table for everything else.",
      ]}
      relatedLinks={[
        { href: "/blog/solidjs-data-grid-simple-table", label: "Pillar guide: the best free SolidJS data grid in 2026" },
        { href: "/blog/simple-table-vs-tanstack-solid-table", label: "Simple Table vs TanStack Solid Table" },
        { href: "/blog/simple-table-vs-kobalte-grid", label: "Simple Table vs Kobalte" },
        { href: "/frameworks/solid", label: "Solid integration hub" },
      ]}
      ctaTitle="Pick the right Solid data grid for 2026"
      ctaDescription="Simple Table for Solid ships virtualization, pinning, grouping, and editing in one MIT package—signals-native, ~70 kB gzipped."
    />
  );
}
