import SimpleTableVsAntDesignContent from "@/components/pages/comparisons/SimpleTableVsAntDesignContent";
import { SEO_STRINGS } from "@/constants/strings/seo";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: SEO_STRINGS.comparisons.antDesign.title,
  description: SEO_STRINGS.comparisons.antDesign.description,
  keywords: SEO_STRINGS.comparisons.antDesign.keywords,
  openGraph: {
    title: SEO_STRINGS.comparisons.antDesign.title,
    description: SEO_STRINGS.comparisons.antDesign.description,
    type: "website",
    images: [SEO_STRINGS.site.ogImage],
    siteName: SEO_STRINGS.site.name,
  },
  twitter: {
    card: "summary_large_image",
    title: SEO_STRINGS.comparisons.antDesign.title,
    description: SEO_STRINGS.comparisons.antDesign.description,
    creator: SEO_STRINGS.site.creator,
    images: SEO_STRINGS.site.ogImage.url,
  },
  alternates: {
    canonical: "/comparisons/simple-table-vs-ant-design",
  },
};

const SimpleVsAntDesign = () => {
  return <SimpleTableVsAntDesignContent />;
};

export default SimpleVsAntDesign;
