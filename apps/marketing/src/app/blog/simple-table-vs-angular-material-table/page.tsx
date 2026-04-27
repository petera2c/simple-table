import type { Metadata } from "next";
import CompetitorBlogLayout from "@/components/blog/CompetitorBlogLayout";
import { SEO_STRINGS } from "@/constants/strings/seo";
import { simpleTableVsAngularMaterialTablePost } from "@/constants/blogPosts";

export const metadata: Metadata = {
  title: simpleTableVsAngularMaterialTablePost.title,
  description: simpleTableVsAngularMaterialTablePost.description,
  keywords:
    "angular material table alternative, mat-table replacement, angular data grid, angular standalone components grid, simple table angular, mit angular table, mat-table vs simple table",
  openGraph: {
    title: simpleTableVsAngularMaterialTablePost.title,
    description: simpleTableVsAngularMaterialTablePost.description,
    type: "article",
    images: [SEO_STRINGS.site.ogImage],
    siteName: SEO_STRINGS.site.name,
  },
  twitter: {
    card: "summary_large_image",
    title: simpleTableVsAngularMaterialTablePost.title,
    description: simpleTableVsAngularMaterialTablePost.description,
    creator: SEO_STRINGS.site.creator,
    images: SEO_STRINGS.site.ogImage.url,
  },
  alternates: { canonical: `/blog/${simpleTableVsAngularMaterialTablePost.slug}` },
};

export default function Page() {
  return (
    <CompetitorBlogLayout
      slug={simpleTableVsAngularMaterialTablePost.slug}
      title={simpleTableVsAngularMaterialTablePost.title}
      subtitle="Angular Material's mat-table is composable but you build virtualization, pinning, grouping, and inline editing yourself. Simple Table for Angular ships all of that—and still themes against Material via CSS variables."
      competitorName="Angular Material mat-table"
      framework="angular"
      heroBadges={["Comparison", "Material UI", "Decision Guide"]}
      datePublished={simpleTableVsAngularMaterialTablePost.createdAt}
      dateModified={simpleTableVsAngularMaterialTablePost.updatedAt}
      introParagraphs={[
        "Angular Material's mat-table is a great primitive: composable, well-documented, and integrated tightly with the rest of Material's MDC components. The catch is that it's deliberately minimal. Sort, paginate, and basic filtering ship as MatSort / MatPaginator helpers, but virtualization, column pinning, row grouping with aggregations, and inline editing are all things you build yourself.",
        "Simple Table for Angular is a complementary alternative. It's MIT-licensed, ships virtualization, pinning, grouping, and editing as first-class features, and themes against Material design tokens via CSS variables—so you can keep your Material look-and-feel without writing a renderer pipeline.",
        "If you've ever tried to wire mat-table + CDK virtual scroll + manual sticky columns + custom sort/group code together, this comparison will save you a lot of plumbing.",
      ]}
      comparisonRows={[
        { feature: "License", competitor: { value: "MIT", tone: "good" }, simpleTable: { value: "MIT", tone: "good" } },
        { feature: "Standalone components", competitor: { value: "Yes", tone: "good" }, simpleTable: { value: "Yes", tone: "good" } },
        { feature: "Out-of-the-box rendering", competitor: { value: "Composable primitive", tone: "neutral" }, simpleTable: { value: "Batteries-included grid", tone: "good" } },
        { feature: "Row virtualization", competitor: { value: "Via CDK virtual scroll (manual)", tone: "neutral" }, simpleTable: { value: "Built-in", tone: "good" } },
        { feature: "Column pinning (sticky columns)", competitor: { value: "Manual", tone: "bad" }, simpleTable: { value: "Built-in", tone: "good" } },
        { feature: "Row grouping with aggregations", competitor: { value: "Build yourself", tone: "bad" }, simpleTable: { value: "Built-in", tone: "good" } },
        { feature: "Inline cell editing", competitor: { value: "Build yourself", tone: "bad" }, simpleTable: { value: "Built-in", tone: "good" } },
        { feature: "Theme via Material tokens", competitor: { value: "Native Material", tone: "good" }, simpleTable: { value: "CSS variables (Material-compatible)", tone: "good" } },
        { feature: "Bundle size (gzipped)", competitor: { value: "~50 kB (excludes virtualization, sort, paginate helpers)", tone: "neutral" }, simpleTable: { value: "~70 kB (everything included)", tone: "good" } },
      ]}
      whyChoose={{
        competitor: {
          title: "Stay with mat-table when…",
          items: [
            "Your needs are basic: sort, paginate, custom cells. No grouping, no pinning, no virtualization.",
            "You want maximum DOM control with mat-table's directive composition.",
            "Your team is comfortable wiring CDK virtual scroll and sticky columns by hand.",
            "Material design system fidelity is non-negotiable.",
          ],
        },
        simpleTable: {
          title: "Switch to Simple Table for Angular when…",
          items: [
            "You want virtualization, pinning, grouping, and editing without writing them yourself.",
            "You've spent more than a sprint maintaining custom mat-table extensions.",
            "You want Material-compatible theming via CSS variables.",
            "You also build React / Vue / Svelte / Solid surfaces and want a shared engine.",
            "You want grouping with aggregations as a declarative prop, not custom Angular code.",
          ],
        },
      }}
      scenarios={[
        {
          emoji: "🪛",
          title: "Basic admin tables, sort + paginate",
          body: "Two screens, ~500 rows each, mat-table + MatSort works fine.",
          recommendation: "competitor",
          recommendationLabel: "Stay with mat-table—you're using it well within its sweet spot.",
        },
        {
          emoji: "📈",
          title: "Reporting view with grouping + aggregations",
          body: "Need expanded/collapsed groups with sum and avg footers across thousands of rows.",
          recommendation: "simpleTable",
          recommendationLabel: "Switch to Simple Table—grouping with aggregations is built-in.",
        },
        {
          emoji: "🧱",
          title: "Wide table with sticky columns + virtualization",
          body: "30+ columns, 100k+ rows, frozen first 3 columns. Currently held together with CDK virtual scroll + manual sticky CSS.",
          recommendation: "simpleTable",
          recommendationLabel: "Switch to Simple Table—pinning and virtualization are first-class.",
        },
        {
          emoji: "🎨",
          title: "Strict Material design fidelity",
          body: "Every component has to feel native Material, including ripples and elevation.",
          recommendation: "competitor",
          recommendationLabel: "Stay with mat-table for native Material fidelity—or use Simple Table with Material-tuned CSS variables.",
        },
      ]}
      faqs={[
        { question: "Can Simple Table look like a Material table?", answer: "Yes. Theming is via CSS variables (row height, header color, hover color, density). Map your Material design tokens onto Simple Table's variables for a Material-feeling grid." },
        { question: "Will I lose mat-table's directive composition flexibility?", answer: "You give up directive-level composition for declarative props. In return, virtualization / pinning / grouping / editing are built in." },
        { question: "Does Simple Table integrate with MatPaginator?", answer: "Simple Table has its own pagination component, but you can wire MatPaginator if you prefer—the table accepts external pagination state via props." },
      ]}
      conclusionParagraphs={[
        "mat-table is a great primitive when your needs match its scope: composable, Material-native, MIT. The moment you need virtualization + pinning + grouping + editing as a coherent package, you're better off swapping the table layer.",
        "Simple Table for Angular gives you those features in one MIT package and still themes against Material via CSS variables. You keep your design system, you stop building data-grid plumbing.",
      ]}
      relatedLinks={[
        { href: "/blog/angular-data-grid-simple-table", label: "Pillar guide: the best free Angular data grid in 2026" },
        { href: "/blog/ag-grid-alternatives-free-angular-data-grids-2026", label: "Best free Angular data grids in 2026" },
        { href: "/frameworks/angular", label: "Angular integration hub" },
      ]}
      ctaTitle="Stop building grid plumbing on top of mat-table"
      ctaDescription="Simple Table for Angular ships virtualization, pinning, grouping, and inline editing—Material-compatible theming via CSS variables, ~70 kB gzipped, MIT."
    />
  );
}
