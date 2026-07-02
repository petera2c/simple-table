import { Metadata } from "next";
import InfiniteScrollContent from "@/components/pages/docs-pages/InfiniteScrollContent";
import { SEO_STRINGS } from "@/constants/strings/seo";
import DocsDemoCode from "@/components/DocsDemoCode";

export const metadata: Metadata = {
  title: SEO_STRINGS.infiniteScroll.title,
  description: SEO_STRINGS.infiniteScroll.description,
  keywords: SEO_STRINGS.infiniteScroll.keywords,
  openGraph: {
    title: SEO_STRINGS.infiniteScroll.title,
    description: SEO_STRINGS.infiniteScroll.description,
    type: "article",
    images: [SEO_STRINGS.site.ogImage],
    siteName: SEO_STRINGS.site.name,
  },
  twitter: {
    card: "summary_large_image",
    title: SEO_STRINGS.infiniteScroll.title,
    description: SEO_STRINGS.infiniteScroll.description,
    creator: SEO_STRINGS.site.creator,
    images: SEO_STRINGS.site.ogImage.url,
  },
  alternates: {
    canonical: "/docs/infinite-scroll",
  },
};

const InfiniteScrollPage = () => {
  return (
    <DocsDemoCode slug="infinite-scroll">
      <InfiniteScrollContent />
    </DocsDemoCode>
  );
};

export default InfiniteScrollPage;
