import { Metadata } from "next";
import ColumnAlignmentContent from "@/components/pages/docs-pages/ColumnAlignmentContent";
import { SEO_STRINGS } from "@/constants/strings/seo";

export const metadata: Metadata = {
  title: SEO_STRINGS.columnAlignment.title,
  description: SEO_STRINGS.columnAlignment.description,
  keywords: SEO_STRINGS.columnAlignment.keywords,
  openGraph: {
    title: SEO_STRINGS.columnAlignment.title,
    description: SEO_STRINGS.columnAlignment.description,
    type: "article",
    images: [SEO_STRINGS.site.ogImage],
    siteName: SEO_STRINGS.site.name,
  },
  twitter: {
    card: "summary_large_image",
    title: SEO_STRINGS.columnAlignment.title,
    description: SEO_STRINGS.columnAlignment.description,
    creator: SEO_STRINGS.site.creator,
    images: SEO_STRINGS.site.ogImage.url,
  },
  alternates: {
    canonical: "/docs/column-alignment",
  },
};

const ColumnAlignmentPage = () => {
  return <ColumnAlignmentContent />;
};

export default ColumnAlignmentPage;
