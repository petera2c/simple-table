import SimpleTableVsSyncfusionContent from "@/components/pages/comparisons/SimpleTableVsSyncfusionContent";
import { SEO_STRINGS } from "@/constants/strings/seo";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: SEO_STRINGS.comparisons.syncfusion.title,
  description: SEO_STRINGS.comparisons.syncfusion.description,
  keywords: SEO_STRINGS.comparisons.syncfusion.keywords,
  openGraph: {
    title: SEO_STRINGS.comparisons.syncfusion.title,
    description: SEO_STRINGS.comparisons.syncfusion.description,
    type: "website",
    images: [SEO_STRINGS.site.ogImage],
    siteName: SEO_STRINGS.site.name,
  },
  twitter: {
    card: "summary_large_image",
    title: SEO_STRINGS.comparisons.syncfusion.title,
    description: SEO_STRINGS.comparisons.syncfusion.description,
    creator: SEO_STRINGS.site.creator,
    images: SEO_STRINGS.site.ogImage.url,
  },
  alternates: {
    canonical: "/comparisons/simple-table-vs-syncfusion",
  },
};

const SimpleVsSyncfusion = () => {
  return <SimpleTableVsSyncfusionContent />;
};

export default SimpleVsSyncfusion;
