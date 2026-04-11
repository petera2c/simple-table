import SimpleTableVsHandsontableContent from "@/components/pages/comparisons/SimpleTableVsHandsontableContent";
import { SEO_STRINGS } from "@/constants/strings/seo";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: SEO_STRINGS.comparisons.handsontable.title,
  description: SEO_STRINGS.comparisons.handsontable.description,
  keywords: SEO_STRINGS.comparisons.handsontable.keywords,
  openGraph: {
    title: SEO_STRINGS.comparisons.handsontable.title,
    description: SEO_STRINGS.comparisons.handsontable.description,
    type: "website",
    images: [SEO_STRINGS.site.ogImage],
    siteName: SEO_STRINGS.site.name,
  },
  twitter: {
    card: "summary_large_image",
    title: SEO_STRINGS.comparisons.handsontable.title,
    description: SEO_STRINGS.comparisons.handsontable.description,
    creator: SEO_STRINGS.site.creator,
    images: SEO_STRINGS.site.ogImage.url,
  },
  alternates: {
    canonical: "/comparisons/simple-table-vs-handsontable",
  },
};

const SimpleVsHandsontable = () => {
  return <SimpleTableVsHandsontableContent />;
};

export default SimpleVsHandsontable;
