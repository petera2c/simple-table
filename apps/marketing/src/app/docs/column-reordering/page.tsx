import ColumnReorderingContent from "@/components/pages/docs-pages/ColumnReorderingContent";
import { Metadata } from "next";
import { SEO_STRINGS } from "@/constants/strings/seo";

export const metadata: Metadata = {
  title: SEO_STRINGS.columnReordering.title,
  description: SEO_STRINGS.columnReordering.description,
  keywords: SEO_STRINGS.columnReordering.keywords,
  openGraph: {
    title: SEO_STRINGS.columnReordering.title,
    description: SEO_STRINGS.columnReordering.description,
    type: "article",
    images: [SEO_STRINGS.site.ogImage],
    siteName: SEO_STRINGS.site.name,
  },
  twitter: {
    card: "summary_large_image",
    title: SEO_STRINGS.columnReordering.title,
    description: SEO_STRINGS.columnReordering.description,
    creator: SEO_STRINGS.site.creator,
    images: SEO_STRINGS.site.ogImage.url,
  },
  alternates: {
    canonical: "/docs/column-reordering",
  },
};

const ColumnReorderingPage = () => {
  return <ColumnReorderingContent />;
};

export default ColumnReorderingPage;
