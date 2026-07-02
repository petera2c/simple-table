import { Metadata } from "next";
import ColumnVisibilityContent from "@/components/pages/docs-pages/ColumnVisibilityContent";
import { SEO_STRINGS } from "@/constants/strings/seo";
import DocsDemoCode from "@/components/DocsDemoCode";

export const metadata: Metadata = {
  title: SEO_STRINGS.columnVisibility.title,
  description: SEO_STRINGS.columnVisibility.description,
  keywords: SEO_STRINGS.columnVisibility.keywords,
  openGraph: {
    title: SEO_STRINGS.columnVisibility.title,
    description: SEO_STRINGS.columnVisibility.description,
    type: "article",
    images: [SEO_STRINGS.site.ogImage],
    siteName: SEO_STRINGS.site.name,
  },
  twitter: {
    card: "summary_large_image",
    title: SEO_STRINGS.columnVisibility.title,
    description: SEO_STRINGS.columnVisibility.description,
    creator: SEO_STRINGS.site.creator,
    images: SEO_STRINGS.site.ogImage.url,
  },
  alternates: {
    canonical: "/docs/column-visibility",
  },
};

const ColumnVisibilityPage = () => {
  return (
    <DocsDemoCode slug="column-visibility">
      <ColumnVisibilityContent />
    </DocsDemoCode>
  );
};

export default ColumnVisibilityPage;
