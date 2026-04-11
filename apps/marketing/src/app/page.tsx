import HomeContent from "@/components/pages/HomeContent";
import { SEO_STRINGS } from "@/constants/strings/seo";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: SEO_STRINGS.home.title,
  description: SEO_STRINGS.home.description,
  keywords: SEO_STRINGS.home.keywords,
  openGraph: {
    title: SEO_STRINGS.home.title,
    description: SEO_STRINGS.home.description,
    type: "website",
    images: [SEO_STRINGS.site.ogImage],
    siteName: SEO_STRINGS.site.name,
  },
  twitter: {
    card: "summary_large_image",
    title: SEO_STRINGS.home.title,
    description: SEO_STRINGS.home.description,
    creator: SEO_STRINGS.site.creator,
    images: SEO_STRINGS.site.ogImage.url,
  },
  alternates: {
    canonical: "/",
  },
};

export default function HomePage() {
  return <HomeContent />;
}
