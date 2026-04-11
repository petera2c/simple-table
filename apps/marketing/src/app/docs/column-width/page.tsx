import { Metadata } from "next";
import ColumnWidthContent from "@/components/pages/docs-pages/ColumnWidthContent";
import { SEO_STRINGS } from "@/constants/strings/seo";

export const metadata: Metadata = {
  title: SEO_STRINGS.columnWidth.title,
  description: SEO_STRINGS.columnWidth.description,
  keywords: SEO_STRINGS.columnWidth.keywords,
  openGraph: {
    title: SEO_STRINGS.columnWidth.title,
    description: SEO_STRINGS.columnWidth.description,
    type: "article",
    images: [SEO_STRINGS.site.ogImage],
    siteName: SEO_STRINGS.site.name,
  },
  twitter: {
    card: "summary_large_image",
    title: SEO_STRINGS.columnWidth.title,
    description: SEO_STRINGS.columnWidth.description,
    creator: SEO_STRINGS.site.creator,
    images: SEO_STRINGS.site.ogImage.url,
  },
  alternates: {
    canonical: "/docs/column-width",
  },
};

const ColumnWidthPage = () => {
  return <ColumnWidthContent />;
};

export default ColumnWidthPage;
