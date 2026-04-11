import { Metadata } from "next";
import TooltipContent from "@/components/pages/docs-pages/TooltipContent";
import { SEO_STRINGS } from "@/constants/strings/seo";

export const metadata: Metadata = {
  title: SEO_STRINGS.tooltips.title,
  description: SEO_STRINGS.tooltips.description,
  keywords: SEO_STRINGS.tooltips.keywords,
  openGraph: {
    title: SEO_STRINGS.tooltips.title,
    description: SEO_STRINGS.tooltips.description,
    type: "article",
    images: [SEO_STRINGS.site.ogImage],
    siteName: SEO_STRINGS.site.name,
  },
  twitter: {
    card: "summary_large_image",
    title: SEO_STRINGS.tooltips.title,
    description: SEO_STRINGS.tooltips.description,
    creator: SEO_STRINGS.site.creator,
    images: SEO_STRINGS.site.ogImage.url,
  },
  alternates: {
    canonical: "/docs/tooltips",
  },
};

const TooltipsPage = () => {
  return <TooltipContent />;
};

export default TooltipsPage;
