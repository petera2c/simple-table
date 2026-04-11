import { Metadata } from "next";
import { SEO_STRINGS } from "@/constants/strings/seo";
import PaginationContent from "@/components/pages/docs-pages/PaginationContent";

export const metadata: Metadata = {
  title: SEO_STRINGS.pagination.title,
  description: SEO_STRINGS.pagination.description,
  keywords: SEO_STRINGS.pagination.keywords,
  openGraph: {
    title: SEO_STRINGS.pagination.title,
    description: SEO_STRINGS.pagination.description,
    type: "article",
    images: [SEO_STRINGS.site.ogImage],
    siteName: SEO_STRINGS.site.name,
  },
  twitter: {
    card: "summary_large_image",
    title: SEO_STRINGS.pagination.title,
    description: SEO_STRINGS.pagination.description,
    creator: SEO_STRINGS.site.creator,
    images: SEO_STRINGS.site.ogImage.url,
  },
  alternates: {
    canonical: "/docs/pagination",
  },
};

const PaginationPage = () => {
  return <PaginationContent />;
};

export default PaginationPage;
