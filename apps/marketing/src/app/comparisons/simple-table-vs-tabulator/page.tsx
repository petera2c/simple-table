import SimpleTableVsTabulatorContent from "@/components/pages/comparisons/SimpleTableVsTabulatorContent";
import { SEO_STRINGS } from "@/constants/strings/seo";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: SEO_STRINGS.comparisons.tabulator.title,
  description: SEO_STRINGS.comparisons.tabulator.description,
  keywords: SEO_STRINGS.comparisons.tabulator.keywords,
  openGraph: {
    title: SEO_STRINGS.comparisons.tabulator.title,
    description: SEO_STRINGS.comparisons.tabulator.description,
    type: "website",
    images: [SEO_STRINGS.site.ogImage],
    siteName: SEO_STRINGS.site.name,
  },
  twitter: {
    card: "summary_large_image",
    title: SEO_STRINGS.comparisons.tabulator.title,
    description: SEO_STRINGS.comparisons.tabulator.description,
    creator: SEO_STRINGS.site.creator,
    images: SEO_STRINGS.site.ogImage.url,
  },
  alternates: {
    canonical: "/comparisons/simple-table-vs-tabulator",
  },
};

const SimpleVsTabulator = () => {
  return <SimpleTableVsTabulatorContent />;
};

export default SimpleVsTabulator;
