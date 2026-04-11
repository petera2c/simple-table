import PricingContent from "@/components/pages/PricingContent";
import { SEO_STRINGS } from "@/constants/strings/seo";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: SEO_STRINGS.pricing.title,
  description: SEO_STRINGS.pricing.description,
  keywords: SEO_STRINGS.pricing.keywords,
  openGraph: {
    title: SEO_STRINGS.pricing.title,
    description: SEO_STRINGS.pricing.description,
    type: "website",
    images: [SEO_STRINGS.site.ogImage],
    siteName: SEO_STRINGS.site.name,
  },
  twitter: {
    card: "summary_large_image",
    title: SEO_STRINGS.pricing.title,
    description: SEO_STRINGS.pricing.description,
    creator: SEO_STRINGS.site.creator,
    images: SEO_STRINGS.site.ogImage.url,
  },
  alternates: {
    canonical: "/pricing",
  },
};

export default function PricingPage() {
  return <PricingContent />;
}
