import type { Metadata } from "next";
import CompetitorBlogLayout from "@/components/blog/CompetitorBlogLayout";
import { SEO_STRINGS } from "@/constants/strings/seo";
import { simpleTableVsPrimeNgTablePost } from "@/constants/blogPosts";

export const metadata: Metadata = {
  title: simpleTableVsPrimeNgTablePost.title,
  description: simpleTableVsPrimeNgTablePost.description,
  keywords:
    "primeng table alternative, primeng datatable replacement, angular data grid, angular standalone components grid, simple table angular, mit angular table, primeng vs simple table",
  openGraph: {
    title: simpleTableVsPrimeNgTablePost.title,
    description: simpleTableVsPrimeNgTablePost.description,
    type: "article",
    images: [SEO_STRINGS.site.ogImage],
    siteName: SEO_STRINGS.site.name,
  },
  twitter: {
    card: "summary_large_image",
    title: simpleTableVsPrimeNgTablePost.title,
    description: simpleTableVsPrimeNgTablePost.description,
    creator: SEO_STRINGS.site.creator,
    images: SEO_STRINGS.site.ogImage.url,
  },
  alternates: { canonical: `/blog/${simpleTableVsPrimeNgTablePost.slug}` },
};

export default function Page() {
  return (
    <CompetitorBlogLayout
      slug={simpleTableVsPrimeNgTablePost.slug}
      title={simpleTableVsPrimeNgTablePost.title}
      subtitle="PrimeNG Table is great if you already use PrimeNG. If you're pulling in PrimeNG just for the table, Simple Table for Angular is a smaller, focused alternative—same virtualization, pinning, grouping, and editing in MIT."
      competitorName="PrimeNG Table"
      framework="angular"
      heroBadges={["Comparison", "Bundle size", "Decision Guide"]}
      datePublished={simpleTableVsPrimeNgTablePost.createdAt}
      dateModified={simpleTableVsPrimeNgTablePost.updatedAt}
      introParagraphs={[
        "PrimeNG is a complete Angular UI suite, and PrimeNG Table is one of its strongest components. If your project is already on PrimeNG with shared theming (Lara, Aura, Material), the table 'just fits.'",
        "But many Angular teams pull in PrimeNG specifically for the data grid—and end up shipping the rest of the suite, the icon set, and theming primitives along with it. Simple Table for Angular is the focused alternative: an MIT-licensed standalone component that drops into any Angular app without a design system tax.",
        "This article compares Simple Table for Angular against PrimeNG Table on bundle size, virtualization, grouping, editing, and developer experience so you can decide if a focused grid is the better trade.",
      ]}
      comparisonRows={[
        { feature: "License", competitor: { value: "MIT (with paid Pro)", tone: "neutral" }, simpleTable: { value: "MIT", tone: "good" } },
        { feature: "Bundle size (gzipped)", competitor: { value: "200–400+ kB (suite + theme + icons)", tone: "bad" }, simpleTable: { value: "~70 kB", tone: "good" } },
        { feature: "Standalone components", competitor: { value: "Yes (Angular 17+)", tone: "good" }, simpleTable: { value: "First-class", tone: "good" } },
        { feature: "Signals-native API", competitor: { value: "Partial", tone: "neutral" }, simpleTable: { value: "Yes", tone: "good" } },
        { feature: "Row + column virtualization", competitor: { value: "Yes (virtualScroll)", tone: "good" }, simpleTable: { value: "Yes (built-in)", tone: "good" } },
        { feature: "Column pinning (frozen columns)", competitor: { value: "Yes", tone: "good" }, simpleTable: { value: "Yes", tone: "good" } },
        { feature: "Row grouping with aggregations", competitor: { value: "Manual", tone: "neutral" }, simpleTable: { value: "Built-in", tone: "good" } },
        { feature: "Inline cell editing", competitor: { value: "Editor templates", tone: "good" }, simpleTable: { value: "Built-in", tone: "good" } },
        { feature: "Theme runtime", competitor: { value: "PrimeNG themes (Aura/Lara/Material)", tone: "neutral" }, simpleTable: { value: "CSS variables, BYO", tone: "good" } },
        { feature: "Icon set", competitor: { value: "PrimeIcons required", tone: "neutral" }, simpleTable: { value: "BYO (Lucide / FA / SVG)", tone: "good" } },
      ]}
      whyChoose={{
        competitor: {
          title: "Stay with PrimeNG Table when…",
          items: [
            "You already use PrimeNG widely (forms, dialogs, charts, menus).",
            "You've standardized on PrimeNG themes (Aura, Lara, Material) across your app.",
            "Your team is invested in PrimeNG patterns and PrimeIcons.",
            "You depend on PrimeNG's TreeTable or other PrimeNG-specific list components.",
          ],
        },
        simpleTable: {
          title: "Switch to Simple Table for Angular when…",
          items: [
            "PrimeNG Table is your only PrimeNG component—you can drop the rest.",
            "Bundle size is a top-3 NFR.",
            "You want signals-native ergonomics and modern Angular patterns.",
            "You want grouping with aggregations and inline editing without slot gymnastics.",
            "You also build React / Vue / Svelte / Solid surfaces and want a shared engine.",
          ],
        },
      }}
      scenarios={[
        {
          emoji: "🎨",
          title: "App standardized on PrimeNG Lara theme",
          body: "Your design system extends Lara across forms, dialogs, and the data grid.",
          recommendation: "competitor",
          recommendationLabel: "Stay with PrimeNG Table—the visual coherence and shared theming wins.",
        },
        {
          emoji: "📦",
          title: "PrimeNG used only for the data grid",
          body: "You added PrimeNG specifically for p-table, kept everything else native or Material.",
          recommendation: "simpleTable",
          recommendationLabel: "Switch to Simple Table—you'll cut 200–400 kB of suite + theme + icons.",
        },
        {
          emoji: "🚀",
          title: "New Angular 19 app, lean by default",
          body: "Greenfield, signals everywhere, want minimum runtime overhead.",
          recommendation: "simpleTable",
          recommendationLabel: "Pick Simple Table for Angular—~70 kB and idiomatic signals.",
        },
        {
          emoji: "🏗️",
          title: "Internal admin app with PrimeNG already in production",
          body: "You use 6+ PrimeNG components across the app, including p-table.",
          recommendation: "competitor",
          recommendationLabel: "Stay with PrimeNG Table—keep the design system coherent.",
        },
      ]}
      faqs={[
        { question: "Can I keep PrimeNG and add Simple Table just for some screens?", answer: "Yes. Many teams keep PrimeNG for forms / dialogs and switch only the data grid to Simple Table when bundle size matters on that route." },
        { question: "Does Simple Table support PrimeNG-style row expansion?", answer: "Yes. Row grouping, expandable rows, and tree data are all built-in." },
        { question: "What about PrimeNG Pro features?", answer: "PrimeNG's Pro tier mainly adds a few advanced components and themes. The core p-table features (sort, virtualization, frozen columns) are MIT in both PrimeNG and Simple Table." },
      ]}
      conclusionParagraphs={[
        "PrimeNG Table is the right call when you're invested in the PrimeNG ecosystem. Simple Table for Angular wins when the data grid is your primary need and you don't want a design system tagging along.",
        "Both ship the headline features—virtualization, pinning, grouping, editing—so the decision is really about whether PrimeNG is your design system or just a transitive dependency.",
      ]}
      relatedLinks={[
        { href: "/comparisons/simple-table-vs-primeng-table", label: "Detailed comparison: Simple Table vs PrimeNG Table" },
        { href: "/blog/angular-data-grid-simple-table", label: "Pillar guide: the best free Angular data grid in 2026" },
        { href: "/frameworks/angular", label: "Angular integration hub" },
      ]}
      ctaTitle="Drop the PrimeNG runtime, keep the data grid"
      ctaDescription="Simple Table for Angular ships virtualization, pinning, grouping, and editing in ~70 kB gzipped—signals-native, MIT, no design system required."
    />
  );
}
