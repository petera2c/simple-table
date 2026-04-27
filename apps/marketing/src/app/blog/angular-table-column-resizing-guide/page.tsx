import type { Metadata } from "next";
import FrameworkTutorialLayout from "@/components/blog/FrameworkTutorialLayout";
import { SEO_STRINGS } from "@/constants/strings/seo";
import { angularTableColumnResizingPost } from "@/constants/blogPosts";

export const metadata: Metadata = {
  title: angularTableColumnResizingPost.title,
  description: angularTableColumnResizingPost.description,
  keywords:
    "angular table column resizing, resizable columns angular, angular data grid resize, ag grid angular resize, primeng table resize, simple table angular, standalone components",
  openGraph: {
    title: angularTableColumnResizingPost.title,
    description: angularTableColumnResizingPost.description,
    type: "article",
    images: [SEO_STRINGS.site.ogImage],
    siteName: SEO_STRINGS.site.name,
  },
  twitter: {
    card: "summary_large_image",
    title: angularTableColumnResizingPost.title,
    description: angularTableColumnResizingPost.description,
    creator: SEO_STRINGS.site.creator,
    images: SEO_STRINGS.site.ogImage.url,
  },
  alternates: { canonical: `/blog/${angularTableColumnResizingPost.slug}` },
};

export default function Page() {
  return (
    <FrameworkTutorialLayout
      slug={angularTableColumnResizingPost.slug}
      title={angularTableColumnResizingPost.title}
      subtitle="Resizable columns are essential for data-heavy Angular apps. This guide walks through implementation, library trade-offs, and pitfalls—with code samples for Simple Table for Angular and a comparison to AG Grid Angular, ngx-datatable, PrimeNG, and mat-table."
      framework="angular"
      heroBadges={["Angular", "Tutorial", "Column Resizing"]}
      datePublished={angularTableColumnResizingPost.createdAt}
      dateModified={angularTableColumnResizingPost.updatedAt}
      introParagraphs={[
        "You're building an Angular admin tool. The Description column is too narrow, the ID column is too wide. Users want Excel-like control. That's column resizing—and it's surprisingly easy to get wrong if you wire mouse and touch events yourself.",
        "This guide compares column-resizing implementations across the Angular data grid landscape (AG Grid Angular, ngx-datatable, PrimeNG, mat-table, Simple Table for Angular) and shows the idiomatic standalone-component setup for Simple Table.",
        "If you're greenfield on Angular 17/18/19 and want resizing that integrates with virtualization, pinning, and grouping, Simple Table for Angular is the focused MIT pick. Read on for the implementation details.",
      ]}
      whyItMatters={[
        { title: "User control", body: "Different users need different column widths. Resizing puts that control in their hands rather than your design system's." },
        { title: "Screen real estate", body: "Laptop vs 4K monitor; mobile vs desktop. Resizable columns adapt to any viewport without code changes." },
        { title: "Data visibility", body: "Long emails, descriptions, and IDs get truncated by default. Resize lets users widen the columns they care about." },
        { title: "Professional feel", body: "Excel and Google Sheets users expect resize. A grid without it feels like a prototype." },
      ]}
      libraryRows={[
        { library: "Simple Table for Angular", support: { value: "Built-in (one input)", tone: "good" }, notes: "[columnResizing]=\"true\" on standalone <simple-table>; integrates with autoExpandColumns." },
        { library: "AG Grid Angular", support: { value: "Built-in", tone: "good" }, notes: "resizable: true on column defs; advanced features (pivot, master/detail) Enterprise-only." },
        { library: "ngx-datatable", support: { value: "Built-in", tone: "good" }, notes: "[resizeable]=\"true\" + [columnMode]=\"'force'\"; requires manual width management." },
        { library: "PrimeNG Table", support: { value: "Built-in", tone: "good" }, notes: "[resizableColumns]=\"true\"; pairs with [columnResizeMode]=\"'fit' | 'expand'\"." },
        { library: "Angular Material mat-table", support: { value: "Manual / DIY", tone: "bad" }, notes: "No native resize—you wire it via CDK Drag/Resize Observer or third-party directives." },
        { library: "Kendo Grid for Angular", support: { value: "Built-in", tone: "good" }, notes: "[resizable]=\"true\"; commercial license required." },
      ]}
      simpleTableSection={{
        headline: "Implementation: Simple Table for Angular",
        intro: "Enable column resizing with a single input on the standalone <simple-table> component. Pair with autoExpandColumns to keep total width pinned to the container, or leave it off to allow horizontal scrolling.",
                notes: (
          <>
            Combine <code>columnResizing</code> with <code>autoExpandColumns</code> to keep the table flush with the container; remove it to allow horizontal scrolling on small viewports.
          </>
        ),
      }}
      alternativeSection={{
        headline: "Implementation: AG Grid Angular",
        intro: "AG Grid is powerful but the API is verbose and Enterprise features are paywalled. Here's the basic resize setup for comparison.",
                note: "AG Grid Community covers basic resize, but row grouping, master/detail, and pivoting require AG Grid Enterprise ($999+/dev/year).",
      }}
      pitfalls={[
        { title: "Forgot to set minWidth", problem: "Users shrink columns to 10px, content becomes unreadable.", solution: "Always set minWidth (50–100px for text, 30–50px for numbers/icons)." },
        { title: "Janky drag on large datasets", problem: "Re-render of 10k rows on every mouse move kills FPS.", solution: "Use a library with built-in virtualization (Simple Table, AG Grid). Avoid hand-rolling resize on plain mat-table." },
        { title: "Touch events not firing", problem: "Resize works on desktop but not mobile.", solution: "Pick a library that handles touchstart/touchmove (Simple Table does this). If rolling your own, listen for both pointer and touch events." },
        { title: "Resize handle too narrow", problem: "Users can't grab the 1–2px border.", solution: "Make the interactive hit area 6–10px even if the visual is thinner." },
      ]}
      faqs={[
        { question: "Does Simple Table for Angular support signals?", answer: "Yes—headers and rows accept signals or static values. Resize updates flow through Angular's change detection automatically." },
        { question: "Can I disable resize per column?", answer: "Yes. Set isResizable: false on individual HeaderObject entries to keep specific columns fixed." },
        { question: "What about responsive / mobile?", answer: "Disable autoExpandColumns at small viewports and let the grid scroll horizontally. Resize handles still work on touch." },
        { question: "How does this integrate with sorting and filtering?", answer: "Resizing is independent of sort/filter state. Users can resize while sorted/filtered without losing their position." },
      ]}
      conclusionParagraphs={[
        "Column resizing in Angular is a single input on Simple Table. AG Grid covers it out of the box too, but with verbose config. PrimeNG and ngx-datatable need more wiring; mat-table needs custom directives.",
        "If you're greenfield on Angular 17+ and want resize, pinning, virtualization, grouping, and editing in one MIT package, Simple Table for Angular is the focused pick.",
      ]}
      relatedLinks={[
        { href: "/blog/angular-data-grid-simple-table", label: "Pillar guide: best free Angular data grid in 2026" },
        { href: "/docs/column-resizing", label: "Column resizing documentation" },
        { href: "/frameworks/angular", label: "Angular integration hub" },
      ]}
      ctaTitle="Add column resizing to your Angular grid"
      ctaDescription="Simple Table for Angular ships resize, pinning, grouping, and editing in one MIT package—~70 kB gzipped, signals-native, standalone-component-friendly."
      docsHref="/docs/column-resizing"
    />
  );
}
