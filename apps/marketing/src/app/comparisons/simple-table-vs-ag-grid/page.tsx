import SimpleTableVsAgGridContent from "@/components/pages/comparisons/SimpleTableVsAgGridContent";
import { SEO_STRINGS } from "@/constants/strings/seo";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: SEO_STRINGS.comparisons.agGrid.title,
  description: SEO_STRINGS.comparisons.agGrid.description,
  keywords: SEO_STRINGS.comparisons.agGrid.keywords,
  openGraph: {
    title: SEO_STRINGS.comparisons.agGrid.title,
    description: SEO_STRINGS.comparisons.agGrid.description,
    type: "website",
    images: [SEO_STRINGS.site.ogImage],
    siteName: SEO_STRINGS.site.name,
  },
  twitter: {
    card: "summary_large_image",
    title: SEO_STRINGS.comparisons.agGrid.title,
    description: SEO_STRINGS.comparisons.agGrid.description,
    creator: SEO_STRINGS.site.creator,
    images: SEO_STRINGS.site.ogImage.url,
  },
  alternates: {
    canonical: "/comparisons/simple-table-vs-ag-grid",
  },
};

const SimpleVsAgGrid = () => {
  return <SimpleTableVsAgGridContent />;
};

export default SimpleVsAgGrid;
