import SimpleTableVsTanstackContent from "@/components/pages/comparisons/SimpleTableVsTanstackContent";
import { SEO_STRINGS } from "@/constants/strings/seo";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: SEO_STRINGS.comparisons.tanstack.title,
  description: SEO_STRINGS.comparisons.tanstack.description,
  keywords: SEO_STRINGS.comparisons.tanstack.keywords,
  openGraph: {
    title: SEO_STRINGS.comparisons.tanstack.title,
    description: SEO_STRINGS.comparisons.tanstack.description,
    type: "website",
    images: [SEO_STRINGS.site.ogImage],
    siteName: SEO_STRINGS.site.name,
  },
  twitter: {
    card: "summary_large_image",
    title: SEO_STRINGS.comparisons.tanstack.title,
    description: SEO_STRINGS.comparisons.tanstack.description,
    creator: SEO_STRINGS.site.creator,
    images: SEO_STRINGS.site.ogImage.url,
  },
  alternates: {
    canonical: "/comparisons/simple-table-vs-tanstack",
  },
};

const SimpleVsTanstack = () => {
  return <SimpleTableVsTanstackContent />;
};

export default SimpleVsTanstack;
