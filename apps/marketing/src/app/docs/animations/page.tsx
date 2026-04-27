import { Metadata } from "next";
import AnimationsContent from "@/components/pages/docs-pages/AnimationsContent";
import { SEO_STRINGS } from "@/constants/strings/seo";

export const metadata: Metadata = {
  title: SEO_STRINGS.animations.title,
  description: SEO_STRINGS.animations.description,
  keywords: SEO_STRINGS.animations.keywords,
  openGraph: {
    title: SEO_STRINGS.animations.title,
    description: SEO_STRINGS.animations.description,
    type: "article",
    images: [SEO_STRINGS.site.ogImage],
    siteName: SEO_STRINGS.site.name,
  },
  twitter: {
    card: "summary_large_image",
    title: SEO_STRINGS.animations.title,
    description: SEO_STRINGS.animations.description,
    creator: SEO_STRINGS.site.creator,
    images: SEO_STRINGS.site.ogImage.url,
  },
  alternates: {
    canonical: "/docs/animations",
  },
};

const AnimationsPage = () => {
  return <AnimationsContent />;
};

export default AnimationsPage;
