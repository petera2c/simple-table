import { Metadata } from "next";
import ColumnSortingContent from "@/components/pages/docs-pages/ColumnSortingContent";
import { SEO_STRINGS } from "@/constants/strings/seo";

export const metadata: Metadata = {
  title: SEO_STRINGS.columnSorting.title,
  description: SEO_STRINGS.columnSorting.description,
  keywords: SEO_STRINGS.columnSorting.keywords,
  openGraph: {
    title: SEO_STRINGS.columnSorting.title,
    description: SEO_STRINGS.columnSorting.description,
    type: "article",
    images: [SEO_STRINGS.site.ogImage],
    siteName: SEO_STRINGS.site.name,
  },
  twitter: {
    card: "summary_large_image",
    title: SEO_STRINGS.columnSorting.title,
    description: SEO_STRINGS.columnSorting.description,
    creator: SEO_STRINGS.site.creator,
    images: SEO_STRINGS.site.ogImage.url,
  },
  alternates: {
    canonical: "/docs/column-sorting",
  },
};

const ColumnSortingPage = () => {
  return <ColumnSortingContent />;
};

export default ColumnSortingPage;
