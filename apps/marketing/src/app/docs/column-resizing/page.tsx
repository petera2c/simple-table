import { Metadata } from "next";
import ColumnResizingContent from "@/components/pages/docs-pages/ColumnResizingContent";
import { SEO_STRINGS } from "@/constants/strings/seo";

export const metadata: Metadata = {
  title: SEO_STRINGS.columnResizing.title,
  description: SEO_STRINGS.columnResizing.description,
  keywords: SEO_STRINGS.columnResizing.keywords,
  openGraph: {
    title: SEO_STRINGS.columnResizing.title,
    description: SEO_STRINGS.columnResizing.description,
    type: "article",
    images: [SEO_STRINGS.site.ogImage],
    siteName: SEO_STRINGS.site.name,
  },
  twitter: {
    card: "summary_large_image",
    title: SEO_STRINGS.columnResizing.title,
    description: SEO_STRINGS.columnResizing.description,
    creator: SEO_STRINGS.site.creator,
    images: SEO_STRINGS.site.ogImage.url,
  },
  alternates: {
    canonical: "/docs/column-resizing",
  },
};

const ColumnResizingPage = () => {
  return <ColumnResizingContent />;
};

export default ColumnResizingPage;
