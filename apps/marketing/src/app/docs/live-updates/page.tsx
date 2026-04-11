import { Metadata } from "next";
import LiveUpdateContent from "@/components/pages/docs-pages/LiveUpdateContent";
import { SEO_STRINGS } from "@/constants/strings/seo";

export const metadata: Metadata = {
  title: SEO_STRINGS.liveUpdates.title,
  description: SEO_STRINGS.liveUpdates.description,
  keywords: SEO_STRINGS.liveUpdates.keywords,
  openGraph: {
    title: SEO_STRINGS.liveUpdates.title,
    description: SEO_STRINGS.liveUpdates.description,
    type: "article",
    images: [SEO_STRINGS.site.ogImage],
    siteName: SEO_STRINGS.site.name,
  },
  twitter: {
    card: "summary_large_image",
    title: SEO_STRINGS.liveUpdates.title,
    description: SEO_STRINGS.liveUpdates.description,
    creator: SEO_STRINGS.site.creator,
    images: SEO_STRINGS.site.ogImage.url,
  },
  alternates: {
    canonical: "/docs/live-updates",
  },
};

const LiveUpdatesPage = () => {
  return <LiveUpdateContent />;
};

export default LiveUpdatesPage;
