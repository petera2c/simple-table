import { Metadata } from "next";
import RowGroupingContent from "@/components/pages/docs-pages/RowGroupingContent";
import { SEO_STRINGS } from "@/constants/strings/seo";
import DocsDemoCode from "@/components/DocsDemoCode";

export const metadata: Metadata = {
  title: SEO_STRINGS.rowGrouping.title,
  description: SEO_STRINGS.rowGrouping.description,
  keywords: SEO_STRINGS.rowGrouping.keywords,
  openGraph: {
    title: SEO_STRINGS.rowGrouping.title,
    description: SEO_STRINGS.rowGrouping.description,
    type: "article",
    images: [SEO_STRINGS.site.ogImage],
    siteName: SEO_STRINGS.site.name,
  },
  twitter: {
    card: "summary_large_image",
    title: SEO_STRINGS.rowGrouping.title,
    description: SEO_STRINGS.rowGrouping.description,
    creator: SEO_STRINGS.site.creator,
    images: SEO_STRINGS.site.ogImage.url,
  },
  alternates: {
    canonical: "/docs/row-grouping",
  },
};

const RowGroupingPage = () => {
  return (
    <DocsDemoCode slug="row-grouping">
      <RowGroupingContent />
    </DocsDemoCode>
  );
};

export default RowGroupingPage;
