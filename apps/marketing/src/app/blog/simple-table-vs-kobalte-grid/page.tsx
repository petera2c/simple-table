import type { Metadata } from "next";
import CompetitorBlogLayout from "@/components/blog/CompetitorBlogLayout";
import { SEO_STRINGS } from "@/constants/strings/seo";
import { simpleTableVsKobalteGridPost } from "@/constants/blogPosts";

export const metadata: Metadata = {
  title: simpleTableVsKobalteGridPost.title,
  description: simpleTableVsKobalteGridPost.description,
  keywords:
    "kobalte alternative, kobalte grid, solidjs data grid, solid signals data grid, simple table solid, mit solid table",
  openGraph: {
    title: simpleTableVsKobalteGridPost.title,
    description: simpleTableVsKobalteGridPost.description,
    type: "article",
    images: [SEO_STRINGS.site.ogImage],
    siteName: SEO_STRINGS.site.name,
  },
  twitter: {
    card: "summary_large_image",
    title: simpleTableVsKobalteGridPost.title,
    description: simpleTableVsKobalteGridPost.description,
    creator: SEO_STRINGS.site.creator,
    images: SEO_STRINGS.site.ogImage.url,
  },
  alternates: { canonical: `/blog/${simpleTableVsKobalteGridPost.slug}` },
};

export default function Page() {
  return (
    <CompetitorBlogLayout
      slug={simpleTableVsKobalteGridPost.slug}
      title={simpleTableVsKobalteGridPost.title}
      subtitle="Kobalte focuses on accessible UI primitives—buttons, dialogs, comboboxes—and isn't a full data grid. Simple Table for Solid is a complete grid with virtualization, pinning, grouping, and editing built on Solid signals."
      competitorName="Kobalte"
      framework="solid"
      heroBadges={["Comparison", "Decision Guide", "Signals-Native"]}
      datePublished={simpleTableVsKobalteGridPost.createdAt}
      dateModified={simpleTableVsKobalteGridPost.updatedAt}
      introParagraphs={[
        "Kobalte is the SolidJS analog to Radix UI: accessible, unstyled UI primitives—dialogs, popovers, comboboxes, toggles. It's not a data grid, but Solid teams sometimes ask whether Kobalte covers grid use cases.",
        "Short answer: no. Kobalte gives you accessible primitives for forms and overlays. Simple Table for Solid is a complete data grid with virtualization, column pinning, row grouping with aggregations, and inline editing—on top of Solid's fine-grained reactivity.",
        "This article clarifies the difference and when each is the right tool.",
      ]}
      comparisonRows={[
        { feature: "Type of library", competitor: { value: "UI primitives (dialogs, popovers, etc.)", tone: "neutral" }, simpleTable: { value: "Full data grid", tone: "good" } },
        { feature: "License", competitor: { value: "MIT", tone: "good" }, simpleTable: { value: "MIT", tone: "good" } },
        { feature: "Solid signals integration", competitor: { value: "Yes (primitives)", tone: "good" }, simpleTable: { value: "Yes (grid)", tone: "good" } },
        { feature: "Built-in data grid", competitor: { value: "No", tone: "bad" }, simpleTable: { value: "Yes", tone: "good" } },
        { feature: "Built-in row virtualization", competitor: { value: "No", tone: "bad" }, simpleTable: { value: "Yes", tone: "good" } },
        { feature: "Column pinning", competitor: { value: "No", tone: "bad" }, simpleTable: { value: "Yes", tone: "good" } },
        { feature: "Row grouping + aggregations", competitor: { value: "No", tone: "bad" }, simpleTable: { value: "Built-in", tone: "good" } },
        { feature: "Inline cell editing", competitor: { value: "No (BYO with Kobalte primitives)", tone: "bad" }, simpleTable: { value: "Built-in", tone: "good" } },
        { feature: "Sort / filter", competitor: { value: "No", tone: "bad" }, simpleTable: { value: "Built-in", tone: "good" } },
      ]}
      whyChoose={{
        competitor: {
          title: "Use Kobalte when…",
          items: [
            "You need accessible dialogs, popovers, comboboxes, and other primitives.",
            "You're hand-building UI on top of unstyled, accessible bricks.",
            "Your data needs are simple HTML tables, not data grids.",
          ],
        },
        simpleTable: {
          title: "Use Simple Table for Solid when…",
          items: [
            "You need a real data grid (virtualization, pinning, grouping, editing).",
            "You can use Kobalte for primitives elsewhere in the app and Simple Table for the grid.",
            "You want a single engine across React / Vue / Angular / Svelte / Vanilla.",
          ],
        },
      }}
      scenarios={[
        {
          emoji: "🧩",
          title: "Building a custom dropdown / dialog for the app",
          body: "Need accessible primitives, your own visual design.",
          recommendation: "competitor",
          recommendationLabel: "Use Kobalte—exactly the right tool.",
        },
        {
          emoji: "📊",
          title: "Internal admin dashboard with 50k rows",
          body: "Sort, filter, virtualize, pinned columns, inline edit.",
          recommendation: "simpleTable",
          recommendationLabel: "Use Simple Table for Solid—Kobalte doesn't cover this.",
        },
        {
          emoji: "🤝",
          title: "Both",
          body: "Kobalte for dialogs/popovers, Simple Table for the data grid.",
          recommendation: "simpleTable",
          recommendationLabel: "Combine them—they're complementary, not competing.",
        },
      ]}
      faqs={[
        { question: "Does Kobalte have a data grid component?", answer: "Not as of 2026. Kobalte is focused on form/overlay primitives—buttons, dialogs, comboboxes, toggles. A data grid is out of scope." },
        { question: "Should I use Kobalte for the editor cells in Simple Table?", answer: "You can. Simple Table accepts arbitrary Solid components in cellEditor, so a Kobalte combobox is a great fit for an enum/select cell." },
        { question: "Are they competitive?", answer: "No—they solve different problems. Kobalte for primitives, Simple Table for the data grid." },
      ]}
      conclusionParagraphs={[
        "Kobalte and Simple Table for Solid aren't competitors—they're complementary. Use Kobalte for accessible UI primitives, use Simple Table for the data grid.",
        "Both are MIT and Solid-native. They play well together.",
      ]}
      relatedLinks={[
        { href: "/blog/solidjs-data-grid-simple-table", label: "Pillar guide: the best free SolidJS data grid in 2026" },
        { href: "/blog/best-solidjs-data-grid-2026", label: "Best free SolidJS data grids in 2026" },
        { href: "/frameworks/solid", label: "Solid integration hub" },
      ]}
      ctaTitle="Need a Solid data grid?"
      ctaDescription="Simple Table for Solid ships virtualization, pinning, grouping, and editing in one MIT package—signals-native, ~70 kB gzipped."
    />
  );
}
